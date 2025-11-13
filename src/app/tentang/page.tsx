'use client';

import Header from '@/components/Header';
import Image from 'next/image';

export default function Tentang() {
  const purposes = [
    {
      icon: 'business_center',
      title: 'Digitalisasi UMKM',
      description: 'Membantu UMKM lokal bertransformasi digital dengan menyediakan platform online yang mudah diakses untuk meningkatkan visibilitas dan jangkauan pasar mereka.'
    },
    {
      icon: 'connecting_airports',
      title: 'Menghubungkan Pelaku Usaha dengan Konsumen',
      description: 'Menjembatani UMKM dengan masyarakat luas melalui sistem pemetaan digital yang interaktif, memudahkan konsumen menemukan produk dan layanan lokal yang mereka butuhkan.'
    },
    {
      icon: 'trending_up',
      title: 'Mendorong Pertumbuhan Ekonomi Lokal',
      description: 'Memberikan kontribusi nyata pada perekonomian Tasikmalaya dengan meningkatkan aksesibilitas UMKM, menciptakan peluang bisnis baru, dan mendukung keberlanjutan usaha kecil menengah.'
    },
    {
      icon: 'insights',
      title: 'Menyediakan Data & Analitik',
      description: 'Menghadirkan informasi statistik dan analisis sebaran UMKM yang dapat digunakan untuk pengambilan keputusan strategis oleh pelaku usaha, pemerintah, dan pemangku kepentingan.'
    }
  ];

  const team = [
    {
      name: 'Marcellinus Geofani',
      prodi: 'S1 Teknik Komputer',
      icon: 'code',
      color: 'from-emerald-500 to-teal-500',
      description: 'Pengembangan website'
    },
    {
      name: 'Otniel',
      prodi: 'S1 Teknik Komputer',
      icon: 'palette',
      color: 'from-purple-500 to-pink-500',
      description: 'Pengumpulan data'
    }
  ];

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
        <div className="container mx-auto max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-purple-500/10 border border-emerald-500/20 rounded-full backdrop-blur-sm mb-6">
              <span className="material-icons text-emerald-600 dark:text-emerald-500 text-sm">info</span>
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-500">Tentang Kami</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Platform <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Pemetaan UMKM</span> Tasikmalaya
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Solusi digital untuk menghubungkan, memetakan, dan mengembangkan UMKM lokal melalui teknologi informasi geografis yang mudah diakses oleh semua kalangan
            </p>
          </div>

          {/* Purpose Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-full backdrop-blur-sm mb-6">
                <span className="material-icons text-emerald-600 dark:text-emerald-500 text-sm">flag</span>
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-500">Tujuan Platform</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Mengapa Platform <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Ini Ada?</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Platform ini hadir dengan tujuan mulia untuk memberdayakan UMKM Tasikmalaya melalui transformasi digital
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {purposes.map((purpose, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <span className="material-icons text-white text-3xl">{purpose.icon}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {purpose.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {purpose.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Vision */}
            <div className="group bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-8 text-white shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-icons text-4xl">visibility</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">Visi Kami</h2>
                <p className="text-white/90 text-lg leading-relaxed">
                  Menjadi platform digital terdepan dalam memetakan dan mengembangkan UMKM di Tasikmalaya, 
                  menciptakan ekosistem ekonomi lokal yang inklusif dan berkelanjutan.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-icons text-white text-4xl">flag</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Misi Kami</h2>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400 text-lg">
                <li className="flex items-start gap-3">
                  <span className="material-icons text-green-500 mt-1">check_circle</span>
                  <span>Memetakan seluruh UMKM di Tasikmalaya secara digital</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-icons text-green-500 mt-1">check_circle</span>
                  <span>Memudahkan akses informasi UMKM bagi masyarakat</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-icons text-green-500 mt-1">check_circle</span>
                  <span>Mendorong digitalisasi UMKM lokal</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-icons text-green-500 mt-1">check_circle</span>
                  <span>Meningkatkan visibilitas produk lokal</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-purple-500/10 border border-emerald-500/20 rounded-full backdrop-blur-sm mb-6">
                <span className="material-icons text-emerald-600 dark:text-emerald-500 text-sm">groups</span>
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-500">Tim Pengembang</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Tim <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Pembuat Platform</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Mahasiswa Universitas Telkom yang berkomitmen mengembangkan ekosistem digital untuk UMKM Tasikmalaya
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 w-full sm:w-64"
                >
                  <div className={`w-28 h-28 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                    <span className="material-icons text-white text-5xl">{member.icon}</span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {member.name}
                    </h3>
                    <div className="text-emerald-600 dark:text-emerald-500 font-semibold mb-1">
                      {member.prodi}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {member.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
