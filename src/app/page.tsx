'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

export default function Home() {
  const [stats, setStats] = useState({
    totalUMKM: 0,
    categories: 0,
    locations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data dari API database
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/umkm');
        const data = await response.json();
        
        const categories = new Set(data.map((u: any) => u.category)).size;
        const districts = new Set(data.map((u: any) => u.district)).size;
        
        setStats({
          totalUMKM: data.length,
          categories: categories,
          locations: districts
        });
      } catch (error) {
        console.error('Error fetching UMKM data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
      
      <main className="relative z-10">
        {/* Hero Section */}
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
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-400/20 to-green-400/20 border border-emerald-400/30 rounded-full backdrop-blur-sm">
                <span className="material-icons text-emerald-600 dark:text-emerald-400 text-sm animate-pulse">
                  verified
                </span>
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  Platform Pemetaan UMKM Terpercaya
                </span>
              </div>

              {/* Main heading - Green */}
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="block bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent pb-2">
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
                  className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
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

        {/* Stats Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: 'store', label: 'UMKM Terdaftar', value: stats.totalUMKM, color: 'from-emerald-400 to-green-500', bgColor: 'from-emerald-50 to-green-50', darkBgColor: 'from-emerald-900/20 to-green-900/20' },
                { icon: 'category', label: 'Kategori Usaha', value: stats.categories, color: 'from-green-400 to-teal-500', bgColor: 'from-green-50 to-teal-50', darkBgColor: 'from-green-900/20 to-teal-900/20' },
                { icon: 'location_city', label: 'Wilayah Tercakup', value: stats.locations, color: 'from-teal-400 to-cyan-500', bgColor: 'from-teal-50 to-cyan-50', darkBgColor: 'from-teal-900/20 to-cyan-900/20' }
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bgColor} dark:${stat.darkBgColor} border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Decorative circles */}
                  <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.color} rounded-full opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                  <div className={`absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-full opacity-5`}></div>
                  
                  {/* Pattern overlay */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                  </div>
                  
                  <div className="relative p-6">
                    {/* Icon and Value Row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`flex items-center justify-center w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                        <span className="material-icons text-white text-2xl">{stat.icon}</span>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                          {loading ? (
                            <span className="inline-block w-16 h-10 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></span>
                          ) : (
                            stat.value
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Label */}
                    <div className="flex items-center gap-2">
                      <div className={`h-1 w-8 bg-gradient-to-r ${stat.color} rounded-full`}></div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        {stat.label}
                      </p>
                    </div>
                    
                    {/* Progress bar effect */}
                    <div className="mt-4 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: loading ? '0%' : '100%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Fitur <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Platform</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Teknologi terkini untuk kemudahan akses informasi UMKM
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: 'map',
                  title: 'Peta Interaktif',
                  description: 'Temukan UMKM dengan peta interaktif yang mudah digunakan',
                  color: 'from-emerald-400 to-green-500'
                },
                {
                  icon: 'search',
                  title: 'Pencarian Cerdas',
                  description: 'Cari UMKM berdasarkan kategori, lokasi, atau nama dengan cepat',
                  color: 'from-green-400 to-teal-500'
                },
                {
                  icon: 'info',
                  title: 'Informasi Lengkap',
                  description: 'Dapatkan detail alamat, dan jam operasional dari setiap UMKM',
                  color: 'from-teal-400 to-cyan-500'
                },
                {
                  icon: 'bar_chart',
                  title: 'Statistik UMKM',
                  description: 'Lihat data dan statistik lengkap UMKM di berbagai wilayah',
                  color: 'from-emerald-500 to-green-600'
                },
                {
                  icon: 'filter_list',
                  title: 'Filter Kategori',
                  description: 'Filter UMKM berdasarkan kategori usaha yang Anda cari',
                  color: 'from-lime-400 to-green-500'
                },
                {
                  icon: 'speed',
                  title: 'Akses Cepat',
                  description: 'Platform responsif dan cepat, dapat diakses dari berbagai perangkat',
                  color: 'from-green-500 to-emerald-600'
                }
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="group p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`inline-flex p-4 bg-gradient-to-br ${feature.color} rounded-xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="material-icons text-white text-4xl">{feature.icon}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Siap Menjelajahi UMKM Tasikmalaya?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan pengguna yang telah menemukan UMKM lokal favorit mereka
            </p>
            <Link
              href="/peta-umkm"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/50 hover:from-emerald-600 hover:to-green-600 transform hover:-translate-y-1 transition-all duration-300 group"
            >
              <span>Mulai Sekarang</span>
              <span className="material-icons group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-icons">storefront</span>
                UMKM Tasikmalaya
              </h3>
              <p className="text-gray-400">
                Platform digital untuk memetakan dan menghubungkan UMKM lokal dengan pelanggan di Tasikmalaya.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Menu</h4>
              <ul className="space-y-2">
                {['Beranda', 'Peta UMKM', 'Daftar UMKM', 'Tentang', 'Kontak'].map(item => (
                  <li key={item}>
                    <Link href={`/${item === 'Beranda' ? '' : item.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Hubungi Kami</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="material-icons text-sm">location_on</span>
                  Tasikmalaya, Jawa Barat
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-icons text-sm">mail</span>
                  info@umkmtasikmalaya.com
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-icons text-sm">phone</span>
                  +62 812-3456-7890
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 UMKM Tasikmalaya. Mendukung pertumbuhan ekonomi lokal.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
