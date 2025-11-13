'use client';

import Header from '@/components/Header';
import Image from 'next/image';

export default function Tentang() {
  const features = [
    {
      icon: 'map',
      title: 'Peta Interaktif',
      description: 'Visualisasi lokasi UMKM dengan teknologi pemetaan modern'
    },
    {
      icon: 'search',
      title: 'Pencarian Mudah',
      description: 'Temukan UMKM dengan filter kategori dan lokasi'
    },
    {
      icon: 'phone',
      title: 'Kontak Langsung',
      description: 'Hubungi UMKM secara langsung melalui platform'
    },
    {
      icon: 'analytics',
      title: 'Data Akurat',
      description: 'Informasi UMKM yang terverifikasi dan terpercaya'
    }
  ];

  const team = [
    {
      name: 'Tim Teknologi',
      role: 'Pengembangan Platform',
      icon: 'code',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      name: 'Tim Data',
      role: 'Validasi & Update Data',
      icon: 'data_usage',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Tim Komunitas',
      role: 'Koordinasi UMKM',
      icon: 'groups',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Tim Dukungan',
      role: 'Layanan Pengguna',
      icon: 'support_agent',
      color: 'from-orange-500 to-green-500'
    }
  ];

  const stats = [
    { label: 'UMKM Terdaftar', value: '100+', icon: 'store' },
    { label: 'Kategori Usaha', value: '6+', icon: 'category' },
    { label: 'Wilayah Tercakup', value: '8+', icon: 'location_city' },
    { label: 'Pengguna Aktif', value: '1000+', icon: 'people' }
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
              Platform <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Pemetaan UMKM</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Menghubungkan UMKM lokal dengan masyarakat melalui teknologi digital untuk mendukung pertumbuhan ekonomi Tasikmalaya
            </p>
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

          {/* Stats */}
          <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-12 mb-16 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
            </div>

            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex p-4 bg-white/20 rounded-xl mb-4">
                    <span className="material-icons text-white text-4xl">{stat.icon}</span>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-white/90 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Fitur <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Platform</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Teknologi terkini untuk kemudahan akses informasi UMKM
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-icons text-white text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Tim <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Kami</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Dedikasi dan komitmen untuk kesuksesan UMKM lokal
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-center"
                >
                  <div className={`w-20 h-20 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <span className="material-icons text-white text-4xl">{member.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-600">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Bergabunglah Bersama Kami
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Mari bersama-sama memajukan UMKM Tasikmalaya melalui transformasi digital
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/daftar-umkm"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <span className="material-icons">store</span>
                <span>Lihat Daftar UMKM</span>
              </a>
              <a
                href="/kontak"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl border-2 border-gray-300 dark:border-gray-600 hover:border-emerald-500 dark:hover:border-emerald-500 transform hover:-translate-y-1 transition-all duration-300"
              >
                <span className="material-icons">mail</span>
                <span>Hubungi Kami</span>
              </a>
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
