import type { Metadata } from 'next';

import ThemeProvider from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'Daily Stock Picker — 2-Year Growth Screener',
  description:
    'Daily stock picks screened for 2-year big gain potential using fundamental and momentum criteria.',
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
