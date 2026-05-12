import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    let db: any;
    try {
      const mod = await import('@/lib/firebase');
      db = mod.db;
    } catch (err) {
      console.error('Firebase not configured for PUT /api/umkm/update:', err);
      return NextResponse.json(
        { error: 'Firebase not configured on server' },
        { status: 503 }
      );
    }
    const body = await request.json();
    const { 
      id,
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

    if (!id) {
      return NextResponse.json(
        { error: 'ID UMKM harus diisi' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      nama_perusahaan,
      jenis,
      kecamatan,
      alamat,
      telepon: telepon || null,
      waktu_buka: waktu_buka || null,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      tentang: tentang || null,
      updatedAt: new Date()
    };

    // Only update password if provided
    if (password && password.trim() !== '') {
      updateData.password = password;
    }

    // Update in Firestore
    await db.collection('umkm').doc(id).update(updateData);

    return NextResponse.json({
      success: true,
      message: 'UMKM berhasil diupdate',
      data: {
        id,
        ...updateData
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
