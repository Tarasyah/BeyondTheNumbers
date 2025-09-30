// src/app/layout.tsx
"use client";

import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { CustomThemeProvider } from '@/components/custom-theme-provider';
import { Header } from '@/components/layout/header';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { StarsBackground } from '@/components/layout/stars-background';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// This client component manages the body's background class
function BodyClassNameUpdater() {
  const pathname = usePathname();

  useEffect(() => {
    const body = document.body;
    const isDashboardOrChronology = pathname === '/' || pathname === '/chronology';

    // Always remove classes first to avoid conflicts
    body.classList.remove('dashboard-bg', 'non-dashboard-bg');

    // Add the correct class based on the current path
    if (isDashboardOrChronology) {
      body.classList.add('dashboard-bg');
    } else {
      body.classList.add('non-dashboard-bg');
    }

  }, [pathname]);

  return null; // This component does not render anything
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Beyond the Numbers</title>
        <meta name="description" content="The Palestine Data & Memorial Project." />
        <meta name="view-transition" content="same-origin" />
      </head>
      <body className={cn("font-sans antialiased", inter.variable)}>
        <CustomThemeProvider>
          <BodyClassNameUpdater />
          <StarsBackground />
          <Header />
          <main className="flex-1 pt-20">{children}</main>
          <Toaster />
        </CustomThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
