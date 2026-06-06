export default function EmptyState({ message, icon = '📭' }) {
  return (
    <div style={{
      padding: '40px 24px',
      textAlign: 'center',
      color: 'var(--text-muted)'
    }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>{icon}</div>
      <p style={{ fontSize: '14px', lineHeight: '1.5' }}>{message}</p>
    </div>
  );
}
