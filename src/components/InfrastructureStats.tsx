// src/components/InfrastructureStats.tsx
'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { useState, useEffect, useRef } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";


// Custom hook for count-up animation
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
                            setCount(end); // Ensure it ends on the exact number
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
    }, [end, duration]);

    return { count, ref };
};


const StatCard = ({ title, value }: { title: string; value: number | string | null | undefined }) => {
    const finalValue = typeof value === 'number' ? value : 0;
    const { count, ref } = useCountUp(finalValue);
    
    const formatValue = (val: number) => {
        if (title === "Residential Units destroyed" && val >= 1000) {
            return `${(val / 1000).toFixed(0)}K`;
        }
        return val.toLocaleString();
    };

    const displayValue = (value === null || value === undefined) ? 'N/A' : formatValue(count);

    return (
        <div ref={ref} className="animated-gradient-border-card-neutral">
            <div className="content-card">
                 <Card className="bg-transparent text-center h-full border-none shadow-none">
                    <CardHeader className="pb-2 pt-6">
                        <div className="text-4xl font-bold text-primary">{displayValue}</div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">{title}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};


export function InfrastructureStats({ data }: { data: any | null }) {
    const plugin = useRef(
      Autoplay({ delay: 2000, stopOnInteraction: false })
    );

    const images = [
        "/2025-01-20T091020Z_1845813462_RC2LDCAK4ZET_RTRMADP_3_ISRAEL-PALESTINIANS-GAZA-CEASEFIRE-1737364436.webp",
        "/AA-20250119-36799656-36799649-AFTERMATH_OF_ISRAELI_ATTACKS_IN_NORTHERN_GAZA_DURING_CEASEFIRE-1737364681.webp",
        "/AA-20250120-36803295-36803274-THE_DESTRUCTION_INFLICTED_BY_THE_ISRAELI_ARMY_ON_JABALIA-1737358384.webp",
        "/AA-20250120-36803295-36803280-THE_DESTRUCTION_INFLICTED_BY_THE_ISRAELI_ARMY_ON_JABALIA-1737358355.webp",
        "/AA-20250120-36803295-36803294-THE_DESTRUCTION_INFLICTED_BY_THE_ISRAELI_ARMY_ON_JABALIA-1737358369.webp",
    ];

    if (!data) return <div>Loading...</div>;

    const formattedDate = data.date ? format(parseISO(data.date), 'MMMM d, yyyy') : '';

    return (
        <div className="p-6 md:p-8">
            <div>
              <h2 className="text-lg font-semibold tracking-wider text-muted-foreground mb-1">OVERVIEW OF DESTROYED INFRASTRUCTURE</h2>
              {formattedDate && (
                <p className="text-sm text-muted-foreground mb-6">Last updated on {formattedDate}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                
                {/* Left Column: Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <StatCard title="Residential Units destroyed" value={data.residential_units_destroyed} />
                    <StatCard title="Government Buildings" value={data.government_buildings_destroyed} />
                    <StatCard title="Educational Facilities" value={data.educational_buildings_destroyed} />
                    <StatCard title="Mosques Destroyed" value={data.mosques_destroyed} />
                    <StatCard title="Mosques Damaged" value={data.mosques_damaged} />
                    <StatCard title="Churches" value={data.churches_destroyed} />
                </div>

                {/* Right Column: Image Carousel */}
                <Carousel
                    plugins={[plugin.current]}
                    opts={{
                        loop: true,
                    }}
                    className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.play}
                >
                    <CarouselContent>
                        {images.map((src, index) => (
                            <CarouselItem key={index}>
                                <div className="relative w-full h-64 md:h-80">
                                    <Image
                                        src={src}
                                        alt={`Image of destruction in Palestine ${index + 1}`}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className="rounded-lg"
                                        data-ai-hint="destruction rubble city"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary"></div>
                </Carousel>

            </div>
            <p className="text-xs text-muted-foreground mt-4">*since October 7</p>
        </div>
    );
}
