"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { type MapProps } from "@/components/Map";

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

// Dynamically import Leaflet with no SSR
const MapComponent = dynamic<MapProps>(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
  ),
});

export default function UMKMMap() {
  const [category, setCategory] = useState("Semua");
  const [isDark, setIsDark] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/umkm');
        const data: UMKM[] = await response.json();
        
        // Extract unique categories from data
        const uniqueCategories = [...new Set(data.map(u => u.category))].sort();
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
    
    // Listen for location selection from UMKMList
    const handleLocationSelect = (event: any) => {
      setSelectedLocation({ lat: event.detail.lat, lng: event.detail.lng });
    };
    
    window.addEventListener('umkm-location-select', handleLocationSelect);
    return () => window.removeEventListener('umkm-location-select', handleLocationSelect);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <section id="peta">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Peta Persebaran UMKM
      </h2>
      <p className="text-subtext-light dark:text-subtext-dark mb-4">
        Klik marker pada peta untuk melihat detail UMKM atau pilih dari daftar.
      </p>
      <div className="bg-card-light dark:bg-card-dark p-4 md:p-6 rounded-lg shadow-md">
        <MapComponent isDark={isDark} category={category} />
        <div className="mt-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm text-subtext-light dark:text-subtext-dark">
            <span className="material-icons text-primary">layers</span>
            <span>{isDark ? "Peta gelap" : "Peta terang"}</span>
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="map-cat"
              className="text-sm text-subtext-light dark:text-subtext-dark"
            >
              Filter kategori:
            </label>
            <select
              id="map-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-200 dark:border-gray-700 rounded-lg bg-card-light dark:bg-card-dark text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Semua">Semua</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
