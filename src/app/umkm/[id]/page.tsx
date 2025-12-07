'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import FooterSection from '@/components/beranda/FooterSection';
import Image from 'next/image';
import { CAT_COLOR } from '@/data/umkm';
import dynamic from 'next/dynamic';

const SimpleMap = dynamic(() => import('@/components/SimpleMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl flex items-center justify-center">
      <span className="text-gray-400">Memuat peta...</span>
    </div>
  ),
});

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

export default function UMKMProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [umkm, setUmkm] = useState<UMKM | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Function to check if UMKM is currently open
  const isOpen = (operatingHours: string): boolean => {
    if (!operatingHours) return false;
    
    try {
      // Parse format: "08.00 - 17.00" or "08:00 - 17:00"
      const timeMatch = operatingHours.match(/(\d{1,2})[.:] ?(\d{2})\s*-\s*(\d{1,2})[.:] ?(\d{2})/);
      
      if (!timeMatch) return false;
      
      const openHour = parseInt(timeMatch[1]);
      const openMinute = parseInt(timeMatch[2]);
      const closeHour = parseInt(timeMatch[3]);
      const closeMinute = parseInt(timeMatch[4]);
      
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      
      const openTimeInMinutes = openHour * 60 + openMinute;
      const closeTimeInMinutes = closeHour * 60 + closeMinute;
      
      return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes;
    } catch (error) {
      console.error('Error parsing operating hours:', error);
      return false;
    }
  };

  useEffect(() => {
    const fetchUMKM = async () => {
      try {
        const response = await fetch('/api/umkm');
        const data = await response.json();
        const found = data.find((u: UMKM) => u.no === params.id);
        setUmkm(found || null);
      } catch (error) {
        console.error('Error fetching UMKM:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchUMKM();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="animate-pulse space-y-4">
              <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!umkm) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-7xl text-center">
            <span className="material-icons text-6xl text-gray-400 mb-4">store_off</span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">UMKM Tidak Ditemukan</h1>
            <button
              onClick={() => router.push('/daftar-umkm')}
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Kembali ke Daftar UMKM
            </button>
          </div>
        </div>
      </div>
    );
  }

  const galleries = umkm.gambar ? [umkm.gambar] : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pt-24 pb-8">
        <div className="container mx-auto max-w-7xl px-4">
          {/* Breadcrumb - Outside header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <button onClick={() => router.push('/daftar-umkm')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Daftar UMKM
              </button>
              <span className="material-icons text-xs">chevron_right</span>
              <span className="text-gray-900 dark:text-white font-medium">{umkm.name}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                {/* Cover Image */}
                <div className="relative h-64 bg-linear-to-br from-emerald-500 to-green-600">
                  {umkm.gambar && (
                    <Image
                      src={umkm.gambar}
                      alt={umkm.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className="px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg"
                      style={{ backgroundColor: CAT_COLOR[umkm.category] }}
                    >
                      {umkm.category}
                    </span>
                  </div>

                  {/* Logo/Avatar */}
                  <div className="absolute -bottom-16 left-8">
                    <div 
                      className="w-32 h-32 rounded-2xl border-4 border-white dark:border-gray-800 shadow-2xl overflow-hidden flex items-center justify-center"
                      style={{ backgroundColor: umkm.gambar ? 'white' : CAT_COLOR[umkm.category] }}
                    >
                      {umkm.gambar ? (
                        <Image
                          src={umkm.gambar}
                          alt={umkm.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="material-icons text-white" style={{ fontSize: '64px' }}>store</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Title & Info */}
                <div className="pt-20 px-8 pb-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {umkm.name}
                      </h1>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <span className="material-icons text-yellow-500 text-base">star</span>
                          <span className="font-semibold">4.5</span>
                          <span>(120 ulasan)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-icons text-emerald-500 text-base">location_on</span>
                          <span>{umkm.district}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    {isOpen(umkm.operatingHours) ? (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-sm font-semibold">Buka Sekarang</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span className="text-sm font-semibold">Tutup</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`tel:${umkm.phone}`}
                      className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/50"
                    >
                      <span className="material-icons">call</span>
                      <span className="font-semibold">Telepon</span>
                    </a>
                    <a
                      href={`https://wa.me/62${umkm.phone.replace(/^0/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-lg hover:shadow-green-500/50"
                    >
                      <span className="material-icons">chat</span>
                      <span className="font-semibold">WhatsApp</span>
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${umkm.lat},${umkm.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/50"
                    >
                      <span className="material-icons">directions</span>
                      <span className="font-semibold">Petunjuk Arah</span>
                    </a>
                    <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                      <span className="material-icons">share</span>
                      <span className="font-semibold">Bagikan</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-icons text-emerald-500">info</span>
                  Tentang
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {umkm.description}
                </p>
              </div>

              {/* Gallery */}
              {galleries.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="material-icons text-emerald-500">photo_library</span>
                    Galeri Foto
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleries.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                        onClick={() => setSelectedImage(img)}
                      >
                        <Image
                          src={img}
                          alt={`${umkm.name} - ${idx + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="material-icons text-emerald-500">rate_review</span>
                  Ulasan & Rating
                </h2>
                
                {/* Rating Summary */}
                <div className="flex items-center gap-8 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">4.5</div>
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="material-icons text-yellow-500">
                          {star <= 4 ? 'star' : 'star_half'}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">120 ulasan</div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{rating}★</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500"
                            style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : 10}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-12">{rating === 5 ? '84' : rating === 4 ? '24' : '12'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold">
                      A
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900 dark:text-white">Agus Santoso</span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className="material-icons text-yellow-500 text-sm">star</span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">• 2 hari lalu</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Pelayanan sangat baik dan produknya berkualitas. Harga juga terjangkau. Recommended!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 relative">
              {/* Contact Info - Fixed Position */}
              <div className="lg:fixed lg:top-32 lg:w-80 xl:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-h-[calc(100vh-9rem)] overflow-y-auto">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Informasi Kontak</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="material-icons text-emerald-500">location_on</span>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Alamat</div>
                      <div className="text-gray-900 dark:text-white">{umkm.address}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="material-icons text-emerald-500">call</span>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Telepon</div>
                      {umkm.phone && umkm.phone !== 'Tidak ada informasi' ? (
                        <a href={`tel:${umkm.phone}`} className="text-emerald-600 dark:text-emerald-400 hover:underline">
                          {umkm.phone}
                        </a>
                      ) : (
                        <div className="text-gray-400 dark:text-gray-500">Tidak ada</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="material-icons text-emerald-500">schedule</span>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Jam Operasional</div>
                      <div className="text-gray-900 dark:text-white">{umkm.operatingHours}</div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Lokasi di Peta</h4>
                  <div className="rounded-xl overflow-hidden h-48 border border-gray-200 dark:border-gray-700">
                    <SimpleMap 
                      lat={umkm.lat} 
                      lng={umkm.lng} 
                      zoom={15}
                      color={CAT_COLOR[umkm.category] || '#10B981'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <Image
              src={selectedImage}
              alt="Preview"
              width={1200}
              height={800}
              className="object-contain"
              unoptimized
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <span className="material-icons">close</span>
            </button>
          </div>
        </div>
      )}

      <FooterSection />
    </div>
  );
}
