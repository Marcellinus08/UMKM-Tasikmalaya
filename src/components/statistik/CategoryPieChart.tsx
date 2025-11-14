import { useState } from 'react';

interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

interface CategoryPieChartProps {
  categoryStats: CategoryStat[];
}

export default function CategoryPieChart({ categoryStats }: CategoryPieChartProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="material-icons text-emerald-500">pie_chart</span>
        Distribusi per Kategori
      </h2>

      <div className="flex flex-col gap-6 items-center">
        {/* Compact Pie Chart - Top */}
        <div className="relative flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-56 h-56">
            {(() => {
              let currentAngle = 0;
              return categoryStats.map((stat, index) => {
                const angle = (stat.percentage / 100) * 360;
                const startAngle = currentAngle;
                currentAngle += angle;
                
                const startRad = (startAngle - 90) * (Math.PI / 180);
                const endRad = (currentAngle - 90) * (Math.PI / 180);
                
                const x1 = 100 + 85 * Math.cos(startRad);
                const y1 = 100 + 85 * Math.sin(startRad);
                const x2 = 100 + 85 * Math.cos(endRad);
                const y2 = 100 + 85 * Math.sin(endRad);
                
                const largeArc = angle > 180 ? 1 : 0;
                const isHovered = hoveredCategory === stat.category;
                
                return (
                  <path
                    key={index}
                    d={`M 100 100 L ${x1} ${y1} A 85 85 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={stat.color}
                    className="transition-all duration-300 cursor-pointer"
                    style={{ 
                      filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
                      opacity: hoveredCategory && !isHovered ? 0.4 : 1,
                    }}
                    onMouseEnter={() => setHoveredCategory(stat.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />
                );
              });
            })()}
          </svg>

          {/* Compact Tooltip */}
          {hoveredCategory && (() => {
            const stat = categoryStats.find(s => s.category === hoveredCategory);
            if (!stat) return null;
            return (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
                <div className="bg-gray-900 text-white rounded-lg shadow-xl px-3 py-2 text-xs text-center">
                  <div className="font-bold">{stat.category}</div>
                  <div className="text-emerald-400">{stat.percentage.toFixed(1)}%</div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Compact Legend - Bottom (3 columns) */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {categoryStats.map((stat, index) => {
            const isHovered = hoveredCategory === stat.category;
            return (
              <div 
                key={index} 
                className="flex items-center justify-between gap-2 p-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                style={{
                  opacity: hoveredCategory && !isHovered ? 0.4 : 1
                }}
                onMouseEnter={() => setHoveredCategory(stat.category)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div 
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: stat.color }}
                  ></div>
                  <div className="text-xs font-medium text-gray-900 dark:text-white truncate">
                    {stat.category}
                  </div>
                </div>
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex-shrink-0">
                  {stat.count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
