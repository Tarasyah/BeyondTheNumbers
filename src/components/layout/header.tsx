// src/components/layout/header.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/lib/types';

import { cn } from '@/lib/utils';
import { ActiveLink } from '@/components/layout/active-link';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { UserNav } from './user-nav';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Menu, User as UserIcon } from 'lucide-react';


// This is a client component because it uses hooks for scroll effects and menu toggling.
export function Header({ user, profile }: { user: User | null, profile: Profile | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    // Logic for the blurred background effect
    if (currentScrollY > 10) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }

    // Logic for hide/show on scroll direction
    if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
      setHeaderHidden(true);
    } else {
      setHeaderHidden(false);
    }

    lastScrollY.current = currentScrollY;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menu if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/martyrs', label: 'Martyrs' },
    { href: '/chronology', label: 'Chronology' },
    { href: '/feed', label: 'Feed' },
  ];

  return (
    <header id="main-header" className={cn({ scrolled, 'header-hidden': headerHidden })}>
      <div className="header-gradient"></div>
      <div className="header-container">
        <div className="header-bg"></div>

        <Link href="/" className="logo-container">
           <span className={cn("font-bold", scrolled ? "text-foreground" : "text-white")}>Palestine Data Hub</span>
        </Link>

        <nav className="desktop-nav">
          {navLinks.map((link) => (
             <ActiveLink key={link.href} href={link.href} className={cn("nav-link", usePathname() === link.href && 'active')}>
                {link.label}
             </ActiveLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* Desktop user auth */}
            <div className="hidden md:flex">
                 {user ? (
                    <UserNav user={user} profile={profile} />
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="rounded-full">
                                 <UserIcon className={cn("h-5 w-5", scrolled ? "text-foreground" : "text-white")} />
                                <span className="sr-only">User Menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href="/login?tab=signup">Sign Up</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/login?tab=signin">Login</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {/* Mobile menu */}
            <div className="mobile-menu-container md:hidden" ref={menuRef}>
                <button id="mobile-menu-btn" aria-label="Toggle Menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <Menu />
                </button>
                <div id="mobile-menu-dropdown" className={cn("mobile-menu-dropdown", { open: isMenuOpen })}>
                    {navLinks.map(link => (
                         <Link key={link.href} href={link.href} className="menu-item" onClick={() => setIsMenuOpen(false)}>
                            {link.label}
                        </Link>
                    ))}
                    <div className="separator"></div>
                     {user ? (
                        <button onClick={async () => {
                            const { createClient } = await import('@/utils/supabase/client');
                            const supabase = createClient();
                            await supabase.auth.signOut();
                            router.push('/');
                        }} className="menu-item">Log out</button>
                    ) : (
                        <>
                        <Link href="/login?tab=signup" className="menu-item" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                        <Link href="/login?tab=signin" className="menu-item" onClick={() => setIsMenuOpen(false)}>Login</Link>
                        </>
                    )}
                </div>
            </div>
        </div>
      </div>
    </header>
  );
}
