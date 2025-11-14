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
    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
  ),
});

interface UMKMMapProps {
  mapStyle?: string;
  selectedCategory?: string;
}

export default function UMKMMap({ mapStyle = "openstreetmap", selectedCategory = "Semua" }: UMKMMapProps) {
  const [category, setCategory] = useState(selectedCategory);
  const [isDark, setIsDark] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [currentMapStyle, setCurrentMapStyle] = useState(mapStyle);

  // Update category when prop changes
  useEffect(() => {
    setCategory(selectedCategory);
  }, [selectedCategory]);

  // Update map style when prop changes
  useEffect(() => {
    setCurrentMapStyle(mapStyle);
  }, [mapStyle]);

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
    <div className="w-full h-full">
      <MapComponent isDark={isDark} category={category} mapStyle={currentMapStyle} />
    </div>
  );
}
