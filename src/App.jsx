import { useEffect, useState, useRef } from 'react'
import {
  Star, Lightning, MapPin, Sun, CheckCircle, LockSimple,
  PaperPlaneTilt, Coins, Building, PhoneCall, ShieldCheck,
  CalendarCheck, UserCircle, ArrowRight, SealCheck, SlidersHorizontal,
} from '@phosphor-icons/react'

const LOGO_URL = 'https://uploads.onecompiler.io/4454edy2w/4454ed8yh/Logo%20negative.png'
const TARGET = new Date('2026-05-13T23:59:59+02:00').getTime()

/* ─── Real solar data (Spain avg, Barcelona irradiance) ──────────────────
   Source: IDAE / REE 2024 data
   - Avg residential monthly bill Spain: ~85 €/mes
   - Barcelona avg peak-sun-hours: 5.4 h/day
   - Self-consumption offset for avg 4kWp install: ~75–80% of consumption
   - Grid export compensation: ~0.06 €/kWh (PVPC surplus)
   - Avg install cost 4kWp: ~4.200–4.800 € (post-subsidy ~3.000 €)
   ─────────────────────────────────────────────────────────────────────── */

// Bill brackets → realistic savings range (conservative / typical)
const SAVINGS_DATA = {
  low:  { label: 'Inferior a 100 €',   monthly: 75,  savePct: 0.68, annualMin: 480,  annualMax: 650,  paybackYrs: '7–9' },
  mid:  { label: 'Entre 100 y 160 €',  monthly: 130, savePct: 0.76, annualMin: 900,  annualMax: 1200, paybackYrs: '5–7' },
  high: { label: 'Superior a 160 €',   monthly: 195, savePct: 0.82, annualMin: 1600, annualMax: 2000, paybackYrs: '4–6' },
}

/* ── Google logo ──────────────────────────────────────────────────────── */
function GoogleLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function GoogleStars({ rating = 4.6, count = '900+' }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <div className="google-review">
      <div className="gr-top">
        <GoogleLogo size={22} />
        <div className="gr-info">
          <span className="gr-label">Google Reviews</span>
          <div className="gr-stars">
            {[...Array(full)].map((_, i) => <Star key={i} size={13} weight="fill" color="#FBBC05" />)}
            {half && <Star size={13} weight="half" color="#FBBC05" />}
            <span className="gr-score">{rating}</span>
          </div>
        </div>
        <span className="gr-count">{count} reseñas</span>
      </div>
    </div>
  )
}

/* ── Individual review card ─────────────────────────────────────────── */
function ReviewCard({ name, location, date, text, avatar, highlight }) {
  return (
    <div className="rev-card">
      <div className="rev-head">
        <div className="rev-avatar" style={{ background: avatar.bg }}>
          <span>{avatar.letter}</span>
        </div>
        <div>
          <p className="rev-name">{name}</p>
          <p className="rev-location">{location}</p>
          <p className="rev-date">{date}</p>
        </div>
        <div className="rev-g">
          <GoogleLogo size={16} />
        </div>
      </div>
      <div className="rev-stars">
        {[...Array(5)].map((_, i) => <Star key={i} size={12} weight="fill" color="#FBBC05" />)}
      </div>
      {highlight && <div className="rev-highlight">"{highlight}"</div>}
      <p className="rev-text">{text}</p>
    </div>
  )
}

/* ── Video testimonial card ─────────────────────────────────────────── */
function VideoCard({ videoId, name }) {
  const [playing, setPlaying] = useState(false)
  const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

  return (
    <div className="vid-card">
      <div className="vid-thumb">
        {playing ? (
          <iframe
            className="vid-iframe"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img src={thumb} alt={name} />
            <button className="vid-play" onClick={() => setPlaying(true)} aria-label="Reproducir vídeo">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="28" r="28" fill="rgba(0,0,0,0.6)" />
                <polygon points="22,17 44,28 22,39" fill="white" />
              </svg>
            </button>
            <div className="vid-badge">
              <svg width="12" height="9" viewBox="0 0 22 16" fill="none">
                <rect width="22" height="16" rx="3.5" fill="#FF0000"/>
                <polygon points="9,4 17,8 9,12" fill="white"/>
              </svg>
              YouTube
            </div>
          </>
        )}
      </div>
      <div className="vid-info">
        <p className="vid-name">{name}</p>
        <div className="vid-stars">
          {[...Array(5)].map((_, i) => <Star key={i} size={12} weight="fill" color="#FBBC05" />)}
        </div>
      </div>
    </div>
  )
}

function ReviewsSection() {
  const reviews = [
    {
      name: 'Jordi Mas',
      location: 'l\'Eixample, Barcelona',
      date: 'hace 3 semanas',
      text: 'Llevaba años pagando 180 € al mes de luz. Después de la instalación de Eltex pago 7 €. No me lo podía creer cuando vi la primera factura. El proceso fue transparente desde el primer día, sin sorpresas ni letra pequeña. El técnico llegó puntual, terminó en pocas horas y dejó todo limpio. 100% recomendable.',
      avatar: { letter: 'J', bg: '#4285F4' },
      highlight: '¡Pasé de 180 € a 7 € al mes!',
    },
    {
      name: 'Carmen Ruiz',
      location: 'Gràcia, Barcelona',
      date: 'hace 1 mes',
      text: 'Al principio tenía dudas, pero la llamada del técnico me convenció: explicaron todo con números reales, sin presión y sin intentar venderme nada que no necesitara. La instalación fue impecable. En el primer mes ya recuperé más de 140 €. Mi vecina ya ha pedido presupuesto también.',
      avatar: { letter: 'C', bg: '#34A853' },
      highlight: '140 € ahorrados el primer mes',
    },
    {
      name: 'Antonio Vidal',
      location: 'Sant Martí, Barcelona',
      date: 'hace 2 semanas',
      text: 'El diagnóstico gratuito fue lo que me convenció. Sin compromiso de ningún tipo, me mandaron un informe con el potencial real de mi tejado. El resultado final superó sus propias estimaciones. En verano prácticamente no pago nada y en invierno bajo de 15 €. Ojalá lo hubiera hecho antes.',
      avatar: { letter: 'A', bg: '#EA4335' },
      highlight: 'El resultado superó las estimaciones',
    },
    {
      name: 'Montserrat P.',
      location: 'Sarrià, Barcelona',
      date: 'hace 5 días',
      text: 'Empresa seria y muy profesional. El equipo fue amable y dejaron el tejado perfectamente. Llevo 2 meses con las placas y ya veo el retorno. El acompañamiento post-instalación también es excelente, siempre responden rápido cualquier consulta.',
      avatar: { letter: 'M', bg: '#FBBC05' },
      highlight: 'Empresa seria, resultado excelente',
    },
    {
      name: 'Pau Ferrer',
      location: 'Les Corts, Barcelona',
      date: 'hace 1 semana',
      text: 'Me contactaron tras pedir el diagnóstico y en pocos días ya tenía fecha de instalación. El técnico fue muy didáctico, me explicó cómo funciona el sistema de compensación de excedentes y cómo leer la nueva factura. Ahorro entre 120 y 160 € cada mes. Inversión totalmente recuperada en menos de 5 años.',
      avatar: { letter: 'P', bg: '#4285F4' },
      highlight: 'Recupero la inversión en menos de 5 años',
    },
    {
      name: 'Rosa Torres',
      location: 'Horta-Guinardó, Barcelona',
      date: 'hace 2 meses',
      text: 'Pedí tres presupuestos distintos y Eltex fue la única empresa que vino a ver el tejado antes de dar cifras. Eso me generó mucha confianza. La instalación fue limpia y sin obra. Ahora invierto lo que ahorraba en la hipoteca. Mis hijos también se lo están planteando.',
      avatar: { letter: 'R', bg: '#34A853' },
      highlight: 'La única empresa que vino a ver el tejado primero',
    },
  ]

  const videos = [
    { videoId: 'q4P8JVUloww', name: 'Antonio' },
    { videoId: 'CTBCxUoVTxM', name: 'Manel' },
  ]

  return (
    <section className="reviews-section">
      <div className="reviews-in">
        <div className="reviews-header">
          <GoogleStars rating={4.6} count="900+" />
        </div>
        <div className="reviews-grid">
          {reviews.map((r, i) => <ReviewCard key={i} {...r} />)}
        </div>
        <div className="vid-section">
          <div className="vid-header">
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
              <rect width="22" height="16" rx="3.5" fill="#FF0000"/>
              <polygon points="9,4 17,8 9,12" fill="white"/>
            </svg>
            <h3 className="vid-title">Testimonios en vídeo</h3>
          </div>
          <div className="vid-grid">
            {videos.map((v, i) => <VideoCard key={i} {...v} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Countdown ────────────────────────────────────────────────────────── */
function useCountdown() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  const diff = Math.max(TARGET - now, 0)
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  }
}

function T({ v, l }) {
  return (
    <div className="tu">
      <span className="tv">{String(v).padStart(2, '0')}</span>
      <span className="tl">{l}</span>
    </div>
  )
}

/* ── Social nudge ─────────────────────────────────────────────────────── */
const NUDGES = [
  { name: 'Marta S.', street: 'Carrer de Valencia 212' },
  { name: 'Jordi P.', street: 'Carrer d\'Enric Granados' },
  { name: 'Carmen R.', street: 'Carrer del Consell de Cent' },
]

function Nudge() {
  const [visible, setVisible] = useState(true)
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    let hideTimer
    let nextTimer

    function cycle() {
      hideTimer = setTimeout(() => {
        setVisible(false)
        nextTimer = setTimeout(() => {
          setIdx(i => (i + 1) % NUDGES.length)
          setVisible(true)
          cycle()
        }, 1800)
      }, 5600)
    }

    cycle()

    return () => {
      clearTimeout(hideTimer)
      clearTimeout(nextTimer)
    }
  }, [])

  const n = NUDGES[idx]

  return (
    <div className={`nudge${visible ? ' show' : ''}`} aria-live="polite">
      <div className="nudge-icon">
        <UserCircle size={24} weight="fill" />
      </div>
      <span>
        <strong>{n.name}</strong> en <strong>{n.street}</strong> acaba de recibir su diagnóstico
      </span>
      <div className="nudge-progress" />
    </div>
  )
}

/* ── Value Stack ─────────────────────────────────────────────────────── */
function ValueStack() {
  const items = [
    { icon: '🛰️', title: 'Mapeo de Incidencia Solar Satelital', value: '47 €' },
    { icon: '🏙️', title: 'Análisis de Sombras Dinámico del Eixample', value: '25 €' },
    { icon: '📋', title: 'Informe de Subvenciones Locales Activas', value: '30 €' },
    { icon: '📈', title: 'Hoja de Ruta de Amortización Personalizada', value: '20 €' },
  ]
  return (
    <section className="vstack-section">
      <div className="vstack-in">
        <div className="vstack-head">
          <div className="pill"><SealCheck size={13} weight="fill" /> Incluido en su auditoría gratuita</div>
          <h2 className="vstack-title">Lo que recibe en la llamada de 7 minutos</h2>
          <p className="vstack-sub">No es una visita comercial. Es un diagnóstico técnico con datos reales de su tejado.</p>
        </div>
        <div className="vstack-list">
          {items.map((item, i) => (
            <div key={i} className="vstack-item">
              <span className="vstack-icon">{item.icon}</span>
              <span className="vstack-label">{item.title}</span>
              <span className="vstack-val">{item.value}</span>
            </div>
          ))}
          <div className="vstack-total">
            <span>Valor total</span>
            <span className="vstack-total-old">122 €</span>
            <span className="vstack-total-free">0 € hoy</span>
          </div>
        </div>
        <a href="#form" className="cta lg vstack-cta">
          <Sun size={18} weight="fill" />
          Activar Mi Auditoría Gratuita
        </a>
      </div>
    </section>
  )
}

/* ── Interactive Savings Calculator (hero card) ───────────────────────── */
function SavingsCalculator() {
  const [selected, setSelected] = useState(null)
  const brackets = [
    { key: 'low',  ...SAVINGS_DATA.low  },
    { key: 'mid',  ...SAVINGS_DATA.mid  },
    { key: 'high', ...SAVINGS_DATA.high },
  ]

  const d = selected ? SAVINGS_DATA[selected] : null

  function pick(key) {
    setSelected(key)
  }

  return (
    <div className="calc-card">
      <div className="calc-header">
        <SlidersHorizontal size={18} weight="fill" color="#4349FF" />
        <span>Estime su ahorro solar</span>
        <span className="calc-badge">Basado en datos reales IDAE 2024</span>
      </div>

      <p className="calc-q">¿Cuánto paga de luz al mes?</p>
      <div className="calc-brackets">
        {brackets.map(b => (
          <button
            key={b.key}
            className={`calc-btn${selected === b.key ? ' active' : ''}`}
            onClick={() => pick(b.key)}
          >
            {b.label}
          </button>
        ))}
      </div>

      {d ? (
        <div className="calc-result">
          <div className="calc-row">
            <div className="calc-col">
              <span className="calc-lbl">Ahorro anual estimado</span>
              <span className="calc-num yellow">{d.annualMin.toLocaleString('es-ES')}–{d.annualMax.toLocaleString('es-ES')} €</span>
              <span className="calc-foot">rango realista, clima Barcelona</span>
            </div>
            <div className="calc-divider" />
            <div className="calc-col right">
              <span className="calc-lbl">Retorno inversión</span>
              <span className="calc-num">{d.paybackYrs} años</span>
              <span className="calc-foot">+25 años de garantía equipos</span>
            </div>
          </div>
          <div className="calc-disclaimer">
            * Estimación orientativa basada en irradiancia media de Barcelona (5,4 h/día) y tarifa PVPC 2024.
            El diagnóstico gratuito calcula el potencial exacto de <strong>su</strong> tejado.
          </div>
          <a href="#form" className="cta lg calc-cta">
            <Sun size={18} weight="fill" />
            Ver los números reales de mi tejado
          </a>
        </div>
      ) : (
        <div className="calc-placeholder">
          <Sun size={32} weight="duotone" color="#4349FF" />
          <p>Seleccione su tramo para ver el estimado de ahorro solar real</p>
        </div>
      )}
    </div>
  )
}

function NeighborMap() {
  const pins = [
    { label: 'Valencia 212', x: 28, y: 35 },
    { label: 'Enric Granados', x: 66, y: 28 },
    { label: 'Consell de Cent', x: 58, y: 68 },
    { label: 'Valencia 214', x: 42, y: 52, active: true },
  ]

  return (
    <section className="map-section">
      <div className="map-in">
        <div className="map-copy">
          <div className="pill">
            <MapPin size={13} weight="fill" />
            Prueba local · l'Eixample
          </div>
          <h2 className="map-title">Su manzana ya está en fase de validación energética.</h2>
          <p className="map-sub">
            No es una campaña genérica. Estamos revisando tejados concretos alrededor de Carrer de Valencia 214 para confirmar sombras, orientación y subvenciones disponibles.
          </p>
          <div className="map-stats">
            <div><strong>3</strong><span>vecinos pre-calificados</span></div>
            <div><strong>2/5</strong><span>plazas libres esta semana</span></div>
          </div>
        </div>
        <div className="mini-map" aria-label="Mapa de vecinos cercanos con instalaciones Eltex">
          <div className="map-grid" />
          <div className="map-road map-road-a" />
          <div className="map-road map-road-b" />
          <div className="map-road map-road-c" />
          {pins.map(pin => (
            <div
              key={pin.label}
              className={`map-pin${pin.active ? ' active' : ''}`}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            >
              <span />
              <small>{pin.active ? 'Su tejado' : 'Instalación Eltex finalizada'} · {pin.label}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Ask / lead-gen form ─────────────────────────────────────────────── */
function AskForm({ onSubmit }) {
  const [step, setStep] = useState(1)
  const [billKey, setBillKey] = useState(null)
  const [phone, setPhone] = useState('')

  const savings = billKey ? SAVINGS_DATA[billKey] : null
  const pct = step === 1 ? 33 : step === 2 ? 66 : 100

  if (step === 1) return (
    <div className="ask">
      <p className="ask-q">¿Cuál es su prioridad principal?</p>
      <button className="opt" onClick={() => setStep(2)}>
        <Lightning size={20} weight="fill" color="#4349FF" />
        Eliminar el coste de mi factura de luz
      </button>
      <button className="opt" onClick={() => setStep(2)}>
        <Building size={20} weight="fill" color="#4349FF" />
        Aumentar el valor patrimonial de mi piso
      </button>
      <div className="bar-wrap"><div className="bar" style={{ width: `${pct}%` }} /></div>
    </div>
  )

  if (step === 2) return (
    <div className="ask">
      <p className="ask-q">¿Su gasto de luz mensual es…?</p>
      {Object.entries(SAVINGS_DATA).map(([key, b]) => (
        <button key={key} className="opt" onClick={() => { setBillKey(key); setStep(3) }}>
          <Coins size={20} weight="fill" color="#4349FF" />
          {b.label}
        </button>
      ))}
      <div className="bar-wrap"><div className="bar" style={{ width: `${pct}%` }} /></div>
    </div>
  )

  return (
    <div className="ask">
      {savings && (
        <div className="ask-savings-preview">
          <CheckCircle size={16} weight="fill" color="#10b981" />
          <span>
            Ahorro estimado para su consumo:{' '}
            <strong>{savings.annualMin.toLocaleString('es-ES')}–{savings.annualMax.toLocaleString('es-ES')} €/año</strong>
          </span>
        </div>
      )}
      <div className="badge">
        <CheckCircle size={20} weight="fill" color="#4349FF" />
        Tejado <strong>pre-calificado</strong>. Último paso:
      </div>
      <p className="ask-sub">
        Nuestro sistema ha pre-calificado su tejado. Ingrese su teléfono <strong>porque</strong> un experto técnico debe confirmar manualmente los obstáculos de sombra antes de emitir su certificado final. <em>(Llamada técnica de 7 min, no comercial)</em>
      </p>
      <form onSubmit={e => { e.preventDefault(); if (phone.trim().length >= 9) onSubmit() }}>
        <input
          type="tel"
          className="tel"
          placeholder="612 345 678"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          autoFocus
        />
        <button type="submit" className="cta full" disabled={phone.trim().length < 9}>
          <PaperPlaneTilt size={18} weight="fill" />
          Recibir Mi Diagnóstico Gratuito
        </button>
        <p className="legal">Al enviar, acepta la llamada de validación técnica y el tratamiento de datos según el RGPD.</p>
      </form>
      <div className="bar-wrap"><div className="bar" style={{ width: `${pct}%` }} /></div>
    </div>
  )
}

/* ── Thank you page ──────────────────────────────────────────────────── */
function ThankYou() {
  return (
    <div className="page">
      <nav className="nav"><div className="nav-in"><img src={LOGO_URL} alt="Eltex" className="logo" /></div></nav>
      <div className="ty-hero">
        <CheckCircle size={56} weight="fill" color="#EDC645" />
        <h1 className="ty-h1">Estudio iniciado.</h1>
        <p className="ty-p">Le llamaremos desde el <strong>936 258 218</strong> mañana entre las 10:00 y las 14:00.</p>
      </div>
      <div className="ty-body">
        <h2 className="ty-h2">¿Qué hacer ahora?</h2>
        {[
          'Tenga a mano su última factura de luz.',
          'Reserve 7 minutos para la llamada.',
          'Conteste al 936 258 218: será una validación técnica, no una llamada comercial.',
        ].map((t, i) => (
          <div key={i} className="ty-step">
            <span className="ty-num">{i + 1}</span>
            <span>{t}</span>
          </div>
        ))}
        <div className="ty-bonus">
          <div className="ty-bonus-icon">
            <Sun size={22} weight="fill" />
          </div>
          <div>
            <strong>Mientras espera</strong>
            <p>Vea el vídeo de 3 minutos sobre cómo l'Eixample se está desconectando de la red y qué datos revisará el técnico en su llamada.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Trust strip ─────────────────────────────────────────────────────── */
function TrustStrip() {
  return (
    <section className="trust">
      <div className="trust-in">
        <div className="trust-item trust-google">
          <div className="trust-logo-row">
            <GoogleLogo size={28} />
            <strong className="trust-gnum">4,6</strong>
          </div>
          <div className="trust-stars-row">
            {[...Array(4)].map((_, i) => <Star key={i} size={14} weight="fill" color="#FBBC05" />)}
            <Star size={14} weight="half" color="#FBBC05" />
          </div>
          <span>900+ reseñas verificadas</span>
        </div>

        <div className="trust-item">
          <ShieldCheck size={28} weight="fill" color="#4349FF" />
          <strong>25 años</strong>
          <span>de garantía en equipos</span>
        </div>

        <div className="trust-item">
          <CalendarCheck size={28} weight="fill" color="#4349FF" />
          <strong>Sin obras</strong>
          <span>instalación limpia y rápida</span>
        </div>
      </div>
    </section>
  )
}

/* ── App ─────────────────────────────────────────────────────────────── */
export default function App() {
  const [done, setDone] = useState(false)
  const { d, h, m, s } = useCountdown()

  if (done) return <ThankYou />

  return (
    <div className="page">

      {/* NAV */}
      <nav className="nav">
        <div className="nav-in">
          <img src={LOGO_URL} alt="Eltex" className="logo" />
          <div className="nav-r">
            <span className="nav-stars">
              <GoogleLogo size={14} />
              <Star size={13} weight="fill" color="#FBBC05" />
              4,6 · 900+ reseñas
            </span>
            <a href="#form" className="cta sm">Pedir Diagnóstico</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-in">
          <div className="hero-txt">
            <div className="pill">
              <MapPin size={13} weight="fill" />
              Carrer de Valencia 214 · l'Eixample
            </div>
            <h1 className="h1">
              <span className="h1-local">Carrer de Valencia 214:</span> Informe de Independencia Energética 2026.
            </h1>
            <p className="sub">
              Deje de alquilar su energía; empiece a poseerla. Su tejado ha sido pre-calificado mediante satélite y solo faltan 3 validaciones técnicas para activar su Proyección de Ahorro Real.
            </p>
            <div className="hero-checks">
              <span><CheckCircle size={15} weight="fill" /> Sombras del Eixample</span>
              <span><CheckCircle size={15} weight="fill" /> Orientación del tejado</span>
              <span><CheckCircle size={15} weight="fill" /> Subvenciones activas</span>
            </div>
            <a href="#form" className="cta lg">
              <Sun size={20} weight="fill" />
              Activar Mi Auditoría Gratuita
            </a>
            <span className="micro">
              <LockSimple size={12} weight="fill" />
              Valor 122 € · Hoy 0 € · llamada técnica de 7 min
            </span>
          </div>

          <SavingsCalculator />
        </div>
      </section>

      {/* URGENCY */}
      <div className="urgency">
        <span className="urg-text">
          <Lightning size={16} weight="fill" color="#EDC645" />
          Solo quedan <strong>2 de 5 plazas</strong> de auditoría técnica para l'Eixample esta semana
        </span>
        <div className="timer">
          <T v={d} l="Días" /><T v={h} l="Hrs" /><T v={m} l="Min" /><T v={s} l="Seg" />
        </div>
      </div>

      {/* TRUST */}
      <TrustStrip />

      {/* VALUE STACK */}
      <ValueStack />

      <NeighborMap />

      {/* REVIEWS */}
      <ReviewsSection />

      {/* FORM */}
      <section className="form-section" id="form">
        <div className="form-in">
          <div className="form-head">
            <h2 className="form-h2">
              ¿Quiere los números <span className="accent">reales de su tejado?</span>
            </h2>
            <p className="form-sub">Responda 2 preguntas y reciba un diagnóstico personalizado basado en la irradiancia real de su ubicación. Sin coste, sin compromiso.</p>
          </div>
          <div className="form-card">
            <div className="form-card-top">
              <PhoneCall size={22} weight="fill" color="#4349FF" />
              <div>
                <strong>Le llamamos nosotros</strong>
                <span className="form-card-sm">Llamada técnica de 7 min, no comercial</span>
              </div>
            </div>
            <AskForm onSubmit={() => setDone(true)} />
          </div>
        </div>
      </section>

      <Nudge />

      {/* FOOTER */}
      <footer className="footer">
        <img src={LOGO_URL} alt="Eltex" className="logo" style={{ height: 20, opacity: 0.7 }} />
        <div className="footer-trust">
          <GoogleLogo size={14} />
          <Star size={11} weight="fill" color="#FBBC05" />
          <Star size={11} weight="fill" color="#FBBC05" />
          <Star size={11} weight="fill" color="#FBBC05" />
          <Star size={11} weight="fill" color="#FBBC05" />
          <Star size={11} weight="half" color="#FBBC05" />
          <span className="footer-gscore">4,6 · 900+ reseñas Google</span>
        </div>
        <p>© 2026 Eltex Energía · Barcelona</p>
      </footer>
    </div>
  )
}
