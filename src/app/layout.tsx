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
  title: 'Palestine Data Hub',
  description: 'A real-time, data-driven web dashboard documenting the events in Palestine.',
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
            <div className="hidden dark:block">
              <div className="fixed inset-0 -z-20 martyrs-page-dark-bg" />
              <StarsBackground />
            </div>
            <div className="relative z-1 flex min-h-screen flex-col bg-transparent">
              <Header />
              <main className="flex-1">{children}</main>
            </div>
          </div>
          <Toaster />
        </CustomThemeProvider>
      </body>
    </html>
  );
}
