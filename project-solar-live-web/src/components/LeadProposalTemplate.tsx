'use client';

import { useState } from 'react';
import { BRAND_COPY, BRAND_THEME } from '@project-solar/shared-solar-core';
import { LeadCaptureForm } from './LeadCaptureForm';
import type { LeadTemplateVars } from '../lib/template-vars';
import { LOGO_DATA_URL } from '../lib/brand';

const LOGO_URL = LOGO_DATA_URL;

const SAVINGS_DATA = {
  low:  { label: 'Inferior a 100 €',  annualMin: 480,  annualMax: 650,  paybackYrs: '7–9' },
  mid:  { label: 'Entre 100 y 160 €', annualMin: 900,  annualMax: 1200, paybackYrs: '5–7' },
  high: { label: 'Superior a 160 €',  annualMin: 1600, annualMax: 2000, paybackYrs: '4–6' },
} as const;

type SavingsKey = keyof typeof SAVINGS_DATA;

/* ── SVG icon components ── */

function GoogleLogo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function StarFull({ size = 13 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FBBC05"/></svg>;
}

function StarHalf({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs><clipPath id="hs"><rect width="12" height="24"/></clipPath></defs>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#E8E8E4"/>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FBBC05" clipPath="url(#hs)"/>
    </svg>
  );
}

function RatingStars({ rating, size = 13 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <>
      {Array.from({ length: full }).map((_, i) => <StarFull key={i} size={size} />)}
      {half && <StarHalf size={size} />}
    </>
  );
}

/* ── Reviews section ── */
interface VideoTestimonialData {
  videoId: string;
  name: string;
  location: string;
  quote: string;
  result: string;
}

function VideoTestimonialCard({ videoId, name, location, quote, result }: VideoTestimonialData) {
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;

  return (
    <article className="testimonial-card">
      <div className="testimonial-media">
        <iframe
          className="testimonial-iframe"
          src={embedUrl}
          title={`Testimonio de ${name}`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <div className="testimonial-body">
        <h3 className="testimonial-name">{name}</h3>
        <p className="testimonial-location">{location}</p>
        <blockquote className="testimonial-quote">"{quote}"</blockquote>
        <div className="testimonial-result">{result}</div>
      </div>
    </article>
  );
}

function ReviewsSection() {
  const videos: VideoTestimonialData[] = [
    {
      videoId: 'q4P8JVUloww',
      name: 'Antonio',
      location: 'Barcelona',
      quote: 'Decidimos poner placas solares por un tema económico, evidentemente, y un tema ecológico.',
      result: 'Ahorro anual: 2.634 €',
    },
    {
      videoId: 'CTBCxUoVTxM',
      name: 'Manel',
      location: 'Barcelona',
      quote: 'Nosaltres de llum havíem arribat a pagar 200€ al mes. Ara mateix, l’última factura ha sigut de 6€.',
      result: 'Factura de 200€ a solo 6€/mes',
    },
  ];

  return (
    <section className="reviews-section">
      <div className="reviews-in">
        <div className="reviews-copy">
          <span className="reviews-kicker">Testimonios reales</span>
          <h2 className="reviews-title">Clientes que ya ahorran con eltex</h2>
          <p className="reviews-sub">
            Historias verificadas de vecinos que ya han instalado placas solares con nosotros.
          </p>
        </div>
        <div className="testimonial-grid">
          {videos.map((video) => (
            <VideoTestimonialCard key={video.videoId} {...video} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Value stack ── */
function ValueStack() {
  const items = [
    { icon: '💶', title: 'Cuánto podría ahorrar al mes y al año' },
    { icon: '🔋', title: 'Cuántos paneles encajan y qué producción esperar' },
    { icon: '📋', title: 'Ayudas activas y plazo real de amortización' },
  ];
  return (
    <section className="vstack-section">
      <div className="vstack-in">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div className="pill" style={{ marginBottom: 0 }}>
            Lo que se resuelve en la llamada
          </div>
          <h2 className="vstack-title">En 7 minutos sabrá si este tejado compensa o no</h2>
          <p className="vstack-sub">La llamada sirve para cerrar números y siguiente paso. Si no sale a cuenta, también se lo diremos.</p>
        </div>
        <div className="vstack-list">
          {items.map((item, i) => (
            <div key={i} className="vstack-item">
              <span className="vstack-icon">{item.icon}</span>
              <span className="vstack-label">{item.title}</span>
              <span className="vstack-val" style={{ color: '#059669', fontWeight: 700 }}>Gratis</span>
            </div>
          ))}
        </div>
        <a href="#form" className="cta lg vstack-cta">Quiero mi estimación real</a>
      </div>
    </section>
  );
}

function ScarcityNotice({ address, validUntil }: { address: string; validUntil: string }) {
  return (
    <div className="scarcity-card">
      <span className="scarcity-kicker">Ventana técnica reservada</span>
      <p className="scarcity-copy">
        Hemos reservado una ventana técnica para <strong>{address}</strong>. Si no la reclama antes del{' '}
        <strong>{validUntil}</strong>, archivaremos los datos satelitales y la plaza para dejar sitio a un vecino en lista de espera.
      </p>
    </div>
  );
}

/* ── Savings calculator ── */
function SavingsCalculator() {
  const [selected, setSelected] = useState<SavingsKey | null>(null);
  const d = selected ? SAVINGS_DATA[selected] : null;

  return (
    <div className="calc-card">
      <div className="calc-header">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/><line x1="4" y1="12" x2="20" y2="12"/><circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="18" r="2" fill="currentColor" stroke="none"/></svg>
        <span>Estime su ahorro solar</span>
        <span className="calc-badge">Basado en datos reales IDAE 2024</span>
      </div>
      <p className="calc-q">¿Cuánto paga de luz al mes?</p>
      <div className="calc-brackets">
        {(Object.entries(SAVINGS_DATA) as [SavingsKey, typeof SAVINGS_DATA[SavingsKey]][]).map(([key, b]) => (
          <button key={key} className={`calc-btn${selected === key ? ' active' : ''}`} onClick={() => setSelected(key)}>
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
          <a href="#form" className="cta lg calc-cta">☀️ Ver los números reales de mi tejado</a>
        </div>
      ) : (
        <div className="calc-placeholder">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" fill={BRAND_THEME.blue}/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={BRAND_THEME.blue} strokeWidth="2" strokeLinecap="round"/></svg>
          <p>Seleccione su tramo para ver el estimado de ahorro solar real</p>
        </div>
      )}
    </div>
  );
}

/* ── House scan card (CSS visualization, shown when no proposal image) ── */
function HouseScanCard({ address }: { address: string }) {
  return (
    <div className="house-scan">
      <div className="house-scan-top">
        <span className="scan-dot" />
        <span>Tejado detectado · {address}</span>
      </div>
      <div className="roof-visual">
        <div className="roof-block roof-main" />
        <div className="roof-block roof-side" />
        <div className="roof-panel panel-a" />
        <div className="roof-panel panel-b" />
        <div className="roof-panel panel-c" />
        <div className="scan-crosshair" />
        <div className="sun-path" />
      </div>
      <div className="house-scan-bottom">
        <div>
          <strong>Pre-calificado por satélite</strong>
          <span>3 validaciones técnicas pendientes</span>
        </div>
        <div className="scan-score">87%</div>
      </div>
    </div>
  );
}

/* ── Neighbor map ── */
function NeighborMap({ address, locationLabel }: { address: string; locationLabel: string }) {
  const hood = locationLabel || 'Barcelona';
  const pins = [
    { label: 'Zona próxima', x: 28, y: 35 },
    { label: 'Zona próxima', x: 66, y: 28 },
    { label: 'Zona próxima', x: 58, y: 68 },
    { label: address,          x: 42, y: 52, active: true },
  ];
  return (
    <section className="map-section">
      <div className="map-in">
        <div className="map-copy">
          <div className="pill">📍 Basado en su dirección · {hood}</div>
          <h2 className="map-title">Esta estimación parte de su tejado, no de una media genérica.</h2>
          <p className="map-sub">
            Tomamos {address} como punto de partida. En la llamada solo validamos sombras reales, espacio útil y ayudas activas antes de darle la cifra final.
          </p>
          <div className="map-stats">
            <div><strong>1</strong><span>tejado revisado: el suyo</span></div>
            <div><strong>3</strong><span>comprobaciones antes de cerrar números</span></div>
          </div>
        </div>
        <div className="mini-map" aria-label="Mapa de vecinos cercanos">
          <div className="map-grid" />
          <div className="map-road map-road-a" />
          <div className="map-road map-road-b" />
          <div className="map-road map-road-c" />
          {pins.map((pin, i) => (
            <div key={i} className={`map-pin${pin.active ? ' active' : ''}`} style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>
              <span />
              <small>{pin.active ? 'Su tejado' : 'Instalación Eltex finalizada'} · {pin.label}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Trust strip ── */
function TrustStrip() {
  return (
    <section className="trust">
      <div className="trust-in">
        <div className="trust-item trust-google">
          <div className="trust-logo-row">
            <GoogleLogo size={28} />
            <strong className="trust-gnum">4,6</strong>
          </div>
          <div className="trust-stars-row"><RatingStars rating={4.5} size={14} /></div>
          <span>{BRAND_COPY.googleReviewsVerified}</span>
        </div>
        <div className="trust-item">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill={BRAND_THEME.blue} opacity=".15" stroke={BRAND_THEME.blue} strokeWidth="1.5"/><path d="M9 22V12h6v10" stroke={BRAND_THEME.blue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <strong>{BRAND_COPY.installationsHeadline}</strong>
          <span>{BRAND_COPY.installationsFull.replace(`${BRAND_COPY.installationsHeadline} `, '')}</span>
        </div>
        <div className="trust-item">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={BRAND_THEME.blue} opacity=".15" stroke={BRAND_THEME.blue} strokeWidth="1.5"/><path d="M9 12l2 2 4-4" stroke={BRAND_THEME.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <strong>{BRAND_COPY.warrantyHeadline}</strong>
          <span>{BRAND_COPY.warrantyFull.replace(`${BRAND_COPY.warrantyHeadline} `, '')}</span>
        </div>
      </div>
    </section>
  );
}

/* ── Thank you full-page ── */
function ThankYouPage() {
  return (
    <div className="page">
      <nav className="nav"><div className="nav-in"><img src={LOGO_URL} alt="Eltex" className="logo" /></div></nav>
      <div className="ty-hero">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto', display: 'block' }}><circle cx="12" cy="12" r="11" fill="rgba(255,255,255,0.2)"/><path d="M7 12.5l3.5 3.5 6.5-7" stroke="#EDC645" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <h1 className="ty-h1">Estudio iniciado.</h1>
        <p className="ty-p">Le llamaremos desde el <strong>936 258 218</strong> mañana entre las 10:00 y las 14:00.</p>
      </div>
      <div className="ty-body">
        <h2 className="ty-h2">¿Qué hacer ahora?</h2>
        {[
          'Tenga a mano su última factura de luz.',
          'Reserve 7 minutos para la llamada.',
          'Conteste al 936 258 218: será una validación técnica, no comercial.',
        ].map((text, i) => (
          <div key={i} className="ty-step">
            <span className="ty-num">{i + 1}</span>
            <span>{text}</span>
          </div>
        ))}
        <div className="ty-bonus">
          <div className="ty-bonus-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" fill="#0A0A0A"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <div>
            <strong>Mientras espera</strong>
            <p>Vea el vídeo de 3 minutos sobre cómo los vecinos de Barcelona se están desconectando de la red y qué datos revisará el técnico en su llamada.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════ */

export interface LeadProposalTemplateProps {
  vars: LeadTemplateVars;
}

export function LeadProposalTemplate({ vars }: LeadProposalTemplateProps) {
  const [done, setDone] = useState(false);

  const address = vars.address_line_1 || vars.address_full;
  const hood = vars.location_label || 'Barcelona';
  const proposalImagePath = vars.proposal_image_url
    ? {
        src: `/api/image/${vars.lead_id}?w=640`,
        srcSet: [
          `/api/image/${vars.lead_id}?w=360 360w`,
          `/api/image/${vars.lead_id}?w=640 640w`,
          `/api/image/${vars.lead_id}?w=960 960w`
        ].join(', ')
      }
    : null;

  if (done) return <ThankYouPage />;

  return (
    <div className="page">

      {/* NAV */}
      <nav className="nav">
        <div className="nav-in">
          <img src={LOGO_URL} alt="Eltex" className="logo" />
          <div className="nav-r">
            <span className="nav-stars">
              <GoogleLogo size={14} />
              <StarFull size={13} />
              {BRAND_COPY.googleReviewsBadge}
            </span>
            <a href="#form" className="cta sm">Ver mi ahorro</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-in">
          {/* Proposal image or CSS fallback */}
          {vars.proposal_image_url ? (
            <div className="proposal-img-wrap">
              <img
                src={proposalImagePath?.src}
                srcSet={proposalImagePath?.srcSet}
                sizes="(min-width: 1024px) 520px, (min-width: 640px) calc(100vw - 64px), calc(100vw - 32px)"
                width={960}
                height={960}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                alt={`Tejado de ${address}`}
              />
              <div className="proposal-img-label">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', flexShrink: 0, display: 'inline-block' }} />
                Tejado pre-calificado · {address}
              </div>
            </div>
          ) : (
            <HouseScanCard address={address} />
          )}

          <div className="hero-txt">
            <div className="pill">☀️ Revisión solar para su tejado · {hood}</div>
            <h1 className="h1">
              <span className="h1-local">{address}</span>Vea si este tejado puede bajar su factura de verdad.
            </h1>
            {vars.projected_monthly_bill >= 0 && (
              <div className="hero-bill-compare">
                <span className="hbc-label">Estimación inicial para su tejado</span>
                <div className="hbc-row">
                  <div className="hbc-before">
                    <span className="hbc-val">€{Math.round(vars.current_monthly_bill)}</span>
                    <span className="hbc-unit">factura actual</span>
                  </div>
                  <span className="hbc-arrow">→</span>
                  <div className="hbc-after">
                    <span className="hbc-val hbc-green">€{Math.round(vars.projected_monthly_bill)}</span>
                    <span className="hbc-unit">si compensa solar</span>
                  </div>
                </div>
                {vars.annual_savings_eur > 0 && (
                  <span className="hbc-sub">
                    Referencia inicial: {Math.round(vars.annual_savings_eur).toLocaleString('es-ES')} €/año · {vars.panels_recommended} paneles
                  </span>
                )}
              </div>
            )}
            <p className="sub">
              Ya hemos hecho una revisión inicial por satélite. En una llamada técnica de 7 minutos confirmamos sombras, orientación y ayudas activas, y le decimos si merece la pena o no.
            </p>
            <div className="hero-checks">
              <span>🔍 Confirmamos sombras reales y espacio útil</span>
              <span>🔍 Calculamos producción y paneles recomendados</span>
              <span>🔍 Revisamos ayudas activas en {hood}</span>
            </div>
            <a href="#form" className="cta lg">Quiero mis números reales</a>
            <span className="micro">🔒 1 llamada · 7 min · sin compromiso</span>
            <a href="tel:+34936258218" className="hero-phone">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>
              Prefiero llamar: 936 258 218
            </a>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <TrustStrip />

      {/* VALUE STACK */}
      <ValueStack />

      {/* NEIGHBOR MAP */}
      <NeighborMap address={address} locationLabel={hood} />

      {/* REVIEWS */}
      <ReviewsSection />

      {/* FORM */}
      <section className="form-section" id="form">
        <div className="form-in">
          <div className="form-head">
            <ScarcityNotice address={address} validUntil={vars.valid_until} />
            <h2 className="form-h2">
              ¿Quiere la cifra <span className="accent">real de su tejado?</span>
            </h2>
            <p className="form-sub">
              Déjenos su teléfono. Le llamamos nosotros, validamos los 3 puntos clave y le decimos si compensa o no. Sin coste y sin compromiso.
            </p>
          </div>
          <LeadCaptureForm id={vars.lead_id} address={address} onSuccess={() => setDone(true)} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <img src={LOGO_URL} alt="Eltex" className="logo" style={{ height: 20, opacity: 0.7 }} />
        <div className="footer-trust">
          <GoogleLogo size={14} />
          <RatingStars rating={4.5} size={11} />
          <span className="footer-gscore">{BRAND_COPY.googleReviewsFull}</span>
        </div>
        <p>© 2026 Eltex Energía · Barcelona</p>
      </footer>
    </div>
  );
}
