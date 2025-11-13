'use client';

import { useState, useMemo, useEffect } from 'react';
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

export default function DaftarUMKM() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<'name' | 'category'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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

  const filteredAndSortedUMKMs = useMemo(() => {
    let result = umkms.filter(umkm => {
      const matchesSearch = umkm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           umkm.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           umkm.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Semua' || umkm.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return a.category.localeCompare(b.category);
      }
    });

    return result;
  }, [umkms, searchQuery, selectedCategory, sortBy]);

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
              <span className="material-icons text-emerald-600 dark:text-emerald-500 text-sm">store</span>
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-500">Direktori Lengkap</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Daftar <span className="bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">UMKM</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Temukan dan hubungi UMKM lokal di Tasikmalaya dengan mudah
            </p>
          </div>

          {/* Filter and Search Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              {/* Search */}
              <div className="lg:col-span-2 relative">
                <span className="material-icons absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Cari UMKM berdasarkan nama, deskripsi, atau lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <span className="material-icons absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  sort
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'category')}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="name">Urutkan: Nama (A-Z)</option>
                  <option value="category">Urutkan: Kategori</option>
                </select>
                <span className="material-icons absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* View Toggle and Results */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Menampilkan <span className="font-bold text-emerald-600 dark:text-emerald-500">{filteredAndSortedUMKMs.length}</span> dari <span className="font-bold">{umkms.length}</span> UMKM
              </p>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Tampilan:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  aria-label="Grid view"
                >
                  <span className="material-icons">grid_view</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  aria-label="List view"
                >
                  <span className="material-icons">view_list</span>
                </button>
              </div>
            </div>
          </div>

          {/* UMKM List */}
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Memuat data UMKM dari database...</p>
            </div>
          ) : filteredAndSortedUMKMs.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-icons text-6xl text-gray-300 dark:text-gray-600 mb-4">search_off</span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">UMKM Tidak Ditemukan</h3>
              <p className="text-gray-600 dark:text-gray-400">Coba ubah kata kunci pencarian atau filter kategori</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {filteredAndSortedUMKMs.map((umkm, index) => (
                viewMode === 'grid' ? (
                  // Grid View Card
                  <div
                    key={index}
                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform hover:-translate-y-2 transition-all duration-300"
                  >
                    {/* Category stripe */}
                    <div className="h-3" style={{ backgroundColor: CAT_COLOR[umkm.category] }}></div>
                    
                    <div className="p-6">
                      {/* Header with icon */}
                      <div className="flex items-start gap-4 mb-4">
                        <div 
                          className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: CAT_COLOR[umkm.category] }}
                        >
                          <span className="material-icons text-white text-2xl">storefront</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors truncate">
                            {umkm.name}
                          </h3>
                          <span
                            className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                            style={{ backgroundColor: CAT_COLOR[umkm.category] }}
                          >
                            {umkm.category}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {umkm.description}
                      </p>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="material-icons text-sm mt-0.5 text-emerald-500">location_on</span>
                          <span className="flex-1 line-clamp-2">{umkm.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="material-icons text-sm text-emerald-400">phone</span>
                          <a 
                            href={`tel:${umkm.phone}`} 
                            className="hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors font-medium"
                          >
                            {umkm.phone}
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <a
                          href={`tel:${umkm.phone}`}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-300 to-green-300 text-white rounded-lg font-semibold hover:from-emerald-400 hover:to-green-400 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          <span className="material-icons text-sm">call</span>
                          <span>Hubungi</span>
                        </a>
                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg">
                          <span className="material-icons text-sm">directions</span>
                          <span>Lokasi</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View Card
                  <div
                    key={index}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Left color bar */}
                      <div className="w-full md:w-2 h-2 md:h-auto" style={{ backgroundColor: CAT_COLOR[umkm.category] }}></div>
                      
                      <div className="flex-1 p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-3">
                              <div 
                                className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform flex-shrink-0"
                                style={{ backgroundColor: CAT_COLOR[umkm.category] }}
                              >
                                <span className="material-icons text-white">storefront</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {umkm.name}
                                </h3>
                                <span
                                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                                  style={{ backgroundColor: CAT_COLOR[umkm.category] }}
                                >
                                  {umkm.category}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                              {umkm.description}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="material-icons text-sm text-indigo-500 mt-0.5">location_on</span>
                                <span className="flex-1">{umkm.address}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="material-icons text-sm text-green-500">phone</span>
                                <a 
                                  href={`tel:${umkm.phone}`} 
                                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
                                >
                                  {umkm.phone}
                                </a>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex md:flex-col gap-2 md:w-32 flex-shrink-0">
                            <a
                              href={`tel:${umkm.phone}`}
                              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                            >
                              <span className="material-icons text-sm">call</span>
                              <span>Hubungi</span>
                            </a>
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm">
                              <span className="material-icons text-sm">directions</span>
                              <span>Lokasi</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
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
