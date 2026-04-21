import { useState, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

type Mode = 'trip' | 'city'

export default function CreateTrip() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialMode = (searchParams.get('mode') as Mode) === 'city' ? 'city' : 'trip'

  const [mode, setMode] = useState<Mode>(initialMode)
  const [form, setForm] = useState({
    title: '',
    organizer_name: '',
    city: ''
  })
  const [loading, setLoading] = useState(false)
  const [surveyLink, setSurveyLink] = useState('')
  const [surveyToken, setSurveyToken] = useState('')
  const [tripId, setTripId] = useState('')
  const [copied, setCopied] = useState(false)

  const placeholders = useMemo(
    () =>
      mode === 'trip'
        ? { title: 'Kız kıza tatil 2026', titleHint: 'ör. Kafa tatili' }
        : { title: 'Cumartesi gecesi planı', titleHint: 'ör. Cumartesi gecesi' },
    [mode]
  )

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.organizer_name.trim()) {
      alert('Lütfen başlık ve adını doldur.')
      return
    }
    if (mode === 'city' && !form.city.trim()) {
      alert('City mode için şehir gir.')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post(`${API}/trips/`, {
        title: form.title,
        organizer_name: form.organizer_name,
        mode,
        city: mode === 'city' ? form.city : undefined
      })
      const token = res.data.trip.survey_token
      const id = res.data.trip.id
      setSurveyLink(`${window.location.origin}/survey/${token}`)
      setSurveyToken(token)
      setTripId(id)
    } catch (e) {
      console.error('Trip create error:', e)
      let detail = 'Bilinmeyen hata'
      if (axios.isAxiosError(e)) {
        if (e.response) {
          detail = `Sunucu ${e.response.status}: ${JSON.stringify(e.response.data)}`
        } else if (e.request) {
          detail = `Backend'e ulaşılamadı (${API}). Uyanmasını bekle ya da VITE_API_URL'i kontrol et.`
        } else {
          detail = e.message
        }
      } else if (e instanceof Error) {
        detail = e.message
      }
      alert(`Bir şeyler ters gitti!\n\n${detail}`)
    }
    setLoading(false)
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(surveyLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  if (surveyLink) {
    return (
      <>
        <Navbar />
        <main style={{ flex: 1, padding: '3rem 24px' }}>
          <div className="gg-container" style={{ maxWidth: 560 }}>
            <div className="gg-card" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.75rem', marginBottom: '0.5rem' }}>🎉</div>
              <h2>Trip hazır!</h2>
              <p style={{ color: 'var(--text-soft)', marginTop: '0.35rem' }}>Anket linkini grubuna gönder.</p>

              <div
                style={{
                  background: 'var(--surface-muted)',
                  border: '1px dashed var(--border-strong)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.7rem 0.9rem',
                  margin: '1.5rem 0 1rem',
                  wordBreak: 'break-all',
                  fontSize: '0.88rem',
                  color: 'var(--text-h)'
                }}
              >
                {surveyLink}
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button className="gg-btn gg-btn-primary" onClick={copyLink}>
                  {copied ? '✓ Kopyalandı' : 'Linki kopyala'}
                </button>
                <button className="gg-btn gg-btn-secondary" onClick={() => navigate(`/survey/${surveyToken}`)}>
                  Kendim de dolduracağım
                </button>
                <button className="gg-btn gg-btn-dark" onClick={() => navigate(`/dashboard/${tripId}`)}>
                  Dashboard'a git →
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main style={{ flex: 1, padding: '2.5rem 24px 3.5rem' }}>
        <div className="gg-container" style={{ maxWidth: 620 }}>
          <Link to="/" style={{ color: 'var(--text-soft)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1.25rem' }}>
            ← Ana sayfa
          </Link>

          <div className="gg-card" style={{ padding: '2.25rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>Yeni gezi başlat</h1>
            <p style={{ color: 'var(--text-soft)', marginBottom: '1.75rem' }}>Saniyeler içinde anket linkin hazır.</p>

            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-soft)', letterSpacing: '0.12em', marginBottom: '0.6rem' }}>
              PLAN TİPİ
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <ModeTile
                active={mode === 'trip'}
                onClick={() => setMode('trip')}
                icon="✈️"
                title="Tatil"
                subtitle="Şehir/ülke seç"
              />
              <ModeTile
                active={mode === 'city'}
                onClick={() => setMode('city')}
                icon="☕"
                title="Şehir içi"
                subtitle="Kafe / müze / bar"
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="gg-label">
                Gezi başlığı
                <span className="gg-label-hint">{placeholders.titleHint}</span>
              </label>
              <input
                className="gg-input"
                placeholder={placeholders.title}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {mode === 'city' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="gg-label">
                  Şehir
                  <span className="gg-label-hint">Plan hangi şehirde?</span>
                </label>
                <input
                  className="gg-input"
                  placeholder="İstanbul"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
            )}

            <div style={{ marginBottom: '1.75rem' }}>
              <label className="gg-label">
                Adın
                <span className="gg-label-hint">Organizatör olarak görüneceksin</span>
              </label>
              <input
                className="gg-input"
                placeholder="Ayşe"
                value={form.organizer_name}
                onChange={(e) => setForm({ ...form, organizer_name: e.target.value })}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="gg-btn gg-btn-primary"
              style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
            >
              {loading ? 'Oluşturuluyor...' : 'Gezi oluştur →'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function ModeTile(props: { active: boolean; onClick: () => void; icon: string; title: string; subtitle: string }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      style={{
        textAlign: 'left',
        background: props.active ? 'white' : 'var(--surface-muted)',
        border: props.active ? '2px solid var(--primary)' : '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-md)',
        padding: '0.9rem 1rem',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxShadow: props.active ? '0 6px 16px -10px var(--primary-ring)' : 'none'
      }}
    >
      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-h)', marginBottom: '0.15rem' }}>
        <span style={{ marginRight: '0.4rem' }}>{props.icon}</span>
        {props.title}
      </div>
      <div style={{ fontSize: '0.82rem', color: 'var(--text-soft)' }}>{props.subtitle}</div>
    </button>
  )
}
