import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.nav
      className="lein-navbar"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <NavLink to="/" className="navbar-logo">
        <motion.div
          className="navbar-logo-icon"
          whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(46,107,230,0.5)' }}
        >
          🚨
        </motion.div>
        <div>
          <div className="navbar-logo-title">LEIN</div>
          <div className="navbar-logo-sub">Respond. Predict. Save Lives.</div>
        </div>
      </NavLink>

      <nav className="navbar-links">
        {[
          { to: '/', label: 'Report', icon: '📋', end: true },
          { to: '/dashboard', label: 'Dashboard', icon: '🗺' },
          { to: '/analytics', label: 'Analytics', icon: '📊' },
        ].map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="navbar-status">
        <span className="navbar-time">{time}</span>
        <div className="status-dot" />
        <span>Online</span>
      </div>
    </motion.nav>
  );
}
