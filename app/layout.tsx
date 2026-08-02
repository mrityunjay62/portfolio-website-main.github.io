import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mrityunjay Kumar | Portfolio',
  description: 'Immersive AI-focused portfolio experience with a room-based journey.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
