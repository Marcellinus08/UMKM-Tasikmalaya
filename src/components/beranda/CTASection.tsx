import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Siap Menjelajahi UMKM Tasikmalaya?
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Bergabunglah dengan ribuan pengguna yang telah menemukan UMKM lokal favorit mereka
        </p>
        <Link
          href="/peta-umkm"
          className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-emerald-500 to-green-500 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/50 hover:from-emerald-600 hover:to-green-600 transform hover:-translate-y-1 transition-all duration-300 group"
        >
          <span>Mulai Sekarang</span>
          <span className="material-icons group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </Link>
      </div>
    </section>
  );
}
