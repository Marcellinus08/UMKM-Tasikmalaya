import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Background decorations - Green */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center space-y-8">
          {/* Badge - Green */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-emerald-400/20 to-green-400/20 border border-emerald-400/30 rounded-full backdrop-blur-sm">
            <span className="material-icons text-emerald-600 dark:text-emerald-400 text-sm animate-pulse">
              verified
            </span>
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Platform Pemetaan UMKM
            </span>
          </div>

          {/* Main heading - Green */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="block bg-linear-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent pb-2">
              Temukan UMKM
            </span>
            <span className="block text-gray-900 dark:text-white">
              di Tasikmalaya
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Platform digital untuk memetakan dan menghubungkan UMKM lokal dengan pelanggan, 
            mendukung pertumbuhan ekonomi daerah Tasikmalaya
          </p>

          {/* CTA Buttons - Green */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href="/peta-umkm"
              className="group relative px-8 py-4 bg-linear-to-r from-emerald-500 to-green-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 overflow-hidden"
            >
              <span className="absolute inset-0 bg-linear-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="material-icons relative">map</span>
              <span className="relative">Jelajahi Peta</span>
            </Link>
            
            <Link
              href="/daftar-umkm"
              className="group px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
            >
              <span className="material-icons group-hover:scale-110 transition-transform">store</span>
              <span>Lihat Daftar UMKM</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
