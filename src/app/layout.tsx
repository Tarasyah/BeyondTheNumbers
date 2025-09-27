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
          <div className="relative flex min-h-screen flex-col bg-background">
            <div className="hidden dark:block">
              <StarsBackground />
            </div>
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </CustomThemeProvider>
      </body>
    </html>
  );
}
