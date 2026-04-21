'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

interface CampaignStartResponse {
  ok: true;
  jobId: string;
  seedAddress: string;
  radiusM: number;
  status: 'processing';
}

interface CampaignStatusResponse {
  ok: true;
  jobId: string;
  seedAddress: string;
  radiusM: number;
  status: 'processing' | 'completed' | 'failed';
  errorMessage?: string | null;
  candidateCount: number;
  acceptedCount: number;
  rejectedCount: number;
  uploadedCount: number;
  driveFolderName: string | null;
  driveFolderUrl: string | null;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function OpsConsole() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [address, setAddress] = useState('');
  const [radiusM, setRadiusM] = useState('500');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [job, setJob] = useState<CampaignStatusResponse | null>(null);

  async function fetchCampaignStatus(jobId: string) {
    const response = await fetch(`/api/admin/campaign/${jobId}`, {
      headers: {
        Authorization: `Bearer ${password}`,
        'x-admin-password': password
      }
    });
    const body = await response.json();
    if (response.status === 401) {
      setAuthed(false);
      setPassword('');
      throw new Error('Wrong password');
    }
    if (!response.ok) throw new Error(body?.error || 'Campaign failed');
    return body as CampaignStatusResponse;
  }

  async function pollCampaignStatus(jobId: string) {
    for (;;) {
      const next = await fetchCampaignStatus(jobId);
      setJob(next);
      if (next.status === 'completed') return next;
      if (next.status === 'failed') {
        throw new Error(next.errorMessage || 'Campaign failed');
      }
      await sleep(4000);
    }
  }

  function onPasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.trim()) setAuthed(true);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setJob(null);

    try {
      const response = await fetch('/api/admin/campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
          'x-admin-password': password
        },
        body: JSON.stringify({ address, radius_m: Number(radiusM) || 500 })
      });
      const body = await response.json();
      if (response.status === 401) {
        setAuthed(false);
        setPassword('');
        throw new Error('Wrong password');
      }
      if (!response.ok) throw new Error(body?.error || 'Campaign failed');
      const start = body as CampaignStartResponse;
      setJob({
        ok: true,
        jobId: start.jobId,
        seedAddress: start.seedAddress,
        radiusM: start.radiusM,
        status: 'processing',
        errorMessage: null,
        candidateCount: 0,
        acceptedCount: 0,
        rejectedCount: 0,
        uploadedCount: 0,
        driveFolderName: null,
        driveFolderUrl: null
      });
      await pollCampaignStatus(start.jobId);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Campaign failed');
    } finally {
      setBusy(false);
    }
  }

  if (!authed) {
    return (
      <section style={panelStyle}>
        <div>
          <p style={eyebrowStyle}>Ops Console</p>
          <h1 style={titleStyle}>Operator access required.</h1>
        </div>
        <form onSubmit={onPasswordSubmit} style={formStyle}>
          <label style={fieldStyle}>
            <span style={labelStyle}>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              autoFocus
              style={inputStyle}
            />
          </label>
          <button type="submit" style={primaryButtonStyle}>Unlock</button>
        </form>
        {error ? <p style={errorStyle}>{error}</p> : null}
      </section>
    );
  }

  return (
    <section style={panelStyle}>
      <div>
        <p style={eyebrowStyle}>Ops Console</p>
        <h1 style={titleStyle}>Scan one address, find neighbors, build postcards, upload one Drive folder.</h1>
        <p style={bodyStyle}>
          Submit a seed address and radius. The backend scans the neighborhood, filters non-houses and
          existing solar, creates personalized PDFs for the neighbors, and uploads them into a single
          Drive folder named from the seed house.
        </p>
      </div>

      <form onSubmit={onSubmit} style={formStyle}>
        <label style={fieldStyle}>
          <span style={labelStyle}>Seed address</span>
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Carrer la Pau, 13, 08758 Cervelló, Barcelona"
            required
            style={inputStyle}
          />
        </label>

        <label style={fieldStyle}>
          <span style={labelStyle}>Radius in metres</span>
          <input
            value={radiusM}
            onChange={(event) => setRadiusM(event.target.value)}
            inputMode="numeric"
            pattern="[0-9]*"
            style={inputStyle}
          />
        </label>

        <button type="submit" disabled={busy} style={primaryButtonStyle}>
          {busy ? 'Running campaign...' : 'Run neighborhood campaign'}
        </button>
      </form>

      {error ? <p style={errorStyle}>{error}</p> : null}

      {job ? (
        <section style={resultStyle}>
          <div style={summaryGridStyle}>
            <article style={summaryCardStyle}>
              <strong>{job.acceptedCount}</strong>
              <span>eligible neighbors</span>
            </article>
            <article style={summaryCardStyle}>
              <strong>{job.uploadedCount}</strong>
              <span>PDFs uploaded</span>
            </article>
            <article style={summaryCardStyle}>
              <strong>{job.rejectedCount}</strong>
              <span>rejected roofs</span>
            </article>
          </div>

          <div style={detailCardStyle}>
            <p style={detailEyebrowStyle}>Campaign summary</p>
            <p style={detailBodyStyle}><strong>Status:</strong> {job.status}</p>
            <p style={detailBodyStyle}><strong>Seed:</strong> {job.seedAddress}</p>
            <p style={detailBodyStyle}><strong>Radius:</strong> {job.radiusM} m</p>
            <p style={detailBodyStyle}><strong>Scanned candidates:</strong> {job.candidateCount}</p>
            {job.driveFolderName ? (
              <p style={detailBodyStyle}><strong>Drive folder:</strong> {job.driveFolderName}</p>
            ) : null}
            {job.status === 'processing' ? (
              <p style={processingStyle}>Campaign is still running. The page polls until Drive upload completes.</p>
            ) : null}
            {job.driveFolderUrl ? (
              <a href={job.driveFolderUrl} target="_blank" rel="noreferrer" style={folderLinkStyle}>
                Open Drive folder
              </a>
            ) : null}
          </div>
        </section>
      ) : null}
    </section>
  );
}

const panelStyle = {
  background: '#ffffff',
  borderRadius: 28,
  padding: 28,
  boxShadow: '0 24px 80px rgba(15, 23, 42, 0.08)',
  display: 'grid',
  gap: 24
} as const;

const eyebrowStyle = {
  margin: '0 0 6px',
  color: '#4C52F7',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: '0.16em',
  textTransform: 'uppercase'
} as const;

const titleStyle = {
  margin: 0,
  fontSize: 'clamp(2rem, 4vw, 3.2rem)',
  lineHeight: 1,
  letterSpacing: '-0.04em'
} as const;

const bodyStyle = {
  margin: '12px 0 0',
  maxWidth: 760,
  color: '#475569',
  fontSize: 16,
  lineHeight: 1.7
} as const;

const formStyle = {
  display: 'grid',
  gap: 16
} as const;

const fieldStyle = {
  display: 'grid',
  gap: 8
} as const;

const labelStyle = {
  fontSize: 13,
  fontWeight: 700,
  color: '#0f172a'
} as const;

const inputStyle = {
  width: '100%',
  borderRadius: 18,
  border: '1px solid #d9e0ea',
  padding: 16,
  font: 'inherit',
  fontSize: 15
} as const;

const primaryButtonStyle = {
  border: 0,
  borderRadius: 999,
  background: '#4C52F7',
  color: '#fff',
  fontWeight: 800,
  padding: '14px 22px',
  cursor: 'pointer',
  justifySelf: 'start'
} as const;

const errorStyle = {
  margin: 0,
  color: '#b91c1c',
  fontWeight: 700
} as const;

const resultStyle = {
  display: 'grid',
  gap: 18
} as const;

const summaryGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 14
} as const;

const summaryCardStyle = {
  borderRadius: 18,
  padding: 18,
  background: '#f8fafc',
  display: 'grid',
  gap: 4
} as const;

const detailCardStyle = {
  borderRadius: 20,
  padding: 20,
  background: '#0f172a',
  color: '#f8fafc',
  display: 'grid',
  gap: 8
} as const;

const detailEyebrowStyle = {
  margin: 0,
  color: '#93c5fd',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: '0.14em',
  textTransform: 'uppercase'
} as const;

const detailBodyStyle = {
  margin: 0,
  color: 'rgba(248,250,252,0.86)',
  lineHeight: 1.6
} as const;

const processingStyle = {
  margin: 0,
  color: '#fde68a',
  lineHeight: 1.6,
  fontWeight: 700
} as const;

const folderLinkStyle = {
  color: '#f8fafc',
  fontWeight: 700
} as const;
