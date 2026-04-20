export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-soft)', marginTop: '4rem' }}>
      <div
        className="gg-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.6rem 24px',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff8a4d, #ff5722)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            🌐
          </span>
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-h)' }}>
              Group<span style={{ color: 'var(--primary)' }}>Go</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>
              Arkadaş gruplarının "nereye gidelim?" tartışmasını dakikalar içinde bitiren öneri sistemi.
            </div>
          </div>
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-soft)' }}>
          © 2026 GroupGo by Buse Dikici. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  )
}
