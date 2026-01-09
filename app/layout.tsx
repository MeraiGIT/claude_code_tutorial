import type { Metadata } from 'next';
import './globals.css';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen relative">
        {children}
      </body>
    </html>
  );
}
