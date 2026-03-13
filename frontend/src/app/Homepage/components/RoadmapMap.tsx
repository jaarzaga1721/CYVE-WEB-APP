'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import type * as Leaflet from 'leaflet';
import type { CompanyInfo } from '@/app/roadmap/roadmapData';
import styles from '@/app/roadmap/roadmap.module.css';

/** Default center: Angeles City (from CYVE footer) */
const DEFAULT_CENTER: [number, number] = [15.14, 120.59];
const DEFAULT_ZOOM = 2;
const PIN_ZOOM = 4;
const RADIUS_METERS = 80000;

export interface RoadmapMapProps {
  companies: CompanyInfo[];
  /** Optional user location for "your area" circle; uses DEFAULT_CENTER if not set */
  userCenter?: [number, number] | null;
  className?: string;
}

export default function RoadmapMap({ companies, userCenter, className }: RoadmapMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined' || !containerRef.current) return;

    let isCancelled = false;

    const initMap = async () => {
      // Import Leaflet dynamically
      const LeafletModule = await import('leaflet');
      const L = LeafletModule.default;

      if (isCancelled || !containerRef.current) return;

      // Clean up any existing map instance before creating a new one
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {
          console.warn('Preprocessing map removal error:', e);
        }
        mapRef.current = null;
      }

      // Initialize map immediately and store in ref
      const withCoords = companies.filter((c): c is CompanyInfo & { latLng: [number, number] } => c.latLng != null);
      const center = userCenter ?? DEFAULT_CENTER;
      const zoom = withCoords.length > 0 ? PIN_ZOOM : DEFAULT_ZOOM;

      const map = L.map(containerRef.current, {
        center,
        zoom,
        scrollWheelZoom: true,
      });
      mapRef.current = map;

      if (isCancelled) {
        map.remove();
        mapRef.current = null;
        return;
      }

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO',
      }).addTo(map);

      if (isCancelled) return;

      const goldIcon = L.divIcon({
        className: 'cyve-marker',
        html: `<div style="
          width:18px;height:18px;
          background:#f5a623;
          border:2px solid #000;
          border-radius:50%;
          box-shadow: 0 0 15px #f5a623, 0 0 30px rgba(245, 166, 35, 0.5);
          position:relative;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 4px; height: 4px; background: #fff; border-radius: 50%;"></div>
          <div style="
            position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
            width:36px;height:36px;border:1px solid rgba(245,166,35,0.6);
            border-radius:50%;animation: pulse 1.5s infinite;
          "></div>
        </div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const markers: Leaflet.Marker[] = [];
      withCoords.forEach(company => {
        if (!company.latLng) return;
        const marker = L.marker(company.latLng, { icon: goldIcon })
          .addTo(map)
          .bindPopup(
            `<div style="min-width:180px;padding:12px 8px;font-family:inherit;">
              <strong style="display:block;margin-bottom:4px;color:#000;">${escapeHtml(company.name)}</strong>
              <div style="color:#666;font-size:12px;margin-bottom:4px;">${escapeHtml(company.address)}</div>
              <div style="font-size:12px;color:#333;line-height:1.4;">${escapeHtml(company.description)}</div>
            </div>`
          );
        markers.push(marker);
      });

      if (isCancelled) return;

      L.circle(center, {
        radius: RADIUS_METERS,
        color: '#f5be1e',
        fillColor: '#f5be1e',
        fillOpacity: 0.1,
        weight: 1,
      }).addTo(map);

      if (withCoords.length > 0 && !isCancelled) {
        const group = L.featureGroup(markers as Leaflet.Layer[]);
        map.fitBounds(group.getBounds().pad(0.3));
      }
    };

    initMap();

    return () => {
      isCancelled = true;
      if (mapRef.current) {
        const mapToCleanup = mapRef.current;
        mapRef.current = null;
        // Small delay to let React finish unmounting before Leaflet touches DOM
        setTimeout(() => {
          try {
            mapToCleanup.remove();
          } catch (e) {
            // Ignore removeChild errors during unmount as node is already gone
          }
        }, 0);
      }
    };
  }, [mounted, companies, userCenter]);

  if (!mounted) {
    return (
      <div className={`${styles.mapWrapper} ${className ?? ''}`}>
        <div className={styles.mapPlaceholder}>
          <span className={styles.mapLabel}>Initializing Map System…</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.mapWrapper} ${className ?? ''}`}>
      <div ref={containerRef} className={styles.mapContainer} />
    </div>
  );
}

function escapeHtml(s: string): string {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
