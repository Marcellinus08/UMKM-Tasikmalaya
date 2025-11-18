interface SummaryCardsProps {
  totalUMKM: number;
  categoriesCount: number;
  districtsCount: number;
}

export default function SummaryCards({ totalUMKM, categoriesCount, districtsCount }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card 1: Total UMKM */}
      <div className="group relative bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden hover:-translate-y-2">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500/10 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative flex items-center gap-4">
          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="material-icons text-white text-3xl">store</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">Total UMKM</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{totalUMKM}</p>
          </div>
        </div>
      </div>

      {/* Card 2: Kategori */}
      <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-blue-200 dark:border-blue-700 overflow-hidden hover:-translate-y-2">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative flex items-center gap-4">
          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="material-icons text-white text-3xl">category</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Kategori</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{categoriesCount}</p>
          </div>
        </div>
      </div>

      {/* Card 3: Kecamatan */}
      <div className="group relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-purple-200 dark:border-purple-700 overflow-hidden hover:-translate-y-2">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-500/10 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative flex items-center gap-4">
          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="material-icons text-white text-3xl">location_city</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Kecamatan</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{districtsCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
