import type { Metadata, Viewport } from 'next';

import ThemeProvider from '@/components/theme-provider';

export const viewport: Viewport = {
  themeColor: '#0a0e17',
};

export const metadata: Metadata = {
  title: 'Daily Stock Picker — 2-Year Growth Screener',
  description:
    'Daily stock picks screened for 2-year big gain potential using fundamental and momentum criteria.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'StockPicker',
  },
  icons: [
    { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
