import { useEffect, useState } from 'react'
import {
  Star, Lightning, MapPin, Sun, Buildings, CurrencyEur, ChartLineUp,
  Wrench, HouseLine, ShieldCheck, FileText, CalendarCheck, PhoneCall,
  CheckCircle, LockSimple, UserCircle, Coins, Building, PaperPlaneTilt,
  ClockCountdown, UserCircleGear, Files, StarFour, MapTrifold, Gift,
  PlayCircle, ChartBar, House,
} from '@phosphor-icons/react'

const LOGO_URL = 'https://uploads.onecompiler.io/4454edy2w/4454ed8yh/Logo%20negative.png'
const TARGET   = new Date('2026-05-13T23:59:59+02:00').getTime()

function useCountdown() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  const diff = Math.max(TARGET - now, 0)
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

// ── Dot grid ────────────────────────────────────────────────
function DotGrid({ color = '#4349FF', opacity = 0.15 }) {
  const id = `dots-${color.replace('#', '')}`
  return (
    <svg className="dot-grid" aria-hidden="true" style={{ opacity }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={id} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

// ── Timer unit ───────────────────────────────────────────────
function TimerUnit({ val, label }) {
  return (
    <div className="timer-unit">
      <span className="timer-val">{String(val).padStart(2, '0')}</span>
      <span className="timer-lbl">{label}</span>
    </div>
  )
}

// ── Nudge ────────────────────────────────────────────────────
function Nudge({ name, street, action }) {
  const [vis, setVis] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVis(true), 3200); return () => clearTimeout(t) }, [])
  if (!vis) return null
  return (
    <div className="nudge">
      <UserCircle size={28} weight="fill" color="#4349FF" />
      <span><strong>{name}</strong> de {street} {action}</span>
    </div>
  )
}

// ── 3-step ask form ─────────────────────────────────────────
function AskForm({ onSubmit }) {
  const [step, setStep]   = useState(1)
  const [phone, setPhone] = useState('')
  const next = () => setStep(s => s + 1)

  if (step === 1) return (
    <div className="ask-step">
      <p className="ask-q">¿Cuál es su prioridad principal ahora?</p>
      <div className="ask-options">
        <button className="ask-opt" onClick={next}>
          <Lightning size={22} weight="fill" color="#4349FF" />
          Reducir mi factura mensual
        </button>
        <button className="ask-opt" onClick={next}>
          <Building size={22} weight="fill" color="#4349FF" />
          Aumentar el valor de mi propiedad
        </button>
      </div>
      <div className="ask-progress"><div className="ask-bar" style={{ width: '33%' }} /></div>
    </div>
  )

  if (step === 2) return (
    <div className="ask-step">
      <p className="ask-q">¿Cuál es su gasto de luz promedio mensual?</p>
      <div className="ask-options">
        {['Menos de 100 €', 'Entre 100 y 200 €', 'Más de 200 €'].map(opt => (
          <button key={opt} className="ask-opt" onClick={next}>
            <Coins size={22} weight="fill" color="#4349FF" />
            {opt}
          </button>
        ))}
      </div>
      <div className="ask-progress"><div className="ask-bar" style={{ width: '66%' }} /></div>
    </div>
  )

  return (
    <div className="ask-step">
      <div className="qualified-badge">
        <CheckCircle size={22} weight="fill" color="#4349FF" />
        <span>Su tejado ha sido <strong>pre-calificado</strong>. Solo falta un paso.</span>
      </div>
      <p className="ask-q ask-q--sm">
        Ingrese su teléfono para que un técnico valide los últimos 3 puntos de su Informe 2026.
        Es una llamada de validación técnica, no comercial.
      </p>
      <form onSubmit={e => { e.preventDefault(); if (phone.trim().length >= 9) onSubmit() }}>
        <input
          type="tel"
          className="phone-input"
          placeholder="612 345 678"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
        />
        <button type="submit" className="cta-btn cta-btn--full">
          <PaperPlaneTilt size={18} weight="fill" />
          Finalizar y Recibir Mi Diagnóstico
        </button>
        <p className="legal-copy">
          Al enviar, acepta la llamada de validación técnica y el tratamiento de datos según la normativa vigente.
        </p>
      </form>
      <div className="ask-progress"><div className="ask-bar" style={{ width: '100%' }} /></div>
    </div>
  )
}

// ── Thank-you ────────────────────────────────────────────────
function ThankYou() {
  return (
    <div className="page ty-page">
      <nav className="navbar">
        <div className="nav-inner">
          <img src={LOGO_URL} alt="Eltex" className="nav-logo" />
        </div>
      </nav>
      <main>
        <div className="ty-hero">
          <DotGrid color="#ffffff" opacity={0.12} />
          <div className="ty-hero-content">
            <div className="ty-icon"><CheckCircle size={64} weight="fill" color="#EDC645" /></div>
            <h1 className="ty-h1">Estudio iniciado.</h1>
            <p className="ty-sub">
              Un Experto Energético le llamará desde el <strong>936 258 218</strong> mañana entre las 10:00 y las 14:00 para completar su diagnóstico.
            </p>
          </div>
        </div>

        <div className="ty-body">
          <div>
            <h2 className="section-title-dark">¿Qué hacer ahora?</h2>
            <div className="ty-steps">
              {[
                'Tenga a mano su última factura de luz para validar el escenario de consumo.',
                'Reserve 7 minutos para la llamada técnica.',
                'Revise su email: ya le enviamos el acceso al mini-curso gratuito.',
              ].map((text, i) => (
                <div key={i} className="step-pill">
                  <span className="step-num">{i + 1}</span>
                  <span className="step-text">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bonus-badge">
              <Gift size={16} weight="fill" color="#EDC645" />
              <span>Bonus gratuito incluido</span>
            </div>
            <h2 className="bonus-title">Mini-curso gratuito en 3 vídeos</h2>
            <div className="video-cards">
              {[
                'Errores comunes antes de instalar solar en fincas urbanas.',
                'Cómo leer su factura para detectar coste oculto.',
                'Cómo aprovechar subvenciones sin perder plazos.',
              ].map((title, i) => (
                <div key={i} className="video-card">
                  <div className="video-num">{i + 1}</div>
                  <p className="video-title">{title}</p>
                  <PlayCircle size={24} weight="fill" color="#EDC645" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// ══ MAIN LANDING ══════════════════════════════════════════════
export default function App() {
  const [submitted, setSubmitted] = useState(false)
  const { days, hours, minutes, seconds } = useCountdown()

  if (submitted) return <ThankYou />

  return (
    <div className="page">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-inner">
          <img src={LOGO_URL} alt="Eltex" className="nav-logo" />
          <div className="nav-right">
            <span className="nav-trust">
              <Star size={14} weight="fill" color="#EDC645" />
              4,6 · 900+ reseñas
            </span>
            <a href="#form" className="cta-btn cta-btn--sm">Quiero mi Diagnóstico</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section">
        <DotGrid color="#4349FF" opacity={0.1} />
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <MapPin size={14} weight="fill" />
              Carrer de Valencia 214 · l'Eixample, Barcelona
            </div>
            <h1 className="hero-h1">
              Reclaim your<br />
              <span className="hero-h1-accent">energy back.</span>
            </h1>
            <p className="hero-sub">
              Cómo independizar su hogar de las subidas eléctricas sin cambiar su estilo de vida. Hacemos este mapeo porque estamos validando la eficiencia técnica de su manzana tras una instalación cercana.
            </p>
            <div className="hero-ctas">
              <a href="#form" className="cta-btn cta-btn--lg">
                <Sun size={20} weight="fill" />
                Quiero mi Diagnóstico Solar 2026
              </a>
              <span className="hero-microcopy">
                <LockSimple size={13} weight="fill" />
                Gratuito · Sin compromiso · 2 minutos
              </span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="map-card">
              <div className="map-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=700&q=80&auto=format&fit=crop"
                  alt="Tejado Carrer de Valencia 214"
                  className="map-img"
                />
                <div className="map-overlay" />
                <div className="map-badge map-badge--green">
                  <CheckCircle size={13} weight="fill" />
                  Tu tejado: Apto para solar ✓
                </div>
                <div className="map-badge map-badge--yellow map-badge--bottom">
                  <Lightning size={13} weight="fill" />
                  Vecino ya instalado ✓
                </div>
              </div>
              <div className="savings-chip">
                <div className="savings-left">
                  <span className="savings-label">Tu ahorro anual estimado</span>
                  <span className="savings-num">1.140 €</span>
                  <span className="savings-note">28.500 € en 25 años</span>
                </div>
                <div className="savings-divider" />
                <div className="savings-right">
                  <div className="savings-row">
                    <span className="savings-before">~95 €</span>
                    <span className="savings-after">~8 €</span>
                  </div>
                  <span className="savings-per">/ mes · factura de luz</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* URGENCY STRIP */}
      <div className="urgency-strip">
        <Lightning size={20} weight="fill" color="#EDC645" />
        <span className="urgency-text">Solo quedan <strong>2 de 5 plazas</strong> de auditoría técnica para l'Eixample esta semana.</span>
        <div className="timer">
          <TimerUnit val={days} label="Días" />
          <TimerUnit val={hours} label="Hrs" />
          <TimerUnit val={minutes} label="Min" />
          <TimerUnit val={seconds} label="Seg" />
        </div>
        <span className="urgency-deadline">Válida hasta el 13 de mayo</span>
      </div>

      {/* VALUE STACK */}
      <section className="value-section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-eyebrow">
              <FileText size={13} weight="fill" />
              Lo que recibe hoy
            </div>
            <h2 className="section-h2">
              Reciba su diagnóstico técnico personalizado<br />
              <span className="text-blue">para Carrer de Valencia 214</span>
            </h2>
            <p className="section-sub">
              No es una llamada comercial. Es un informe técnico para entender el potencial real de su tejado.
            </p>
          </div>

          <div className="value-cards">
            {[
              { Icon: Sun,          title: 'Mapeo de Incidencia Solar',   desc: 'Análisis satelital de orientación y superficie útil de su tejado específico.', col: '#EDC645', bg: 'rgba(237,198,69,.12)' },
              { Icon: Buildings,    title: 'Análisis de Sombras',          desc: 'Detección de bloqueos por edificios cercanos del Eixample que afectan su producción.', col: '#4349FF', bg: 'rgba(67,73,255,.1)' },
              { Icon: CurrencyEur,  title: 'Roadmap de Subvenciones',      desc: 'Ayudas activas disponibles para su zona este mes, con plazos y requisitos.', col: '#EDC645', bg: 'rgba(237,198,69,.12)' },
              { Icon: ChartLineUp,  title: 'Informe de Coste Oculto',      desc: 'Estimación de energía "alquilada" en los próximos 10 años si no actúa ahora.', col: '#4349FF', bg: 'rgba(67,73,255,.1)' },
            ].map(({ Icon, title, desc, col, bg }, i) => (
              <div key={i} className="value-card">
                <div className="value-icon" style={{ background: bg }}>
                  <Icon size={24} weight="fill" color={col} />
                </div>
                <h3 className="value-title">{title}</h3>
                <p className="value-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DETAILS */}
      <section className="details-section">
        <div className="section-inner details-inner">
          <div className="details-copy">
            <div className="section-eyebrow section-eyebrow--white">
              <Wrench size={13} weight="fill" />
              Tu instalación con Eltex
            </div>
            <h2 className="section-h2 section-h2--white">
              Sin obras, sin complicaciones,<br />con garantía de 25 años.
            </h2>
            <p className="section-sub section-sub--white">
              Un equipo técnico local se encarga de todo: permisos, subvenciones, instalación y seguimiento.
            </p>
            <a href="#form" className="cta-btn cta-btn--yellow cta-btn--lg" style={{ marginTop: 36, display: 'inline-flex' }}>
              <CalendarCheck size={20} weight="fill" />
              Reservar Auditoría Técnica Gratuita
            </a>
          </div>

          <div className="details-table-wrap">
            {[
              { Icon: House,           label: 'Tu tejado',             value: 'Apto para solar ✓', accent: true },
              { Icon: ClockCountdown,  label: 'Retorno estimado',      value: '~5 años',            accent: true },
              { Icon: Wrench,          label: 'Instalación',           value: 'En 1 día, sin obras' },
              { Icon: UserCircleGear,  label: 'Tu gestor personal',    value: 'De inicio a fin' },
              { Icon: Files,           label: 'Permisos y subvenciones',value: 'Nos encargamos de todo' },
              { Icon: ShieldCheck,     label: 'Garantía',              value: '25 años' },
            ].map(({ Icon, label, value, accent }, i) => (
              <div key={i} className="detail-row">
                <div className="detail-left">
                  <Icon size={18} weight="fill" className="detail-icon-el" color="rgba(255,255,255,0.35)" />
                  <span className="detail-label">{label}</span>
                </div>
                <span className={`detail-value${accent ? ' detail-value--accent' : ''}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="proof-section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-eyebrow">
              <MapTrifold size={13} weight="fill" />
              Prueba social hiperlocal
            </div>
            <h2 className="section-h2">
              Miles de propietarios de Barcelona<br />
              <span className="text-blue">ya han iniciado su transición solar</span>
            </h2>
          </div>

          <div className="proof-cards">
            {[
              { Icon: StarFour, col: '#EDC645', num: '4,6',    lbl: 'en Google',        sub: '900+ reseñas verificadas' },
              { Icon: HouseLine, col: '#4349FF', num: '3.500+', lbl: 'instalaciones',    sub: 'en la provincia de Barcelona' },
              { Icon: ShieldCheck, col: '#EDC645', num: '30',   lbl: 'años de garantía', sub: 'en equipos y mano de obra' },
              { Icon: MapPin, col: '#4349FF', num: 'Local',     lbl: 'empresa Barcelona', sub: 'equipo técnico en l\'Eixample' },
            ].map(({ Icon, col, num, lbl, sub }, i) => (
              <div key={i} className="proof-stat">
                <Icon size={32} weight="fill" color={col} style={{ display: 'block', marginBottom: 12 }} />
                <div className="proof-stat-num">{num}</div>
                <div className="proof-stat-label">{lbl}</div>
                <div className="proof-stat-sub">{sub}</div>
              </div>
            ))}
          </div>

          <div className="photo-strip">
            <div className="photo-strip-img photo-strip-img--wide">
              <img
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80&auto=format&fit=crop"
                alt="Hogar eficiente"
              />
            </div>
            <div className="photo-strip-img">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format&fit=crop"
                alt="Instalación solar"
              />
            </div>
            <div className="photo-strip-img">
              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&q=80&auto=format&fit=crop"
                alt="Familia con energía solar"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="form-section" id="form">
        <DotGrid color="#4349FF" opacity={0.09} />
        <div className="section-inner form-inner">
          <div className="form-copy">
            <div className="section-eyebrow">
              <ChartBar size={13} weight="fill" />
              Diagnóstico gratuito
            </div>
            <h2 className="section-h2">
              ¿Quiere los números<br />
              <span className="text-blue">exactos de su tejado?</span>
            </h2>
            <p className="section-sub">
              Esto es una estimación. Podemos darle los datos reales de su tejado en una llamada técnica de 7 minutos.
            </p>
            <div className="form-trust">
              {['No es una visita comercial', 'Datos reales de su tejado', 'Sin compromiso de compra'].map(t => (
                <div key={t} className="form-trust-item">
                  <CheckCircle size={18} weight="fill" color="#4349FF" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-card">
            <div className="form-card-header">
              <PhoneCall size={24} weight="fill" color="#4349FF" />
              <div>
                <div className="form-card-title">Te llamamos nosotros</div>
                <div className="form-card-sub">Déjenos su número y le contactamos cuando prefiera</div>
              </div>
            </div>
            <AskForm onSubmit={() => setSubmitted(true)} />
          </div>
        </div>
        <Nudge name="Marta" street="Carrer de Provença" action="acaba de reservar su Auditoría" />
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <img src={LOGO_URL} alt="Eltex" className="footer-logo" />
          <p className="footer-copy">© 2026 Eltex Energía · Empresa local · Barcelona · l'Eixample</p>
          <p className="footer-legal">Reclaim your energy back.</p>
        </div>
      </footer>
    </div>
  )
}
