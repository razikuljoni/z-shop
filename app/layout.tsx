import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Z Shop | Online Shopping for Electronics, Apparel, Computers & More',
  description: 'Z Shop is a premier global e-commerce marketplace featuring real-time inventory, fast Prime delivery, 2FA security, and AI shopping assistance.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-gray-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
