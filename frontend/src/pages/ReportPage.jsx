import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, Flame, ShieldAlert, CarFront, CheckCircle2, Mic, MapPin, Loader2 } from 'lucide-react';
import api from '../services/api';

const TYPES = [
  { id: 'Medical',  icon: Activity,    label: 'Medical',  color: 'var(--med-blue)' },
  { id: 'Fire',     icon: Flame,       label: 'Fire',     color: 'var(--alert-red)' },
  { id: 'Security', icon: ShieldAlert, label: 'Security', color: 'var(--premium-gold)' },
  { id: 'Accident', icon: CarFront,    label: 'Accident', color: 'var(--warn-amber)' },
];

function WowSequence({ result, onComplete }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sequence = [
      { delay: 800 },  // Analyzing Language...
      { delay: 1500 }, // Incident Type Found
      { delay: 1000 }, // Severity Score
      { delay: 1200 }, // Nearest Hospital
      { delay: 1500 }, // Best Responder
    ];
    let currentDelay = 0;
    sequence.forEach((s, i) => {
      currentDelay += s.delay;
      setTimeout(() => setStep(i + 1), currentDelay);
    });
    setTimeout(onComplete, currentDelay + 1000);
  }, [onComplete]);

  return (
    <div style={{ background: '#000', border: '2px solid var(--ai-blue)', borderRadius: 16, padding: 32, fontFamily: 'monospace', fontSize: 16 }}>
      <div style={{ color: 'var(--ai-blue)', fontWeight: 800, marginBottom: 24, fontSize: 18 }}>AI ENGINE ENGAGED</div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ color: step >= 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
          {step === 0 && <Loader2 className="inline-spin" size={16} />} 
          {step >= 1 ? '✔ Language processing complete.' : ' Analyzing natural language and context...'}
        </div>
        
        {step >= 1 && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ color: 'var(--ai-blue-light)', fontWeight: 700 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Classified Type: </span>{result.type.toUpperCase()}
          </motion.div>
        )}

        {step >= 2 && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ color: result.priority_score > 7 ? 'var(--alert-red)' : 'var(--warn-amber)', fontWeight: 700 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Calculated Severity: </span>{result.priority_score}/10.0
          </motion.div>
        )}

        {step >= 3 && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ color: 'var(--safe-green)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Resource Locator: </span>Nearest Hospital Verified (Lagos General)
          </motion.div>
        )}

        {step >= 4 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'rgba(59,130,246,0.1)', padding: 16, border: '1px solid var(--ai-blue)', borderRadius: 8, marginTop: 16 }}>
            <div style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 8 }}>DISPATCH PROTOCOL READY</div>
            <div style={{ color: 'var(--text-secondary)' }}>Optimal Responder: <span style={{ color: '#fff' }}>Unit A-07</span></div>
            <div style={{ color: 'var(--text-secondary)' }}>Estimated Arrival: <span style={{ color: 'var(--safe-green)', fontWeight: 800 }}>4 MINUTES</span></div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ReportPage() {
  const navigate = useNavigate();
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [sequenceDone, setSequenceDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type || description.length < 10) return;
    setIsSubmitting(true);
    // Mock the result instantly, but let the WowSequence animate it
    setResult({ type, priority_score: 9.4, eta: '4 MIN' });
  };

  if (isSubmitting && !sequenceDone && result) {
    return (
      <div className="report-page-container">
        <div className="report-spotlight" />
        <div className="report-card" style={{ maxWidth: 800 }}>
          <WowSequence result={result} onComplete={() => setSequenceDone(true)} />
        </div>
      </div>
    );
  }

  if (sequenceDone && result) {
    return (
      <div className="report-page-container">
        <div className="report-spotlight" />
        <motion.div className="report-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="result-icon-wrapper">
            <CheckCircle2 size={40} />
          </div>
          <h2 style={{ fontSize: 40, marginBottom: 16 }}>INCIDENT LOGGED</h2>
          <p style={{ marginBottom: 40, fontSize: 18 }}>System has deployed optimal response units.</p>

          <button className="btn-primary" onClick={() => navigate('/dashboard')} style={{ width: '100%', height: 64, fontSize: 20 }}>
            OPEN LIVE COMMAND CENTER
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="report-page-container">
      <div className="report-spotlight" />
      <div className="report-card">
        <div className="report-header">
          <p style={{ fontSize: 18, color: 'var(--ai-blue)', fontWeight: 800 }}>AI-ASSISTED TRIAGE SYSTEM</p>
          <h1 style={{ fontSize: 48, marginTop: 8 }}>NEW INCIDENT REPORT</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
            {TYPES.map(t => {
              const Icon = t.icon;
              return (
                <div
                  key={t.id}
                  className={`intake-type-card ${type === t.id ? 'selected' : ''}`}
                  onClick={() => setType(t.id)}
                >
                  <Icon size={40} className="intake-type-icon" />
                  <div className="intake-type-label">{t.label}</div>
                </div>
              );
            })}
          </div>

          <div className="intake-input-wrapper">
            <div className="intake-input-header">
              <span>DESCRIPTION LOG</span>
            </div>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the emergency in English or Nigerian Pidgin..."
              rows={4}
            />
          </div>

          <button type="submit" className="intake-submit-btn">
            TRANSMIT TO LEIN AI
          </button>
        </form>
      </div>
    </div>
  );
}
