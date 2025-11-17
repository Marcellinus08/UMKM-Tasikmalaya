import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Query data UMKM dari Supabase
    const { data, error } = await supabase
      .from('umkm')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json([], { status: 200 });
    }

    if (!data) {
      return NextResponse.json([]);
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
          phone: umkm.waktu_buka || 'Tidak ada informasi',
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

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
