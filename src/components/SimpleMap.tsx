'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface SimpleMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  color?: string;
}

export default function SimpleMap({ lat, lng, zoom = 15, color = '#10B981' }: SimpleMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: zoom,
        zoomControl: true,
        attributionControl: true,
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(mapRef.current);

      // Create custom pin icon matching the one in Map.tsx
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

      // Add marker with custom icon
      L.marker([lat, lng], { icon: customIcon }).addTo(mapRef.current);

      // Add custom styles
      const style = document.createElement('style');
      style.textContent = `
        .pin-container {
          position: relative;
          width: 40px;
          height: 50px;
        }

        .pin-pulse {
          position: absolute;
          top: 0;
          left: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .pin-pulse-2 {
          position: absolute;
          top: 0;
          left: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: 1s;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.5);
          }
        }

        .pin-body {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 35px;
          height: 35px;
          border-radius: 50% 50% 50% 0;
          transform: translateX(-50%) rotate(-45deg);
          z-index: 2;
        }

        .pin-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 22px;
          height: 22px;
          border-radius: 50%;
          filter: blur(3px);
        }

        .pin-dot-static {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
        }

        .pin-shadow {
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 8px;
          background: radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%);
          border-radius: 50%;
          z-index: 1;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, zoom, color]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full"
      style={{ minHeight: '100%' }}
    />
  );
}
