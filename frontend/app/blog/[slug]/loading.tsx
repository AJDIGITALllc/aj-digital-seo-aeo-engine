/**
 * Streaming loading state for blog/[slug].
 * Shown while the Server Component suspends (edge cases only with ISR —
 * pre-rendered pages skip this entirely).
 */

export default function ArticleLoading() {
  return (
    <article aria-busy="true" aria-label="Loading article">
      <header>
        {/* Title skeleton */}
        <div
          style={{
            height:          '2rem',
            width:           '70%',
            background:      '#e5e7eb',
            borderRadius:    '4px',
            marginBottom:    '1rem',
            animation:       'pulse 1.5s ease-in-out infinite',
          }}
          aria-hidden="true"
        />
        {/* Meta skeleton */}
        <div
          style={{
            height:          '1rem',
            width:           '30%',
            background:      '#e5e7eb',
            borderRadius:    '4px',
            animation:       'pulse 1.5s ease-in-out infinite',
          }}
          aria-hidden="true"
        />
      </header>

      {/* Body skeleton — 5 lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            height:          '1rem',
            width:           i % 3 === 0 ? '95%' : i % 3 === 1 ? '88%' : '92%',
            background:      '#e5e7eb',
            borderRadius:    '4px',
            marginTop:       '0.75rem',
            animation:       'pulse 1.5s ease-in-out infinite',
          }}
          aria-hidden="true"
        />
      ))}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </article>
  )
}
