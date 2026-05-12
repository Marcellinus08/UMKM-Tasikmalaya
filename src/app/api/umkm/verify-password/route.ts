import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, password } = body;

    if (!id || !password) {
      return NextResponse.json(
        { error: 'ID dan password harus diisi', valid: false },
        { status: 400 }
      );
    }

    // Get UMKM from database
    try {
      const docRef = doc(db, 'umkm', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return NextResponse.json(
          { error: 'UMKM tidak ditemukan', valid: false },
          { status: 404 }
        );
      }

      const data = docSnap.data();

      // Verify password
      const isValid = data?.password === password;

      return NextResponse.json({
        valid: isValid,
        message: isValid ? 'Password benar' : 'Password salah'
      });
    } catch (error) {
      console.error('Firebase error:', error);
      return NextResponse.json(
        { error: 'UMKM tidak ditemukan', valid: false },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server', valid: false },
      { status: 500 }
    );
  }
}
