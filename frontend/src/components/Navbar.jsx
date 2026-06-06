import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav
      className="lein-navbar"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <NavLink to="/" className="navbar-logo">
        <div className="navbar-logo-icon">🚨</div>
        <div className="navbar-logo-text">
          <div className="navbar-logo-title">LEIN</div>
          <div className="navbar-logo-sub">Lagos Emergency Intelligence Network</div>
        </div>
      </NavLink>

      <nav className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}>
          <span>📋</span> Report
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}>
          <span>🗺</span> Dashboard
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}>
          <span>📊</span> Analytics
        </NavLink>
      </nav>

      <div className="navbar-status">
        <div className="status-dot" />
        <span>System Online</span>
      </div>
    </motion.nav>
  );
}
