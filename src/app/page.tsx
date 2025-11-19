'use client';

import { useEffect, useState } from 'react';
import './globals.css';

import Header from '@/components/Header';
import HeroSection from '@/components/beranda/HeroSection';
import StatsSection from '@/components/beranda/StatsSection';
import FeaturesSection from '@/components/beranda/FeaturesSection';
import CTASection from '@/components/beranda/CTASection';
import FooterSection from '@/components/beranda/FooterSection';

export default function Home() {
  const [stats, setStats] = useState({
    totalUMKM: 0,
    categories: 0,
    locations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data dari API database
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/umkm');
        const data = await response.json();
        
        const categories = new Set(data.map((u: any) => u.category)).size;
        const districts = new Set(data.map((u: any) => u.district)).size;
        
        setStats({
          totalUMKM: data.length,
          categories: categories,
          locations: districts
        });
      } catch (error) {
        console.error('Error fetching UMKM data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Fixed Green Blur Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse-green"></div>
        <div className="absolute top-1/3 right-20 w-80 h-80 bg-green-500/30 rounded-full blur-3xl animate-pulse-green-delay-1"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-teal-500/30 rounded-full blur-3xl animate-pulse-green-delay-2"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl animate-pulse-green"></div>
      </div>

      <Header />
      
      <main className="relative z-10">
        <HeroSection />
        <StatsSection loading={loading} stats={stats} />
        <FeaturesSection />
        <CTASection />
      </main>

      <div>
        <FooterSection />
      </div>
    </div>
  );
}
