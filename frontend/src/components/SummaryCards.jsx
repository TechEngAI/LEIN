import { motion } from 'framer-motion';

export default function SummaryCards({ activeCount, avgResponse, respondersCount }) {
  const cards = [
    { title: 'Active Incidents', value: activeCount, icon: '🚨', color: 'var(--alert-red)' },
    { title: 'Avg Response Time', value: avgResponse, icon: '⏱', color: 'var(--accent-blue)' },
    { title: 'Responders On Duty', value: respondersCount, icon: '🚑', color: 'var(--safe-green)' }
  ];

  return (
    <div className="summary-cards">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          className="summary-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          whileHover={{ y: -2 }}
        >
          <div className="sc-icon">{card.icon}</div>
          <div className="sc-value" style={{ color: card.color }}>{card.value}</div>
          <div className="sc-title">{card.title}</div>
        </motion.div>
      ))}
    </div>
  );
}
