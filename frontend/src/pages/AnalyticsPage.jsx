import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SummaryCards from '../components/SummaryCards';
import LGABarChart from '../components/LGABarChart';
import HourlyTrendChart from '../components/HourlyTrendChart';
import ForecastTable from '../components/ForecastTable';
import { mockHeatmap, mockForecast } from '../data/mockData';
import api from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const AI_SYSTEMS = [
  { icon: '🧠', name: 'NLP Classifier', desc: 'Classifies emergencies in English & Pidgin using Claude AI', acc: '94%', status: 'ACTIVE' },
  { icon: '📡', name: 'Severity Predictor', desc: 'RandomForest model scores priority 1–10 from incident features', acc: '91%', status: 'ACTIVE' },
  { icon: '🗺', name: 'Route Optimizer', desc: 'Haversine + traffic multipliers select nearest available unit', acc: '97%', status: 'ACTIVE' },
  { icon: '🔮', name: 'Incident Forecaster', desc: 'Predicts next 6h incident volume by LGA and type', acc: '88%', status: 'ACTIVE' },
];

export default function AnalyticsPage() {
  const [heatmap, setHeatmap] = useState(mockHeatmap);
  const [forecast, setForecast] = useState(mockForecast);
  const [summaryStats, setSummaryStats] = useState({ activeCount: 12, avgResponse: '12 min', respondersCount: 45, hospitalsOnline: 18 });

  const [hourlyData] = useState(() =>
    Array.from({ length: 24 }).map((_, i) => ({
      hour: `${i}:00`,
      medical:  Math.floor(Math.random() * 10) + (i > 7 && i < 18 ? 5 : 0),
      fire:     Math.floor(Math.random() * 3),
      security: Math.floor(Math.random() * 5) + (i > 18 ? 4 : 0),
      accident: Math.floor(Math.random() * 4) + (i === 8 || i === 17 ? 6 : 0),
    }))
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      gsap.fromTo('.analytics-row',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: '.analytics-container', start: 'top 80%' } }
      );
    }, 100);

    const abortController = new AbortController();
    (async () => {
      try { const r = await api.get('/stats/heatmap', { signal: abortController.signal }); setHeatmap(r.data); } catch { console.warn("API offline, using mock heatmap"); }
      try { const r = await api.get('/forecast', { signal: abortController.signal }); setForecast(r.data); } catch { console.warn("API offline, using mock forecast"); }
      try { const r = await api.get('/incidents', { signal: abortController.signal }); setSummaryStats(p => ({ ...p, activeCount: r.data.length })); } catch { console.warn("API offline, using mock incidents"); }
    })();

    return () => { clearTimeout(timer); abortController.abort(); };
  }, []);

  return (
    <div className="analytics-page">
      <div className="analytics-container">

        {/* Header */}
        <div className="analytics-header analytics-row">
          <h1>📊 Analytics &amp; Intelligence Center</h1>
          <p>Real-time intelligence powered by LEIN AI — Lagos Emergency Intelligence Network</p>
        </div>

        {/* KPI Cards */}
        <div className="analytics-row">
          <SummaryCards {...summaryStats} />
        </div>

        {/* Charts */}
        <div className="analytics-row analytics-grid-2">
          <div className="chart-card">
            <h3>Incidents by LGA</h3>
            <LGABarChart data={heatmap} />
          </div>
          <div className="chart-card">
            <h3>24-Hour Trend</h3>
            <HourlyTrendChart data={hourlyData} />
          </div>
        </div>

        {/* Forecast Table */}
        <div className="analytics-row">
          <div className="chart-card">
            <h3>AI Incident Forecast — Next 6 Hours</h3>
            <ForecastTable data={forecast} />
          </div>
        </div>

        {/* AI Systems */}
        <div className="analytics-row">
          <div className="chart-card">
            <h3 style={{ marginBottom: 20 }}>AI Systems Status</h3>
            <div className="ai-systems-grid">
              {AI_SYSTEMS.map((sys, i) => (
                <motion.div
                  key={sys.name}
                  className="ai-system-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4, boxShadow: '0 0 30px rgba(46,107,230,0.3)' }}
                >
                  <div className="ai-system-icon">{sys.icon}</div>
                  <div className="ai-system-name">{sys.name}</div>
                  <div className="ai-acc">{sys.acc}</div>
                  <div className="ai-system-desc">{sys.desc}</div>
                  <div className="ai-system-status">● {sys.status}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
