import { motion } from 'framer-motion';

export default function SummaryCards({ activeCount, avgResponse, respondersCount }) {
  const cards = [
    { title: '🚨 Active Incidents', value: activeCount },
    { title: '⏱ Avg Response Time', value: avgResponse },
    { title: '🚑 Responders On Duty', value: respondersCount }
  ];

  return (
    <div className="summary-cards">
      {cards.map((card, index) => (
        <motion.div 
          key={card.title}
          className="summary-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="sc-value">{card.value}</div>
          <div className="sc-title">{card.title}</div>
        </motion.div>
      ))}
    </div>
  );
}
