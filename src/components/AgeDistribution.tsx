// src/components/AgeDistribution.tsx
'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Progress } from "@/components/ui/progress";
import { useMemo, useState, useEffect, useRef } from 'react';

type AgePoint = { age_group: string, count: number };

// Custom hook for count-up animation for decimals
const useDecimalCountUp = (end: number, duration: number = 2500, decimals: number = 1) => {
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
                        
                        const currentVal = progress * end;
                        setCount(parseFloat(currentVal.toFixed(decimals)));

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            setCount(end);
                        }
                    };

                    requestAnimationFrame(animate);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        
        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [end, duration, decimals]);

    return { count, ref };
};

// Custom hook for progress bar animation
const useProgressAnimation = (endValue: number, duration: number = 2500) => {
    const [value, setValue] = useState(0);
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
                        
                        setValue(progress * endValue);

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                          setValue(endValue);
                        }
                    };

                    requestAnimationFrame(animate);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        
        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [endValue, duration]);
    
    return { value, ref };
};

export function AgeDistribution({ data }: { data: AgePoint[] | null }) {
    
    const { sortedData, averageAge } = useMemo(() => {
        if (!data || data.length === 0) return { sortedData: null, averageAge: 0 };

        const ageOrder = ["0-10", "11-20", "21-30", "31-40", "41-50", "51-60", "61-70", "71-80", "81-90", "91-100", "101+", "Unknown"];
        
        const sorted = [...data].sort((a, b) => {
            const indexA = ageOrder.indexOf(a.age_group);
            const indexB = ageOrder.indexOf(b.age_group);
            
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            
            return indexA - indexB;
        });

        // Calculate average age, using midpoint of age groups
        let totalAgeSum = 0;
        let totalCount = 0;
        
        data.forEach(item => {
            if (item.age_group !== "Unknown") {
                const parts = item.age_group.replace('+', '').split('-').map(Number);
                const midpoint = parts.length > 1 ? (parts[0] + parts[1]) / 2 : parts[0];
                totalAgeSum += midpoint * item.count;
                totalCount += item.count;
            }
        });

        const avg = totalCount > 0 ? totalAgeSum / totalCount : 0;

        return { sortedData: sorted, averageAge: avg };

    }, [data]);
    
    const { count: animatedAverageAge, ref: ageRef } = useDecimalCountUp(averageAge, 2500, 1);
    const { value: animatedProgress, ref: progressRef } = useProgressAnimation((averageAge / 100) * 100, 2500);


    if (!sortedData || sortedData.length === 0) {
      return (
        <div className="h-full p-4 md:p-8">
            <h2 className="text-2xl font-semibold leading-none tracking-tight">Age Distribution of Martyrs</h2>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground mt-4">
              <p>Loading age distribution or no data available...</p>
            </div>
        </div>
      )
    }
    
    return (
        <div className="h-full p-4 md:p-8">
            <h2 className="text-2xl font-semibold leading-none tracking-tight">Age Distribution of Martyrs</h2>
            <div className="mt-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sortedData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                          <XAxis dataKey="age_group" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} hide={true} />
                          <Tooltip
                              cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
                              contentStyle={{ 
                                  backgroundColor: 'hsl(var(--background) / 0.8)',
                                  borderColor: 'hsl(var(--border) / 0.5)',
                              }}
                          />
                          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Number of Casualties"/>
                      </BarChart>
                  </ResponsiveContainer>
                </div>
                {averageAge > 0 && (
                    <div className="mt-8 text-center" ref={ageRef}>
                        <div className="text-6xl font-bold text-yellow-400">{animatedAverageAge.toFixed(1)}</div>
                        <p className="text-muted-foreground mt-2">Average age at death</p>
                        <div ref={progressRef}>
                          <Progress value={animatedProgress} className="w-1/2 mx-auto mt-4 h-2 bg-muted [&>div]:bg-yellow-400" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
