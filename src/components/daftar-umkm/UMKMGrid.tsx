import { CAT_COLOR } from '@/data/umkm';
import Image from 'next/image';

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
  gambar?: string | null;
}

interface UMKMGridProps {
  umkms: UMKM[];
  loading: boolean;
}

export default function UMKMGrid({ umkms, loading }: UMKMGridProps) {
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Memuat data UMKM dari database...</p>
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
                className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform overflow-hidden flex-shrink-0"
                style={{ backgroundColor: umkm.gambar ? 'transparent' : CAT_COLOR[umkm.category] }}
              >
                {umkm.gambar ? (
                  <Image 
                    src={umkm.gambar} 
                    alt={umkm.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
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
                <span className="material-icons text-sm mt-0.5 text-emerald-500 flex-shrink-0">location_on</span>
                <span className="flex-1">{umkm.address}</span>
              </div>
            </div>

            <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="material-icons text-sm text-emerald-400 flex-shrink-0">schedule</span>
                <span className="font-medium">{umkm.operatingHours}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
