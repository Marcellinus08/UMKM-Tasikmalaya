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
  const [selectedUMKM, setSelectedUMKM] = useState<UMKM | null>(null);
  const [mapStyle, setMapStyle] = useState('openstreetmap');

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
    <div className="h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Header />
      
      {/* Main Content: Fullscreen with Sidebar - Fixed positioning */}
      <div className="fixed top-20 left-0 right-0 bottom-0 flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg h-full overflow-hidden">
          {/* Search Box */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative mb-2">
              <span className="material-icons absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                search
              </span>
              <input
                type="text"
                placeholder="Cari UMKM..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            {/* Category Dropdown */}
            <div className="mb-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kategori
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900 dark:text-white"
              >
                <option value="Semua">Semua Kategori</option>
                {categories.filter(cat => cat !== 'Semua').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Map Style Dropdown */}
            <div className="mb-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Jenis Peta
              </label>
              <select
                value={mapStyle}
                onChange={(e) => setMapStyle(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900 dark:text-white"
              >
                <option value="openstreetmap">OpenStreetMap</option>
                <option value="esri">Esri Street</option>
                <option value="voyager">Voyager</option>
                <option value="satellite">Satelit</option>
                <option value="terrain">Terrain</option>
              </select>
            </div>

            {/* Results counter */}
            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                <span className="text-emerald-600 dark:text-emerald-500">{filteredUMKMs.length}</span> UMKM ditemukan
              </p>
            </div>
          </div>

          {/* UMKM List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
            {filteredUMKMs.map((umkm, index) => (
              <div
                key={index}
                onClick={() => setSelectedUMKM(umkm)}
                className={`p-2.5 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                  selectedUMKM?.no === umkm.no ? 'bg-emerald-50 dark:bg-emerald-900/10 border-l-4 border-emerald-500' : ''
                }`}
              >
                <div className="flex items-start gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{ 
                      backgroundColor: CAT_COLOR[umkm.category] || '#6B7280'
                    }}
                  >
                    <span className="material-icons text-xs" style={{ color: 'white' }}>store</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-0.5 truncate">
                      {umkm.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 line-clamp-1 leading-tight">
                      {umkm.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className="px-1.5 py-0.5 rounded font-medium text-[10px]"
                        style={{ 
                          backgroundColor: CAT_COLOR[umkm.category] || '#6B7280',
                          color: 'white'
                        }}
                      >
                        {umkm.category}
                      </span>
                      <span className="flex items-center gap-0.5 text-gray-500 dark:text-gray-400 text-[10px]">
                        <span className="material-icons" style={{ fontSize: '11px' }}>location_on</span>
                        {umkm.district}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Fullscreen Map */}
        <div className="flex-1 h-full overflow-hidden relative">
          <UMKMMap mapStyle={mapStyle} selectedCategory={selectedCategory} />

          {/* Selected UMKM Detail Card */}
          {selectedUMKM && (
            <div className="absolute bottom-4 left-4 right-4 bg-white/98 dark:bg-gray-800/98 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-2xl">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1 truncate">
                    {selectedUMKM.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                    {selectedUMKM.description}
                  </p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-start gap-1.5 text-gray-600 dark:text-gray-400">
                      <span className="material-icons text-sm">location_on</span>
                      <span className="line-clamp-1">{selectedUMKM.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                      <span className="material-icons text-sm">phone</span>
                      <a href={`tel:${selectedUMKM.phone}`} className="hover:text-emerald-600 transition-colors">
                        {selectedUMKM.phone}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-green-600 transition-all flex items-center gap-1 shadow-md">
                    <span className="material-icons text-sm">info</span>
                    Detail
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUMKM(null);
                    }}
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                  >
                    <span className="material-icons text-sm">close</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
