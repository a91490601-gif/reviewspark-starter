import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'ReviewSpark', description: 'Minimal Review App' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
