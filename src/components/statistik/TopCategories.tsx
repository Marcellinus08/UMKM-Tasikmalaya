interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

interface TopCategoriesProps {
  categoryStats: CategoryStat[];
}

export default function TopCategories({ categoryStats }: TopCategoriesProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <span className="material-icons text-emerald-500">emoji_events</span>
        Top 5 Kategori Terpopuler
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {categoryStats.slice(0, 5).map((stat, index) => (
          <div 
            key={index}
            className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 text-center border-2 border-gray-200 dark:border-gray-600 hover:scale-105 transition-transform"
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              {index + 1}
            </div>
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: stat.color }}
            >
              <span className="material-icons" style={{ color: 'white', fontSize: '36px' }}>store</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{stat.category}</h3>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">{stat.count}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">UMKM</p>
          </div>
        ))}
      </div>
    </div>
  );
}
