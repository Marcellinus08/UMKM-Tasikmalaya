'use client';

import { useState, useEffect } from 'react';
import Chart from './Chart';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: string;
  gradient: string;
}

const StatCard = ({ title, value, trend, icon, gradient }: StatCardProps) => (
  <div className={`p-6 rounded-xl ${gradient} shadow-soft hover:shadow-lg transition-shadow duration-300`}>
    <div className="flex justify-between items-start mb-4">
      <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{title}</p>
      <span className="material-icons text-primary-500 text-2xl">{icon}</span>
    </div>
    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</h3>
    {trend && (
      <div className="flex items-center gap-1">
        <span className={`material-icons text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {trend.isPositive ? 'trending_up' : 'trending_down'}
        </span>
        <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">dari bulan lalu</span>
      </div>
    )}
  </div>
);

interface UMKM {
  no: number;
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

export default function Dashboard() {
  const [umkms, setUmkms] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/umkm');
        const data = await response.json();
        setUmkms(data);
      } catch (error) {
        console.error('Error fetching UMKM data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Menghitung statistik dari data UMKM
  const totalUMKM = umkms.length;
  const categories = [...new Set(umkms.map((umkm: UMKM) => umkm.category))];
  const districts = [...new Set(umkms.map((umkm: UMKM) => umkm.district))];
  const popularCategory = umkms.reduce((acc: Record<string, number>, curr: UMKM) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const categoryEntries = Object.entries(popularCategory);
  const mostPopularCategory = categoryEntries.length > 0 
    ? categoryEntries.reduce((a: [string, number], b: [string, number]) => 
        a[1] > b[1] ? a : b
      )[0]
    : 'N/A';

  if (loading) {
    return (
      <section>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl mt-7 font-bold mb-6 text-gray-900 dark:text-white">
            Statistik UMKM Tasikmalaya
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div>
        <h2 className="text-2xl mt-7 font-bold mb-6 text-gray-900 dark:text-white">
          Statistik UMKM Tasikmalaya
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total UMKM"
            value={totalUMKM}
            icon="store"
            gradient="bg-linear-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20"
          />
          <StatCard
            title="Kategori UMKM"
            value={categories.length}
            icon="category"
            gradient="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
          />
          <StatCard
            title="Kategori Terpopuler"
            value={mostPopularCategory}
            icon="trending_up"
            gradient="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
          />
          <StatCard
            title="Kecamatan Terjangkau"
            value={districts.length}
            icon="location_city"
            gradient="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
          />
        </div>

        {/* Mini Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-soft">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Persebaran UMKM
              </h3>
              <div className="flex items-center gap-2">
                <span className="material-icons text-primary-500">location_city</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {[...new Set(umkms.map(u => u.district))].length} Kecamatan
                </span>
              </div>
            </div>
            <div className="h-64 relative">
              <Chart variant="growth" data={umkms} />
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-soft">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Distribusi Kategori
              </h3>
              <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                Lihat Detail →
              </button>
            </div>
            <div className="h-64 relative">
              <Chart variant="distribution" data={umkms} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}