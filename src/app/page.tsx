'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import UMKMList from '@/components/UMKMList';

// Import UMKMMap dynamically to avoid SSR issues with Leaflet
const UMKMMap = dynamic(() => import('@/components/UMKMMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
  ),
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main>
        <div className="container mx-auto px-4 md:px-8">
          {/* Dashboard Section */}
          <Dashboard />

          {/* Map Section */}
          <section id="peta-umkm" className="mt-8">
            <UMKMMap />
          </section>

          {/* UMKM List Section */}
          <section id="daftar-umkm" className="mt-8">
            <UMKMList />
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-16">
        <div className="container mx-auto px-4 md:px-8 py-8">
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            © 2025 Peta UMKM Tasikmalaya. Mendukung pertumbuhan ekonomi lokal.
          </p>
        </div>
      </footer>
    </div>
  );
}
