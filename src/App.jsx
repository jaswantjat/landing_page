import { useEffect, useState } from 'react'
import {
  Star, Lightning, MapPin, Sun, CheckCircle, LockSimple,
  PaperPlaneTilt, Coins, Building, PhoneCall, ShieldCheck,
  CalendarCheck, UserCircle, ArrowRight, SealCheck,
} from '@phosphor-icons/react'

const LOGO_URL = 'https://uploads.onecompiler.io/4454edy2w/4454ed8yh/Logo%20negative.png'
const TARGET = new Date('2026-05-13T23:59:59+02:00').getTime()

/* ── Real brand logos via official CDN / SVG inline ─────────────────────── */

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

/* Individual review card */
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

/* Video testimonial card */
function VideoCard({ videoId, name, saved, quote }) {
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
        <p className="vid-saved">{saved}</p>
        <p className="vid-quote">"{quote}"</p>
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
      text: 'Llevaba años pagando 180 € al mes de luz. Después de la instalación de Eltex pago 7 €. No me lo podía creer cuando vi la primera factura. El proceso fue transparente desde el primer día, sin sorpresas ni letra pequeña. El técnico llegó puntual, terminó en 6 horas y dejó todo limpio. 100% recomendable.',
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
      text: 'Empresa seria y muy profesional. Tardaron exactamente lo que dijeron, el equipo fue amable y dejaron el tejado perfectamente. Llevo 2 meses con las placas y ya veo el retorno. El acompañamiento post-instalación también es excelente, siempre responden rápido cualquier consulta.',
      avatar: { letter: 'M', bg: '#FBBC05' },
      highlight: 'Empresa seria, resultado excelente',
    },
    {
      name: 'Pau Ferrer',
      location: 'Les Corts, Barcelona',
      date: 'hace 1 semana',
      text: 'Me contactaron tras pedir el diagnóstico y en 2 días ya tenía fecha de instalación. El técnico fue muy didáctico, me explicó cómo funciona el sistema de compensación de excedentes y cómo leer la nueva factura. Ahorro entre 120 y 160 € cada mes. Inversión totalmente recuperada en menos de 5 años.',
      avatar: { letter: 'P', bg: '#4285F4' },
      highlight: 'Recupero la inversión en menos de 5 años',
    },
    {
      name: 'Rosa Torres',
      location: 'Horta-Guinardó, Barcelona',
      date: 'hace 2 meses',
      text: 'Pedí tres presupuestos distintos y Eltex fue la única empresa que vino a ver el tejado antes de dar cifras. Eso me generó mucha confianza. La instalación fue limpia, rápida y sin obra. Ahora invierto lo que ahorraba en la hipoteca. Mis hijos también se lo están planteando.',
      avatar: { letter: 'R', bg: '#34A853' },
      highlight: 'La única empresa que vino a ver el tejado primero',
    },
  ]

  const videos = [
    {
      videoId: 'q4P8JVUloww',
      name: 'Testimonio cliente Eltex',
      saved: 'Ahorro real verificado',
      quote: 'La mejor decisión que tomé para mi hogar',
    },
    {
      videoId: 'CTBCxUoVTxM',
      name: 'Testimonio cliente Eltex',
      saved: 'Instalación en 1 día',
      quote: 'Sin obras, sin complicaciones, sin sorpresas',
    },
  ]

  return (
    <section className="reviews-section">
      <div className="reviews-in">
        {/* Header */}
        <div className="reviews-header">
          <GoogleStars rating={4.6} count="900+" />
        </div>

        {/* Written reviews */}
        <div className="reviews-grid">
          {reviews.map((r, i) => <ReviewCard key={i} {...r} />)}
        </div>

        {/* Video testimonials */}
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

function Nudge() {
  const [show, setShow] = useState(false)
  useEffect(() => { const t = setTimeout(() => setShow(true), 3000); return () => clearTimeout(t) }, [])
  if (!show) return null
  return (
    <div className="nudge">
      <UserCircle size={24} weight="fill" color="#4349FF" />
      <span><strong>Marta</strong> de Carrer de Provença acaba de reservar su auditoría</span>
    </div>
  )
}

function AskForm({ onSubmit }) {
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState('')
  const next = () => setStep(s => s + 1)

  if (step === 1) return (
    <div className="ask">
      <p className="ask-q">¿Cuál es su prioridad?</p>
      <button className="opt" onClick={next}>
        <Lightning size={20} weight="fill" color="#4349FF" />
        Reducir mi factura mensual
      </button>
      <button className="opt" onClick={next}>
        <Building size={20} weight="fill" color="#4349FF" />
        Aumentar el valor de mi propiedad
      </button>
      <div className="bar-wrap"><div className="bar" style={{ width: '33%' }} /></div>
    </div>
  )

  if (step === 2) return (
    <div className="ask">
      <p className="ask-q">¿Cuánto paga de luz al mes?</p>
      {['Menos de 100 €', 'Entre 100 y 200 €', 'Más de 200 €'].map(o => (
        <button key={o} className="opt" onClick={next}>
          <Coins size={20} weight="fill" color="#4349FF" />
          {o}
        </button>
      ))}
      <div className="bar-wrap"><div className="bar" style={{ width: '66%' }} /></div>
    </div>
  )

  return (
    <div className="ask">
      <div className="badge">
        <CheckCircle size={20} weight="fill" color="#4349FF" />
        Su tejado está <strong>pre-calificado</strong>. Último paso:
      </div>
      <p className="ask-sub">
        Déjenos su teléfono. Un técnico le llama para validar su informe. No es comercial.
      </p>
      <form onSubmit={e => { e.preventDefault(); if (phone.trim().length >= 9) onSubmit() }}>
        <input
          type="tel"
          className="tel"
          placeholder="612 345 678"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
        />
        <button type="submit" className="cta full">
          <PaperPlaneTilt size={18} weight="fill" />
          Recibir Mi Diagnóstico Gratuito
        </button>
        <p className="legal">Al enviar, acepta la llamada técnica y el tratamiento de datos según la normativa vigente.</p>
      </form>
      <div className="bar-wrap"><div className="bar" style={{ width: '100%' }} /></div>
    </div>
  )
}

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
          'Revise su email: ya le enviamos un mini-curso gratuito.',
        ].map((t, i) => (
          <div key={i} className="ty-step">
            <span className="ty-num">{i + 1}</span>
            <span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Trust strip with real Google badge ─────────────────────────────────── */
function TrustStrip() {
  return (
    <section className="trust">
      <div className="trust-in">
        {/* Google */}
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

        {/* Garantía */}
        <div className="trust-item">
          <ShieldCheck size={28} weight="fill" color="#4349FF" />
          <strong>25 años</strong>
          <span>de garantía en equipos</span>
        </div>

        {/* Instalación */}
        <div className="trust-item">
          <CalendarCheck size={28} weight="fill" color="#4349FF" />
          <strong>1 día</strong>
          <span>instalación sin obras</span>
        </div>
      </div>
    </section>
  )
}

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
              Su tejado puede <span className="accent">eliminar su factura</span> de luz.
            </h1>
            <p className="sub">
              Estamos validando la eficiencia solar de su manzana. Descubra cuánto puede ahorrar con un diagnóstico técnico gratuito de 2 minutos.
            </p>
            <a href="#form" className="cta lg">
              <Sun size={20} weight="fill" />
              Quiero Mi Diagnóstico Solar 2026
            </a>
            <span className="micro">
              <LockSimple size={12} weight="fill" />
              Gratuito · Sin compromiso · 2 minutos
            </span>
          </div>

          <div className="hero-card">
            <div className="card-img">
              <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=700&q=80&auto=format&fit=crop" alt="" />
              <span className="tag tag-g"><CheckCircle size={12} weight="fill" /> Apto para solar</span>
              <span className="tag tag-y"><Lightning size={12} weight="fill" /> Vecino ya instalado</span>
            </div>
            <div className="card-savings">
              <div>
                <span className="sv-label">Ahorro anual estimado</span>
                <span className="sv-num">1.140 €</span>
              </div>
              <div className="sv-divider" />
              <div className="sv-right">
                <span className="sv-old">~95 €</span>
                <span className="sv-new">~8 €</span>
                <span className="sv-per">/ mes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* URGENCY */}
      <div className="urgency">
        <span className="urg-text">
          <Lightning size={16} weight="fill" color="#EDC645" />
          Solo <strong>2 plazas</strong> de auditoría esta semana
        </span>
        <div className="timer">
          <T v={d} l="Días" /><T v={h} l="Hrs" /><T v={m} l="Min" /><T v={s} l="Seg" />
        </div>
      </div>

      {/* TRUST */}
      <TrustStrip />

      {/* REVIEWS */}
      <ReviewsSection />

      {/* FORM */}
      <section className="form-section" id="form">
        <div className="form-in">
          <div className="form-head">
            <h2 className="form-h2">
              ¿Quiere los números <span className="accent">reales de su tejado?</span>
            </h2>
            <p className="form-sub">Responda 2 preguntas y reciba un diagnóstico personalizado. Sin coste, sin compromiso.</p>
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
