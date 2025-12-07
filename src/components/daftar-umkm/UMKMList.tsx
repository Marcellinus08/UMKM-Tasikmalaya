import { CAT_COLOR } from '@/data/umkm';
import Image from 'next/image';
import { memo } from 'react';
import Link from 'next/link';

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
  umkms: UMKM[];
  loading: boolean;
}

function UMKMList({ umkms, loading }: UMKMListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse"
          >
            <div className="flex">
              <div className="w-1.5 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex-1 p-5">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 rounded-lg bg-gray-300 dark:bg-gray-600 shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (umkms.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="material-icons text-6xl text-gray-300 dark:text-gray-600 mb-4">search_off</span>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">UMKM Tidak Ditemukan</h3>
        <p className="text-gray-600 dark:text-gray-400">Coba ubah kata kunci pencarian atau filter kategori</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {umkms.map((umkm, index) => (
        <div
          key={index}
          className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300"
        >
          <div className="flex">
            {/* Left color bar */}
            <div className="w-1.5 shrink-0" style={{ backgroundColor: CAT_COLOR[umkm.category] }}></div>
            
            <div className="flex-1 p-5">
              <div className="flex items-start gap-4">
                {/* Icon/Image */}
                <div 
                  className="w-24 h-24 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0 overflow-hidden"
                  style={{ backgroundColor: umkm.gambar ? 'transparent' : CAT_COLOR[umkm.category] }}
                >
                  {umkm.gambar ? (
                    <Image 
                      src={umkm.gambar} 
                      alt={umkm.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
                      unoptimized
                    />
                  ) : (
                    <span className="material-icons" style={{ color: 'white', fontSize: '64px' }}>store</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex-1">
                      {umkm.name}
                    </h3>
                    <span
                      className="inline-block text-xs font-semibold text-white shrink-0"
                      style={{ backgroundColor: CAT_COLOR[umkm.category], borderRadius: '4px', padding: '3px 8px' }}
                    >
                      {umkm.category}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="material-icons text-sm text-emerald-500 mt-0.5 shrink-0">location_on</span>
                      <span className="flex-1">{umkm.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="material-icons text-sm text-emerald-400 shrink-0">schedule</span>
                      <span className="font-medium">{umkm.operatingHours}</span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <Link
                    href={`/umkm/${umkm.no}`}
                    className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <span className="material-icons text-sm">visibility</span>
                    <span>Lihat Detail</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(UMKMList);
