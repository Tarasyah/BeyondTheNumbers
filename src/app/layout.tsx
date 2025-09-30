// src/app/layout.tsx
"use client";

import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import './globals.css';
import { CustomThemeProvider } from '@/components/custom-theme-provider';
import { Header } from '@/components/layout/header';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import { StarsBackground } from '@/components/layout/stars-background';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Hapus metadata dari sini karena RootLayout sekarang adalah Client Component
// export const metadata: Metadata = {
//   title: 'Beyond the Numbers',
//   description: 'The Palestine Data & Memorial Project.',
// };

// Komponen klien baru untuk mengelola kelas body
function BodyClassNameUpdater() {
  const pathname = usePathname();

  useEffect(() => {
    const body = document.body;
    const isDashboardOrChronology = pathname === '/' || pathname === '/chronology';

    if (isDashboardOrChronology) {
      body.classList.add('dashboard-bg');
      body.classList.remove('non-dashboard-bg');
    } else {
      body.classList.add('non-dashboard-bg');
      body.classList.remove('dashboard-bg');
    }

    // Cleanup saat komponen dilepas atau path berubah
    return () => {
      body.classList.remove('dashboard-bg', 'non-dashboard-bg');
    };
  }, [pathname]);

  return null; // Komponen ini tidak merender apa-apa
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Metadata bisa ditempatkan di sini atau di page.tsx masing-masing */}
        <title>Beyond the Numbers</title>
        <meta name="description" content="The Palestine Data & Memorial Project." />
        <meta name="view-transition" content="same-origin" />
      </head>
      <body className={cn("font-sans antialiased", inter.variable)}>
        <CustomThemeProvider>
          <BodyClassNameUpdater /> {/* Tambahkan komponen di sini */}
          <div className="relative min-h-screen">
            <div className="absolute inset-0 -z-20 bg-background"></div>
            <div className="hidden dark:block">
              <StarsBackground />
            </div>
            <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
              <Header />
              <main className="flex-1 pt-20">{children}</main>
            </div>
          </div>
          <Toaster />
        </CustomThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
