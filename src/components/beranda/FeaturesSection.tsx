export default function FeaturesSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Fitur <span className="bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Platform</span>
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
              <div className={`inline-flex p-4 bg-linear-to-br ${feature.color} rounded-xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
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
  );
}
