import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SummaryCards from '../components/SummaryCards';
import LGABarChart from '../components/LGABarChart';
import HourlyTrendChart from '../components/HourlyTrendChart';
import ForecastTable from '../components/ForecastTable';
import { mockHeatmap, mockForecast } from '../data/mockData';
import api from '../services/api';

gsap.registerPlugin(ScrollTrigger);

export default function AnalyticsPage() {
  const [heatmap, setHeatmap] = useState(mockHeatmap);
  const [forecast, setForecast] = useState(mockForecast);

  const [summaryStats, setSummaryStats] = useState({
    activeCount: 12,
    avgResponse: '12 min',
    respondersCount: 45
  });

  useEffect(() => {
    // Animate rows
    gsap.fromTo('.analytics-row', 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.15,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.analytics-container',
          start: 'top 80%'
        }
      }
    );

    // Fetch Analytics data
    const fetchAnalytics = async () => {
      try {
        const resHeatmap = await api.get('/stats/heatmap');
        setHeatmap(resHeatmap.data);
      } catch {
        // use mock
      }

      try {
        const resForecast = await api.get('/forecast');
        setForecast(resForecast.data);
      } catch {
        // use mock
      }

      try {
        const resIncidents = await api.get('/incidents');
        setSummaryStats(prev => ({ ...prev, activeCount: resIncidents.data.length }));
      } catch {
        // use mock 12
      }
    };
    fetchAnalytics();
  }, []);

  // Mock hourly data
  const hourlyData = Array.from({length: 24}).map((_, i) => ({
    hour: `${i}:00`,
    medical: Math.floor(Math.random() * 10) + (i > 7 && i < 18 ? 5 : 0),
    fire: Math.floor(Math.random() * 3),
    security: Math.floor(Math.random() * 5) + (i > 18 ? 4 : 0),
    accident: Math.floor(Math.random() * 4) + (i === 8 || i === 17 ? 6 : 0)
  }));

  return (
    <div className="analytics-container">
      <div className="analytics-header analytics-row">
        <h1>Analytics & Forecasting</h1>
        <p>Powered by LEIN AI</p>
      </div>

      <div className="analytics-row">
        <SummaryCards {...summaryStats} />
      </div>

      <div className="analytics-row">
        <LGABarChart data={heatmap} />
      </div>

      <div className="analytics-row">
        <HourlyTrendChart data={hourlyData} />
      </div>

      <div className="analytics-row">
        <ForecastTable data={forecast} />
      </div>
    </div>
  );
}
