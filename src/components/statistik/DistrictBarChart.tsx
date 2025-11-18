interface DistrictStat {
  district: string;
  count: number;
}

interface DistrictBarChartProps {
  districtStats: DistrictStat[];
}

export default function DistrictBarChart({ districtStats }: DistrictBarChartProps) {
  const maxDistrictCount = Math.max(...districtStats.map(d => d.count), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <span className="material-icons text-emerald-500">location_on</span>
        Distribusi per Kecamatan
      </h2>

      <div className="space-y-6">
        {/* Bar Chart */}
        <div className="relative flex items-end justify-between gap-2 px-4" style={{ height: '256px' }}>
          {districtStats.map((stat, index) => {
            const heightPercentage = (stat.count / maxDistrictCount) * 100;
            const heightInPx = (heightPercentage / 100) * 256; // 256px = container height
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2 group relative" style={{ height: '100%', justifyContent: 'flex-end' }}>
                {/* Value label on top - now with fixed positioning */}
                <div 
                  className="absolute left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"
                  style={{ bottom: 'calc(100% + 8px)' }}
                >
                  <div className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                    {stat.count} UMKM
                    {/* Arrow pointer */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-emerald-600"></div>
                  </div>
                </div>
                
                {/* Bar */}
                <div 
                  className="w-full bg-gradient-to-t from-emerald-500 to-green-400 rounded-t-lg transition-all duration-1000 ease-out hover:from-emerald-600 hover:to-green-500 cursor-pointer relative overflow-hidden group-hover:shadow-lg flex items-start justify-center pt-2"
                  style={{ 
                    height: `${heightInPx}px`,
                    minHeight: '30px'
                  }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent transform -translate-y-full group-hover:translate-y-full transition-transform duration-1000"></div>
                  
                  {/* Count label inside bar */}
                  <span className="text-white font-bold text-sm relative z-10">
                    {stat.count}
                  </span>
                </div>
                
                {/* District name */}
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center w-full truncate mt-2" title={stat.district}>
                  {stat.district}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary table */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          {districtStats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate mr-2">{stat.district}</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500">{stat.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
