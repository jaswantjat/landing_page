import { useEffect, useMemo, useState } from 'react'

const notifications = [
  'Marta de Carrer de Provenca acaba de reservar su Auditoria.',
  'Jordi de Diputacio acaba de solicitar su Informe 2026.',
  'Laura de Consell de Cent acaba de activar su Diagnostico Solar.',
]

const reviews = [
  { name: 'A. Ribes', text: 'Proceso claro y tecnico. Sin presion comercial.' },
  { name: 'M. Bosch', text: 'La auditoria detecto sombras que nadie nos habia explicado.' },
  { name: 'C. Vidal', text: 'Nos guiaron con subvenciones del barrio paso a paso.' },
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

function App() {
  const [step, setStep] = useState(1)
  const [priority, setPriority] = useState('')
  const [billRange, setBillRange] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [now, setNow] = useState(Date.now())
  const [notificationIndex, setNotificationIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setNotificationIndex((prev) => (prev + 1) % notifications.length)
    }, 5500)
    return () => clearInterval(interval)
  }, [])

  const timeLeft = useMemo(() => formatTime(TARGET_DATE - now), [now])

  const handleStepOne = (value) => {
    setPriority(value)
    setStep(2)
  }

  const handleStepTwo = (value) => {
    setBillRange(value)
    setStep(3)
  }

  const canSubmit = phone.trim().length >= 9

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!priority || !billRange || !canSubmit) {
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="page thankyou">
        <section className="card strong">
          <p className="eyebrow">Diagnostico 2026</p>
          <h1>Estudio iniciado.</h1>
          <p>
            Un Experto Energetico le llamara desde el <strong>936 258 218</strong> manana entre las
            10:00 y las 14:00 para completar su diagnostico.
          </p>
          <ol>
            <li>Tenga a mano su ultima factura de luz.</li>
            <li>Reserve 7 minutos para la llamada tecnica.</li>
            <li>Revise su email para acceder al mini-curso gratuito.</li>
          </ol>
        </section>

        <section className="card">
          <h2>Mini-curso gratuito en 3 videos</h2>
          <ul>
            <li>Errores comunes antes de instalar solar en fincas urbanas.</li>
            <li>Como leer su factura para detectar coste oculto.</li>
            <li>Como aprovechar subvenciones sin perder plazos.</li>
          </ul>
        </section>
      </main>
    )
  }

  return (
    <main className="page">
      <header className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">Carrer de Valencia 214 | l'Eixample</p>
          <h1>Como independizar su hogar de las subidas electricas sin cambiar su estilo de vida.</h1>
          <p className="lead">
            Hacemos este mapeo porque estamos validando la eficiencia tecnica de su manzana tras una
            instalacion cercana.
          </p>
          <a href="#diagnostico" className="cta-btn">
            Quiero mi Diagnostico Solar 2026
          </a>
          <p className="note">Gratuito. Sin compromiso. Validacion tecnica en menos de 2 minutos.</p>
        </div>
      </header>

      <aside className="toast" aria-live="polite">
        {notifications[notificationIndex]}
      </aside>

      <section className="scarcity">
        <p>
          Solo quedan <strong>2 de 5 plazas</strong> de auditoria tecnica para l'Eixample esta semana.
        </p>
        <div className="timer" role="timer" aria-label="Tiempo restante de oferta">
          <div><span>{timeLeft.days}</span><small>Dias</small></div>
          <div><span>{timeLeft.hours}</span><small>Horas</small></div>
          <div><span>{timeLeft.minutes}</span><small>Min</small></div>
          <div><span>{timeLeft.seconds}</span><small>Seg</small></div>
        </div>
        <p className="deadline">Valida hasta el 13 de mayo</p>
      </section>

      <section id="diagnostico" className="card">
        <h2>Roadmap de Eficiencia Solar 2026</h2>
        <p>
          No es una llamada comercial. Es un informe tecnico para entender el potencial real de su
          tejado y su ahorro proyectado.
        </p>
        <ul className="stack">
          <li>Mapeo de Incidencia Solar por analisis satelital.</li>
          <li>Analisis de Sombras por edificios cercanos del Eixample.</li>
          <li>Roadmap de Subvenciones Locales activas este mes.</li>
          <li>Informe de Coste Oculto de energia alquilada a 10 anos.</li>
        </ul>
      </section>

      <section className="card dark">
        <h2>3.000+ propietarios en Barcelona ya iniciaron su transicion</h2>
        <p className="badges">4,6 Google (900+ resenas) | Garantia 30 anos</p>
        <div className="map-grid" aria-label="Mapa de instalaciones en l'Eixample">
          {Array.from({ length: 18 }).map((_, index) => (
            <span key={index} className={`pin pin-${index % 4}`} />
          ))}
        </div>
        <div className="reviews">
          {reviews.map((review) => (
            <article key={review.name}>
              <strong>{review.name}</strong>
              <p>{review.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Reserve su Auditoria Tecnica Gratuita</h2>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="step-block">
              <p className="step">Paso 1 de 3</p>
              <h3>Cual es su prioridad principal ahora?</h3>
              <button type="button" onClick={() => handleStepOne('factura')} className="option-btn">
                Reducir mi factura mensual
              </button>
              <button type="button" onClick={() => handleStepOne('patrimonio')} className="option-btn">
                Aumentar el valor patrimonial de mi propiedad
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="step-block">
              <p className="step">Paso 2 de 3</p>
              <h3>Cual es su gasto de luz promedio mensual?</h3>
              <button type="button" onClick={() => handleStepTwo('<100')} className="option-btn">
                Menos de 100 EUR
              </button>
              <button type="button" onClick={() => handleStepTwo('100-200')} className="option-btn">
                Entre 100 y 200 EUR
              </button>
              <button type="button" onClick={() => handleStepTwo('>200')} className="option-btn">
                Mas de 200 EUR
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="step-block">
              <p className="step">Paso 3 de 3</p>
              <h3>Su tejado ha sido pre-calificado.</h3>
              <p>
                Ingrese su telefono para que un tecnico valide los ultimos 3 puntos de su Informe
                2026. Es una llamada de validacion tecnica, no comercial.
              </p>
              <label htmlFor="telefono">Telefono</label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                placeholder="Ej: 612 345 678"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
              <button type="submit" className="cta-btn" disabled={!canSubmit}>
                Finalizar y Recibir Mi Diagnostico
              </button>
              <small>
                Al enviar, acepta la llamada de validacion tecnica y el tratamiento de datos segun la
                normativa vigente.
              </small>
            </div>
          )}
        </form>
      </section>

      <footer className="footer">
        <p>Solicitud de auditoria tecnica solar para Carrer de Valencia 214.</p>
      </footer>
    </main>
  )
}

export default App
