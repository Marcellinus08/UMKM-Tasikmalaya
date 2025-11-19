interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  sortBy: 'name' | 'category';
  setSortBy: (value: 'name' | 'category') => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (value: 'grid' | 'list') => void;
  filteredCount: number;
  totalCount: number;
}

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  categories,
  selectedCategory,
  setSelectedCategory,
  viewMode,
  setViewMode,
  filteredCount,
  totalCount
}: FilterBarProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Search */}
        <div className="lg:col-span-2 relative">
          <span className="material-icons absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            search
          </span>
          <input
            type="text"
            placeholder="Cari UMKM berdasarkan nama, deskripsi, atau lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <span className="material-icons absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            sort
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'category')}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            <option value="name">Urutkan: Nama (A-Z)</option>
            <option value="category">Urutkan: Kategori</option>
          </select>
          <span className="material-icons absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            expand_more
          </span>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === cat
                ? 'bg-linear-to-r from-emerald-500 to-green-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* View Toggle and Results */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Menampilkan <span className="font-bold text-emerald-600 dark:text-emerald-500">{filteredCount}</span> dari <span className="font-bold">{totalCount}</span> UMKM
        </p>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Tampilan:</span>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            aria-label="Grid view"
          >
            <span className="material-icons">grid_view</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            aria-label="List view"
          >
            <span className="material-icons">view_list</span>
          </button>
        </div>
      </div>
    </div>
  );
}
