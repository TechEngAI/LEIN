export default function LoadingSkeleton({ rows = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="skeleton-line"
          style={{
            height: '18px',
            width: `${[80, 60, 90][i % 3]}%`,
            borderRadius: '4px'
          }}
        />
      ))}
    </div>
  );
}
