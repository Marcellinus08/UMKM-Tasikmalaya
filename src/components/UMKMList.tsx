'use client';

import { useState, useEffect } from 'react';
import { CAT_COLOR } from '@/data/umkm';
import Image from 'next/image';

interface UMKM {
  no: string; // UUID
  name: string;
  category: string;
  district: string;
  description: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  operatingHours: string;
  gambar?: string | null;
}

interface UMKMListProps {
  onLocationSelect?: (lat: number, lng: number) => void;
}

export default function UMKMList({ onLocationSelect }: UMKMListProps) {
  const [umkms, setUmkms] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [displayCount, setDisplayCount] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/umkm');
        const data = await response.json();
        setUmkms(data);
        
        // Extract unique categories from data
        const uniqueCategories = [...new Set(data.map((u: UMKM) => u.category))].sort() as string[];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching UMKM data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset pagination when category or search changes
  useEffect(() => {
    setDisplayCount(10);
  }, [activeCategory, searchQuery]);

  const filteredUMKMs = umkms.filter(umkm => {
    const matchCategory = activeCategory === 'Semua' || umkm.category === activeCategory;
    const query = searchQuery.toLowerCase();
    const matchQuery = !query || 
      umkm.name.toLowerCase().includes(query) || 
      umkm.address.toLowerCase().includes(query);
    return matchCategory && matchQuery;
  });

  // Paginate filtered results
  const displayedUMKMs = filteredUMKMs.slice(0, displayCount);
  const hasMore = filteredUMKMs.length > displayCount;

    const categoryIcons: { [key: string]: string } = {
    'Semua': 'category',
    'Kuliner': 'restaurant',
    'Fashion & Pakaian': 'checkroom',
    'Kerajinan Tangan': 'handyman',
    'Jasa': 'cleaning_services',
    'Elektronik': 'devices',
    'Kesehatan & Kecantikan': 'spa'
  };

  return (
    <section id="daftar-umkm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Daftar UMKM</h2>
        <div className="bg-emerald-100 dark:bg-emerald-900 text-primary font-semibold px-4 py-2 rounded-full flex items-center space-x-2">
          <span className="material-icons text-base">storefront</span>
          <span>{loading ? '...' : filteredUMKMs.length} UMKM</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-none sm:w-80">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-subtext-light dark:text-subtext-dark">
              search
            </span>
            <input
              type="text"
              placeholder="Cari nama/alamat…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full h-11 rounded-full border border-gray-200 dark:border-gray-700 bg-card-light dark:bg-card-dark text-sm 
                focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
                transition-all duration-300"
            />
          </div>
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-card-light dark:bg-card-dark text-sm font-medium
              focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
              text-gray-900 dark:text-white transition-all duration-300 cursor-pointer"
          >
            <option value="Semua">Semua Kategori</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedUMKMs.map((umkm) => (
          <article 
            key={umkm.no}
            className="group bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft hover:shadow-lg
              border border-gray-100 dark:border-gray-700 transition-all duration-300
              hover:border-primary-500/30 dark:hover:border-primary-500/30 animate-fade-in"
          >
            <div className="flex items-start gap-4 mb-3">
              {/* Icon/Image */}
              <div 
                className="w-20 h-20 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform flex-shrink-0 overflow-hidden"
                style={{ backgroundColor: umkm.gambar ? 'transparent' : (CAT_COLOR[umkm.category] || '#6B7280') }}
              >
                {umkm.gambar ? (
                  <Image 
                    src={umkm.gambar} 
                    alt={umkm.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="material-icons text-white text-3xl">storefront</span>
                )}
              </div>
              
              {/* Title and Category */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold group-hover:text-primary-500 transition-colors mb-2">{umkm.name}</h3>
                <span 
                  className="text-xs font-semibold px-3 py-1.5 rounded-full text-white inline-block
                    shadow-soft transform group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: CAT_COLOR[umkm.category] || '#6B7280' }}
                >
                  {umkm.category}
                </span>
              </div>
            </div>
            <div className="space-y-3 text-subtext-light dark:text-subtext-dark text-sm">
              <div className="flex items-start group/item">
                <span className="material-icons text-primary-500 mr-2 group-hover/item:scale-110 transition-transform">
                  location_on
                </span>
                <span className="group-hover/item:text-primary-500 transition-colors">{umkm.district}</span>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary-500 text-white text-sm font-medium
                  transform hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300
                  focus:ring-2 focus:ring-primary-500/50"
                onClick={() => {
                  // Emit event untuk UMKMMap
                  window.dispatchEvent(new CustomEvent('umkm-location-select', {
                    detail: { lat: umkm.lat, lng: umkm.lng }
                  }));
                  
                  // Scroll ke map section
                  const mapSection = document.getElementById('peta-umkm');
                  mapSection?.scrollIntoView({ behavior: 'smooth' });
                  onLocationSelect?.(umkm.lat, umkm.lng);
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="material-icons text-base">map</span>
                  Lihat di Peta
                </span>
              </button>
              <a
                href={`https://www.google.com/maps?q=${umkm.lat},${umkm.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 
                  text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800
                  transform hover:translate-y-[-2px] hover:shadow-md transition-all duration-300
                  focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="material-icons text-base">directions</span>
                  Rute
                </span>
              </a>
            </div>
            </article>
          ))}
        </div>
        
        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setDisplayCount(prev => prev + 10)}
              className="px-6 py-3 rounded-lg bg-primary-500 text-white font-medium
                transform hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="material-icons text-base">expand_more</span>
                Lihat Lebih Banyak
              </span>
            </button>
          </div>
        )}
        </>
      )}
    </section>
  );
}