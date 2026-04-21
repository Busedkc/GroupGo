import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const COUNTRY_OPTIONS = [
  'Turkey', 'Greece', 'Italy', 'Spain', 'France',
  'Portugal', 'Netherlands', 'Germany', 'Croatia',
  'Japan', 'Thailand', 'USA'
]

const TRIP_INTERESTS = [
  'Beach', 'Hiking', 'Food', 'Nightlife', 'Culture',
  'History', 'Shopping', 'Nature', 'Adventure', 'Photography', 'Relax'
]

const CITY_INTERESTS = [
  'Cafe', 'Brunch', 'Museum', 'Bar', 'Restaurant',
  'Park', 'Live', 'Shopping', 'Art', 'Walk'
]

type Mode = 'trip' | 'city'

export default function Survey() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState<any>(null)
  const [form, setForm] = useState({
    participant_name: '',
    budget_min: '',
    budget_max: '',
    preferred_date_start: '',
    preferred_date_end: '',
    preferred_countries: [] as string[],
    preferred_city_areas: '',
    interests: [] as string[],
    interests_other: '',
    notes: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get(`${API}/trips/token/${token}`).then((res) => setTrip(res.data))
  }, [token])

  const mode: Mode = trip?.mode === 'city' ? 'city' : 'trip'
  const interestOptions = useMemo(() => (mode === 'city' ? CITY_INTERESTS : TRIP_INTERESTS), [mode])

  const toggle = (key: 'preferred_countries' | 'interests', value: string) => {
    setForm((prev) => {
      const list = prev[key]
      return {
        ...prev,
        [key]: list.includes(value) ? list.filter((x) => x !== value) : [...list, value]
      }
    })
  }

  const handleSubmit = async () => {
    if (!form.participant_name.trim()) {
      alert('Lütfen adını yaz.')
      return
    }
    const preferredDates = [form.preferred_date_start, form.preferred_date_end].filter(Boolean)
    const extraInterests = form.interests_other.split(',').map((s) => s.trim()).filter(Boolean)
    const allInterests = [...form.interests, ...extraInterests]
    const cityAreas = form.preferred_city_areas.split(',').map((s) => s.trim()).filter(Boolean)

    setLoading(true)
    try {
      await axios.post(`${API}/responses/${token}`, {
        participant_name: form.participant_name,
        budget_min: form.budget_min ? parseInt(form.budget_min) : null,
        budget_max: form.budget_max ? parseInt(form.budget_max) : null,
        preferred_dates: preferredDates,
        preferred_countries: mode === 'city' ? cityAreas : form.preferred_countries,
        interests: allInterests,
        notes: form.notes
      })
      setSubmitted(true)
    } catch (e) {
      alert('Bir şeyler ters gitti!')
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <>
        <Navbar />
        <main style={{ flex: 1, padding: '3rem 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="gg-card" style={{ padding: '2.5rem', textAlign: 'center', maxWidth: 460 }}>
            <div
              style={{
                width: 66,
                height: 66,
                borderRadius: '50%',
                background: 'var(--primary-soft)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.7rem',
                margin: '0 auto 1rem'
              }}
            >
              🎉
            </div>
            <h2>Yanıtın kaydedildi!</h2>
            <p style={{ color: 'var(--text-soft)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              Organizatöre haber verildi. Herkes yanıtladığında AI önerisi hazır olacak.
            </p>
            {trip?.id && (
              <button className="gg-btn gg-btn-primary" onClick={() => navigate(`/dashboard/${trip.id}`)}>
                Sonuçları gör →
              </button>
            )}
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
          <div className="gg-card" style={{ padding: '2.25rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: '50%',
                  background: 'var(--primary-soft)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  margin: '0 auto 0.75rem'
                }}
              >
                {mode === 'city' ? '☕' : '✈️'}
              </div>
              <h1 style={{ fontSize: '1.9rem' }}>{trip?.title || 'Yükleniyor...'}</h1>
              <p style={{ color: 'var(--text-soft)', marginTop: '0.35rem' }}>
                {trip?.organizer_name ? (
                  <>
                    <strong style={{ color: 'var(--text-h)' }}>{trip.organizer_name}</strong> tarafından organize ediliyor — tercihini gir
                  </>
                ) : (
                  'Tercihini gir'
                )}
              </p>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="gg-label">Adın</label>
              <input
                className="gg-input"
                placeholder="Ayşe"
                value={form.participant_name}
                onChange={(e) => setForm({ ...form, participant_name: e.target.value })}
              />
            </div>

            {mode === 'trip' && (
              <>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="gg-label">Tercih ettiğin ülkeler</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {COUNTRY_OPTIONS.map((country) => {
                      const active = form.preferred_countries.includes(country)
                      return (
                        <span
                          key={country}
                          className={`gg-chip ${active ? 'gg-chip-active' : ''}`}
                          onClick={() => toggle('preferred_countries', country)}
                        >
                          {country}
                        </span>
                      )
                    })}
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="gg-label">
                    Tercih ettiğin tarih aralığı
                    <span className="gg-label-hint">takvimden seç</span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <input
                      type="date"
                      className="gg-input"
                      value={form.preferred_date_start}
                      onChange={(e) => setForm({ ...form, preferred_date_start: e.target.value })}
                    />
                    <input
                      type="date"
                      className="gg-input"
                      value={form.preferred_date_end}
                      onChange={(e) => setForm({ ...form, preferred_date_end: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="gg-label">
                    Bütçe aralığı (₺)
                    <span className="gg-label-hint">opsiyonel</span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <input
                      className="gg-input"
                      placeholder="Min ₺"
                      value={form.budget_min}
                      onChange={(e) => setForm({ ...form, budget_min: e.target.value })}
                    />
                    <input
                      className="gg-input"
                      placeholder="Max ₺"
                      value={form.budget_max}
                      onChange={(e) => setForm({ ...form, budget_max: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            {mode === 'city' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="gg-label">
                  Tercih ettiğin mahalleler
                  <span className="gg-label-hint">virgülle ayır</span>
                </label>
                <input
                  className="gg-input"
                  placeholder="Karaköy, Kadıköy, Cihangir"
                  value={form.preferred_city_areas}
                  onChange={(e) => setForm({ ...form, preferred_city_areas: e.target.value })}
                />
              </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="gg-label">
                {mode === 'city' ? 'Ne yapmak istersin?' : 'İlgi alanların'}
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {interestOptions.map((item) => {
                  const active = form.interests.includes(item)
                  return (
                    <span
                      key={item}
                      className={`gg-chip ${active ? 'gg-chip-active' : ''}`}
                      onClick={() => toggle('interests', item)}
                    >
                      {item}
                    </span>
                  )
                })}
              </div>
              <input
                className="gg-input"
                placeholder="Diğer (virgülle ayır)"
                value={form.interests_other}
                onChange={(e) => setForm({ ...form, interests_other: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="gg-label">
                Notlar
                <span className="gg-label-hint">opsiyonel</span>
              </label>
              <textarea
                className="gg-textarea"
                placeholder="Özel istek, alerji, vs."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="gg-btn gg-btn-primary"
              style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
            >
              {loading ? 'Gönderiliyor...' : 'Gönder →'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
