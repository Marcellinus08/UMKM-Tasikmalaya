import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    // If ID is provided, return single UMKM
    if (id) {
      try {
        const docSnap = await db.collection('umkm').doc(id).get();

        if (!docSnap.exists) {
          return NextResponse.json({ error: 'UMKM tidak ditemukan' }, { status: 404 });
        }

        return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
      } catch (error) {
        console.error('Firebase error:', error);
        return NextResponse.json({ error: 'UMKM tidak ditemukan' }, { status: 404 });
      }
    }
    
    // Check if pagination is requested
    const usePagination = pageParam !== null || limitParam !== null || category !== null || search !== null;
    
    const page = parseInt(pageParam || '1');
    const limitNum = parseInt(limitParam || '50');
    const skipOffset = (page - 1) * limitNum;

    const collectionRef = db.collection('umkm');
    let ref = collectionRef.orderBy('nama_perusahaan', 'asc');

    if (category && category !== 'Semua') {
      ref = ref.where('jenis', '==', category);
    }

    const querySnapshot = await ref.get();
    let allData = querySnapshot.docs.map((document) => ({ id: document.id, ...document.data() }));

    // Filter by search if provided (client-side since Firestore doesn't have full-text search)
    if (search) {
      const searchLower = search.toLowerCase();
      allData = allData.filter((umkm: any) =>
        umkm.nama_perusahaan?.toLowerCase().includes(searchLower) ||
        umkm.alamat?.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const total = allData.length;
    const paginatedData = usePagination
      ? allData.slice(skipOffset, skipOffset + limitNum)
      : allData;

    // Transform data ke format yang sesuai dengan struktur aplikasi
    const transformedData = paginatedData
      .map((umkm: any) => {
        let lat = umkm.latitude ? parseFloat(String(umkm.latitude)) : null;
        let lng = umkm.longitude ? parseFloat(String(umkm.longitude)) : null;
        
        // Jika lat/lng masih null, gunakan default Tasikmalaya
        if (lat === null || isNaN(lat)) {
          lat = -7.327;
        }
        if (lng === null || isNaN(lng)) {
          lng = 108.22;
        }
        
        const categoryValue = umkm.jenis && String(umkm.jenis).trim() !== '' ? String(umkm.jenis) : 'Lainnya';
        return {
          no: umkm.id,
          name: umkm.nama_perusahaan,
          category: categoryValue,
          district: umkm.kecamatan,
          description: `${categoryValue} terbaik di ${umkm.kecamatan}`,
          address: umkm.alamat,
          phone: umkm.telepon || 'Tidak ada informasi',
          lat,
          lng,
          operatingHours: umkm.waktu_buka || '',
          gambar: umkm.gambar_url || null,
          tentang: umkm.tentang || null
        };
      });

    console.log('Transformed data count:', transformedData.length);
    if (transformedData.length > 0) {
      console.log('First item:', transformedData[0]);
      console.log('First item coords:', { lat: transformedData[0].lat, lng: transformedData[0].lng });
    }

    // Return array for backward compatibility if no pagination requested
    if (!usePagination) {
      return NextResponse.json(transformedData);
    }

    // Return object with pagination info if pagination requested
    return NextResponse.json({
      data: transformedData,
      pagination: {
        page,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('API error:', error);
    // Return empty array for backward compatibility
    return NextResponse.json([], { status: 200 });
  }
}
