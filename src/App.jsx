import { useEffect, useMemo, useState } from 'react'

const LOGO_URL = 'https://uploads.onecompiler.io/4454edy2w/4454ed8yh/Logo%20negative.png'

const notifications = [
  { name: 'Marta R.', street: 'Carrer de Provença', action: 'acaba de reservar su Auditoría Solar.' },
  { name: 'Jordi M.', street: 'Diputació 189', action: 'acaba de solicitar su Informe 2026.' },
  { name: 'Laura V.', street: 'Consell de Cent', action: 'acaba de activar su Diagnóstico Solar.' },
  { name: 'Pere B.', street: 'Balmes 102', action: 'acaba de completar su estudio técnico.' },
]

const reviews = [
  { name: 'Ana R.', neighborhood: "L'Eixample", stars: 5, text: 'Proceso completamente técnico, sin presión comercial. El informe de sombras fue revelador.' },
  { name: 'Marc B.', neighborhood: "L'Eixample", stars: 5, text: 'Detectaron un problema de sombras que nadie nos había explicado. Ahorramos un 30% más gracias a eso.' },
  { name: 'Carme V.', neighborhood: "L'Eixample", stars: 5, text: 'Nos guiaron con subvenciones del barrio paso a paso. Conseguimos el máximo de ayudas disponibles.' },
]

const deliverables = [
  { icon: '🛰️', title: 'Mapeo de Incidencia Solar', desc: 'Análisis satelital de la orientación e irradiación real de su tejado.' },
  { icon: '🏙️', title: 'Análisis de Sombras', desc: 'Impacto de los edificios del Eixample sobre su producción estimada.' },
  { icon: '📋', title: 'Roadmap de Subvenciones', desc: 'Ayudas locales, autonómicas y estatales activas este mes.' },
  { icon: '💶', title: 'Informe de Coste Oculto', desc: 'Cuánto pagará de más en energía alquilada los próximos 10 años.' },
]

const stats = [
  { value: '3.000+', label: 'Instalaciones en España' },
  { value: '4,6★', label: 'Google (900+ reseñas)' },
  { value: '30 años', label: 'Garantía de producto' },
  { value: '90%', label: 'Ahorro máximo potencial' },
]

const TARGET_DATE = new Date('2026-05-13T23:59:59+02:00').getTime()

function formatTime(ms) {
  const safe = Math.max(ms, 0)
  const totalSeconds = Math.floor(safe / 1000)
  const days = Math.floor(totalSeconds / (24 * 3600))
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { days, hours, minutes, seconds }
}

function StarRating({ count = 5 }) {
  return (
    <span className="stars" aria-label={`${count} estrellas`}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  )
}

function ProgressBar({ step }) {
  return (
    <div className="progress-bar" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}>
      {[1, 2, 3].map((n) => (
        <div key={n} className={`progress-step ${n <= step ? 'active' : ''} ${n === step ? 'current' : ''}`} />
      ))}
    </div>
  )
}

function App() {
  const [step, setStep] = useState(1)
  const [priority, setPriority] = useState('')
  const [billRange, setBillRange] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [now, setNow] = useState(Date.now())
  const [notifIndex, setNotifIndex] = useState(0)
  const [notifVisible, setNotifVisible] = useState(true)
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => setHeroVisible(true), 100)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifVisible(false)
      setTimeout(() => {
        setNotifIndex((prev) => (prev + 1) % notifications.length)
        setNotifVisible(true)
      }, 400)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const timeLeft = useMemo(() => formatTime(TARGET_DATE - now), [now])
  const canSubmit = phone.trim().length >= 9 && name.trim().length >= 2

  const handleStepOne = (value) => { setPriority(value); setStep(2) }
  const handleStepTwo = (value) => { setBillRange(value); setStep(3) }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!priority || !billRange || !canSubmit) return
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (submitted) {
    return (
      <div className="app">
        <nav className="navbar">
          <img src={LOGO_URL} alt="Eltex Energía" className="nav-logo" />
        </nav>
        <div className="thankyou-page">
          <div className="thankyou-card">
            <div className="ty-icon">✅</div>
            <div className="eyebrow-pill blue">Diagnóstico Solar 2026</div>
            <h1 className="ty-title">Estudio iniciado, {name.split(' ')[0]}.</h1>
            <p className="ty-sub">
              Un Experto Energético le llamará desde el <strong>936 258 218</strong> mañana entre las <strong>10:00 y las 14:00</strong> para completar su diagnóstico personalizado.
            </p>
            <div className="ty-steps">
              {[
                'Tenga a mano su última factura de luz.',
                'Reserve 7 minutos para la llamada técnica.',
                'Revise su email para el mini-curso gratuito.',
              ].map((item, i) => (
                <div key={i} className="ty-step-item">
                  <span className="ty-step-num">{i + 1}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="ty-bonus-card">
            <div className="eyebrow-pill">Mini-curso gratuito · 3 vídeos</div>
            <h2>Incluido con su diagnóstico</h2>
            <ul className="bonus-list">
              {[
                'Errores comunes antes de instalar solar en fincas urbanas.',
                'Cómo leer su factura para detectar el coste oculto.',
                'Cómo aprovechar subvenciones sin perder los plazos.',
              ].map((item, i) => (
                <li key={i}><span className="check">✓</span>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      {/* Top announcement bar */}
      <div className="announcement-bar">
        <span>🏆 Partner oficial de Starlink en España</span>
        <span className="sep">·</span>
        <span>+3.000 instalaciones realizadas</span>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <img src={LOGO_URL} alt="Eltex Energía" className="nav-logo" />
        <a href="#diagnostico" className="nav-cta">Solicita tu estudio gratuito →</a>
      </nav>

      {/* Hero */}
      <header className={`hero ${heroVisible ? 'hero-visible' : ''}`}>
        <div className="hero-bg-dots" aria-hidden="true" />
        <div className="hero-inner">
          <div className="google-badge">
            <span className="g-icon">G</span>
            <div>
              <div className="g-stars">★★★★★ <span className="g-score">4,6/5</span></div>
              <div className="g-count">más de +875 reseñas</div>
            </div>
          </div>
          <h1>Cómo independizar su hogar de las subidas eléctricas sin cambiar su estilo de vida.</h1>
          <p className="hero-lead">
            Hacemos este mapeo porque estamos validando la eficiencia técnica de su manzana <strong>tras una instalación cercana en l'Eixample.</strong>
          </p>
          <div className="hero-bullets">
            {[
              'Ahorra hasta un 90% en tu factura de la luz',
              'Más de 3.000 instalaciones en toda España',
              'Un Account Manager de principio a fin',
            ].map((b, i) => (
              <div key={i} className="hero-bullet"><span className="bullet-check">✓</span>{b}</div>
            ))}
          </div>
          <a href="#diagnostico" className="btn-primary hero-btn">
            Quiero mi Diagnóstico Solar 2026 →
          </a>
          <p className="hero-note">Gratuito · Sin compromiso · Validación técnica en 2 min</p>
        </div>
        <div className="hero-image-panel" aria-hidden="true">
          <div className="hero-img-overlay" />
        </div>
      </header>

      {/* Live notification toast */}
      <div className={`toast-notif ${notifVisible ? 'toast-visible' : 'toast-hidden'}`} aria-live="polite">
        <span className="toast-dot" />
        <span><strong>{notifications[notifIndex].name}</strong> · {notifications[notifIndex].street} — {notifications[notifIndex].action}</span>
      </div>

      {/* Trust logos */}
      <section className="trust-section">
        <p className="trust-label">Con la confianza de los líderes del sector</p>
        <div className="trust-logos">
          {['//ABANCA', 'cetelem', 'Sófinco', 'PYLONTECH', 'JinKO Solar', 'Hisense'].map((name) => (
            <span key={name} className="trust-logo-item">{name}</span>
          ))}
        </div>
      </section>

      {/* Urgency / Scarcity */}
      <section className="urgency-section">
        <div className="urgency-inner">
          <div className="urgency-left">
            <span className="urgency-badge">⚡ Solo 2 plazas restantes</span>
            <h2>Auditoría técnica para l'Eixample — esta semana</h2>
            <p>Cada semana validamos un número limitado de tejados en el barrio. No pierda su turno.</p>
            <a href="#diagnostico" className="btn-primary">Reservar mi plaza gratuita →</a>
          </div>
          <div className="urgency-right">
            <p className="timer-label">Oferta válida hasta el 13 de mayo</p>
            <div className="timer">
              {[
                { v: timeLeft.days, l: 'Días' },
                { v: timeLeft.hours, l: 'Horas' },
                { v: timeLeft.minutes, l: 'Min' },
                { v: timeLeft.seconds, l: 'Seg' },
              ].map(({ v, l }) => (
                <div key={l} className="timer-unit">
                  <span className="timer-val">{String(v).padStart(2, '0')}</span>
                  <span className="timer-lbl">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="deliverables-section">
        <div className="section-inner">
          <div className="eyebrow-pill blue">Roadmap de Eficiencia Solar 2026</div>
          <h2>No es una llamada comercial.<br />Es un informe técnico personalizado.</h2>
          <p className="section-sub">Analizamos el potencial real de su tejado y su ahorro proyectado con datos reales de su zona.</p>
          <div className="deliverables-grid">
            {deliverables.map((d) => (
              <div key={d.title} className="deliverable-card">
                <span className="deliverable-icon">{d.icon}</span>
                <div>
                  <h3>{d.title}</h3>
                  <p>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="stats-section">
        {stats.map((s) => (
          <div key={s.label} className="stat-item">
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* Social proof */}
      <section className="proof-section">
        <div className="section-inner">
          <div className="eyebrow-pill">Propietarios en Barcelona</div>
          <h2>3.000+ vecinos ya iniciaron su transición energética</h2>
          <div className="reviews-grid">
            {reviews.map((r) => (
              <article key={r.name} className="review-card">
                <StarRating count={r.stars} />
                <p className="review-text">"{r.text}"</p>
                <div className="review-author">
                  <div className="review-avatar">{r.name[0]}</div>
                  <div>
                    <strong>{r.name}</strong>
                    <span>{r.neighborhood}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Lead capture form */}
      <section id="diagnostico" className="form-section">
        <div className="section-inner">
          <div className="form-card">
            <div className="eyebrow-pill blue">Carrer de Valencia 214 · l'Eixample</div>
            <h2>Reserve su Auditoría Técnica Gratuita</h2>
            <p className="form-sub">Su tejado ha sido pre-calificado para el programa de validación 2026.</p>

            <ProgressBar step={step} />
            <p className="step-label">Paso {step} de 3</p>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="form-step">
                  <h3>¿Cuál es su prioridad principal ahora?</h3>
                  {[
                    { v: 'factura', label: 'Reducir mi factura mensual de luz', icon: '💡' },
                    { v: 'patrimonio', label: 'Aumentar el valor patrimonial de mi propiedad', icon: '🏠' },
                  ].map(({ v, label, icon }) => (
                    <button
                      key={v}
                      type="button"
                      className={`option-btn ${priority === v ? 'selected' : ''}`}
                      onClick={() => handleStepOne(v)}
                    >
                      <span className="opt-icon">{icon}</span>
                      <span>{label}</span>
                      <span className="opt-arrow">→</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="form-step">
                  <h3>¿Cuál es su gasto de luz promedio mensual?</h3>
                  {[
                    { v: '<100', label: 'Menos de 100 €/mes', icon: '🟢' },
                    { v: '100-200', label: 'Entre 100 y 200 €/mes', icon: '🟡' },
                    { v: '>200', label: 'Más de 200 €/mes', icon: '🔴' },
                  ].map(({ v, label, icon }) => (
                    <button
                      key={v}
                      type="button"
                      className={`option-btn ${billRange === v ? 'selected' : ''}`}
                      onClick={() => handleStepTwo(v)}
                    >
                      <span className="opt-icon">{icon}</span>
                      <span>{label}</span>
                      <span className="opt-arrow">→</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="form-step">
                  <div className="pre-qualified-badge">🎯 Tejado pre-calificado</div>
                  <h3>Ingrese sus datos para recibir el informe</h3>
                  <p className="form-step-sub">Una llamada de validación técnica de 7 minutos, no comercial.</p>

                  <div className="input-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                      id="nombre"
                      type="text"
                      placeholder="Su nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      id="telefono"
                      type="tel"
                      placeholder="Ej: 612 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary submit-btn" disabled={!canSubmit}>
                    Finalizar y Recibir Mi Diagnóstico →
                  </button>
                  <p className="legal">
                    Al enviar acepta la llamada de validación técnica y el tratamiento de datos conforme al RGPD.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <img src={LOGO_URL} alt="Eltex Energía" className="footer-logo" />
        <p>Solicitud de auditoría técnica solar — Carrer de Valencia 214, l'Eixample, Barcelona.</p>
        <p className="footer-legal">© 2026 Eltex Energía · Todos los derechos reservados · Política de privacidad</p>
      </footer>
    </div>
  )
}

export default App
