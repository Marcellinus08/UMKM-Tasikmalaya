# Setup Supabase untuk UMKM Tasikmalaya

## 1. Buat Project Supabase

1. Pergi ke [https://app.supabase.com](https://app.supabase.com)
2. Login atau buat akun baru
3. Klik "New Project"
4. Isi informasi project:
   - Name: `UMKM Tasikmalaya` (atau nama pilihan Anda)
   - Database Password: Buat password yang kuat
   - Region: Pilih region terdekat (misal: Singapore untuk Asia)
5. Klik "Create new project"
6. Tunggu project selesai dibuat (biasanya 1-2 menit)

## 2. Setup Database Table

1. Pergi ke SQL Editor di sidebar kiri
2. Klik "New Query"
3. Copy dan paste SQL berikut:

```sql
CREATE TABLE umkm (
  no INT PRIMARY KEY,
  nama_perusahaan VARCHAR(255) NOT NULL,
  jenis VARCHAR(100) NOT NULL,
  kecamatan VARCHAR(100) NOT NULL,
  alamat TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  waktu_buka VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO umkm (no, nama_perusahaan, jenis, kecamatan, alamat, latitude, longitude, waktu_buka) VALUES
(1, 'Warung Nasi Ibu Ani', 'Kuliner', 'Tawang', 'Jl. Sutisna Senjaya No. 45', -7.3287, 108.2145, '06:00 - 18:00'),
(2, 'Batik Tasik Kreasi', 'Fashion & Pakaian', 'Cihideung', 'Jl. Ciamis No. 12', -7.3301, 108.2210, '08:00 - 17:00'),
(3, 'Anyaman Bambu Karya Mandiri', 'Kerajinan Tangan', 'Cipedes', 'Jl. Pahlawan No. 78', -7.3245, 108.2282, '07:00 - 16:00'),
(4, 'Salon Cantik Berseri', 'Kesehatan & Kecantikan', 'Cihideung', 'Jl. Yudanegara No. 34', -7.3335, 108.2235, '09:00 - 20:00'),
(5, 'Toko Elektronik Maju Jaya', 'Elektronik', 'Tawang', 'Jl. Sutisna Senjaya No. 120', -7.3198, 108.2175, '08:00 - 21:00'),
(6, 'Laundry Express Clean', 'Jasa', 'Mangkubumi', 'Jl. Ir. H. Juanda No. 56', -7.3260, 108.2260, '06:30 - 19:00'),
(7, 'Roti & Kue Manis Jaya', 'Kuliner', 'Cipedes', 'Jl. RE Martadinata No. 9', -7.3315, 108.2168, '05:00 - 18:00'),
(8, 'Apotek Sehat Farma', 'Kesehatan & Kecantikan', 'Mangkubumi', 'Jl. HZ Mustofa No. 88', -7.3222, 108.2198, '07:00 - 22:00');
```

4. Klik "Run" untuk execute query

## 3. Konfigurasi Environment Variables

1. Pergi ke Settings > API di dashboard Supabase
2. Copy "Project URL" 
3. Copy "anon public" key
4. Edit file `.env.local` di project root:

```
NEXT_PUBLIC_SUPABASE_URL=paste_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_anon_key_here
```

5. Save file

## 4. Enable Row Level Security (RLS) - Opsional tapi Recommended

1. Pergi ke Authentication > Policies
2. Pilih table "umkm"
3. Klik "Enable RLS"
4. Tambahkan policy untuk read access:
   - Policy Name: `Enable read access for all`
   - For role: `anon`
   - Using expression: `true`
   - Klik "Create policy"

## 5. Test Koneksi

1. Start development server:
```bash
npm run dev
```

2. Buka browser ke http://localhost:3000
3. Periksa console untuk error messages
4. Data UMKM seharusnya muncul di dashboard

## Troubleshooting

### Error: "Failed to fetch UMKM data from Supabase"
- Pastikan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY benar
- Pastikan table `umkm` sudah dibuat
- Check browser console untuk error details

### Data tidak muncul
- Verifikasi data sudah di-insert ke table dengan benar
- Pastikan RLS policies memungkinkan read access
- Reload page dengan Ctrl+Shift+R (hard refresh)

### CORS Error
- Pastikan Supabase project settings mengizinkan domain http://localhost:3000
- Pergi ke Settings > API > CORS settings
- Tambahkan http://localhost:3000 ke allowed origins
