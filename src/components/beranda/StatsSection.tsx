interface StatsSectionProps {
  loading: boolean;
  stats: {
    totalUMKM: number;
    categories: number;
    locations: number;
  };
}

export default function StatsSection({ loading, stats }: StatsSectionProps) {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: 'store', label: 'UMKM Terdaftar', value: stats.totalUMKM, color: 'from-emerald-400 to-green-500', bgColor: 'from-emerald-50 to-green-50' },
            { icon: 'category', label: 'Kategori Usaha', value: stats.categories, color: 'from-green-400 to-teal-500', bgColor: 'from-green-50 to-teal-50' },
            { icon: 'location_city', label: 'Wilayah Tercakup', value: stats.locations, color: 'from-teal-400 to-cyan-500', bgColor: 'from-teal-50 to-cyan-50' }
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${stat.bgColor} dark:bg-linear-to-br dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Decorative circles */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 bg-linear-to-br ${stat.color} rounded-full opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              <div className={`absolute -bottom-8 -left-8 w-24 h-24 bg-linear-to-br ${stat.color} rounded-full opacity-5`}></div>
              
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
              </div>
              
              <div className="relative p-6">
                {/* Icon and Value Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex items-center justify-center w-14 h-14 bg-linear-to-br ${stat.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
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
                  <div className={`h-1 w-8 bg-linear-to-r ${stat.color} rounded-full`}></div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
                
                {/* Progress bar effect */}
                <div className="mt-4 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-linear-to-r ${stat.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: loading ? '0%' : '100%' }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
