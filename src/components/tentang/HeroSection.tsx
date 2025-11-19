export default function HeroSection() {
  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-emerald-500/10 to-purple-500/10 border border-emerald-500/20 rounded-full backdrop-blur-sm mb-6">
        <span className="material-icons text-emerald-600 dark:text-emerald-500 text-sm">info</span>
        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-500">Tentang Kami</span>
      </div>

      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
        Platform <span className="bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Pemetaan UMKM</span> Tasikmalaya
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
        Solusi digital untuk menghubungkan, memetakan, dan mengembangkan UMKM lokal melalui teknologi informasi geografis yang mudah diakses oleh semua kalangan
      </p>
    </div>
  );
}
