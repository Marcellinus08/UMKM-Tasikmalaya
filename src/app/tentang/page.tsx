'use client';

'use client';

import Header from '@/components/Header';
import HeroSection from '@/components/tentang/HeroSection';
import PurposeSection from '@/components/tentang/PurposeSection';
import TeamSection from '@/components/tentang/TeamSection';
import FooterSection from '@/components/beranda/FooterSection';

export default function Tentang() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Fixed Green Blur Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse-green"></div>
        <div className="absolute top-1/3 right-20 w-80 h-80 bg-green-500/30 rounded-full blur-3xl animate-pulse-green-delay-1"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-teal-500/30 rounded-full blur-3xl animate-pulse-green-delay-2"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl animate-pulse-green"></div>
      </div>

      <Header />
      
      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <HeroSection />
          <PurposeSection />
          <TeamSection />
        </div>
      </main>

      <div>
        <FooterSection />
      </div>
    </div>
  );
}
