import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    // Check if pagination is requested
    const usePagination = pageParam !== null || limitParam !== null || category !== null || search !== null;
    
    const page = parseInt(pageParam || '1');
    const limit = parseInt(limitParam || '50');
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Query data UMKM dari Supabase
    let query = supabase
      .from('umkm')
      .select('*', { count: usePagination ? 'exact' : undefined })
      .order('id', { ascending: true });
    
    // Apply pagination if requested
    if (usePagination) {
      query = query.range(from, to);
    }
    
    // Filter by category if provided
    if (category && category !== 'Semua') {
      query = query.eq('jenis', category);
    }
    
    // Filter by search if provided
    if (search) {
      query = query.or(`nama_perusahaan.ilike.%${search}%,alamat.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      // Return empty array for backward compatibility
      return NextResponse.json(usePagination ? { data: [], pagination: { page, limit, total: 0, totalPages: 0 } } : [], { status: 200 });
    }

    if (!data) {
      return NextResponse.json(usePagination ? { data: [], pagination: { page, limit, total: 0, totalPages: 0 } } : []);
    }

    // Transform data ke format yang sesuai dengan struktur aplikasi
    const transformedData = data
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
        
        return {
          no: umkm.id,
          name: umkm.nama_perusahaan,
          category: umkm.jenis,
          district: umkm.kecamatan,
          description: `${umkm.jenis} terbaik di ${umkm.kecamatan}`,
          address: umkm.alamat,
          phone: umkm.telepon || 'Tidak ada informasi',
          lat,
          lng,
          operatingHours: umkm.waktu_buka || '',
          gambar: umkm.gambar_url || null
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
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('API error:', error);
    // Return empty array for backward compatibility
    return NextResponse.json([], { status: 200 });
  }
}
