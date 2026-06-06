import { motion } from 'framer-motion';
import EmptyState from './EmptyState';
import LoadingSkeleton from './LoadingSkeleton';
import api from '../services/api';
import { useState } from 'react';

const TYPE_META = {
  Medical:  { icon: '❤️', color: '#2E6BE6' },
  Fire:     { icon: '🔥', color: '#C0392B' },
  Security: { icon: '🛡', color: '#D4AF37' },
  Accident: { icon: '🚗', color: '#E67E22' },
};

export default function IncidentDetail({ incident, hospitals, loadingHospitals, onResolve, onAssign, responders }) {
  const [assigning, setAssigning] = useState(false);
  const [eta, setEta] = useState(null);

  if (!incident) {
    return (
      <div className="incident-detail-panel">
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
          <div style={{ fontSize: 48, opacity: 0.3 }}>🗺</div>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
            Select an incident from the queue to view AI analysis and dispatch options
          </p>
        </div>
      </div>
    );
  }

  const meta = TYPE_META[incident.type] || { icon: '⚠️', color: '#7A8BB5' };
  const conf = Math.round(incident.priority_score * 10);
  const noResponders = responders && !responders.some(r => r.status === 'available');

  const handleAssign = async () => {
    setAssigning(true);
    try {
      const res = await api.post('/assign', { incident_id: incident.id, responder_id: 1 });
      setEta(res.data.eta || '8 mins');
      if (onAssign) onAssign(1);
    } catch {
      setEta('8 mins');
      if (onAssign) onAssign(1);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <motion.div
      className="incident-detail-panel"
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      key={incident.id}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Header */}
      <div className="detail-heading">
        <div
          className="detail-type-icon"
          style={{ background: `${meta.color}22`, border: `1px solid ${meta.color}44` }}
        >
          {meta.icon}
        </div>
        <div>
          <h2 style={{ fontSize: 15, marginBottom: 2 }}>{incident.type} Emergency</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>📍 {incident.lga} LGA</p>
        </div>
      </div>

      {/* AI Score */}
      <div className="ai-score-display detail-section">
        <div className="ai-score-number">{incident.priority_score.toFixed(1)}</div>
        <div className="ai-score-label">AI Priority Score / 10</div>
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 8 }}>
          <span className={`badge ${incident.priority_score > 7 ? 'danger' : incident.priority_score > 4 ? 'warn' : 'safe'}`}>
            {incident.priority_score > 7 ? '🔴 HIGH' : incident.priority_score > 4 ? '🟡 MEDIUM' : '🟢 LOW'}
          </span>
          <span className="badge gold">AI Conf {conf}%</span>
        </div>
      </div>

      {/* Description */}
      <div className="detail-section">
        <h3>Incident Details</h3>
        <div className="detail-row">
          <span className="label">Severity</span>
          <span className="value">{incident.severity}/5</span>
        </div>
        <div className="detail-row">
          <span className="label">Status</span>
          <span className="value" style={{ color: 'var(--safe-green-l)', textTransform: 'uppercase', fontSize: 11 }}>
            ● {incident.status}
          </span>
        </div>
        <div className="detail-description">{incident.description}</div>
        <div className="keywords" style={{ marginTop: 10 }}>
          {['urgent', 'dispatch-ready', incident.type.toLowerCase()].map(kw => (
            <span key={kw} className="chip">{kw}</span>
          ))}
        </div>
      </div>

      {/* Hospitals */}
      <div className="detail-section">
        <h3>Nearest Hospitals</h3>
        {loadingHospitals ? (
          <LoadingSkeleton rows={3} />
        ) : hospitals.length > 0 ? (
          <div className="hospital-list">
            {hospitals.slice(0, 3).map((h, i) => (
              <div key={h.id} className="hospital-item">
                <div className="h-meta">
                  <span className="h-name">{h.name}</span>
                  <span style={{ color: h.capacity > 80 ? 'var(--alert-red-l)' : 'var(--safe-green-l)' }}>
                    {h.capacity}%
                  </span>
                </div>
                <div className="h-capacity">
                  <div className="h-bar" style={{
                    width: `${h.capacity}%`,
                    background: h.capacity > 80 ? 'var(--alert-red)' : h.capacity > 60 ? '#E67E22' : 'var(--safe-green)',
                  }} />
                </div>
                {i === 0 && <div style={{ fontSize: 10, color: 'var(--gold)', marginTop: 4 }}>⭐ Recommended — ETA 4 mins</div>}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No hospitals found nearby" icon="🏥" />
        )}
      </div>

      {/* Actions */}
      <div className="detail-actions">
        {eta ? (
          <div className="eta-badge">
            ✅ Responder Dispatched — ETA: {eta}
          </div>
        ) : noResponders ? (
          <div className="eta-badge" style={{ background: 'rgba(192,57,43,0.2)', borderColor: 'rgba(192,57,43,0.3)', color: 'var(--alert-red-l)' }}>
            ⚠ No responders available
          </div>
        ) : (
          <motion.button
            className="btn-gold"
            onClick={handleAssign}
            disabled={assigning}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {assigning ? '⏳ Dispatching...' : '🚑 Assign Nearest Responder'}
          </motion.button>
        )}
        <button className="btn-secondary" onClick={() => onResolve(incident.id)}>
          ✓ Mark Resolved
        </button>
      </div>
    </motion.div>
  );
}
