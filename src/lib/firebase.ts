import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Try to build credential from individual environment variables
function buildCredentialFromEnv(): admin.ServiceAccount | null {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKeyId = process.env.FIREBASE_PRIVATE_KEY_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const clientId = process.env.FIREBASE_CLIENT_ID;
  const authUri = process.env.FIREBASE_AUTH_URI;
  const tokenUri = process.env.FIREBASE_TOKEN_URI;
  const authProviderX509CertUrl = process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL;
  const clientX509CertUrl = process.env.FIREBASE_CLIENT_X509_CERT_URL;

  if (projectId && privateKeyId && privateKey && clientEmail && clientId) {
    return {
      type: 'service_account' as const,
      project_id: projectId,
      private_key_id: privateKeyId,
      private_key: privateKey,
      client_email: clientEmail,
      client_id: clientId,
      auth_uri: authUri || 'https://accounts.google.com/o/oauth2/auth',
      token_uri: tokenUri || 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: authProviderX509CertUrl || 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: clientX509CertUrl || '',
    } as admin.ServiceAccount;
  }
  return null;
}

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.resolve(process.cwd(), 'serviceAccountKey.json');

let credential: admin.ServiceAccount | null = null;

// First try individual env vars
credential = buildCredentialFromEnv();

// Then try file
if (!credential) {
  if (fs.existsSync(serviceAccountPath)) {
    try {
      credential = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    } catch (error) {
      console.error('Gagal membaca serviceAccountKey.json:', error);
    }
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
      'Firebase Admin credentials not found. Set individual FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, FIREBASE_CLIENT_ID env vars or provide a service account JSON file.'
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
