interface Purpose {
  icon: string;
  title: string;
  description: string;
}

export default function PurposeSection() {
  const purposes: Purpose[] = [
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

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-full backdrop-blur-sm mb-6">
          <span className="material-icons text-emerald-600 dark:text-emerald-500 text-sm">flag</span>
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-500">Tujuan Platform</span>
        </div>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Mengapa Platform <span className="bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Ini Ada?</span>
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
                <div className="w-16 h-16 bg-linear-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
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
  );
}
