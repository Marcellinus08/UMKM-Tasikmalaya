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

interface UMKMListProps {
  umkms: UMKM[];
  loading: boolean;
}

export default function UMKMList({ umkms, loading }: UMKMListProps) {
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
    <div className="space-y-4">
      {umkms.map((umkm, index) => (
        <div
          key={index}
          className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300"
        >
          <div className="flex">
            {/* Left color bar */}
            <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: CAT_COLOR[umkm.category] }}></div>
            
            <div className="flex-1 p-5">
              <div className="flex items-start gap-4">
                {/* Icon/Image */}
                <div 
                  className="w-24 h-24 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0 overflow-hidden"
                  style={{ backgroundColor: umkm.gambar ? 'transparent' : CAT_COLOR[umkm.category] }}
                >
                  {umkm.gambar ? (
                    <Image 
                      src={umkm.gambar} 
                      alt={umkm.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
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
                      className="inline-block text-xs font-semibold text-white flex-shrink-0"
                      style={{ backgroundColor: CAT_COLOR[umkm.category], borderRadius: '4px', padding: '3px 8px' }}
                    >
                      {umkm.category}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="material-icons text-sm text-emerald-500 mt-0.5 flex-shrink-0">location_on</span>
                      <span className="flex-1">{umkm.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="material-icons text-sm text-emerald-400 flex-shrink-0">schedule</span>
                      <span className="font-medium">{umkm.operatingHours}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
