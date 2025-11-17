-- SQL Script untuk memperbaiki Row Level Security Policy
-- Jalankan script ini di Supabase SQL Editor

-- ======================================
-- FIX UNTUK STORAGE BUCKET (PENTING!)
-- ======================================

-- Policy untuk Storage Bucket umkm-images
-- Ini yang menyebabkan error "new row violates row-level security policy"

-- 1. Allow public to view/download images
CREATE POLICY "Public can view umkm images"
ON storage.objects FOR SELECT
USING (bucket_id = 'umkm-images');

-- 2. Allow anyone to upload images (untuk development)
CREATE POLICY "Anyone can upload umkm images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'umkm-images');

-- 3. Allow anyone to update images
CREATE POLICY "Anyone can update umkm images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'umkm-images');

-- 4. Allow anyone to delete images
CREATE POLICY "Anyone can delete umkm images"
ON storage.objects FOR DELETE
USING (bucket_id = 'umkm-images');

-- ======================================
-- FIX UNTUK TABEL UMKM
-- ======================================

-- OPSI 1: Disable RLS untuk tabel umkm (Paling Mudah - Untuk Development)
-- Gunakan ini jika aplikasi masih dalam tahap development
ALTER TABLE umkm DISABLE ROW LEVEL SECURITY;

-- OPSI 2: Enable RLS dengan Policy yang Membolehkan Semua Operasi (Untuk Development)
-- Uncomment kode di bawah jika ingin tetap enable RLS tapi izinkan semua operasi
/*
ALTER TABLE umkm ENABLE ROW LEVEL SECURITY;

-- Drop existing policies jika ada
DROP POLICY IF EXISTS "Allow all operations on umkm" ON umkm;

-- Buat policy yang membolehkan SELECT untuk semua orang
CREATE POLICY "Enable read access for all users" ON umkm
    FOR SELECT
    USING (true);

-- Buat policy yang membolehkan INSERT untuk semua orang
CREATE POLICY "Enable insert for all users" ON umkm
    FOR INSERT
    WITH CHECK (true);

-- Buat policy yang membolehkan UPDATE untuk semua orang
CREATE POLICY "Enable update for all users" ON umkm
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Buat policy yang membolehkan DELETE untuk semua orang
CREATE POLICY "Enable delete for all users" ON umkm
    FOR DELETE
    USING (true);
*/

-- OPSI 3: Policy untuk Production dengan Authentication (Untuk Production)
-- Uncomment jika sudah implement authentication dan ingin security yang lebih ketat
/*
ALTER TABLE umkm ENABLE ROW LEVEL SECURITY;

-- Public dapat membaca semua data
CREATE POLICY "Public can read umkm" ON umkm
    FOR SELECT
    USING (true);

-- Hanya authenticated users yang bisa insert/update/delete
CREATE POLICY "Authenticated users can insert umkm" ON umkm
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update umkm" ON umkm
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete umkm" ON umkm
    FOR DELETE
    TO authenticated
    USING (true);
*/

-- Verifikasi RLS status
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'umkm';

-- Lihat policies yang aktif
SELECT * FROM pg_policies WHERE tablename = 'umkm';
