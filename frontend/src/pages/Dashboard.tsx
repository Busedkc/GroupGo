import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AIResponse from '../components/AIResponse'

const API = 'http://localhost:8000'

const AVATAR_COLORS = ['#ff6b3d', '#2fb8a3', '#f5b769', '#5a8f6a', '#9b6bff', '#f87171', '#3b82f6']

function initials(name?: string) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase()
}

function formatDateRange(dates?: string[]) {
  if (!dates || dates.length === 0) return '-'
  if (dates.length === 1) return new Date(dates[0]).toLocaleDateString('tr-TR')
  return `${new Date(dates[0]).toLocaleDateString('tr-TR')} – ${new Date(dates[1]).toLocaleDateString('tr-TR')}`
}

export default function Dashboard() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState<any>(null)
  const [responses, setResponses] = useState<any[]>([])
  const [recommendation, setRecommendation] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    axios.get(`${API}/trips/${tripId}`).then((res) => setTrip(res.data))
    axios.get(`${API}/responses/${tripId}`).then((res) => setResponses(res.data.responses))
  }, [tripId])

  const mode: 'trip' | 'city' = trip?.mode === 'city' ? 'city' : 'trip'
  const surveyLink = useMemo(
    () => (trip?.survey_token ? `${window.location.origin}/survey/${trip.survey_token}` : ''),
    [trip]
  )

  const getRecommendation = async () => {
    setLoading(true)
    try {
      const res = await axios.post(`${API}/ai/${tripId}/recommend`)
      setRecommendation(res.data.recommendation)
    } catch (e) {
      alert('Bir şeyler ters gitti!')
    }
    setLoading(false)
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(surveyLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <>
      <Navbar />
      <main style={{ flex: 1, padding: '2rem 24px 3.5rem' }}>
        <div className="gg-container" style={{ maxWidth: 960 }}>
          {/* Header card */}
          <div className="gg-card" style={{ padding: '1.75rem 2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.7rem',
                    borderRadius: 999,
                    background: mode === 'city' ? 'var(--accent-teal-soft)' : 'var(--primary-soft)',
                    color: mode === 'city' ? '#1a8979' : 'var(--primary-hover)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginBottom: '0.6rem'
                  }}
                >
                  {mode === 'city' ? '☕ City Mode' : '✈️ Trip Mode'}
                </span>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{trip?.title || 'Yükleniyor...'}</h1>
                <p style={{ color: 'var(--text-soft)' }}>
                  Organizatör: <strong style={{ color: 'var(--text-h)' }}>{trip?.organizer_name || '—'}</strong>
                  {trip?.city && (
                    <>
                      <span style={{ margin: '0 0.4rem' }}>·</span>
                      {trip.city}
                    </>
                  )}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: '50%',
                    background: 'var(--primary-soft)',
                    color: 'var(--primary-hover)',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {responses.length}
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-soft)' }}>yanıt</div>
              </div>
            </div>

            {surveyLink && (
              <div
                style={{
                  marginTop: '1.5rem',
                  background: 'var(--surface-muted)',
                  border: '1px dashed var(--border-strong)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.85rem 1rem'
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-hover)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                  ANKET LİNKİNİ PAYLAŞ
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    className="gg-input"
                    value={surveyLink}
                    readOnly
                    style={{ fontSize: '0.88rem', background: 'white' }}
                  />
                  <button className="gg-btn gg-btn-primary" onClick={copyLink} style={{ flexShrink: 0 }}>
                    {copied ? '✓ Kopyalandı' : 'Linki kopyala'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Responses */}
          <h2 style={{ marginBottom: '1rem' }}>Yanıtlar ({responses.length})</h2>
          {responses.length === 0 ? (
            <div className="gg-card" style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📬</div>
              <h3 style={{ marginBottom: '0.35rem' }}>Henüz yanıt yok</h3>
              <p style={{ color: 'var(--text-soft)' }}>Linki paylaş, ilk tercihlerin gelmesini bekle.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {responses.map((r, i) => (
                <div key={r.id || i} className="gg-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.9rem' }}>
                    <span className="gg-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                      {initials(r.participant_name)}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-h)' }}>{r.participant_name}</div>
                      {r.preferred_dates?.length > 0 && mode === 'trip' && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-soft)' }}>{formatDateRange(r.preferred_dates)}</div>
                      )}
                    </div>
                  </div>

                  {r.preferred_countries?.length > 0 && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-hover)', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                        {mode === 'city' ? '📍 MAHALLELER' : '🌍 ÜLKELER'}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {r.preferred_countries.map((c: string) => (
                          <span key={c} className="gg-tag">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {r.interests?.length > 0 && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-hover)', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                        ✨ İSTEKLER
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {r.interests.map((it: string) => (
                          <span key={it} className="gg-tag">{it}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {mode === 'trip' && (r.budget_min || r.budget_max) && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginBottom: '0.5rem' }}>
                      💰 {r.budget_min ?? '?'}₺ – {r.budget_max ?? '?'}₺
                    </div>
                  )}

                  {r.notes && (
                    <div
                      style={{
                        background: 'var(--surface-muted)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.6rem 0.75rem',
                        fontSize: '0.86rem',
                        color: 'var(--text)',
                        fontStyle: 'italic'
                      }}
                    >
                      "{r.notes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* AI CTA */}
          {responses.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <button
                onClick={getRecommendation}
                disabled={loading}
                className="gg-btn gg-btn-primary"
                style={{ padding: '1rem 2.25rem', fontSize: '1rem' }}
              >
                {loading ? 'Analiz ediliyor...' : '🪄 AI önerisi al'}
              </button>
              <p style={{ color: 'var(--text-soft)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Grup tercihleri analiz edilip ortak nokta önerilecek
              </p>
            </div>
          )}

          {recommendation && (
            <div
              style={{
                marginTop: '2rem',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #ff8a4d, #ff5722)',
                  color: 'white',
                  padding: '2rem'
                }}
              >
                <div style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem', opacity: 0.9 }}>
                  🪄 AI ÖNERİSİ
                </div>
                <h2 style={{ color: 'white', fontSize: '1.6rem' }}>
                  {mode === 'city' ? 'Mahalle & mekan önerisi' : 'Destinasyon önerisi'}
                </h2>
              </div>
              <div style={{ background: 'white', padding: '1.75rem 2rem' }}>
                <AIResponse text={recommendation} />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
