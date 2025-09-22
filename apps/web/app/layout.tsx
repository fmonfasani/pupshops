import './globals.css';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import { defaultMetadata } from './seo';

export const metadata = defaultMetadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <Providers>
          <main className="mx-auto max-w-6xl px-4 py-12">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
