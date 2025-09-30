// src/components/layout/header.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Menu } from 'lucide-react';

// Header component disederhanakan untuk menghapus logika otentikasi
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const [navLinks, setNavLinks] = useState([
    { href: '/', label: 'Dashboard' },
    { href: '/martyrs', label: 'Martyrs' },
    { href: '/chronology', label: 'Chronology' },
    { href: '/feed', label: 'Voices' },
  ]);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrolled(currentScrollY > 10);
    if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
      setHeaderHidden(true);
    } else {
      setHeaderHidden(false);
    }
    lastScrollY.current = currentScrollY;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header id="main-header" className={cn({ scrolled, 'header-hidden': headerHidden })}>
      <div className="header-gradient"></div>
      <div className="header-container">
        <div className="header-bg"></div>

        <Link href="/" className="flex items-center space-x-2">
           <span className={cn("font-bold", scrolled ? "text-foreground" : "text-white")}>Beyond the Numbers</span>
        </Link>

        <nav className="desktop-nav">
          {navLinks.map((link) => (
             <Link key={link.href} href={link.href} className={cn("nav-link", pathname === link.href && 'active')}>
                {link.label}
             </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
            <ThemeToggle />
            
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
                </div>
            </div>
        </div>
      </div>
    </header>
  );
}
