import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';
import MainLayout from '@/layouts/MainLayout';
import '../styles/global.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gym & Physiotherapy Management',
  description: 'Unified dashboard for managing gym and physiotherapy operations.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
