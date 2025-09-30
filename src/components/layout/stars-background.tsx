// src/components/layout/stars-background.tsx
"use client";

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

export function StarsBackground() {
    const pathname = usePathname();

    // Tampilkan bintang hanya di halaman Martyrs dan Voices/Feed
    const showStars = useMemo(() => {
        return pathname === '/martyrs' || pathname === '/feed';
    }, [pathname]);

    // Buat partikel bintang
    const stars = useMemo(() => {
        if (!showStars) return null;
        return Array.from({ length: 500 }).map((_, i) => {
            const style = {
                animationDelay: `${Math.random() * 1.5}s`,
                animationDuration: `${Math.random() * 2 + 1}s`,
                left: `${Math.random() * 100}vw`,
                top: `${Math.random() * 100}vh`,
                height: `${Math.random() * 0.2 + 0.1}rem`,
                width: `${Math.random() * 0.2 + 0.1}rem`,
            };
            return (
                <p
                    key={i}
                    className="animate-move-twinkle absolute rounded-full bg-white"
                    style={style}
                ></p>
            );
        });
    }, [showStars]);

    if (!showStars) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
            <div className="relative w-full h-full">
                {stars}
            </div>
        </div>
    );
}
