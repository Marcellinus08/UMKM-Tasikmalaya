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
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationTarget, setNavigationTarget] = useState<UMKM | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [isActiveNavigation, setIsActiveNavigation] = useState(false);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    return distance;
  };

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
    const matchesSearch = umkm.name.toLowerCase().includes(searchQuery.toLowerCase());
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
                    <div className="flex items-center gap-2 text-xs mt-1">
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
          <UMKMMap 
            mapStyle={mapStyle} 
            selectedCategory={selectedCategory} 
            selectedUMKM={selectedUMKM}
            onNavigationChange={(isNav, target) => {
              setIsNavigating(isNav);
              setNavigationTarget(target);
            }}
            onUserLocationChange={(location, accuracy) => {
              setUserLocation(location);
              setLocationAccuracy(accuracy);
            }}
            onActiveNavigationChange={(isActive) => {
              setIsActiveNavigation(isActive);
            }}
          />

          {/* Navigation Info - Top Right */}
          {isNavigating && navigationTarget && (
            <div className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-xl max-w-xs backdrop-blur-sm">
              <div className="space-y-2">
                {/* User Location Info */}
                {userLocation && (
                  <div className="flex items-start gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow">
                      <span className="material-icons text-white text-base">my_location</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Lokasi Anda
                      </h3>
                      <p className="text-[10px] text-gray-600 dark:text-gray-400 font-mono">
                        {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Target Info */}
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow">
                    <span className="material-icons text-white text-base">place</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Tujuan Navigasi
                    </h3>
                    <p className="text-xs font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                      {navigationTarget.name}
                    </p>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 line-clamp-1 mb-1.5">
                      {navigationTarget.address}
                    </p>
                    {userLocation && (
                      <div className="flex items-center gap-1 text-[10px] bg-gray-50 dark:bg-gray-900 px-1.5 py-1 rounded">
                        <span className="material-icons text-gray-500 dark:text-gray-400" style={{ fontSize: '12px' }}>near_me</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {(() => {
                            const distance = calculateDistance(
                              userLocation.lat,
                              userLocation.lng,
                              navigationTarget.lat,
                              navigationTarget.lng
                            );
                            return distance < 1 
                              ? `${(distance * 1000).toFixed(0)} meter`
                              : `${distance.toFixed(2)} km`;
                          })()}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">dari Anda</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1 pt-2">
                  {/* Mulai Navigasi Button - Only show when destination is set but navigation not active */}
                  {!isActiveNavigation && (
                    <button
                      onClick={() => {
                        setIsActiveNavigation(true);
                        if ((window as any).startActiveNavigation) {
                          (window as any).startActiveNavigation();
                        }
                      }}
                      className="flex-1 px-2 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded text-[11px] font-semibold transition-all hover:shadow-md flex items-center justify-center gap-1"
                    >
                      <span className="material-icons" style={{ fontSize: '14px' }}>navigation</span>
                      Mulai
                    </button>
                  )}
                  
                  {/* Stop Button */}
                  <button
                    onClick={() => {
                      setIsNavigating(false);
                      setNavigationTarget(null);
                      setIsActiveNavigation(false);
                      if ((window as any).stopNavigation) {
                        (window as any).stopNavigation();
                      }
                    }}
                    className={`px-2 py-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded text-[11px] font-medium transition-all hover:shadow-md flex items-center justify-center gap-1 ${isActiveNavigation ? 'flex-1' : ''}`}
                  >
                    <span className="material-icons" style={{ fontSize: '14px' }}>close</span>
                    Batal
                  </button>
                  
                  {/* Google Maps Button */}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${navigationTarget.lat},${navigationTarget.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded transition-all hover:shadow-md flex items-center justify-center"
                    title="Buka di Google Maps"
                  >
                    <span className="material-icons" style={{ fontSize: '14px' }}>map</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Map Style Dropdown - Bottom Left */}
          <div className="absolute bottom-4 left-4 z-10">
            <select
              value={mapStyle}
              onChange={(e) => setMapStyle(e.target.value)}
              className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900 dark:text-white shadow-lg cursor-pointer"
            >
              <option value="openstreetmap">🗺️ OpenStreetMap</option>
              <option value="esri">🌍 Esri Street</option>
              <option value="voyager">🧭 Voyager</option>
              <option value="satellite">🛰️ Satelit</option>
              <option value="terrain">⛰️ Terrain</option>
            </select>
          </div>

          {/* Selected UMKM Detail Card */}
          {selectedUMKM && (
            <div className="absolute bottom-4 left-4 right-4 bg-white/98 dark:bg-gray-800/98 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-2xl">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2 truncate">
                    {selectedUMKM.name}
                  </h3>
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
