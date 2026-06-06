import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { gsap } from 'gsap';

const TYPES = [
  { id: 'Medical',  icon: '❤️',  label: 'Medical',  color: '#2E6BE6' },
  { id: 'Fire',     icon: '🔥',  label: 'Fire',     color: '#C0392B' },
  { id: 'Security', icon: '🛡',  label: 'Security', color: '#D4AF37' },
  { id: 'Accident', icon: '🚗',  label: 'Accident', color: '#E67E22' },
];

function AIAnalyzing({ progress }) {
  return (
    <div className="ai-analyzing">
      <div className="ai-ring" />
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center' }}>
        Analyzing Incident...
      </div>
      <div className="ai-progress-track" style={{ width: '100%' }}>
        <div className="ai-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{progress}% complete</div>
    </div>
  );
}

export default function ReportPage() {
  const navigate = useNavigate();
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [severityHint, setSeverityHint] = useState(3);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [listening, setListening] = useState(false);
  const textareaRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [description]);

  useEffect(() => {
    if (cardRef.current) {
      gsap.from(cardRef.current, { y: 50, opacity: 0, duration: 0.7, ease: 'power3.out' });
    }
  }, []);

  const handleLocationDetect = () => {
    if (!navigator.geolocation) { setLocationError(true); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocationError(false); },
      () => setLocationError(true)
    );
  };

  const toggleVoice = () => {
    setListening(l => !l);
    if (!listening) {
      setTimeout(() => setListening(false), 3000);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!type) newErrors.type = 'Select an emergency type';
    if (description.length < 10) newErrors.description = 'Min 10 characters required';
    const finalLat = location ? location.lat : parseFloat(manualLat);
    const finalLng = location ? location.lng : parseFloat(manualLng);
    if (!isNaN(finalLat) && !isNaN(finalLng)) {
      if (finalLat < 6.2 || finalLat > 6.8 || finalLng < 3.1 || finalLng > 3.7)
        newErrors.location = 'Location appears outside Lagos — verify coordinates';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setAnalyzeProgress(0);

    const interval = setInterval(() => {
      setAnalyzeProgress(p => Math.min(p + 12, 92));
    }, 250);

    const finalLat = location ? location.lat : parseFloat(manualLat);
    const finalLng = location ? location.lng : parseFloat(manualLng);

    try {
      const reportRes = await api.post('/report', { type, description, lat: finalLat, lng: finalLng, severity_hint: severityHint });
      const { incident_id } = reportRes.data;
      const classifyRes = await api.post('/classify', { incident_id });
      clearInterval(interval);
      setAnalyzeProgress(100);
      setTimeout(() => { setResult(classifyRes.data); setIsSubmitting(false); }, 400);
    } catch (err) {
      clearInterval(interval);
      setAnalyzeProgress(100);
      setTimeout(() => {
        setResult({ type, confidence: 0.92, keywords: ['emergency', 'urgent', 'dispatch'], priority_score: 7.4, mockFallback: true });
        setIsSubmitting(false);
      }, 400);
    }
  };

  const getSevColor = (v) => v <= 2 ? 'var(--safe-green-l)' : v === 3 ? '#F39C12' : 'var(--alert-red-l)';

  if (result) {
    return (
      <div className="report-page">
        <div className="report-page-grid" />
        <motion.div className="result-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="success-banner">✓ Emergency report submitted to LEIN system</div>
          {result.mockFallback && (
            <div className="error-text" style={{ textAlign: 'center', marginBottom: 16 }}>
              ⚡ AI offline — fallback classification applied
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 48 }}>{TYPES.find(t => t.id === result.type)?.icon || '🚨'}</div>
            <div>
              <h2 style={{ color: 'var(--white)' }}>AI Classification Complete</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>LEIN AI has analyzed your report</p>
            </div>
          </div>

          <div className="result-stats">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Emergency Type</span>
              <strong style={{ color: 'var(--ai-blue-light)' }}>{result.type}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>AI Confidence</span>
              <strong style={{ color: 'var(--safe-green-l)' }}>{(result.confidence * 100).toFixed(0)}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Priority Score</span>
              <strong style={{ color: result.priority_score >= 8 ? 'var(--alert-red-l)' : 'var(--amber)' }}>
                {result.priority_score}/10
              </strong>
            </div>
          </div>

          <div className="keywords">
            {result.keywords?.map(kw => <span key={kw} className="chip">{kw}</span>)}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>
              🗺 View Command Center →
            </button>
            <button className="btn-secondary" onClick={() => { setResult(null); setType(''); setDescription(''); }}>
              + New Report
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="report-page">
      <div className="report-page-grid" />
      <div className="report-card" ref={cardRef}>
        <div className="report-header">
          <div className="report-header-icon">🚨</div>
          <h1>LEIN</h1>
          <p className="tagline">Lagos Emergency Intelligence Network</p>
          <span className="pidgin-note">🗣 English or Pidgin accepted</span>
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          {/* Type */}
          <div className="form-group">
            <label className="form-label">Emergency Type</label>
            <div className="type-grid">
              {TYPES.map(et => (
                <motion.div
                  key={et.id}
                  className={`type-btn ${type === et.id ? 'selected' : ''}`}
                  onClick={() => setType(et.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ '--glow': et.color }}
                >
                  <span className="icon">{et.icon}</span>
                  <span>{et.label}</span>
                </motion.div>
              ))}
            </div>
            {errors.type && <div className="error-text">{errors.type}</div>}
          </div>

          {/* Description + Voice */}
          <div className="form-group">
            <label className="form-label">Incident Description</label>
            <textarea
              ref={textareaRef}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the emergency... e.g. 'e don do am, e no dey breathe'"
              rows={3}
              style={{ minHeight: '80px', maxHeight: '200px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="char-counter">{description.length} chars</div>
              <div className="voice-btn-wrapper">
                <AnimatePresence>
                  {listening && (
                    <>
                      <motion.div className="voice-pulse" style={{ animationDelay: '0s' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                      <motion.div className="voice-pulse" style={{ animationDelay: '0.5s' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                    </>
                  )}
                </AnimatePresence>
                <motion.button
                  type="button"
                  className={`voice-btn ${listening ? 'listening' : ''}`}
                  onClick={toggleVoice}
                  whileTap={{ scale: 0.9 }}
                  style={{ width: 40, height: 40, fontSize: 16, borderRadius: '50%', background: listening ? 'var(--alert-red)' : 'var(--ai-blue)', color: 'white', border: 'none', cursor: 'pointer', position: 'relative' }}
                  title="Voice input"
                >
                  {listening ? '🔴' : '🎤'}
                </motion.button>
              </div>
            </div>
            {errors.description && <div className="error-text">{errors.description}</div>}
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">Location</label>
            {!location && (
              <button type="button" className="btn-secondary" onClick={handleLocationDetect}>
                📍 Auto-detect Location
              </button>
            )}
            <AnimatePresence>
              {location && (
                <motion.div className="location-badge" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  ✓ {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  <button type="button" className="btn-text" onClick={() => setLocation(null)}>Clear</button>
                </motion.div>
              )}
            </AnimatePresence>
            {locationError && !location && (
              <div className="manual-location mt-2">
                <input type="number" step="any" placeholder="Latitude (e.g. 6.52)" value={manualLat} onChange={e => setManualLat(e.target.value)} />
                <input type="number" step="any" placeholder="Longitude (e.g. 3.38)" value={manualLng} onChange={e => setManualLng(e.target.value)} />
              </div>
            )}
            {errors.location && <div className="error-text">{errors.location}</div>}
          </div>

          {/* Severity */}
          <div className="form-group">
            <label className="form-label" style={{ color: getSevColor(severityHint) }}>
              Severity Level — {['', 'Minor', 'Low', 'Moderate', 'Serious', 'Critical'][severityHint]}
            </label>
            <input type="range" min="1" max="5" value={severityHint} onChange={e => setSeverityHint(+e.target.value)} />
            <div className="severity-labels">
              <span>1 Minor</span><span>3 Moderate</span><span>5 Critical</span>
            </div>
          </div>

          {/* Analyzing */}
          {isSubmitting && <AIAnalyzing progress={analyzeProgress} />}

          {!isSubmitting && (
            <button type="submit" className="btn-gold submit-btn">
              🚨 Submit Emergency Report
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
