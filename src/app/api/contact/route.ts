import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    let db: any;
    try {
      const mod = await import('@/lib/firebase');
      db = mod.db;
    } catch (err) {
      console.error('Firebase not configured for POST /api/contact:', err);
      return NextResponse.json(
        { error: 'Firebase not configured on server' },
        { status: 503 }
      );
    }
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

    // Insert data ke Firestore collection contact_messages
    const docRef = await db.collection('contact_messages').add({
      full_name,
      email,
      phone: phone || null,
      subject,
      message,
      status: 'new', // Status default: new
      created_at: new Date(),
      updated_at: new Date()
    });

    console.log('Insert successful:', { id: docRef.id });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Pesan berhasil dikirim!',
        data: { id: docRef.id, full_name, email, phone, subject, message }
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
    let db: any;
    try {
      const mod = await import('@/lib/firebase');
      db = mod.db;
    } catch (err) {
      console.error('Firebase not configured for GET /api/contact:', err);
      return NextResponse.json(
        { error: 'Firebase not configured on server' },
        { status: 503 }
      );
    }

    const querySnapshot = await db.collection('contact_messages')
      .orderBy('created_at', 'desc')
      .get();

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
