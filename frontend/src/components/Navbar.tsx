import { Link, NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? '#1a140f' : '#6a5d52',
    fontWeight: isActive ? 700 : 500,
    fontSize: '0.95rem',
    padding: '0.5rem 0.25rem',
    transition: 'color 0.15s ease'
  })

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 246, 238, 0.85)',
        backdropFilter: 'saturate(180%) blur(10px)',
        WebkitBackdropFilter: 'saturate(180%) blur(10px)',
        borderBottom: '1px solid var(--border)'
      }}
    >
      <div
        className="gg-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.9rem 24px'
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff8a4d, #ff5722)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.1rem'
            }}
          >
            🌐
          </span>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-h)' }}>
            Group<span style={{ color: 'var(--primary)' }}>Go</span>
          </span>
        </Link>

        <nav style={{ display: 'flex', gap: '2rem' }}>
          <NavLink to="/" end style={linkStyle}>Ana sayfa</NavLink>
          <a href="/#how" style={{ color: '#6a5d52', fontWeight: 500, fontSize: '0.95rem', padding: '0.5rem 0.25rem' }}>Nasıl çalışır</a>
          <a href="/#modes" style={{ color: '#6a5d52', fontWeight: 500, fontSize: '0.95rem', padding: '0.5rem 0.25rem' }}>Modlar</a>
        </nav>

        <button className="gg-btn gg-btn-primary" onClick={() => navigate('/create')}>
          Trip başlat
        </button>
      </div>
    </header>
  )
}
