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

interface UMKMGridProps {
  umkms: UMKM[];
  loading: boolean;
}

function UMKMGrid({ umkms, loading }: UMKMGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse"
          >
            <div className="h-3 bg-gray-300 dark:bg-gray-600"></div>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {umkms.map((umkm, index) => (
        <div
          key={index}
          className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform hover:-translate-y-2 transition-all duration-300 flex flex-col"
        >
          {/* Category stripe */}
          <div className="h-3" style={{ backgroundColor: CAT_COLOR[umkm.category] }}></div>
          
          <div className="p-6 flex flex-col flex-1">
            {/* Header with icon/image */}
            <div className="flex items-start gap-4 mb-4">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform overflow-hidden shrink-0"
                style={{ backgroundColor: umkm.gambar ? 'transparent' : CAT_COLOR[umkm.category] }}
              >
                {umkm.gambar ? (
                  <Image 
                    src={umkm.gambar} 
                    alt={umkm.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
                    unoptimized
                  />
                ) : (
                  <span className="material-icons" style={{ color: 'white', fontSize: '48px' }}>store</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors line-clamp-2">
                  {umkm.name}
                </h3>
                <span
                  className="inline-block py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: CAT_COLOR[umkm.category], borderRadius: '4px', padding: '3px 8px' }}
                >
                  {umkm.category}
                </span>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="material-icons text-sm mt-0.5 text-emerald-500 shrink-0">location_on</span>
                <span className="flex-1">{umkm.address}</span>
              </div>
            </div>

            <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="material-icons text-sm text-emerald-400 shrink-0">schedule</span>
                <span className="font-medium">{umkm.operatingHours}</span>
              </div>
              <Link
                href={`/umkm/${umkm.no}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span className="material-icons text-sm">visibility</span>
                <span>Lihat Detail</span>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(UMKMGrid);
