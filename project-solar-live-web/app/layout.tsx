import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Rethink_Sans } from 'next/font/google';
import { BRAND_THEME } from '@project-solar/shared-solar-core';
import './globals.css';

const rethinkSans = Rethink_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rethink',
});

export const metadata: Metadata = {
  title: 'Eltex Solar — Propuesta personalizada',
  description: 'Informe de independencia energética personalizado para su tejado'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      className={rethinkSans.variable}
      style={{
        ['--blue' as string]: BRAND_THEME.blue,
        ['--blue-lt' as string]: BRAND_THEME.blueLight,
        ['--yellow' as string]: BRAND_THEME.yellow,
        ['--black' as string]: BRAND_THEME.black,
        ['--white' as string]: BRAND_THEME.white,
        ['--off' as string]: BRAND_THEME.offWhite,
      }}
    >
      <body>{children}</body>
    </html>
  );
}
