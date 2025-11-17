import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('umkm-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Gagal mengupload gambar: ' + uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('umkm-images')
      .getPublicUrl(filePath);

    const imageUrl = urlData.publicUrl;

    // Update database with image URL (kolom gambar_url)
    const { data, error } = await supabase
      .from('umkm')
      .update({ gambar_url: imageUrl })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Database error:', error);
      
      // Rollback: Delete uploaded file
      await supabase.storage
        .from('umkm-images')
        .remove([filePath]);
      
      return NextResponse.json(
        { error: 'Gagal menyimpan ke database' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Gambar berhasil diupload',
      imageUrl,
      data 
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
