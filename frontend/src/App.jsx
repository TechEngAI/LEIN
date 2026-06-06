import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import ReportPage from './pages/ReportPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ReportPage />
          </motion.div>
        } />
        <Route path="/dashboard" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DashboardPage />
          </motion.div>
        } />
        <Route path="/analytics" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AnalyticsPage />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
