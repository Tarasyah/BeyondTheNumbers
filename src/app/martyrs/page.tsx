
"use client"
import { useState, useMemo } from 'react';
import { getMartyrs } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Martyr } from "@/lib/types";
import { Button } from '@/components/ui/button';

const MARTYRS_PER_PAGE = 100;

function MartyrCard({ martyr }: { martyr: Martyr }) {
  return (
    <div className="bg-card/5 dark:bg-card/90 border border-border/20 rounded-lg p-4 text-center shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{martyr.en_name}</h3>
      </div>
      <div>
        <p className="text-muted-foreground mt-2">Age: {martyr.age}</p>
      </div>
    </div>
  );
}


function MartyrsPage({ allMartyrs }: { allMartyrs: Martyr[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [visibleCount, setVisibleCount] = useState(MARTYRS_PER_PAGE);

  const filteredAndSortedMartyrs = useMemo(() => {
    let martyrs = allMartyrs ? [...allMartyrs] : [];

    if (searchTerm) {
      martyrs = martyrs.filter(m => m.en_name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (sortOrder === 'latest') {
        martyrs.sort((a, b) => (a.id && b.id && b.id > a.id ? -1 : 1));
    } else if (sortOrder === 'oldest') {
        martyrs.sort((a, b) => (a.id && b.id && a.id > b.id ? 1 : -1));
    } else if (sortOrder === 'name-asc') {
      martyrs.sort((a, b) => a.en_name.localeCompare(b.en_name));
    } else if (sortOrder === 'name-desc') {
      martyrs.sort((a, b) => b.en_name.localeCompare(a.en_name));
    }

    return martyrs;
  }, [allMartyrs, searchTerm, sortOrder]);
  
  const visibleMartyrs = useMemo(() => {
    return filteredAndSortedMartyrs.slice(0, visibleCount);
  }, [filteredAndSortedMartyrs, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + MARTYRS_PER_PAGE);
  }

  return (
    <div className="dark:bg-black dark:text-white min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center my-12">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-4">IN MEMORY OF</h1>
          <h2 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-primary">THE MARTYRS</h2>
          <p className="text-muted-foreground italic mt-6 max-w-2xl mx-auto">
            "Never think of those martyred in the cause of Allah as dead. In fact, they are alive with their Lord, well provided for." (Quran 3:169)
          </p>
        </header>

        <div className="flex flex-col md:flex-row justify-center items-center mb-8 gap-4">
          <Input 
            placeholder="Search name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs w-full bg-card/5 dark:bg-card/90"
          />
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full max-w-xs md:w-[180px] bg-card/5 dark:bg-card/90">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleMartyrs.map(martyr => (
            <MartyrCard key={martyr.id} martyr={martyr} />
          ))}
        </div>

        {visibleCount < filteredAndSortedMartyrs.length && (
            <div className="text-center mt-12">
                <Button onClick={handleLoadMore} variant="outline" size="lg">
                    Load More
                </Button>
            </div>
        )}
      </div>
    </div>
  )
}

async function MartyrsPageWrapper() {
    const allMartyrs = await getMartyrs() || [];
    return <MartyrsPage allMartyrs={allMartyrs} />;
}

export default MartyrsPageWrapper;
