'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

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

const CAT_COLOR: Record<string, string> = {
  "Kuliner": "#F97316",
  "Restoran": "#FF6B35",
  "Warung nasi": "#FB923C",
  "Fashion & Pakaian": "#8B5CF6",
  "Pakaian": "#A78BFA",
  "Toko Pakaian": "#D8B4FE",
  "Kerajinan Tangan": "#DC2626",
  "Kerajinan": "#EF4444",
  "Jasa": "#0EA5E9",
  "Layanan Jasa": "#0284C7",
  "Elektronik": "#6366F1",
  "Toko Elektronik": "#818CF8",
  "Kesehatan & Kecantikan": "#EC4899",
  "Kesehatan": "#F472B6",
  "Kecantikan": "#FB7185",
  "Toko Buah dan Sayuran": "#22C55E",
  "Toko bahan makanan": "#84CC16",
  "Toko Perlengkapan Rumah": "#14B8A6",
  "Kedai Kopi": "#92400E",
  "Toko Sepatu": "#7C2D12",
  "Pusat Perbelanjaan": "#9333EA",
};

export interface MapProps {
  isDark: boolean;
  category: string;
}

export default function Map({ isDark, category }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const [umkms, setUmkms] = useState<UMKM[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Fetch UMKM data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/umkm');
        const data = await response.json();
        console.log('Fetched UMKM data:', data);
        console.log('Data length:', data.length);
        if (data.length > 0) {
          console.log('First item:', data[0]);
          console.log('First item coords:', `lat=${data[0].lat}, lng=${data[0].lng}`);
          // Check valid coords
          const validCoords = data.filter((u: UMKM) => u.lat && u.lng && !isNaN(u.lat) && !isNaN(u.lng));
          console.log('Valid coords count:', validCoords.length);
          const latValues = data.map((u: UMKM) => u.lat);
          const lngValues = data.map((u: UMKM) => u.lng);
          console.log('Lat values range:', `min=${Math.min(...latValues)}, max=${Math.max(...latValues)}`);
          console.log('Lng values range:', `min=${Math.min(...lngValues)}, max=${Math.max(...lngValues)}`);
        }
        setUmkms(data);
      } catch (error) {
        console.error('Error fetching UMKM data:', error);
      }
    };

    fetchData();

    // Listen for location selection from UMKMList
    const handleLocationSelect = (event: any) => {
      setSelectedLocation({ lat: event.detail.lat, lng: event.detail.lng });
    };
    
    window.addEventListener('umkm-location-select', handleLocationSelect);
    return () => window.removeEventListener('umkm-location-select', handleLocationSelect);
  }, []);

  // Initialize map only after data is loaded
  useEffect(() => {
    if (typeof window === 'undefined' || umkms.length === 0 || mapRef.current) return;

    console.log('Initializing map with', umkms.length, 'UMKM');
    
    // Calculate bounds from all UMKM locations
    const latLngs = umkms.map(u => [u.lat, u.lng] as L.LatLngTuple);
    console.log('LatLngs:', latLngs);
    
    const bounds = L.latLngBounds(latLngs);
    console.log('Calculated bounds:', bounds);
    console.log('Bounds NE:', bounds.getNorthEast());
    console.log('Bounds SW:', bounds.getSouthWest());
    console.log('Bounds center:', bounds.getCenter());
    console.log('Bounds toString:', bounds.toString());
    
    mapRef.current = L.map('map', { 
      zoomControl: true 
    });

    layerGroupRef.current = L.layerGroup().addTo(mapRef.current);

    const lightTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> kontributor',
      maxZoom: 19,
    });

    const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; CARTO',
      maxZoom: 19,
    });

    // Set initial base layer
    if (isDark) {
      darkTiles.addTo(mapRef.current);
    } else {
      lightTiles.addTo(mapRef.current);
    }

    // Store tile layers for later switching
    (mapRef.current as any).lightTiles = lightTiles;
    (mapRef.current as any).darkTiles = darkTiles;

    // Fit map to bounds immediately
    console.log('Fitting map to bounds');
    mapRef.current.fitBounds(bounds.pad(0.1), { maxZoom: 14 });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [umkms, isDark]);

  // Handle dark mode toggle
  useEffect(() => {
    if (!mapRef.current) return;

    const lightTiles = (mapRef.current as any).lightTiles;
    const darkTiles = (mapRef.current as any).darkTiles;
    
    if (isDark) {
      if (mapRef.current.hasLayer(lightTiles)) mapRef.current.removeLayer(lightTiles);
      if (!mapRef.current.hasLayer(darkTiles)) darkTiles.addTo(mapRef.current);
    } else {
      if (mapRef.current.hasLayer(darkTiles)) mapRef.current.removeLayer(darkTiles);
      if (!mapRef.current.hasLayer(lightTiles)) lightTiles.addTo(mapRef.current);
    }
  }, [isDark]);

  // Update markers when category or data changes
  useEffect(() => {
    if (!mapRef.current || !layerGroupRef.current || umkms.length === 0) return;

    const buildPopup = (item: UMKM) => {
      const gmaps = `https://www.google.com/maps?q=${item.lat},${item.lng}`;
      return `
        <div class="space-y-1">
          <div class="font-semibold">${item.name}</div>
          <div class="text-xs inline-block px-2 py-0.5 rounded-full" style="background:${CAT_COLOR[item.category]||'#ccc'}20;color:${CAT_COLOR[item.category]||'#333'}">${item.category}</div>
          <div class="text-sm text-gray-700">${item.address}</div>
          <div class="text-sm"><span style="color: #F97316;">🕐</span> ${item.phone}</div>
          <div class="pt-1">
            <a href="${gmaps}" target="_blank" rel="noopener" class="text-primary text-sm">Lihat rute ↗</a>
          </div>
        </div>`;
    };

    // Filter markers based on category OR selectedLocation
    let filteredItems: UMKM[];
    
    if (selectedLocation) {
      // If a location is selected, show only that UMKM
      filteredItems = umkms.filter((item: UMKM) => 
        item.lat === selectedLocation.lat && item.lng === selectedLocation.lng
      );
    } else {
      // Otherwise filter by category
      filteredItems = category === 'Semua' 
        ? umkms
        : umkms.filter((item: UMKM) => item.category === category);
    }

    layerGroupRef.current.clearLayers();

    const markers: L.Marker[] = [];

    filteredItems.forEach((item: UMKM) => {
      const color = CAT_COLOR[item.category] || '#2563EB';
      
      // Create futuristic modern pin icon with glow effect (reversed colors)
      const svgIcon = `
        <div class="pin-container">
          <!-- Pulse ring animation -->
          <div class="pin-pulse" style="background: ${color}20;"></div>
          <div class="pin-pulse-2" style="background: ${color}15;"></div>
          
          <!-- Main pin body with white gradient -->
          <div class="pin-body" style="
            background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
            box-shadow: 
              0 0 20px rgba(255,255,255,0.5),
              0 4px 15px rgba(0,0,0,0.3),
              inset 0 1px 0 rgba(255,255,255,0.8);
            border: 3px solid ${color};
          ">
            <!-- Inner glow circle with color -->
            <div class="pin-glow" style="
              background: radial-gradient(circle, ${color}dd 0%, ${color}99 50%, transparent 70%);
            "></div>
            
            <!-- Center dot with category color (no animation) -->
            <div class="pin-dot pin-dot-static" style="
              background: ${color};
              box-shadow: 0 0 12px ${color}, 0 0 4px ${color}cc;
            "></div>
          </div>
          
          <!-- Bottom shadow -->
          <div class="pin-shadow"></div>
        </div>
      `;
      
      const customIcon = L.divIcon({
        html: svgIcon,
        iconSize: [40, 50],
        iconAnchor: [20, 45],
        popupAnchor: [0, -45],
        className: 'custom-pin-marker',
      });
      
      const marker = L.marker([item.lat, item.lng], { icon: customIcon });

      marker.bindPopup(buildPopup(item));
      marker.addTo(layerGroupRef.current!);
      markers.push(marker as any);
    });

    if (filteredItems.length && mapRef.current) {
      if (selectedLocation) {
        // Zoom in to selected location
        mapRef.current.setView([selectedLocation.lat, selectedLocation.lng], 16);
        // Open popup for selected marker
        const firstMarker = markers[0];
        if (firstMarker) {
          setTimeout(() => firstMarker.openPopup(), 300);
        }
      } else {
        // Show all markers with bounds
        const bounds = L.featureGroup(markers).getBounds();
        mapRef.current.fitBounds(bounds.pad(0.1), { maxZoom: 14 });
      }
    }
  }, [category, umkms, selectedLocation]);

  return <div id="map" className="w-full h-[420px] rounded-lg" />;
}