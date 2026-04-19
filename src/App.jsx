import { useEffect, useState } from 'react'

const LOGO_URL = 'https://uploads.onecompiler.io/4454edy2w/4454ed8yh/Logo%20negative.png'
const WA_NUMBER = '34936258218'
const WA_MSG = encodeURIComponent('Hola, me interesa el diagnóstico solar gratuito para Carrer de Valencia 214.')

const timeSlots = [
  { id: 'morning', main: 'Mañana', sub: '9:00 – 13:00' },
  { id: 'afternoon', main: 'Tarde', sub: '15:00 – 19:00' },
  { id: 'tomorrow', main: 'Mañana (día)', sub: 'Próximo laborable' },
  { id: 'anytime', main: 'Cuando sea', sub: 'Lo antes posible' },
]

const details = [
  { label: 'Tu tejado', value: 'Apto para solar ✓', green: true },
  { label: 'Retorno estimado', value: '~5 años', green: true },
  { label: 'Instalación', value: 'En 1 día, sin obras' },
  { label: 'Tu gestor personal', value: 'De inicio a fin' },
  { label: 'Permisos y subvenciones', value: 'Nos encargamos de todo' },
  { label: 'Garantía', value: '25 años' },
]

// ── Illustrated roof map ────────────────────────────────────────────
function RoofMap() {
  return (
    <div className="roof-map" aria-hidden="true">
      {/* streets */}
      <div className="st sth" style={{ top: 128 }} />
      <div className="st stv" style={{ left: 140 }} />
      {/* generic blocks */}
      {[
        { t: 18, l: 8,   w: 58, h: 36 },
        { t: 28, l: 90,  w: 50, h: 30 },
        { t: 55, l: 225, w: 70, h: 42 },
        { t: 148, l: 4,  w: 54, h: 34 },
        { t: 158, l: 228,w: 64, h: 38 },
        { t: 234, l: 16, w: 58, h: 36 },
        { t: 228, l: 178,w: 72, h: 42 },
      ].map((b, i) => (
        <div key={i} className="block" style={{ top: b.t, left: b.l, width: b.w, height: b.h }} />
      ))}

      {/* Neighbour — already installed */}
      <div className="nb-roof" style={{ top: 18, left: 8 }}>
        <div className="nb-tag">Ya instalado ✓</div>
        <div className="panel-grid nb-panels">
          {Array(8).fill(0).map((_, i) => <div key={i} className="panel nb-panel" />)}
        </div>
      </div>

      {/* YOUR roof — highlighted */}
      <div className="my-roof" style={{ top: 143, left: 108 }}>
        <div className="my-tag">Tu tejado<span className="my-tag-arrow" /></div>
        <div className="panel-grid my-panels">
          {Array(15).fill(0).map((_, i) => <div key={i} className="panel my-panel" />)}
        </div>
      </div>
    </div>
  )
}

// ── Timer digit ─────────────────────────────────────────────────────
function TimerUnit({ val, label }) {
  return (
    <div className="timer-unit">
      <span className="timer-val">{String(val).padStart(2, '0')}</span>
      <span className="timer-lbl">{label}</span>
    </div>
  )
}

export default function App() {
  const [phone, setPhone] = useState('')
  const [slot, setSlot] = useState('morning')
  const [submitted, setSubmitted] = useState(false)
  const [now, setNow] = useState(Date.now())

  const TARGET = new Date('2026-05-13T23:59:59+02:00').getTime()
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  const diff = Math.max(TARGET - now, 0)
  const days    = Math.floor(diff / 86400000)
  const hours   = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (phone.trim().length < 9) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-page">
        <div className="phone-wrap">
          <div className="screen ty-screen">
            <nav className="ty-nav">
              <img src={LOGO_URL} alt="Eltex" className="ty-logo" />
            </nav>
            <div className="ty-body">
              <div className="ty-check">✅</div>
              <h1 className="ty-title">¡Listo! Te llamamos pronto.</h1>
              <p className="ty-sub">
                Recibirás una llamada de validación técnica de <strong>7 minutos</strong>.
                No es una visita comercial.
              </p>
              <div className="ty-steps">
                {[
                  'Ten a mano tu última factura de luz.',
                  'Reserva 7 min para la llamada técnica.',
                  'Revisa tu email para el mini-curso gratuito.',
                ].map((s, i) => (
                  <div key={i} className="ty-step">
                    <span className="ty-num">{i + 1}</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-btn"
              >
                <span className="wa-icon-wrap">
                  <WaIcon />
                </span>
                <div>
                  <div className="wa-main">¿Prefieres WhatsApp?</div>
                  <div className="wa-sub-text">Respuesta en menos de 1 hora</div>
                </div>
              </a>
              <div className="trust-line">
                <span className="stars">★★★★★</span>
                Empresa local · Barcelona · 3.500+ instalaciones
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-page">
      <div className="phone-wrap">
        <div className="screen">

          {/* ── HERO ── */}
          <div className="hero">
            <RoofMap />
            {/* top bar */}
            <div className="hero-top">
              <img src={LOGO_URL} alt="Eltex" className="hero-logo" />
              <span className="hero-badge">Tu proyecto solar</span>
            </div>
            {/* bottom address */}
            <div className="hero-bottom">
              <div className="hero-addr">Carrer de Valencia 214</div>
              <div className="hero-addr-sub">08011 Barcelona · l'Eixample</div>
            </div>
          </div>

          {/* ── CONTENT ── */}
          <div className="content">

            {/* Savings card */}
            <div className="sav-card">
              <div className="sav-left">
                <div className="sav-label">Tu ahorro anual</div>
                <div className="sav-num">1.140 €</div>
                <div className="sav-footnote">28.500 € en 25 años</div>
              </div>
              <div className="sav-right">
                <div className="sav-per">Tu factura</div>
                <div className="sav-before">~95 €</div>
                <div className="sav-after">~8 €</div>
                <div className="sav-per">/ mes</div>
              </div>
            </div>

            {/* Countdown */}
            <div className="countdown-strip">
              <span className="countdown-label">⚡ Oferta válida hasta el 13 de mayo</span>
              <div className="timer">
                <TimerUnit val={days} label="Días" />
                <TimerUnit val={hours} label="Hrs" />
                <TimerUnit val={minutes} label="Min" />
                <TimerUnit val={seconds} label="Seg" />
              </div>
            </div>

            {/* Detail rows */}
            <div className="sec-title">Tu instalación con Eltex</div>
            <div className="details-card">
              {details.map((d) => (
                <div key={d.label} className="d-row">
                  <span className="d-label">{d.label}</span>
                  <span className={`d-value${d.green ? ' green' : ''}`}>{d.value}</span>
                </div>
              ))}
            </div>

            {/* CTA section */}
            <div className="cta-section">
              <div className="cta-title">¿Quieres los números exactos?</div>
              <div className="cta-sub">Esto es una estimación. Podemos darte los datos reales de tu tejado.</div>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-btn"
              >
                <span className="wa-icon-wrap">
                  <WaIcon />
                </span>
                <div>
                  <div className="wa-main">Escríbenos por WhatsApp</div>
                  <div className="wa-sub-text">Respuesta en menos de 1 hora</div>
                </div>
              </a>

              {/* OR */}
              <div className="or-divider">
                <div className="or-line" />
                <span className="or-text">o</span>
                <div className="or-line" />
              </div>

              {/* Callback form */}
              <div className="callback-card">
                <div className="cb-title">Te llamamos nosotros</div>
                <div className="cb-sub">Déjanos tu número y te contactamos cuando prefieras.</div>

                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <div className="input-label">Tu teléfono</div>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="612 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="time-label">¿Cuándo te va bien?</div>
                  <div className="time-grid">
                    {timeSlots.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`time-btn${slot === s.id ? ' selected' : ''}`}
                        onClick={() => setSlot(s.id)}
                      >
                        <div className="time-main">{s.main}</div>
                        <div className="time-sub-text">{s.sub}</div>
                      </button>
                    ))}
                  </div>

                  <button type="submit" className="submit-btn">Llamadme →</button>
                </form>
              </div>
            </div>

            {/* Trust footer */}
            <div className="trust-footer">
              <span className="stars">★★★★★</span>
              Empresa local · Barcelona · 3.500+ instalaciones
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

function WaIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}
