import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

export default function Navbar() {
  const linkStyle = (isActive) => ({
    color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
    fontWeight: isActive ? '700' : '400',
    fontSize: '14px',
    transition: 'all 0.2s'
  });

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        background: 'var(--navy)',
        color: 'var(--white)',
        padding: '0 24px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '24px' }}>
        <img src={logo} alt="LEIN Logo" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />
        <div>
          <div style={{ fontWeight: '700', fontSize: '16px', letterSpacing: '1px' }}>LEIN</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px' }}>Lagos Emergency Intelligence Network</div>
        </div>
      </div>

      {/* Nav Links */}
      <NavLink to="/" end style={({ isActive }) => linkStyle(isActive)}>📋 Report</NavLink>
      <NavLink to="/dashboard" style={({ isActive }) => linkStyle(isActive)}>🗺 Dashboard</NavLink>
      <NavLink to="/analytics" style={({ isActive }) => linkStyle(isActive)}>📊 Analytics</NavLink>

      {/* Status indicator */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1A7A4A', display: 'inline-block' }} />
        System Online
      </div>
    </motion.nav>
  );
}
