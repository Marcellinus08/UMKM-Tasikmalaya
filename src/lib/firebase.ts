import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
  console.warn('Firebase credentials are not set. Please add Firebase configuration to your environment variables.');
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export interface UMKM {
  id?: string;
  nama_perusahaan: string;
  jenis: string;
  kecamatan: string;
  alamat: string;
  latitude: number;
  longitude: number;
  waktu_buka: string;
  telepon?: string;
  gambar_url?: string | null;
  password?: string;
  tentang?: string | null;
}
