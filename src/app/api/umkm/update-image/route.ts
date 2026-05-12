import { NextRequest, NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const file = formData.get('file') as File;

    if (!id || !file) {
      return NextResponse.json(
        { error: 'ID dan file gambar harus disediakan' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File harus berupa gambar' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Ukuran file maksimal 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${id}-${Date.now()}.${fileExt}`;
    const filePath = `umkm/${fileName}`;

    try {
      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const bucket = storage.bucket();
      const fileRef = bucket.file(filePath);
      await fileRef.save(buffer, {
        metadata: {
          contentType: file.type,
        },
      });

      // Make the file public so it can be accessed via URL
      await fileRef.makePublic();
      const imageUrl = fileRef.publicUrl();

      // Update database with image URL
      await db.collection('umkm').doc(id).update({
        gambar_url: imageUrl,
        updatedAt: new Date()
      });

      return NextResponse.json({
        success: true,
        message: 'Gambar berhasil diupload',
        imageUrl,
        data: { id, gambar_url: imageUrl }
      });
    } catch (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Gagal mengupload gambar: ' + (uploadError instanceof Error ? uploadError.message : String(uploadError)) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
