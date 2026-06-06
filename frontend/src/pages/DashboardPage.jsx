import { useState, useEffect } from 'react';
import { ShieldAlert, Activity, Users, Building2, Server, BrainCircuit, ActivitySquare } from 'lucide-react';
import LEINMap from '../components/LEINMap';
import IncidentQueue from '../components/IncidentQueue';
import api from '../services/api';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [incidents, setIncidents] = useState([]);
  const [responders, setResponders] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await api.get('/incidents');
        setIncidents(res);
        if (res.length > 0) setSelectedIncident(res[0]);
        const { data: resp } = await api.get('/responders');
        setResponders(resp);
      } catch {
        console.warn("Using mock dashboard data");
      }
    };
    fetchData();
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
            <strong>{incidents.length || 12}</strong>
          </div>
          <div className="ops-divider" />
          <div className="ops-stat">
            <Users size={16} color="var(--safe-green)" />
            <span className="ops-label">RESPONDERS ONLINE:</span>
            <strong>{responders.length || 18}</strong>
          </div>
          <div className="ops-divider" />
          <div className="ops-stat">
            <Building2 size={16} color="var(--warn-amber)" />
            <span className="ops-label">HOSPITALS AVAILABLE:</span>
            <strong>26</strong>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Server size={16} color="var(--safe-green)" />
          <span className="ops-label">SYSTEM STATUS:</span>
          <strong style={{ color: 'var(--safe-green)' }}>OPERATIONAL</strong>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* LEFT PANEL: Queue & Engines */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <span>LIVE INCIDENT QUEUE</span>
            <span style={{ background: 'var(--alert-red)', color: '#fff', padding: '2px 8px', borderRadius: 12, fontSize: 10 }}>{incidents.length} ACTIVE</span>
          </div>
          <div className="dash-panel-content" style={{ flex: 2, borderBottom: '1px solid var(--border-bright)' }}>
            <IncidentQueue 
              incidents={incidents} 
              selectedId={selectedIncident?.id} 
              onSelect={id => setSelectedIncident(incidents.find(i => i.id === id))} 
            />
          </div>
          <div className="dash-panel-header">
            <span>AI ENGINE STATUS</span>
            <BrainCircuit size={14} color="var(--safe-green)" />
          </div>
          <div className="dash-panel-content" style={{ flex: 1 }}>
            <div className="engine-item"><span>Classifier Engine</span><div className="engine-online" /></div>
            <div className="engine-item"><span>Forecast Engine</span><div className="engine-online" /></div>
            <div className="engine-item"><span>Routing Engine</span><div className="engine-online" /></div>
            <div className="engine-item"><span>Severity Engine</span><div className="engine-online" /></div>
          </div>
        </div>

        {/* CENTER PANEL: Map Dominance */}
        <div style={{ position: 'relative', background: '#000' }}>
          <LEINMap incidents={incidents} />
        </div>

        {/* RIGHT PANEL: Intelligence & Timeline */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <span>LIVE INCIDENT TIMELINE</span>
            <Activity size={14} />
          </div>
          <div className="dash-panel-content" style={{ flex: 1.5, borderBottom: '1px solid var(--border-bright)' }}>
            <div className="tl-item"><div className="tl-time">14:24</div><div className="tl-dot"/><div className="tl-desc">ETA calculated for Unit A-07 (4 mins).</div></div>
            <div className="tl-item"><div className="tl-time">14:23</div><div className="tl-dot"/><div className="tl-desc">Responder assigned to Ikeja Incident.</div></div>
            <div className="tl-item"><div className="tl-time">14:22</div><div className="tl-dot"/><div className="tl-desc">AI classified incident as Medical, Severity 9.4.</div></div>
            <div className="tl-item"><div className="tl-time">14:21</div><div className="tl-dot"/><div className="tl-desc">Medical emergency reported in Ikeja.</div></div>
          </div>

          <div className="dash-panel-header">
            <span>HOSPITAL CAPACITY</span>
            <Building2 size={14} />
          </div>
          <div className="dash-panel-content" style={{ flex: 1, borderBottom: '1px solid var(--border-bright)' }}>
            <div className="hosp-item">
              <div className="hosp-item-name">LAGOS GENERAL</div>
              <div className="hosp-item-meta">
                <span>Beds Available: 21</span>
                <span style={{ color: 'var(--safe-green)' }}>Capacity: GOOD</span>
              </div>
              <div className="hosp-capacity-bar"><div className="hosp-capacity-fill" style={{ width: '40%', background: 'var(--safe-green)' }} /></div>
            </div>
            <div className="hosp-item">
              <div className="hosp-item-name">IKEJA HOSPITAL</div>
              <div className="hosp-item-meta">
                <span>Beds Available: 7</span>
                <span style={{ color: 'var(--alert-red)' }}>Capacity: LOW</span>
              </div>
              <div className="hosp-capacity-bar"><div className="hosp-capacity-fill" style={{ width: '85%', background: 'var(--alert-red)' }} /></div>
            </div>
          </div>

          <div className="dash-panel-header">
            <span>RESOURCE STATUS BOARD</span>
            <Users size={14} />
          </div>
          <div className="dash-panel-content" style={{ flex: 1 }}>
            <div className="resource-item">
              <span className="resource-name">Unit A-07</span>
              <span className="resource-badge resource-available">AVAILABLE</span>
            </div>
            <div className="resource-item">
              <span className="resource-name">Unit B-03</span>
              <span className="resource-badge resource-busy">ON ASSIGNMENT</span>
            </div>
            <div className="resource-item">
              <span className="resource-name">Unit C-11</span>
              <span className="resource-badge resource-returning">RETURNING</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
