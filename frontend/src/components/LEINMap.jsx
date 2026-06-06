import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import gsap from 'gsap';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TYPE_COLORS = {
  Medical: '#2E6BE6',
  Fire: '#C0392B',
  Security: '#D4AF37',
  Accident: '#E67E22',
};

const createIncidentIcon = (type) => {
  const color = TYPE_COLORS[type] || '#7A8BB5';
  const icon = type === 'Medical' ? '❤️' : type === 'Fire' ? '🔥' : type === 'Security' ? '🛡' : '🚗';
  return new L.DivIcon({
    className: '',
    html: `<div style="
      background:${color};
      width:32px;height:32px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:2px solid white;
      box-shadow:0 0 12px ${color}88;
      display:flex;align-items:center;justify-content:center;
    "><span style="transform:rotate(45deg);font-size:14px;">${icon}</span></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

const hospitalIcon = new L.DivIcon({
  className: '',
  html: `<div style="background:#1A7A4A;color:white;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:4px;font-weight:bold;font-size:14px;border:2px solid white;box-shadow:0 0 10px rgba(26,122,74,0.6);">+</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const responderIcon = new L.DivIcon({
  className: '',
  html: `<div style="background:#2E6BE6;width:20px;height:20px;border-radius:50%;border:2px solid white;box-shadow:0 0 10px rgba(46,107,230,0.6);display:flex;align-items:center;justify-content:center;font-size:10px;">🚑</div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function DarkTiles() {
  return (
    <TileLayer
      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      attribution='&copy; <a href="https://carto.com/">CARTO</a>'
    />
  );
}

function MapAnimator() {
  const map = useMap();
  useEffect(() => {
    gsap.from(map.getContainer(), { opacity: 0, duration: 1, ease: 'power2.out' });
  }, [map]);
  return null;
}

export default function LEINMap({ incidents, hospitals, responders, setSelectedIncident }) {
  return (
    <div className="map-wrapper">
      <div className="map-overlay-badge">
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#27AE60', display: 'inline-block' }} />
        Lagos Emergency Network — Live View
      </div>
      <MapContainer
        center={[6.5244, 3.3792]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <DarkTiles />
        <MapAnimator />

        {incidents.map(incident => (
          <Marker
            key={`inc-${incident.id}`}
            position={[incident.lat, incident.lng]}
            icon={createIncidentIcon(incident.type)}
            eventHandlers={{ click: () => setSelectedIncident(incident) }}
          >
            <Popup>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, minWidth: 160 }}>
                <strong>{incident.type}</strong>
                <p style={{ margin: '4px 0', color: '#666', fontSize: 12 }}>{incident.description}</p>
                <div style={{ fontSize: 11, color: '#2E6BE6' }}>Priority: {incident.priority_score}/10</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {hospitals.map(hospital => (
          <Marker key={`hosp-${hospital.id}`} position={[hospital.lat, hospital.lng]} icon={hospitalIcon}>
            <Popup>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
                <strong>{hospital.name}</strong>
                <div style={{ fontSize: 11, color: hospital.capacity > 80 ? '#C0392B' : '#1A7A4A' }}>
                  Capacity: {hospital.capacity}%
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {responders.map(responder => (
          <Marker key={`resp-${responder.id}`} position={[responder.lat, responder.lng]} icon={responderIcon}>
            <Popup>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
                <strong>{responder.name}</strong>
                <div style={{ fontSize: 11, color: responder.status === 'available' ? '#1A7A4A' : '#C0392B' }}>
                  ● {responder.status}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
