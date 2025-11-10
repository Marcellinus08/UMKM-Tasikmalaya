-- Hapus tabel lama jika ada
DROP TABLE IF EXISTS umkm CASCADE;

-- Buat tabel umkm baru dengan struktur yang sederhana
CREATE TABLE umkm (
  id BIGSERIAL PRIMARY KEY,
  no INTEGER UNIQUE NOT NULL,
  nama_perusahaan VARCHAR(255) NOT NULL,
  jenis VARCHAR(100) NOT NULL,
  kecamatan VARCHAR(100) NOT NULL,
  alamat TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  waktu_buka VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Set Row Level Security
ALTER TABLE umkm ENABLE ROW LEVEL SECURITY;

-- Buat policy untuk SELECT (public read)
CREATE POLICY "Enable read access for all users" ON umkm
  FOR SELECT USING (true);

-- Buat index untuk performa
CREATE INDEX idx_umkm_no ON umkm(no);
CREATE INDEX idx_umkm_jenis ON umkm(jenis);
CREATE INDEX idx_umkm_kecamatan ON umkm(kecamatan);

-- Insert data sampel (sesuaikan dengan data asli Anda)
-- Format koordinat: derajat desimal
-- Latitude untuk Tasikmalaya: -7.XXXXXX (negatif karena South)
-- Longitude untuk Tasikmalaya: 108.XXXXXX (positif karena East)

INSERT INTO umkm (no, nama_perusahaan, jenis, kecamatan, alamat, latitude, longitude, waktu_buka) VALUES
(1, 'Restoran Maju Jaya', 'Restoran', 'Kawalu', 'Jl. Ahmad Yani No. 1', -7.3270, 108.2200, '08:00 - 22:00'),
(2, 'Toko Pakaian Modern', 'Fashion & Pakaian', 'Cipedes', 'Jl. Siliwangi No. 45', -7.3280, 108.2250, '09:00 - 20:00'),
(3, 'Kedai Kopi Hits', 'Kuliner', 'Kawalu', 'Jl. Jendral Sudirman No. 23', -7.3265, 108.2180, '07:00 - 21:00'),
(4, 'Toko Elektronik Sahabat', 'Elektronik', 'Banyuasih', 'Jl. Merdeka No. 78', -7.3310, 108.2320, '08:30 - 18:00'),
(5, 'Warung Nasi Lezat', 'Warung nasi', 'Cipedes', 'Jl. Proklamasi No. 12', -7.3290, 108.2210, '06:00 - 15:00');

-- Setelah insert, Anda bisa melihat data dengan query ini:
-- SELECT * FROM umkm ORDER BY no;
