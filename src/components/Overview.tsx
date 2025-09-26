// src/components/Overview.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';

// Custom hook for count-up animation triggered by visibility
const useCountUp = (end: number, duration: number = 1500) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    let start = 0;
                    const startTime = Date.now();

                    const animate = () => {
                        const currentTime = Date.now();
                        const elapsedTime = currentTime - startTime;
                        const progress = Math.min(elapsedTime / duration, 1);
                        
                        setCount(Math.floor(progress * end));

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            setCount(end);
                        }
                    };

                    requestAnimationFrame(animate);
                    observer.disconnect(); // Animate only once
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [end, duration]);

    return { count, ref };
};


// Define a type for the props for better code safety
type OverviewStats = {
  totalKilled: number;
  totalInjured: number;
  childrenKilled: number;
  womenKilled: number;
  killedInWestBank: number;
  childFamine: number;
} | null;


const StatCard = ({ title, value }: { title: string; value: number | undefined | null }) => {
    const finalValue = value ?? 0;
    const { count, ref } = useCountUp(finalValue);
    const displayValue = (value === null || value === undefined) ? 'N/A' : count.toLocaleString();
    
    return (
        <Card ref={ref} className="bg-card text-center">
            <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="text-4xl font-bold text-primary mb-1">{displayValue}</div>
                <div className="text-sm font-medium text-muted-foreground text-center">{title}</div>
            </CardContent>
        </Card>
    );
};

export function Overview({ stats }: { stats: OverviewStats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
      <StatCard title="Killed in Gaza" value={stats?.totalKilled} />
      <StatCard title="Injured in Gaza" value={stats?.totalInjured} />
      <StatCard title="Children Killed" value={stats?.childrenKilled} />
      <StatCard title="Women Killed" value={stats?.womenKilled} />
      <StatCard title="Child Famine Deaths" value={stats?.childFamine} />
      <StatCard title="Killed in West Bank" value={stats?.killedInWestBank} />
    </div>
  );
}
