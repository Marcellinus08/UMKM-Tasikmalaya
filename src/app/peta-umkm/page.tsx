'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import { CAT_COLOR } from '@/data/umkm';

interface UMKM {
  no: number;
  name: string;
  category: string;
  district: string;
  description: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  operatingHours: string;
}

// Import UMKMMap dynamically to avoid SSR issues with Leaflet
const UMKMMap = dynamic(() => import('@/components/UMKMMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 animate-pulse flex items-center justify-center">
      <div className="text-center">
        <span className="material-icons text-6xl text-gray-400 dark:text-gray-600 animate-spin">map</span>
        <p className="text-gray-500 dark:text-gray-400 mt-4">Memuat peta...</p>
      </div>
    </div>
  ),
});

export default function PetaUMKM() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [umkms, setUmkms] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data UMKM dari API database
    const fetchUMKMs = async () => {
      try {
        const response = await fetch('/api/umkm');
        const data = await response.json();
        setUmkms(data);
      } catch (error) {
        console.error('Error fetching UMKM data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUMKMs();
  }, []);

  const categories = ['Semua', ...Array.from(new Set(umkms.map(u => u.category)))];

  const filteredUMKMs = umkms.filter(umkm => {
    const matchesSearch = umkm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         umkm.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || umkm.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Fixed Green Blur Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse-green"></div>
        <div className="absolute top-1/3 right-20 w-80 h-80 bg-green-500/30 rounded-full blur-3xl animate-pulse-green-delay-1"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-teal-500/30 rounded-full blur-3xl animate-pulse-green-delay-2"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl animate-pulse-green"></div>
      </div>

      <Header />
      
      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header Section - Pastel */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-400/20 to-green-400/20 border border-emerald-400/30 rounded-full backdrop-blur-sm mb-6">
              <span className="material-icons text-emerald-600 dark:text-emerald-500 text-sm">map</span>
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-500">Peta Interaktif</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Peta <span className="bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">UMKM</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Jelajahi lokasi UMKM di Tasikmalaya dengan peta interaktif
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <span className="material-icons absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Cari nama atau deskripsi UMKM..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <span className="material-icons absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  filter_list
                </span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <span className="material-icons absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Results counter */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Menampilkan <span className="font-bold text-emerald-600 dark:text-emerald-500">{filteredUMKMs.length}</span> dari <span className="font-bold">{umkms.length}</span> UMKM
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-sm text-emerald-600 dark:text-emerald-500 hover:underline flex items-center gap-1"
                >
                  <span className="material-icons text-sm">close</span>
                  Hapus pencarian
                </button>
              )}
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-icons text-emerald-600">location_on</span>
                Peta Lokasi UMKM
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="material-icons text-sm">info</span>
                <span>Klik marker untuk info detail</span>
              </div>
            </div>
            <UMKMMap />
          </div>

          {/* Legend Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="material-icons">palette</span>
              Legenda Kategori
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(CAT_COLOR).map(([category, color]) => (
                <div
                  key={category}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div
                    className="w-4 h-4 rounded-full shadow-md"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* UMKM List Below Map */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="material-icons text-emerald-600">format_list_bulleted</span>
              Daftar UMKM
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUMKMs.map((umkm, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform hover:-translate-y-2 transition-all duration-300"
                >
                  {/* Category badge */}
                  <div className="h-2" style={{ backgroundColor: CAT_COLOR[umkm.category] }}></div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors">
                        {umkm.name}
                      </h4>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: CAT_COLOR[umkm.category] }}
                      >
                        {umkm.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {umkm.description}
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                        <span className="material-icons text-sm mt-0.5">location_on</span>
                        <span className="flex-1">{umkm.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <span className="material-icons text-sm">phone</span>
                        <a href={`tel:${umkm.phone}`} className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
                          {umkm.phone}
                        </a>
                      </div>
                    </div>
                    
                    <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-green-600 transition-all duration-300 group-hover:shadow-lg">
                      <span className="material-icons text-sm">directions</span>
                      <span>Lihat di Peta</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 mt-16">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-gray-400">© 2025 UMKM Tasikmalaya. Mendukung pertumbuhan ekonomi lokal.</p>
        </div>
      </footer>
    </div>
  );
}
