import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, phone, subject, message } = body;

    console.log('Received data:', { full_name, email, phone, subject, message });

    // Validasi input
    if (!full_name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Nama, email, subjek, dan pesan wajib diisi' },
        { status: 400 }
      );
    }

    // Insert data ke tabel contact_messages
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          full_name,
          email,
          phone: phone || null,
          subject,
          message,
          status: 'new', // Status default: new
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return NextResponse.json(
        { 
          error: 'Gagal menyimpan pesan. Silakan coba lagi.',
          details: error.message 
        },
        { status: 500 }
      );
    }

    console.log('Insert successful:', data);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Pesan berhasil dikirim!',
        data: data[0]
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error details:', error);
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan pada server',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET endpoint untuk admin panel (opsional - untuk melihat pesan)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Gagal mengambil data pesan' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
