import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Activity, Navigation, LineChart } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    { title: 'CLASSIFY', desc: 'AI-driven incident intake and severity scoring.', icon: Activity, path: '/intake' },
    { title: 'PREDICT', desc: 'Forecast hotspots before emergencies occur.', icon: LineChart, path: '/analytics' },
    { title: 'DISPATCH', desc: 'Optimal routing for emergency responders.', icon: Navigation, path: '/dashboard' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <ShieldAlert size={80} color="var(--ai-blue)" />
        </div>
        <h1 style={{ fontSize: 80, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 16 }}>
          LEIN
        </h1>
        <h2 style={{ fontSize: 24, color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 48 }}>
          Lagos Emergency Intelligence Network
        </h2>
        
        <p style={{ fontSize: 20, color: 'var(--text-primary)', maxWidth: 600, margin: '0 auto 64px', lineHeight: 1.6, fontWeight: 500 }}>
          Respond. Predict. Save Lives.<br/>
          <span style={{ color: 'var(--text-muted)' }}>The AI-Powered Emergency Response Platform for Africa's Largest Megacity.</span>
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, maxWidth: 1000, margin: '0 auto 64px' }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div 
                key={f.title}
                whileHover={{ y: -8, borderColor: 'var(--ai-blue)', boxShadow: '0 20px 40px rgba(59,130,246,0.1)' }}
                onClick={() => navigate(f.path)}
                style={{ background: 'var(--bg-panel)', border: '2px solid var(--border-bright)', padding: 32, borderRadius: 24, cursor: 'pointer', textAlign: 'left' }}
              >
                <Icon size={32} color="var(--ai-blue)" style={{ marginBottom: 24 }} />
                <h3 style={{ fontSize: 24, color: 'var(--text-primary)', marginBottom: 12 }}>{f.title}</h3>
                <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>{f.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <button 
          className="btn-primary" 
          onClick={() => navigate('/intake')}
          style={{ height: 64, padding: '0 48px', fontSize: 20, borderRadius: 32, fontWeight: 800 }}
        >
          ENTER SYSTEM
        </button>
      </motion.div>
    </div>
  );
}
