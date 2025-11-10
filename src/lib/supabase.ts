import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are not set. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UMKM {
  no: number;
  nama_perusahaan: string;
  jenis: string;
  kecamatan: string;
  alamat: string;
  latitude: number;
  longitude: number;
  waktu_buka: string;
}
