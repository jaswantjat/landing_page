'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

const PRIORITY_OPTIONS = [
  { key: 'ahorro', label: 'Cuánto podría ahorrar al mes' },
  { key: 'viabilidad', label: 'Si la instalación compensa en mi vivienda' },
];

export function LeadCaptureForm({ id, address = '', onSuccess }: { id: string; address?: string; onSuccess?: () => void }) {
  const [step, setStep]               = useState<1 | 2>(1);
  const [priority, setPriority]       = useState<string | null>(null);
  const [name, setName]               = useState('');
  const [phone, setPhone]             = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState('');
  const [done, setDone]               = useState(false);

  const progress = step === 1 ? 50 : 100;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (phone.trim().length < 9) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          lead_name:       name.trim() || undefined,
          lead_phone:      phone.trim(),
          priority_choice: priority,
        }),
      });
      if (!res.ok) throw new Error('capture failed');
      setDone(true);
      onSuccess?.();
    } catch {
      setError('No hemos podido guardar sus datos. Inténtelo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) return <ThankYouPanel address={address} />;

  return (
    <div style={cardStyle}>
      {/* card header */}
      <div style={cardTopStyle}>
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.6 3.6a1 1 0 0 1-.25 1L6.6 10.8z" fill="#4349FF"/>
        </svg>
        <div>
          <strong style={{ fontSize: 14, color: '#fff' }}>Le llamamos nosotros</strong>
          <span style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
            Llamada técnica de 7 min, no comercial
          </span>
        </div>
      </div>

      {/* steps */}
      <div style={{ padding: 20 }}>
        {step === 1 && (
          <>
            <p style={questionStyle}>¿Qué quiere resolver primero?</p>
            {PRIORITY_OPTIONS.map(opt => (
              <button
                key={opt.key}
                style={optionStyle}
                onClick={() => { setPriority(opt.key); setStep(2); }}
              >
                <LightningIcon />
                {opt.label}
              </button>
            ))}
          </>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <div style={badgeStyle}>
              <CheckBadgeIcon />
              Tejado <strong>pre-revisado</strong>. En la llamada cerramos los números finales.
            </div>
            <input
              type="text"
              style={inputStyle}
              placeholder="Nombre (opcional)"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
            <input
              type="tel"
              style={{ ...inputStyle, marginTop: 10 }}
              placeholder="612 345 678"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
            <button type="submit" style={ctaStyle} disabled={submitting || phone.trim().length < 9}>
              {submitting ? 'Enviando…' : 'Quiero mi estimación real'}
            </button>
            {error && <p style={{ color: '#ef4444', fontSize: 13, marginTop: 8 }}>{error}</p>}
            <p style={legalStyle}>
              Al enviar, acepta la llamada de validación técnica y el tratamiento de datos según el RGPD.
            </p>
          </form>
        )}

        <ProgressBar value={progress} />
      </div>
    </div>
  );
}

function ThankYouPanel({ address }: { address: string }) {
  return (
    <div style={{ borderRadius: 22, overflow: 'hidden', border: '1px solid #E8E8E4' }}>
      <div style={{ background: '#4349FF', padding: '40px 24px', textAlign: 'center' }}>
        {address && (
          <p style={{ margin: '0 0 16px', fontSize: 13, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {address}
          </p>
        )}
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto' }}>
          <circle cx="12" cy="12" r="11" fill="rgba(255,255,255,0.15)" />
          <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h2 style={{ margin: '14px 0 8px', fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
          Estudio iniciado.
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, maxWidth: 380, margin: '0 auto' }}>
          Le llamaremos desde el <strong style={{ color: '#fff' }}>936 258 218</strong> mañana entre las 10:00 y las 14:00.
        </p>
      </div>
      <div style={{ padding: '24px 20px', background: '#fff' }}>
        <p style={{ fontWeight: 800, fontSize: 16, marginBottom: 14, marginTop: 0 }}>¿Qué hacer ahora?</p>
        {[
          'Tenga a mano su última factura de luz.',
          'Reserve 7 minutos para la llamada.',
          'Conteste al 936 258 218: será una validación técnica, no comercial.',
        ].map((text, i) => (
          <div key={i} style={tyStepStyle}>
            <span style={tyNumStyle}>{i + 1}</span>
            <span style={{ fontSize: 14, lineHeight: 1.5 }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div style={{ height: 4, background: '#E8E8E4', borderRadius: 2, marginTop: 18, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${value}%`, background: '#4349FF', borderRadius: 2, transition: 'width 0.4s ease' }} />
    </div>
  );
}

function LightningIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path d="M13 2L4.09 12.96A1 1 0 0 0 5 14.5h5.5l-1 7.5L20 11.04A1 1 0 0 0 19 9.5h-5.5L13 2z" fill="#4349FF"/>
    </svg>
  );
}

function CheckBadgeIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" stroke="#4349FF" strokeWidth="2"/>
      <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#4349FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── styles ── */

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #E8E8E4',
  borderRadius: 22,
  overflow: 'hidden',
  boxShadow: '0 12px 48px rgba(67,73,255,0.08)',
};

const cardTopStyle: React.CSSProperties = {
  background: '#0A0A0A',
  padding: '18px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
};

const questionStyle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 700,
  marginBottom: 14,
  marginTop: 0,
  lineHeight: 1.4,
};

const optionStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '15px 16px',
  border: '1.5px solid #E8E8E4',
  borderRadius: 14,
  fontSize: 15,
  fontWeight: 600,
  color: '#0A0A0A',
  background: '#fff',
  textAlign: 'left',
  width: '100%',
  marginBottom: 10,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const badgeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  background: '#E8E9FF',
  border: '1px solid rgba(67,73,255,0.2)',
  borderRadius: 12,
  padding: '10px 14px',
  fontSize: 14,
  marginBottom: 12,
  lineHeight: 1.4,
};

const subTextStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#6B6B6B',
  lineHeight: 1.6,
  marginBottom: 14,
  marginTop: 0,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 16,
  border: '1.5px solid #E8E8E4',
  borderRadius: 12,
  fontSize: 18,
  fontWeight: 600,
  color: '#0A0A0A',
  background: '#F8F8F6',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const ctaStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  width: '100%',
  marginTop: 14,
  padding: '16px 24px',
  background: '#4349FF',
  color: '#fff',
  fontWeight: 700,
  fontSize: 15,
  border: 'none',
  borderRadius: 14,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const legalStyle: React.CSSProperties = {
  fontSize: 10,
  color: '#6B6B6B',
  lineHeight: 1.5,
  marginTop: 10,
  textAlign: 'center',
};

const tyStepStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  padding: '13px 16px',
  background: '#F8F8F6',
  border: '1px solid #E8E8E4',
  borderRadius: 12,
  marginBottom: 10,
};

const tyNumStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  flexShrink: 0,
  background: '#4349FF',
  color: '#fff',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 13,
  fontWeight: 800,
};
