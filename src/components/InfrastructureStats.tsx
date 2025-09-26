// src/components/InfrastructureStats.tsx
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';

const StatCard = ({ title, value }: { title: string; value: number | string | null | undefined }) => {
    
    const formatValue = (val: number | string | null | undefined) => {
        if (val === null || val === undefined) return 'N/A';
        if (typeof val === 'string') return val;
        
        if (title === "Residential Units destroyed" && val >= 1000) {
            return `${(val / 1000).toFixed(0)}K`;
        }
        
        return val.toLocaleString();
    };

    const displayValue = formatValue(value);

    return (
        <Card className="bg-card text-center">
            <CardHeader className="pb-2">
                <div className="text-4xl font-bold text-primary">{displayValue}</div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{title}</p>
            </CardContent>
        </Card>
    );
};


export function InfrastructureStats({ data }: { data: any | null }) {
    if (!data) return <div>Loading...</div>;

    const formattedDate = data.date ? format(parseISO(data.date), 'MMMM d, yyyy') : '';

    return (
        <div className="bg-card border border-border rounded-lg p-6 md:p-8">
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

                {/* Right Column: Image */}
                <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
                   <Image 
                        src="https://picsum.photos/seed/destruction/800/600"
                        alt="Image of destruction in Palestine"
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-lg"
                        data-ai-hint="destruction city"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary"></div>
                </div>

            </div>
            <p className="text-xs text-muted-foreground mt-4">*since October 7</p>
        </div>
    );
}
