import { useEffect, useState } from 'react';

export interface UMKM {
  no: string; // UUID
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  operatingHours: string;
}

export function useUMKMData() {
  const [umkms, setUmkms] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUMKMData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/umkm');
        
        if (!response.ok) {
          throw new Error('Failed to fetch UMKM data');
        }
        
        const data = await response.json();
        setUmkms(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching UMKM data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Fallback ke dummy data jika ada error
        setUmkms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUMKMData();
  }, []);

  return { umkms, loading, error };
}

export const CAT_COLOR: Record<string, string> = {
  "Kuliner": "#10B981",
  "Fashion & Pakaian": "#6366F1",
  "Kerajinan Tangan": "#8B5CF6",
  "Jasa": "#14B8A6",
  "Elektronik": "#6B7280",
  "Kesehatan & Kecantikan": "#EC4899",
};
