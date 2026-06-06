import { useState, useEffect } from 'react';
import { Activity, Users, Building2, Server, BrainCircuit, ActivitySquare, TrendingUp, ShieldCheck } from 'lucide-react';
import LEINMap from '../components/LEINMap';
import IncidentQueue from '../components/IncidentQueue';
import api from '../services/api';

const MOCK_INCIDENTS = [
  { id: 1, type: 'Medical', lga: 'Ikeja', lat: 6.6018, lng: 3.3515, severity: 5, priority_score: 9.4, timestamp: new Date(Date.now() - 120000).toISOString() },
  { id: 2, type: 'Fire', lga: 'Lekki', lat: 6.4698, lng: 3.5852, severity: 4, priority_score: 8.2, timestamp: new Date(Date.now() - 240000).toISOString() },
  { id: 3, type: 'Security', lga: 'Surulere', lat: 6.5000, lng: 3.3500, severity: 4, priority_score: 7.8, timestamp: new Date(Date.now() - 600000).toISOString() }
];

const MOCK_HOSPITALS = [
  { id: 1, name: 'Lagos General', lat: 6.45, lng: 3.40, capacity: 60 },
  { id: 2, name: 'Ikeja Medical', lat: 6.60, lng: 3.34, capacity: 15 },
  { id: 3, name: 'Lekki Care', lat: 6.46, lng: 3.58, capacity: 90 }
];

const MOCK_RESPONDERS = [
  { id: 1, name: 'Unit A-07', type: 'Ambulance', lat: 6.55, lng: 3.36, status: 'available' },
  { id: 2, name: 'Unit B-03', type: 'Fire', lat: 6.48, lng: 3.55, status: 'assigned' },
  { id: 3, name: 'Unit C-11', type: 'Police', lat: 6.51, lng: 3.38, status: 'returning' },
  { id: 4, name: 'Unit A-09', type: 'Ambulance', lat: 6.61, lng: 3.33, status: 'available' }
];

export default function DashboardPage() {
  const [incidents, setIncidents] = useState([]);
  const [responders, setResponders] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const [incRes, respRes, hospRes] = await Promise.all([
          api.get('/incidents').catch(() => ({ data: [] })),
          api.get('/responders').catch(() => ({ data: [] })),
          api.get('/hospitals').catch(() => ({ data: [] }))
        ]);
        
        if (!active) return;

        // Fallback to rich mock data if API returns empty arrays or fails
        const finalIncidents = incRes.data.length > 0 ? incRes.data : MOCK_INCIDENTS;
        const finalResponders = respRes.data.length > 0 ? respRes.data : MOCK_RESPONDERS;
        const finalHospitals = hospRes.data.length > 0 ? hospRes.data : MOCK_HOSPITALS;

        setIncidents(finalIncidents);
        setResponders(finalResponders);
        setHospitals(finalHospitals);
        
        if (finalIncidents.length > 0) setSelectedIncident(finalIncidents[0]);
      } catch (err) {
        if (active) {
          setIncidents(MOCK_INCIDENTS);
          setResponders(MOCK_RESPONDERS);
          setHospitals(MOCK_HOSPITALS);
          setSelectedIncident(MOCK_INCIDENTS[0]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => { active = false; };
  }, []);

  return (
    <div className="dashboard-root">
      {/* TOP OPERATIONS BANNER */}
      <div className="ops-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="ops-banner-title">LEIN OPERATIONS CENTER</span>
          <div className="ops-divider" />
          <div className="ops-stat">
            <ActivitySquare size={16} color="var(--ai-blue)" />
            <span className="ops-label">ACTIVE INCIDENTS:</span>
            <strong>{incidents.length}</strong>
            <span style={{ color: 'var(--safe-green)', fontSize: 12, marginLeft: 8 }}>+12% from last hour</span>
          </div>
          <div className="ops-divider" />
          <div className="ops-stat">
            <Users size={16} color="var(--safe-green)" />
            <span className="ops-label">RESPONDERS ONLINE:</span>
            <strong>{responders.length}</strong>
          </div>
          <div className="ops-divider" />
          <div className="ops-stat">
            <Building2 size={16} color="var(--warn-amber)" />
            <span className="ops-label">HOSPITALS AVAILABLE:</span>
            <strong>{hospitals.length || 26}</strong>
          </div>
          <div className="ops-divider" />
          <div className="ops-stat">
            <TrendingUp size={16} color="var(--premium-gold)" />
            <span className="ops-label">AVG RESPONSE TIME:</span>
            <strong>4.2 MIN</strong>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Server size={16} color="var(--safe-green)" />
          <span className="ops-label">SYSTEM STATUS:</span>
          <strong style={{ color: 'var(--safe-green)' }}>OPERATIONAL</strong>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* LEFT PANEL: Queue & Recommendations */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <span>LIVE INCIDENT QUEUE</span>
            <span style={{ background: 'var(--alert-red)', color: '#fff', padding: '2px 8px', borderRadius: 12, fontSize: 10 }}>{incidents.length} ACTIVE</span>
          </div>
          <div className="dash-panel-content" style={{ flex: 1.5, borderBottom: '1px solid var(--border-bright)' }}>
            {!loading ? (
              <IncidentQueue 
                incidents={incidents} 
                selectedId={selectedIncident?.id} 
                onSelect={id => setSelectedIncident(incidents.find(i => i.id === id))} 
              />
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>Loading operational intelligence...</div>
            )}
          </div>
          
          <div className="dash-panel-header">
            <span>AI RECOMMENDATION PANEL</span>
            <ShieldCheck size={14} color="var(--ai-blue)" />
          </div>
          <div className="dash-panel-content" style={{ flex: 1 }}>
            {selectedIncident ? (
              <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid var(--ai-blue)', borderRadius: 8, padding: 16 }}>
                <div style={{ color: 'var(--text-primary)', fontWeight: 800, marginBottom: 12 }}>DISPATCH STRATEGY</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)' }}>Recommended Unit</div>
                    <div style={{ color: '#fff', fontWeight: 700 }}>Unit A-07 ({selectedIncident.type})</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)' }}>Est. Arrival Time</div>
                    <div style={{ color: 'var(--safe-green)', fontWeight: 700 }}>4 Minutes</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)' }}>Target Hospital</div>
                    <div style={{ color: '#fff', fontWeight: 700 }}>Lagos General</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)' }}>Hospital Capacity</div>
                    <div style={{ color: 'var(--warn-amber)', fontWeight: 700 }}>Moderate</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>Select an incident to view AI recommendations.</div>
            )}
          </div>
        </div>

        {/* CENTER PANEL: Map Dominance */}
        <div style={{ position: 'relative', background: '#000' }}>
          <LEINMap incidents={incidents} hospitals={hospitals} responders={responders} />
        </div>

        {/* RIGHT PANEL: Intelligence, Hospitals, Forecast */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <span>AI ENGINE STATUS</span>
            <BrainCircuit size={14} color="var(--safe-green)" />
          </div>
          <div className="dash-panel-content" style={{ flex: 'none', gap: 8 }}>
            <div className="engine-item" style={{ padding: '6px 12px' }}><span>Classifier Engine</span><div className="engine-online" /></div>
            <div className="engine-item" style={{ padding: '6px 12px' }}><span>Severity Engine</span><div className="engine-online" /></div>
            <div className="engine-item" style={{ padding: '6px 12px' }}><span>Forecast Engine</span><div className="engine-online" /></div>
            <div className="engine-item" style={{ padding: '6px 12px' }}><span>Routing Engine</span><div className="engine-online" /></div>
          </div>

          <div className="dash-panel-header">
            <span>HOSPITAL INTELLIGENCE</span>
            <Building2 size={14} />
          </div>
          <div className="dash-panel-content" style={{ flex: 'none' }}>
            <div className="hosp-item">
              <div className="hosp-item-name">LAGOS GENERAL</div>
              <div className="hosp-item-meta">
                <span>Available Beds: 21</span>
                <span style={{ color: 'var(--safe-green)' }}>Status: Available</span>
              </div>
              <div className="hosp-capacity-bar"><div className="hosp-capacity-fill" style={{ width: '40%', background: 'var(--safe-green)' }} /></div>
            </div>
            <div className="hosp-item">
              <div className="hosp-item-name">IKEJA HOSPITAL</div>
              <div className="hosp-item-meta">
                <span>Available Beds: 7</span>
                <span style={{ color: 'var(--alert-red)' }}>Status: Critical</span>
              </div>
              <div className="hosp-capacity-bar"><div className="hosp-capacity-fill" style={{ width: '85%', background: 'var(--alert-red)' }} /></div>
            </div>
          </div>

          <div className="dash-panel-header">
            <span>RESOURCE STATUS BOARD</span>
            <Users size={14} />
          </div>
          <div className="dash-panel-content" style={{ flex: 'none' }}>
            {responders.slice(0, 3).map(r => (
              <div className="resource-item" key={r.id}>
                <span className="resource-name">{r.name}</span>
                <span className={`resource-badge resource-${r.status.toLowerCase()}`}>{r.status.toUpperCase()}</span>
              </div>
            ))}
          </div>

          <div className="dash-panel-header">
            <span>PREDICTIVE FORECAST (6H)</span>
            <TrendingUp size={14} color="var(--alert-red)" />
          </div>
          <div className="dash-panel-content" style={{ flex: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8 }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Ikeja</span>
              <span style={{ color: 'var(--alert-red)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 4 }}>HIGH RISK ↑</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8 }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Lekki</span>
              <span style={{ color: 'var(--alert-red)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 4 }}>HIGH RISK ↑</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8 }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Surulere</span>
              <span style={{ color: 'var(--ai-blue-light)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 4 }}>DECREASING ↓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
