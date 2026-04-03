export default function ServicePageLoading() {
  return (
    <main aria-busy="true" aria-label="Loading service page">
      <header>
        <div style={{ height: '2.5rem', width: '55%', background: '#e5e7eb', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite' }} aria-hidden="true" />
        <div style={{ height: '1.25rem', width: '40%', background: '#e5e7eb', borderRadius: '4px', marginTop: '0.75rem', animation: 'pulse 1.5s ease-in-out infinite' }} aria-hidden="true" />
      </header>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ height: '1rem', width: `${88 + (i % 3) * 4}%`, background: '#e5e7eb', borderRadius: '4px', marginTop: '0.75rem', animation: 'pulse 1.5s ease-in-out infinite' }} aria-hidden="true" />
      ))}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </main>
  )
}
