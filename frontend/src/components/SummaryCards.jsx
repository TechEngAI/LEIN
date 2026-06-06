import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

const CARDS = [
  { title: 'Active Incidents', key: 'activeCount',     icon: '🚨', color: '#C0392B', glow: 'rgba(192,57,43,0.3)',    accent: '#C0392B', delta: '+3 this hour' },
  { title: 'Avg Response',     key: 'avgResponse',      icon: '⏱',  color: '#2E6BE6', glow: 'rgba(46,107,230,0.3)',  accent: '#2E6BE6', delta: '↓ 2 min faster' },
  { title: 'Responders',       key: 'respondersCount',  icon: '🚑',  color: '#1A7A4A', glow: 'rgba(26,122,74,0.3)',   accent: '#1A7A4A', delta: '45 on duty' },
  { title: 'Hospitals Online', key: 'hospitalsOnline',  icon: '🏥',  color: '#D4AF37', glow: 'rgba(212,175,55,0.3)',  accent: '#D4AF37', delta: '12 available' },
];

function AnimatedCounter({ value, duration = 1.5 }) {
  const ref = useRef(null);
  useEffect(() => {
    const isNum = !isNaN(parseFloat(String(value)));
    if (!isNum || !ref.current) return;
    const numVal = parseFloat(String(value));
    gsap.from({ v: 0 }, {
      v: numVal,
      duration,
      ease: 'power2.out',
      onUpdate() {
        if (ref.current) ref.current.textContent = Math.round(this.targets()[0].v);
      },
    });
  }, [value, duration]);

  return <span ref={ref}>{value}</span>;
}

export default function SummaryCards({ activeCount = 12, avgResponse = '12 min', respondersCount = 45, hospitalsOnline = 18 }) {
  const values = { activeCount, avgResponse, respondersCount, hospitalsOnline };

  return (
    <div className="summary-cards">
      {CARDS.map((card, i) => (
        <motion.div
          key={card.key}
          className="summary-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          whileHover={{ y: -6, transition: { type: 'spring', stiffness: 400 } }}
          style={{
            '--card-accent': card.accent,
            '--card-glow': card.glow,
          }}
        >
          <div className="sc-icon">{card.icon}</div>
          <div className="sc-value" style={{ color: card.color }}>
            <AnimatedCounter value={values[card.key]} />
          </div>
          <div className="sc-title">{card.title}</div>
          <div className="sc-delta">{card.delta}</div>
        </motion.div>
      ))}
    </div>
  );
}
