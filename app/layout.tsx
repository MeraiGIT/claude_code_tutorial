import type { Metadata } from 'next';
import { Inter, Cinzel, Playfair_Display, Lora } from 'next/font/google';
import './globals.css';
import { LoadingProvider } from '@/hooks/useLoadingState';
import AppContent from '@/components/AppContent';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700']
});

const cinzel = Cinzel({
  weight: ['600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cinzel'
});

const playfair = Playfair_Display({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair'
});

const lora = Lora({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora'
});

export const metadata: Metadata = {
  title: 'Atlantis To-Do | Underwater Task Manager',
  description: 'A stunning underwater Atlantis-themed to-do app with 3D effects',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`min-h-screen relative ${inter.variable} ${cinzel.variable} ${playfair.variable} ${lora.variable}`}>
        <LoadingProvider>
          <AppContent>
            {children}
          </AppContent>
        </LoadingProvider>
      </body>
    </html>
  );
}
