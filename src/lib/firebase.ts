import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.resolve(process.cwd(), 'serviceAccountKey.json');

function parseServiceAccountJson(value: string) {
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('Invalid FIREBASE_SERVICE_ACCOUNT JSON:', error);
    return null;
  }
}

let credential: admin.ServiceAccount | null = null;

if (serviceAccountJson) {
  credential = parseServiceAccountJson(serviceAccountJson);
}

if (!credential) {
  if (fs.existsSync(serviceAccountPath)) {
    try {
      credential = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    } catch (error) {
      console.error('Gagal membaca serviceAccountKey.json:', error);
    }
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    credential = undefined as any; // applicationDefault will be used
  }
}

if (!admin.apps.length) {
  if (credential) {
    admin.initializeApp({
      credential: admin.credential.cert(credential),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  } else {
    throw new Error(
      'Firebase Admin credentials not found. Set FIREBASE_SERVICE_ACCOUNT in .env.local or GOOGLE_APPLICATION_CREDENTIALS to a service account JSON file.'
    );
  }
}

export const db = getFirestore();
export const storage = getStorage();

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
