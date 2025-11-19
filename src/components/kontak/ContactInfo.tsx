interface ContactInfoItem {
  icon: string;
  title: string;
  content: string;
  color: string;
}

export default function ContactInfo() {
  const contactInfo: ContactInfoItem[] = [
    {
      icon: 'public',
      title: 'Platform',
      content: 'Pemetaan UMKM Tasikmalaya',
      color: 'from-emerald-500 to-green-500'
    },
    {
      icon: 'dataset',
      title: 'Database',
      content: 'Informasi UMKM di 9 kecamatan',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: 'location_city',
      title: 'Wilayah',
      content: 'Tasikmalaya, Jawa Barat',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: 'groups',
      title: 'Komunitas',
      content: 'Terbuka untuk seluruh masyarakat',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: 'analytics',
      title: 'Fitur',
      content: 'Peta interaktif, statistik, dan informasi UMKM',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: 'diversity_3',
      title: 'Tujuan',
      content: 'Digitalisasi dan pengembangan UMKM lokal',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <div className="lg:col-span-1 h-full">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 h-full flex flex-col">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="material-icons text-emerald-600">info</span>
          Informasi Platform
        </h2>
        
        <div className="space-y-5 flex-1">
          {contactInfo.map((info, index) => (
            <div key={index} className="group">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 bg-linear-to-br ${info.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                  <span className="material-icons text-white">{info.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {info.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {info.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
