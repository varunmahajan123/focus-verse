export function FallbackTunnel() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-electric">
      <div className="absolute inset-0 hero-grid opacity-80" />
      <div className="portal-fallback" />
      <div className="fallback-rings" aria-hidden="true">
        {Array.from({ length: 11 }).map((_, index) => (
          <span key={index} style={{ "--ring": index } as React.CSSProperties} />
        ))}
      </div>
    </div>
  );
}
