-- Script untuk convert DMS (Derajat Menit Detik) ke Derajat Desimal
-- Format input: "7°19'37.2" S" atau "108°13'12" E"
-- PostgreSQL version untuk Supabase

-- Helper function untuk extract derajat, menit, detik
CREATE OR REPLACE FUNCTION dms_to_decimal(dms_string TEXT, direction CHAR) 
RETURNS NUMERIC AS $$
DECLARE
  degrees NUMERIC;
  minutes NUMERIC;
  seconds NUMERIC;
  result NUMERIC;
BEGIN
  -- Extract degrees (sebelum °)
  degrees := CAST(SPLIT_PART(dms_string, '°', 1) AS NUMERIC);
  
  -- Extract minutes (antara ° dan ')
  minutes := CAST(SPLIT_PART(SPLIT_PART(dms_string, '°', 2), '''', 1) AS NUMERIC);
  
  -- Extract seconds (antara ' dan ")
  seconds := CAST(
    REGEXP_REPLACE(
      SPLIT_PART(SPLIT_PART(dms_string, '''', 2), '"', 1),
      '[^0-9.]',
      '',
      'g'
    ) AS NUMERIC
  );
  
  -- Convert ke decimal
  result := degrees + (minutes / 60.0) + (seconds / 3600.0);
  
  -- Apply direction
  IF direction IN ('S', 'W') THEN
    result := result * -1;
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- UPDATE latitude dari latitude_dms ke decimal
UPDATE umkm 
SET latitude = CASE 
  WHEN latitude_dms IS NOT NULL AND latitude_dms != '' THEN 
    dms_to_decimal(latitude_dms, 'S')
  ELSE latitude
END
WHERE latitude_dms IS NOT NULL AND latitude_dms != '' AND latitude IS NULL;

-- UPDATE longitude dari longitude_dms ke decimal
UPDATE umkm 
SET longitude = CASE 
  WHEN longitude_dms IS NOT NULL AND longitude_dms != '' THEN 
    dms_to_decimal(longitude_dms, 'E')
  ELSE longitude
END
WHERE longitude_dms IS NOT NULL AND longitude_dms != '' AND longitude IS NULL;

-- Fix latitude yang salah - ganti dengan nilai yang benar untuk Tasikmalaya
-- Data DMS di database sudah salah (73° bukan 7°), jadi kita fix manual

UPDATE umkm 
SET latitude = CASE 
  WHEN latitude < -70 THEN latitude / 10  -- Divide by 10 untuk fix faktor 10 error
  ELSE latitude
END;

-- Verifikasi hasil fix
SELECT id, nama_perusahaan, latitude, longitude, latitude_dms, longitude_dms 
FROM umkm 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL
LIMIT 10;
