-- SQL Script untuk menambahkan kolom gambar ke tabel umkm
-- Jalankan script ini di Supabase SQL Editor

-- Tambahkan kolom gambar_url (URL gambar) - sesuai dengan nama kolom yang sudah ada
-- Jika kolom 'gambar_url' sudah ada, skip langkah ini
ALTER TABLE umkm 
ADD COLUMN IF NOT EXISTS gambar_url TEXT;

-- Update existing records dengan default NULL (akan diisi nanti)
-- Tidak perlu UPDATE karena kolom baru otomatis NULL

-- Verifikasi kolom sudah ditambahkan
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'umkm' AND column_name = 'gambar_url';

-- Lihat struktur tabel setelah perubahan
SELECT * FROM umkm LIMIT 1;

-- OPTIONAL: Buat bucket storage untuk gambar UMKM di Supabase Storage
-- 1. Buka Supabase Dashboard → Storage
-- 2. Create New Bucket dengan nama: umkm-images
-- 3. Set bucket menjadi Public agar gambar bisa diakses
-- 4. Atau jalankan via SQL:
/*
INSERT INTO storage.buckets (id, name, public)
VALUES ('umkm-images', 'umkm-images', true)
ON CONFLICT (id) DO NOTHING;
*/
