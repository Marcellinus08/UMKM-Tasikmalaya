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
                        className="inline-block py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: CAT_COLOR[umkm.category] }}
                      >
                        {umkm.category}
                      </span>
                    </div>
                  </div>
                  
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
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm">
                    <span className="material-icons text-sm">directions</span>
                    <span>Lokasi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
