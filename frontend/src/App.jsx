import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ReportPage from './pages/ReportPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LoadingScreen from './components/LoadingScreen';
import { useState } from 'react';
import './index.css';

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <Router>
      <Navbar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/intake" element={<ReportPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
