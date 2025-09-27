// src/components/layout/header.tsx
import Link from 'next/link';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { ActiveLink } from '@/components/layout/active-link';
import { createClient } from '@/utils/supabase/server';
import { Button } from '@/components/ui/button';
import { UserNav } from './user-nav';
import { User } from 'lucide-react';

export async function Header() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-primary">
              <path d="M21.22,2.83,12.35,11.7A1.62,1.62,0,0,1,12,12h0a1.62,1.62,0,0,1-.35-.07l-8.87-8.87a2,2,0,0,1,2.83-2.83L12,6.59l6.36-6.36a2,2,0,0,1,2.83,2.83Z"/>
              <path d="M2.78,21.17l8.87-8.87a1.62,1.62,0,0,1,.35-.07h0a1.62,1.62,0,0,1,.35.07l8.87,8.87a2,2,0,0,1-2.83,2.83L12,17.41,5.61,24A2,2,0,0,1,2.78,21.17Z"/>
            </svg>
            <span className="font-bold">Palestine Data Hub</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <ActiveLink href="/">
              Dashboard
            </ActiveLink>
            <ActiveLink href="/martyrs">
              Martyrs
            </ActiveLink>
            <ActiveLink href="/chronology">
              Chronology
            </ActiveLink>
            <ActiveLink href="/feed">
              Feed
            </ActiveLink>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
          {user ? (
            <UserNav user={user} />
          ) : (
            <Button asChild variant="ghost" size="icon" className="rounded-full">
                <Link href="/login">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Login</span>
                </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
