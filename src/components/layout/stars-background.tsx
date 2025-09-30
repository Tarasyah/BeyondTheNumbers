// src/components/layout/stars-background.tsx
"use client";

import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';

export function StarsBackground() {
    const pathname = usePathname();
    const [stars, setStars] = useState<JSX.Element[] | null>(null);

    const showStars = useMemo(() => {
        return pathname === '/martyrs' || pathname === '/feed';
    }, [pathname]);

    useEffect(() => {
        if (showStars) {
            const generatedStars = Array.from({ length: 300 }).map((_, i) => {
                const style = {
                    animationDuration: `${Math.random() * 40 + 40}s, ${Math.random() * 5 + 5}s`,
                    animationDelay: `${Math.random() * 5}s, ${Math.random() * 10}s`,
                    left: `${Math.random() * 100}vw`,
                    top: `${Math.random() * 100}vh`,
                    height: `${Math.random() * 0.2 + 0.1}rem`,
                    width: `${Math.random() * 0.2 + 0.1}rem`,
                };
                return (
                    <p
                        key={i}
                        className="star absolute rounded-full bg-white"
                        style={style}
                    ></p>
                );
            });
            setStars(generatedStars);
        } else {
            setStars(null);
        }
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
