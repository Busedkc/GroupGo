import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import heroFriends from '../assets/hero-friends.jpg'
import tripIsland from '../assets/trip-island.jpg'
import cityCafe from '../assets/city-cafe.jpg'

const avatarColors = ['#ff6b3d', '#2fb8a3', '#f5b769', '#5a8f6a']
const avatarNames = ['A', 'M', 'J', 'S']

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />

      <main style={{ flex: 1 }}>
        {/* Hero */}
        <section className="gg-container" style={{ padding: '3.5rem 24px 2rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)',
              gap: '3rem',
              alignItems: 'center'
            }}
          >
            <div>
              <h1>
                Arkadaşlarınla{' '}
                <span style={{ color: 'var(--primary)' }}>birlikte karar ver</span>,<br />
                tartışma dakikalarla bitsin.
              </h1>
              <p style={{ marginTop: '1.25rem', fontSize: '1.05rem', color: 'var(--text-soft)', maxWidth: '520px' }}>
                Bir gezi başlat, anket linkini gruba gönder, herkes tercihini girsin. GroupGo herkesin ortak
                noktasında <strong style={{ color: 'var(--text-h)' }}>en iyi planı</strong> önersin.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
                <button className="gg-btn gg-btn-primary" onClick={() => navigate('/create')}>
                  Ücretsiz başla →
                </button>
                <a href="#how" className="gg-btn gg-btn-secondary">Nasıl çalışır?</a>
              </div>

            </div>

            <div style={{ position: 'relative' }}>
              <img
                src={heroFriends}
                alt="Arkadaş grubu"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-lg)',
                  objectFit: 'cover'
                }}
              />
              <div
                className="gg-card"
                style={{
                  position: 'absolute',
                  bottom: '-18px',
                  left: '24px',
                  padding: '0.9rem 1rem',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--primary-hover)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  AI önerisi hazır
                </div>
                <div style={{ fontWeight: 700, color: 'var(--text-h)' }}>🇮🇹 Amalfi Coast</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-soft)' }}>
                  25 Nisan – 1 Mayıs · 30.000₺–150.000₺
                </div>
              </div>
              <div
                className="gg-card"
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '-12px',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--text-soft)' }}>3 yanıt geldi</div>
                <div style={{ display: 'flex' }}>
                  {avatarNames.slice(0, 3).map((letter, i) => (
                    <span
                      key={letter}
                      className="gg-avatar"
                      style={{
                        width: 22,
                        height: 22,
                        fontSize: '0.65rem',
                        background: avatarColors[i],
                        border: '2px solid white',
                        marginLeft: i === 0 ? 0 : -6
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How */}
        <section id="how" className="gg-container" style={{ padding: '3rem 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2>3 adımda grup kararı</h2>
            <p style={{ color: 'var(--text-soft)', marginTop: '0.5rem' }}>
              Anket atıp herkesi rahatsız etmeden, tek bir linkle bitir.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {[
              { n: '01', icon: '✨', title: 'Trip başlat', desc: 'Bir başlık ve adınla saniyeler içinde trip oluştur.' },
              { n: '02', icon: '🔗', title: 'Linki paylaş', desc: 'Anket linkini WhatsApp grubuna gönder. Herkes tercihini girsin.' },
              { n: '03', icon: '🪄', title: 'AI önerisi al', desc: 'GroupGo ortak bütçe, tarih ve ilgi alanlarına göre planı sunar.' }
            ].map((step) => (
              <div key={step.n} className="gg-card" style={{ padding: '1.75rem', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '1rem', right: '1.25rem', fontSize: '0.82rem', color: 'var(--text-soft)', fontWeight: 600 }}>
                  {step.n}
                </span>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'var(--primary-soft)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.35rem',
                    marginBottom: '1rem'
                  }}
                >
                  {step.icon}
                </div>
                <h3 style={{ marginBottom: '0.35rem' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-soft)', fontSize: '0.93rem' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Modes */}
        <section id="modes" className="gg-container" style={{ padding: '3rem 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2>Her tür plan için</h2>
            <p style={{ color: 'var(--text-soft)', marginTop: '0.5rem' }}>
              Yurtdışı gezisi de planla, cumartesi gecesini de.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <ModeCard
              image={tripIsland}
              tagLabel="✈️ Trip Mode"
              tagColor="var(--primary-soft)"
              tagText="var(--primary-hover)"
              title="Tatile çıkalım"
              desc="Hafta sonu kaçamağı veya 10 günlük tatil — bütçe, tarih ve destinasyon tercihlerini topla."
              ctaText="Trip başlat →"
              ctaColor="var(--primary)"
              onClick={() => navigate('/create?mode=trip')}
            />
            <ModeCard
              image={cityCafe}
              tagLabel="☕ City Mode"
              tagColor="var(--accent-teal-soft)"
              tagText="#1a8979"
              title="Bu akşam ne yapsak?"
              desc="Aynı şehirde yaşıyorsanız — kafe, müze, bar, restoran için ortak ilgi noktanızı bulun."
              ctaText="City planı başlat →"
              ctaColor="var(--accent-teal)"
              onClick={() => navigate('/create?mode=city')}
            />
          </div>
        </section>

        {/* CTA */}
        <section className="gg-container" style={{ padding: '3rem 24px 4rem' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #ff8a4d, #ff5722)',
              borderRadius: 'var(--radius-xl)',
              padding: '3rem 2rem',
              textAlign: 'center',
              color: 'white',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <h2 style={{ color: 'white' }}>Hadi grupla bir karar verin.</h2>
            <p style={{ opacity: 0.92, marginTop: '0.5rem' }}>
              30 saniyede başlat. Hiçbir hesap, kredi kartı veya kurulum gerekmez.
            </p>
            <button
              onClick={() => navigate('/create')}
              className="gg-btn"
              style={{ marginTop: '1.5rem', background: 'white', color: 'var(--text-h)' }}
            >
              Şimdi başla — ücretsiz
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

function ModeCard(props: {
  image: string
  tagLabel: string
  tagColor: string
  tagText: string
  title: string
  desc: string
  ctaText: string
  ctaColor: string
  onClick: () => void
}) {
  return (
    <div
      className="gg-card"
      style={{ overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
      onClick={props.onClick}
    >
      <div style={{ height: 220, overflow: 'hidden' }}>
        <img src={props.image} alt={props.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ padding: '1.5rem' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '0.3rem 0.75rem',
            borderRadius: 999,
            background: props.tagColor,
            color: props.tagText,
            fontSize: '0.78rem',
            fontWeight: 700,
            marginBottom: '0.75rem'
          }}
        >
          {props.tagLabel}
        </span>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.35rem' }}>{props.title}</h3>
        <p style={{ color: 'var(--text-soft)', marginBottom: '1rem' }}>{props.desc}</p>
        <span style={{ color: props.ctaColor, fontWeight: 700 }}>{props.ctaText}</span>
      </div>
    </div>
  )
}
