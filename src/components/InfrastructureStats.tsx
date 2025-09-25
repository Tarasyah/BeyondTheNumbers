// src/components/InfrastructureStats.tsx
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const StatCard = ({ title, value }: { title: string; value: number | string | null | undefined }) => {
    const displayValue = (value === null || value === undefined) ? 'N/A' : typeof value === 'number' ? value.toLocaleString() : value;
    return (
        <Card className="bg-card/50 text-center">
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

    // The API provides educational_buildings as a total. 
    // The screenshot seems to distinguish between destroyed and damaged, but the API doesn't.
    // We will display the total number as "Educational Facilities" for clarity.
    const educationalFacilities = data.educational_buildings;

    return (
        <div className="bg-gray-900/50 border-gray-800 rounded-lg p-6 md:p-8">
            <h2 className="text-lg font-semibold tracking-wider text-muted-foreground mb-1">OVERVIEW OF DESTROYED INFRASTRUCTURE*</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                
                {/* Left Column: Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <StatCard title="Residential Units damaged or destroyed" value={data.residential_units} />
                    <StatCard title="Government Buildings" value={data.government_buildings} />
                    <StatCard title="Educational Facilities" value={educationalFacilities} />
                    <StatCard title="Mosques" value={data.mosques} />
                    <StatCard title="Churches" value={data.churches} />
                    {/* Empty cell for alignment if needed, or another stat */}
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
