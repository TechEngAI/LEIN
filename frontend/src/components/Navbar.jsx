import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ background: 'var(--navy)', color: 'var(--white)', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>LEIN</div>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Report</Link>
      <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
      <Link to="/analytics" style={{ color: 'white', textDecoration: 'none' }}>Analytics</Link>
    </nav>
  );
}
