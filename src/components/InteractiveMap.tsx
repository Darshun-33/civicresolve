import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Complaint } from '../types/complaint';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { MapPin, ExternalLink, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface InteractiveMapProps {
  complaints: Complaint[];
  onSelectComplaint?: (complaint: Complaint) => void;
}

// Fallback coordinate mapping for Chennai localities
const LOCALITY_COORDS: Record<string, [number, number]> = {
  'anna nagar': [13.0850, 80.2101],
  't. nagar': [13.0418, 80.2341],
  't nagar': [13.0418, 80.2341],
  'adyar': [13.0067, 80.2573],
  'velachery': [12.9790, 80.2185],
  'guindy': [13.0067, 80.2026],
  'mylapore': [13.0368, 80.2676],
  'tambaram': [12.9249, 80.1290],
  'central': [13.0827, 80.2707],
  'egmore': [13.0732, 80.2609],
  'thudiyalur': [11.0805, 76.9407],
  'coimbatore': [11.0168, 76.9558],
};

// Custom glowing orchid marker icon
const createCustomIcon = (priority: string) => {
  const isCritical = priority === 'Critical';
  const color = isCritical ? '#EF4444' : '#E65BD6';
  const pulse = isCritical ? 'animate-ping' : '';

  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background: ${color}; opacity: 0.35;" class="${pulse}"></div>
        <div style="width: 14px; height: 14px; border-radius: 50%; background: ${color}; border: 2px solid #FFFFFF; box-shadow: 0 0 10px ${color};"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  complaints,
  onSelectComplaint,
}) => {
  // Center of Chennai
  const defaultCenter: [number, number] = [13.0418, 80.2341];

  // Resolve coordinates for each complaint
  const mappedComplaints = useMemo(() => {
    return complaints.map((c, index) => {
      if (c.latitude && c.longitude) {
        return { complaint: c, lat: c.latitude, lng: c.longitude, isApprox: false };
      }

      // Check locality match
      const locText = (c.location + ' ' + (c.locality || '')).toLowerCase();
      let matchedCoords: [number, number] | null = null;

      for (const [key, coords] of Object.entries(LOCALITY_COORDS)) {
        if (locText.includes(key)) {
          matchedCoords = coords;
          break;
        }
      }

      if (!matchedCoords) {
        matchedCoords = defaultCenter;
      }

      // Add a slight deterministic jitter based on complaint ID so multiple pins in same area don't overlap exactly
      const hash = c.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), index);
      const jitterLat = ((hash % 100) - 50) * 0.0003;
      const jitterLng = (((hash * 13) % 100) - 50) * 0.0003;

      return {
        complaint: c,
        lat: matchedCoords[0] + jitterLat,
        lng: matchedCoords[1] + jitterLng,
        isApprox: true,
      };
    });
  }, [complaints]);

  return (
    <div className="relative w-full h-[450px] sm:h-[500px] rounded-2xl overflow-hidden border border-white/10 shadow-card-layered">
      {/* Notice header overlay */}
      <div className="absolute top-3 left-3 z-[1000] liquid-glass px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs text-lilac border border-white/15">
        <MapPin className="w-3.5 h-3.5 text-orchid-electric" />
        <span>Live Grievance Spatial View • {complaints.length} Localized Records</span>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {mappedComplaints.map(({ complaint, lat, lng, isApprox }) => (
          <Marker
            key={complaint.id}
            position={[lat, lng]}
            icon={createCustomIcon(complaint.priority)}
          >
            <Popup>
              <div className="p-1 space-y-2 min-w-[220px]">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5">
                  <span className="font-mono text-xs font-bold text-orchid-electric">
                    {complaint.id}
                  </span>
                  <StatusBadge status={complaint.status} size="sm" showIcon={false} />
                </div>

                <h4 className="text-sm font-semibold text-pearl leading-snug line-clamp-2">
                  {complaint.title}
                </h4>

                <div className="text-[11px] text-lavender flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-orchid" />
                  <span className="truncate">{complaint.location}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <PriorityBadge priority={complaint.priority} size="sm" />
                  <Link
                    to={`/track?id=${complaint.id}`}
                    className="text-xs text-orchid-electric hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Track</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {isApprox && (
                  <div className="text-[10px] text-lavender/60 italic pt-1 border-t border-white/5">
                    * Locality-based approximate marker
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

