export default function HeaderSection() {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-emerald-400/20 to-green-400/20 border border-emerald-400/30 rounded-full backdrop-blur-sm mb-6">
        <span className="material-icons text-emerald-600 dark:text-emerald-500 text-sm">bar_chart</span>
        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-500">Analisis Data</span>
      </div>

      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
        <span className="bg-linear-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">Statistik</span> UMKM
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Data dan analisis UMKM di Tasikmalaya
      </p>
    </div>
  );
}
