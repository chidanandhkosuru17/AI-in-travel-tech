import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Compass, ExternalLink } from 'lucide-react';

interface OpenStreetMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markerTitle?: string;
  markerDescription?: string;
  depotAddress?: string;
  busNumber?: string;
  className?: string;
}

export const OpenStreetMap: React.FC<OpenStreetMapProps> = ({
  center,
  zoom = 14,
  markerTitle = 'Luggage Safe Depot',
  markerDescription = 'Safe custody locker point',
  depotAddress,
  busNumber,
  className = 'h-72 w-full rounded-2xl',
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy prior map instance if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current, {
      center: [center.lat, center.lng],
      zoom,
      zoomControl: true,
      scrollWheelZoom: false, // Prevent accidental scrolling on page scroll
    });

    // Add standard OpenStreetMap tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Custom Signal Blue Pin Icon for OpenStreetMap
    const customIcon = L.divIcon({
      className: 'custom-osm-pin',
      html: `
        <div style="
          width: 38px;
          height: 38px;
          background: #0057FF;
          border: 3px solid #FFFFFF;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(0, 87, 255, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            transform: rotate(45deg);
            color: #FFFFFF;
            font-size: 16px;
            font-weight: bold;
          ">🧳</div>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38],
    });

    // Add Depot / Recovery Point Marker
    const marker = L.marker([center.lat, center.lng], { icon: customIcon }).addTo(map);

    const popupHtml = `
      <div style="font-family: inherit; font-size: 12px; color: #101828; min-width: 180px; padding: 4px;">
        <div style="font-weight: 800; color: #0057FF; margin-bottom: 2px;">${markerTitle}</div>
        <div style="color: #667085; font-size: 11px; margin-bottom: 6px;">${markerDescription}</div>
        ${depotAddress ? `<div style="font-size: 10px; color: #475467; margin-bottom: 6px; border-top: 1px solid #E4E7EC; padding-top: 4px;">📍 ${depotAddress}</div>` : ''}
        ${busNumber ? `<div style="font-size: 10px; color: #15803D; font-weight: 600;">🚌 Bus: ${busNumber}</div>` : ''}
        <div style="margin-top: 6px;">
          <a href="https://www.openstreetmap.org/?mlat=${center.lat}&mlon=${center.lng}#map=16/${center.lat}/${center.lng}" target="_blank" rel="noopener noreferrer" style="color: #0057FF; font-size: 11px; font-weight: bold; text-decoration: underline;">
            Open in OpenStreetMap ↗
          </a>
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml).openPopup();

    mapInstanceRef.current = map;

    // Clean up on component unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center.lat, center.lng, zoom, markerTitle, markerDescription, depotAddress, busNumber]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([center.lat, center.lng], zoom, {
        animate: true,
      });
    }
  };

  return (
    <div className="relative border border-[#E4E7EC] rounded-2xl overflow-hidden shadow-inner group">
      {/* Top Floating Map Header */}
      <div className="absolute top-2.5 left-2.5 z-[1000] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E4E7EC] shadow-sm flex items-center gap-1.5 text-xs text-[#101828]">
        <Compass className="w-3.5 h-3.5 text-[#0057FF]" />
        <span className="font-bold">OpenStreetMap Live Navigation</span>
        <span className="text-[10px] bg-[#EAF0FF] text-[#0057FF] px-1.5 py-0.2 rounded font-semibold ml-1">
          OSM
        </span>
      </div>

      {/* Recenter Button */}
      <div className="absolute bottom-2.5 right-2.5 z-[1000] flex gap-1.5">
        <button
          type="button"
          onClick={handleRecenter}
          className="bg-white/95 hover:bg-white text-[#101828] hover:text-[#0057FF] p-2 rounded-xl border border-[#E4E7EC] shadow-md transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer"
          title="Recenter Depot Location"
        >
          <Navigation className="w-3.5 h-3.5 text-[#0057FF]" />
          <span className="hidden sm:inline text-[11px]">Recenter</span>
        </button>
        <a
          href={`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=%3B${center.lat}%2C${center.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#0057FF] hover:bg-[#0045CC] text-white p-2 px-3 rounded-xl shadow-md transition-all text-[11px] font-bold flex items-center gap-1 cursor-pointer"
          title="Get Driving Directions via OpenStreetMap"
        >
          <span>Get Directions</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Leaflet Map DOM Container */}
      <div ref={mapContainerRef} className={className} />
    </div>
  );
};
