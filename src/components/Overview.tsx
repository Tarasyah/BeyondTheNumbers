// src/components/Overview.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Custom hook for count-up animation triggered by visibility
const useCountUp = (end: number, duration: number = 2500) => {
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

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            const currentRef = ref.current;
            if (currentRef) {
                observer.unobserve(currentRef);
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
    
    const isWestBankCard = title === "Killed in West Bank";
    const gradientClass = isWestBankCard ? "animated-gradient-border-card" : "animated-gradient-border-card-red";

    return (
      <div className={gradientClass}>
        <div className="content-card">
          <Card ref={ref} className="bg-transparent text-center h-full border-none shadow-none">
            <CardContent className="flex flex-col items-center justify-start p-4 h-full">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2 h-10">{displayValue}</div>
              <div className="text-xs font-medium text-muted-foreground text-center">{title}</div>
            </CardContent>
          </Card>
        </div>
      </div>
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
