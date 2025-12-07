'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import HeaderSection from '@/components/statistik/HeaderSection';
import SummaryCards from '@/components/statistik/SummaryCards';
import TopCategories from '@/components/statistik/TopCategories';
import CategoryPieChart from '@/components/statistik/CategoryPieChart';
import DistrictBarChart from '@/components/statistik/DistrictBarChart';
import FooterSection from '@/components/beranda/FooterSection';
import { CAT_COLOR } from '@/data/umkm';

// Fallback colors jika kategori tidak ada di CAT_COLOR
const FALLBACK_COLORS = [
  '#F97316', '#8B5CF6', '#EC4899', '#10B981', '#3B82F6', 
  '#F59E0B', '#EF4444', '#14B8A6', '#6366F1', '#84CC16',
  '#F472B6', '#A78BFA', '#FB923C', '#FCD34D', '#818CF8'
];

interface UMKM {
  no: string; // UUID
  name: string;
  category: string;
  district: string;
  description: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  operatingHours: string;
}

interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

interface DistrictStat {
  district: string;
  count: number;
}

export default function StatistikPage() {
  const [umkms, setUmkms] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [districtStats, setDistrictStats] = useState<DistrictStat[]>([]);
  const [totalUMKM, setTotalUMKM] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/umkm');
        const data: UMKM[] = await response.json();
        setUmkms(data);
        setTotalUMKM(data.length);

        // Hitung statistik per kategori
        const categoryCount: Record<string, number> = {};
        data.forEach(umkm => {
          categoryCount[umkm.category] = (categoryCount[umkm.category] || 0) + 1;
        });

        const categoryStatsData = Object.entries(categoryCount)
          .map(([category, count], index) => ({
            category,
            count,
            percentage: (count / data.length) * 100,
            color: CAT_COLOR[category] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]
          }))
          .sort((a, b) => b.count - a.count);

        setCategoryStats(categoryStatsData);

        // Hitung statistik per kecamatan
        const districtCount: Record<string, number> = {};
        data.forEach(umkm => {
          districtCount[umkm.district] = (districtCount[umkm.district] || 0) + 1;
        });

        const districtStatsData = Object.entries(districtCount)
          .map(([district, count]) => ({ district, count }))
          .sort((a, b) => b.count - a.count);

        setDistrictStats(districtStatsData);
      } catch (error) {
        console.error('Error fetching UMKM data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const maxDistrictCount = Math.max(...districtStats.map(d => d.count), 1);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Fixed Green Blur Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse-green"></div>
        <div className="absolute top-1/3 right-20 w-80 h-80 bg-green-500/30 rounded-full blur-3xl animate-pulse-green-delay-1"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-teal-500/30 rounded-full blur-3xl animate-pulse-green-delay-2"></div>
      </div>

      <Header />
      
      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <HeaderSection />

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Memuat data statistik...</p>
            </div>
          ) : (
            <div className="space-y-8">
              <SummaryCards 
                totalUMKM={totalUMKM}
                categoriesCount={categoryStats.length}
                districtsCount={districtStats.length}
              />

              <TopCategories categoryStats={categoryStats} />

              <CategoryPieChart categoryStats={categoryStats} />

              <DistrictBarChart districtStats={districtStats} />
            </div>
          )}
        </div>
      </main>

      <div>
        <FooterSection />
      </div>
    </div>
  );
}
