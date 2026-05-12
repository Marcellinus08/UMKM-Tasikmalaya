import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    let db: any;
    try {
      const mod = await import('@/lib/firebase');
      db = mod.db;
    } catch (err) {
      console.error('Firebase not configured for POST /api/umkm/create:', err);
      return NextResponse.json(
        { error: 'Firebase not configured on server' },
        { status: 503 }
      );
    }
    const body = await request.json();
    const { 
      nama_perusahaan, 
      jenis, 
      kecamatan, 
      alamat, 
      telepon, 
      waktu_buka, 
      latitude, 
      longitude,
      password,
      tentang
    } = body;

    // Validasi input required
    if (!nama_perusahaan || !jenis || !kecamatan || !alamat || !latitude || !longitude || !password) {
      return NextResponse.json(
        { error: 'Field yang wajib diisi tidak lengkap' },
        { status: 400 }
      );
    }

    // Create new document in Firestore
    const umkmData = {
      nama_perusahaan,
      jenis,
      kecamatan,
      alamat,
      telepon: telepon || null,
      waktu_buka: waktu_buka || null,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      gambar_url: null, // Will be updated via upload API if image is provided
      password: password,
      tentang: tentang || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('umkm').add(umkmData);

    return NextResponse.json({
      success: true,
      message: 'UMKM berhasil ditambahkan',
      data: {
        id: docRef.id,
        ...umkmData
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
