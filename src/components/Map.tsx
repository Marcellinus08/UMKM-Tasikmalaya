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
  mapStyle: string;
  selectedUMKM?: UMKM | null;
  onNavigationChange?: (isNavigating: boolean, targetUMKM: UMKM | null) => void;
  onUserLocationChange?: (location: { lat: number; lng: number } | null, accuracy: number | null) => void;
}

export default function Map({ isDark, category, mapStyle, selectedUMKM, onNavigationChange, onUserLocationChange }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const [umkms, setUmkms] = useState<UMKM[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationTarget, setNavigationTarget] = useState<{ lat: number; lng: number } | null>(null);

  // Fetch UMKM data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/umkm');
        const data = await response.json();
        setUmkms(data);
      } catch (error) {
        console.error('Error fetching UMKM data:', error);
      }
    };

    fetchData();

    // Get user's current location with high accuracy GPS like Google Maps
    if (navigator.geolocation) {
      // First, get initial position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const accuracy = position.coords.accuracy;
          
          const location = { lat: userLat, lng: userLng };
          setUserLocation(location);
          setLocationAccuracy(accuracy);
          
          // Notify parent component
          if (onUserLocationChange) {
            onUserLocationChange(location, accuracy);
          }
        },
        (error) => {
          console.error('GPS Error:', error.message);
          
          // Fallback to Tasikmalaya center if geolocation fails
          const fallbackLocation = { lat: -7.3267, lng: 108.2210 };
          setUserLocation(fallbackLocation);
        },
        {
          enableHighAccuracy: true,  // Use GPS instead of WiFi/IP
          timeout: 15000,            // Wait up to 15 seconds
          maximumAge: 0              // Don't use cached position
        }
      );

      // Watch position for real-time updates (like Google Maps)
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const accuracy = position.coords.accuracy;
          
          const location = { lat: userLat, lng: userLng };
          setUserLocation(location);
          setLocationAccuracy(accuracy);
          
          // Notify parent component
          if (onUserLocationChange) {
            onUserLocationChange(location, accuracy);
          }
        },
        (error) => {
          console.error('GPS watch error:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000  // Accept positions up to 5 seconds old
        }
      );

      // Cleanup watch on unmount
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }

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
    
    // Calculate bounds from all UMKM locations
    const latLngs = umkms.map(u => [u.lat, u.lng] as L.LatLngTuple);
    const bounds = L.latLngBounds(latLngs);
    
    mapRef.current = L.map('map', { 
      zoomControl: true 
    });

    layerGroupRef.current = L.layerGroup().addTo(mapRef.current);

    // Define different map styles
    const mapStyles: Record<string, { light: string; dark: string; attribution: string; subdomains?: string }> = {
      openstreetmap: {
        light: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abc'
      },
      esri: {
        light: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: 'Tiles &copy; Esri',
        subdomains: undefined
      },
      voyager: {
        light: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd'
      },
      satellite: {
        light: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        dark: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        subdomains: undefined
      },
      terrain: {
        light: 'https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.jpg',
        dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
        subdomains: undefined
      }
    };

    const selectedStyle = mapStyles[mapStyle] || mapStyles.openstreetmap;

    // Light mode tiles
    const lightTiles = L.tileLayer(selectedStyle.light, {
      attribution: selectedStyle.attribution,
      maxZoom: 19,
      ...(selectedStyle.subdomains && { subdomains: selectedStyle.subdomains })
    });

    // Dark mode tiles
    const darkTiles = L.tileLayer(selectedStyle.dark, {
      attribution: selectedStyle.attribution,
      maxZoom: 19,
      ...(selectedStyle.subdomains && { subdomains: selectedStyle.subdomains })
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
    mapRef.current.fitBounds(bounds.pad(0.1), { maxZoom: 14 });

    // Invalidate size after a short delay to ensure proper rendering
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 100);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [umkms, isDark, mapStyle]);

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

  // Show user location marker
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    // Remove existing user marker if any
    if (userMarkerRef.current && mapRef.current.hasLayer(userMarkerRef.current)) {
      mapRef.current.removeLayer(userMarkerRef.current);
    }

    // Create user location marker with blue pulsing icon
    const userIcon = L.divIcon({
      html: `
        <div style="position: relative; width: 30px; height: 30px;">
          <div style="
            position: absolute;
            width: 30px;
            height: 30px;
            background: #3B82F6;
            border-radius: 50%;
            opacity: 0.3;
            animation: pulse-user 2s ease-out infinite;
          "></div>
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 16px;
            height: 16px;
            background: #3B82F6;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          "></div>
        </div>
        <style>
          @keyframes pulse-user {
            0% { transform: scale(0.5); opacity: 0.5; }
            50% { opacity: 0.3; }
            100% { transform: scale(1.5); opacity: 0; }
          }
        </style>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      className: 'user-location-marker'
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(mapRef.current)
      .bindPopup(`
        <div style="
          min-width: 220px;
          padding: 12px;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border: 1px solid #e2e8f0;
        ">
          <!-- Header -->
          <div style="
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;
          ">
            <div style="
              width: 28px;
              height: 28px;
              background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
            ">
              <span style="font-size: 14px;">📍</span>
            </div>
            <div style="
              font-size: 13px;
              font-weight: 700;
              color: #1e293b;
            ">Lokasi GPS Anda</div>
          </div>
          
          <!-- Coordinates -->
          <div style="
            background: #f1f5f9;
            padding: 8px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            color: #475569;
            line-height: 1.6;
          ">
            <div>Lat: <strong style="color: #1e293b;">${userLocation.lat.toFixed(6)}</strong></div>
            <div>Lng: <strong style="color: #1e293b;">${userLocation.lng.toFixed(6)}</strong></div>
          </div>
        </div>
      `, {
        maxWidth: 250,
        className: 'custom-user-popup'
      });

    userMarkerRef.current = userMarker;
  }, [userLocation, mapStyle, locationAccuracy]);

  // Update markers when category or data changes
  useEffect(() => {
    if (!mapRef.current || !layerGroupRef.current || umkms.length === 0) return;

    const showRoute = async (toLat: number, toLng: number) => {
      if (!userLocation || !mapRef.current) {
        return;
      }

      // Find the target UMKM
      const targetUMKM = umkms.find(u => u.lat === toLat && u.lng === toLng);

      // Set navigation state
      setIsNavigating(true);
      setNavigationTarget({ lat: toLat, lng: toLng });
      
      // Notify parent component
      if (onNavigationChange && targetUMKM) {
        onNavigationChange(true, targetUMKM);
      }

      // Remove existing route if any
      if (routeLayerRef.current && mapRef.current.hasLayer(routeLayerRef.current)) {
        mapRef.current.removeLayer(routeLayerRef.current);
      }

      // Make sure user marker is visible (re-add if needed)
      if (userMarkerRef.current && !mapRef.current.hasLayer(userMarkerRef.current)) {
        userMarkerRef.current.addTo(mapRef.current);
      }

      // Highlight user marker temporarily
      if (userMarkerRef.current) {
        userMarkerRef.current.openPopup();
        setTimeout(() => {
          userMarkerRef.current?.closePopup();
        }, 2000);
      }

      try {
        // Fetch route from OSRM (Open Source Routing Machine)
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${toLng},${toLat}?overview=full&geometries=geojson`
        );
        
        const data = await response.json();
        
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          const routeCoordinates = data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);

          // Draw the route following roads
          const route = L.polyline(routeCoordinates, {
            color: '#3B82F6',
            weight: 5,
            opacity: 0.8,
            lineJoin: 'round',
            lineCap: 'round'
          }).addTo(mapRef.current);

          routeLayerRef.current = route;

          // Fit bounds to show the route
          mapRef.current.fitBounds(route.getBounds(), { padding: [50, 50] });
        } else {
          throw new Error('Rute tidak ditemukan');
        }
      } catch (error) {
        console.error('Error fetching route:', error);
        
        // Fallback to straight line if routing fails
        const route = L.polyline(
          [[userLocation.lat, userLocation.lng], [toLat, toLng]],
          {
            color: '#3B82F6',
            weight: 5,
            opacity: 0.8,
            dashArray: '10, 10',
            lineJoin: 'round'
          }
        ).addTo(mapRef.current);

        routeLayerRef.current = route;

        const bounds = L.latLngBounds([
          [userLocation.lat, userLocation.lng],
          [toLat, toLng]
        ]);
        mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    };

    const buildPopup = (item: UMKM) => {
      // Make showRoute globally available
      (window as any).navigateToUMKM = (lat: number, lng: number) => {
        showRoute(lat, lng);
      };

      // Make stopNavigation globally available
      (window as any).stopNavigation = () => {
        setIsNavigating(false);
        setNavigationTarget(null);
        
        // Notify parent component
        if (onNavigationChange) {
          onNavigationChange(false, null);
        }
        
        if (routeLayerRef.current && mapRef.current?.hasLayer(routeLayerRef.current)) {
          mapRef.current.removeLayer(routeLayerRef.current);
          routeLayerRef.current = null;
        }
      };

      return `
        <div class="space-y-1">
          <div class="font-semibold">${item.name}</div>
          <div class="text-xs inline-block px-2 py-0.5 rounded-full" style="background:${CAT_COLOR[item.category]||'#ccc'}20;color:${CAT_COLOR[item.category]||'#333'}">${item.category}</div>
          <div class="text-sm text-gray-700">${item.address}</div>
          <div class="text-sm"><span style="color: #F97316;">📞</span> ${item.phone}</div>
          <div class="pt-2 flex gap-2">
            ${userLocation && !isNavigating ? `
              <button onclick="window.navigateToUMKM(${item.lat}, ${item.lng})" style="background: #3B82F6; color: white; padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer; font-size: 12px; width: 100%;">
                📍 Mulai Navigasi
              </button>
            ` : ''}
            ${isNavigating ? `
              <button onclick="window.stopNavigation()" style="background: #EF4444; color: white; padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer; font-size: 12px; width: 100%;">
                ⛔ Stop Navigasi
              </button>
            ` : ''}
          </div>
        </div>`;
    };

    // Filter markers based on isNavigating OR selectedUMKM OR selectedLocation OR category
    let filteredItems: UMKM[];
    
    if (isNavigating && navigationTarget) {
      // If navigating, show only the destination UMKM
      filteredItems = umkms.filter((item: UMKM) => 
        item.lat === navigationTarget.lat && item.lng === navigationTarget.lng
      );
    } else if (selectedUMKM) {
      // If a UMKM is selected from sidebar, show only that UMKM
      filteredItems = [selectedUMKM];
    } else if (selectedLocation) {
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
      if (selectedUMKM || selectedLocation) {
        // Zoom in to selected UMKM or location
        const targetLat = selectedUMKM?.lat || selectedLocation!.lat;
        const targetLng = selectedUMKM?.lng || selectedLocation!.lng;
        mapRef.current.setView([targetLat, targetLng], 16);
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
  }, [category, umkms, selectedLocation, isDark, mapStyle, userLocation, selectedUMKM, isNavigating, navigationTarget]);

  return <div id="map" style={{ width: '100%', height: '100%' }} className="w-full h-full" />;
}