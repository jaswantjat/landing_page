import { headers } from 'next/headers';
import { permanentRedirect } from 'next/navigation';
import { OpsConsole } from '../src/components/OpsConsole';
import { getPublicRootRedirectTarget } from '../src/lib/root-redirect';

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const headerList = await headers();
  const target = getPublicRootRedirectTarget({
    host: headerList.get('x-forwarded-host') ?? headerList.get('host'),
    searchParams: searchParams ? await searchParams : {},
  });

  if (target) {
    permanentRedirect(target);
  }

  return (
    <main style={pageStyle}>
      <section style={introStyle}>
        <p style={eyebrowStyle}>Project Solar</p>
        <h1 style={titleStyle}>Run one neighborhood campaign from one seed address.</h1>
        <p style={copyStyle}>
          This page is the operator entry point. Submit one address and a radius, generate postcards for
          the eligible neighboring houses, upload the PDFs into Drive, and send every QR to the matching
          <code style={inlineCodeStyle}> /p/[id] </code>
          landing page.
        </p>
      </section>

      <OpsConsole />

      <section style={notesStyle}>
        <div style={noteCardStyle}>
          <h2 style={noteTitleStyle}>What gets personalized</h2>
          <p style={noteBodyStyle}>
            Every accepted neighboring house gets a personalized landing page at
            <code style={inlineCodeStyle}> /p/[lead-id] </code>.
            The postcard and the landing page reuse the same stored proposal image for that lead.
          </p>
        </div>
        <div style={noteCardStyle}>
          <h2 style={noteTitleStyle}>What the job does automatically</h2>
          <p style={noteBodyStyle}>
            The backend scans the radius, removes non-houses and roofs with existing solar, creates the
            PDFs, uploads them into one Drive folder, and keeps the landing page tied to the same lead.
          </p>
        </div>
      </section>
    </main>
  );
}

const pageStyle = {
  maxWidth: 1200,
  margin: '0 auto',
  padding: '48px 24px 80px',
  display: 'grid',
  gap: 24
} as const;

const introStyle = {
  padding: '8px 4px'
} as const;

const eyebrowStyle = {
  margin: 0,
  color: '#4C52F7',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: '0.18em',
  textTransform: 'uppercase'
} as const;

const titleStyle = {
  margin: '10px 0 12px',
  maxWidth: 860,
  fontSize: 'clamp(2.6rem, 6vw, 5.2rem)',
  lineHeight: 0.92,
  letterSpacing: '-0.06em'
} as const;

const copyStyle = {
  margin: 0,
  maxWidth: 720,
  color: '#475569',
  fontSize: 17,
  lineHeight: 1.7
} as const;

const notesStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 18
} as const;

const noteCardStyle = {
  background: '#ffffff',
  borderRadius: 24,
  padding: 24,
  boxShadow: '0 18px 60px rgba(15, 23, 42, 0.08)'
} as const;

const noteTitleStyle = {
  margin: 0,
  fontSize: 22,
  letterSpacing: '-0.04em'
} as const;

const noteBodyStyle = {
  margin: '10px 0 0',
  color: '#475569',
  lineHeight: 1.7
} as const;

const inlineCodeStyle = {
  padding: '2px 6px',
  margin: '0 4px',
  borderRadius: 8,
  background: '#e2e8f0',
  fontFamily: 'ui-monospace, SFMono-Regular, monospace'
} as const;
