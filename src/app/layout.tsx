import { Analytics } from '@vercel/analytics/next';

import type { Metadata } from 'next';
import './globals.css';
import { CustomThemeProvider } from '@/components/custom-theme-provider';
import { Header } from '@/components/layout/header';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google'
import { StarsBackground } from '@/components/layout/stars-background';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Beyond the Numbers',
  description: 'The Palestine Data & Memorial Project.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="view-transition" content="same-origin" />
      </head>
      <body className={cn("font-sans antialiased", inter.variable)}>
        <CustomThemeProvider>
          <div className="relative min-h-screen">
            <div className="absolute inset-0 -z-20 martyrs-page-dark-bg"></div>
            <div className="hidden dark:block">
              <StarsBackground />
            </div>
            <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
              {/* Melewatkan null karena user dan profile tidak lagi digunakan */}
              <Header user={null} profile={null} />
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
