// src/app/chronology/chronology-client-page.tsx
"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { RawEvent } from '@/lib/timeline-data';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

type Language = 'id' | 'en' | 'ar';

function getTranslation(text: RawEvent['year'] | RawEvent['event'], lang: Language): string {
    if (typeof text === 'string') {
        return text;
    }
    return text[lang];
}

export function ChronologyClientPage({ events }: { events: RawEvent[] }) {
    const [lang, setLang] = useState<Language>('id');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEvents = useMemo(() => {
        if (!searchTerm) {
            return events;
        }

        const lowercasedTerm = searchTerm.toLowerCase();

        return events.filter(item => {
            const yearId = typeof item.year !== 'string' ? item.year.id.toLowerCase() : item.year.toLowerCase();
            const yearEn = typeof item.year !== 'string' ? item.year.en.toLowerCase() : item.year.toLowerCase();
            const yearAr = typeof item.year !== 'string' ? item.year.ar.toLowerCase() : item.year.toLowerCase();
            
            const eventId = typeof item.event !== 'string' ? item.event.id.toLowerCase() : item.event.toLowerCase();
            const eventEn = typeof item.event !== 'string' ? item.event.en.toLowerCase() : item.event.toLowerCase();
            const eventAr = typeof item.event !== 'string' ? item.event.ar.toLowerCase() : item.event.toLowerCase();

            return (
                yearId.includes(lowercasedTerm) ||
                yearEn.includes(lowercasedTerm) ||
                yearAr.includes(lowercasedTerm) ||
                eventId.includes(lowercasedTerm) ||
                eventEn.includes(lowercasedTerm) ||
                eventAr.includes(lowercasedTerm)
            );
        });
    }, [events, searchTerm]);

    return (
        <div className="bg-black text-white min-h-screen p-4 md:p-8">
            <header className="text-center my-12">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">CHRONOLOGY OF</h1>
                <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-primary">PALESTINE</h2>
            </header>
            
            <div className="flex flex-col justify-center items-center mb-12 gap-4">
                 <RadioGroup defaultValue="id" onValueChange={(value) => setLang(value as Language)} className="flex items-center space-x-4 rounded-full bg-card/50 p-2 border border-border/20">
                    <RadioGroupItem value="id" id="id" className="sr-only" />
                    <Label htmlFor="id" className={cn("px-4 py-1.5 rounded-full cursor-pointer transition-colors text-sm", lang === 'id' && 'bg-primary text-primary-foreground')}>ID</Label>
                    
                    <RadioGroupItem value="en" id="en" className="sr-only" />
                    <Label htmlFor="en" className={cn("px-4 py-1.5 rounded-full cursor-pointer transition-colors text-sm", lang === 'en' && 'bg-primary text-primary-foreground')}>EN</Label>

                    <RadioGroupItem value="ar" id="ar" className="sr-only" />
                    <Label htmlFor="ar" className={cn("px-4 py-1.5 rounded-full cursor-pointer transition-colors text-sm", lang === 'ar' && 'bg-primary text-primary-foreground')}>AR</Label>
                </RadioGroup>
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search year or event..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={cn(
                            "w-full bg-card/50 border-border/30 pl-10",
                            !searchTerm && "text-center"
                        )}
                    />
                </div>
            </div>

            <div className="relative container mx-auto">
                {/* Central Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border/30 transform -translate-x-1/2"></div>
                <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-primary via-primary/50 to-transparent transform -translate-x-1/2"></div>
                
                {/* Timeline Events */}
                <div className="space-y-16">
                    {filteredEvents.map((item, index) => (
                        <div key={index} className="relative">
                            <div className={cn(
                                "w-full flex items-center",
                                index % 2 === 0 ? "justify-start" : "justify-end"
                            )}>
                                <div className={cn(
                                    "w-1/2",
                                    index % 2 === 0 ? "pr-8" : "pl-8"
                                )}>
                                    <Card className="bg-card/50 border-border/30 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 transform hover:-translate-y-1">
                                         <CardContent className="p-4">
                                            <h3 className="font-bold text-xl mb-4 text-primary">{getTranslation(item.year, lang)}</h3>
                                            {item.image_suggestion && (
                                                <div className="relative w-full mb-4 rounded-md overflow-hidden bg-black/20 flex justify-center items-center">
                                                    <Image src={item.image_suggestion} alt={getTranslation(item.event, lang)} width={500} height={300} style={{objectFit:"contain", width: '100%', height: 'auto'}} />
                                                </div>
                                            )}
                                            <p className={cn("text-foreground/80", lang === 'ar' ? 'text-right' : 'text-left')}>{getTranslation(item.event, lang)}</p>
                                         </CardContent>
                                    </Card>
                                </div>
                            </div>
                             {/* Dot on the timeline */}
                            <div className="absolute left-1/2 top-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
