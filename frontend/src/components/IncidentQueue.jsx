import { motion, AnimatePresence } from 'framer-motion';

const TYPE_META = {
  Medical:  { icon: '❤️', color: '#2E6BE6', glow: 'rgba(46,107,230,0.4)' },
  Fire:     { icon: '🔥', color: '#C0392B', glow: 'rgba(192,57,43,0.4)' },
  Security: { icon: '🛡', color: '#D4AF37', glow: 'rgba(212,175,55,0.4)' },
  Accident: { icon: '🚗', color: '#E67E22', glow: 'rgba(230,126,34,0.4)' },
};

export default function IncidentQueue({ incidents, selectedIncident, setSelectedIncident }) {
  const getMeta = (type) => TYPE_META[type] || { icon: '⚠️', color: '#7A8BB5', glow: 'rgba(122,139,181,0.3)' };

  return (
    <div className="incident-queue">
      <div className="queue-header">
        <h2>Active Incidents</h2>
        <span className="live-badge">{incidents.length} Live</span>
      </div>

      <div className="queue-list">
        <AnimatePresence>
          {incidents.map((incident) => {
            const meta = getMeta(incident.type);
            const isSelected = selectedIncident?.id === incident.id;
            return (
              <motion.div
                layout
                key={incident.id}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24, height: 0 }}
                transition={{ duration: 0.25, type: 'spring', stiffness: 300, damping: 30 }}
                whileHover={{ x: 4 }}
                className={`queue-card ${isSelected ? 'selected' : ''}`}
                style={{
                  borderLeftColor: meta.color,
                  boxShadow: isSelected ? `0 0 20px ${meta.glow}` : undefined,
                }}
                onClick={() => setSelectedIncident(incident)}
              >
                <div className="card-top">
                  <span className="type-label" style={{ color: meta.color }}>
                    {meta.icon} {incident.type}
                  </span>
                  <span className="time-ago">
                    {incident.timestamp
                      ? new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'Just now'}
                  </span>
                </div>
                <div className="lga-label">📍 {incident.lga} LGA</div>
                <div className="incident-card-meta">
                  <span>Severity {incident.severity}/5</span>
                  <span className="ai-conf">AI {Math.round(incident.priority_score * 10)}%</span>
                </div>
                <div className="priority-bar-container">
                  <div
                    className="priority-bar-fill"
                    style={{
                      width: `${(incident.priority_score / 10) * 100}%`,
                      background: incident.priority_score > 8 ? '#C0392B' : incident.priority_score > 6 ? '#E67E22' : '#2E6BE6',
                    }}
                  />
                </div>
                <div className="card-bottom">
                  <span className={`badge ${incident.priority_score > 7 ? 'danger' : incident.priority_score > 4 ? 'warn' : 'safe'}`}>
                    Priority {incident.priority_score.toFixed(1)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {incidents.length === 0 && (
          <div className="queue-empty">
            <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
            <p>No active incidents</p>
          </div>
        )}
      </div>
    </div>
  );
}
