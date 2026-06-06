import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import ReportPage from './pages/ReportPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <ReportPage />
          </motion.div>
        } />
        <Route path="/dashboard" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <DashboardPage />
          </motion.div>
        } />
        <Route path="/analytics" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <AnalyticsPage />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const handleComplete = useCallback(() => setLoaded(true), []);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={handleComplete} />}
      {loaded && (
        <Router>
          <Navbar />
          <AnimatedRoutes />
        </Router>
      )}
    </>
  );
}
