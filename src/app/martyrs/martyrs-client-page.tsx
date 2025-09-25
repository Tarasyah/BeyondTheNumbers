"use client"

import { useState, useMemo, useTransition } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Martyr } from "@/lib/types";
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { fetchMartyrs } from './actions';

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

export function MartyrsClientPage({ initialMartyrs }: { initialMartyrs: Martyr[] }) {
  const [martyrs, setMartyrs] = useState<Martyr[]>(initialMartyrs);
  const [page, setPage] = useState(2); // Start with page 2 since page 1 is initial data
  const [hasMore, setHasMore] = useState(initialMartyrs.length > 0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [isPending, startTransition] = useTransition();

  const filteredAndSortedMartyrs = useMemo(() => {
    let filtered = Array.isArray(martyrs) ? [...martyrs] : [];

    if (searchTerm) {
      filtered = filtered.filter(m => m.en_name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Sorting is now client-side on the currently loaded data.
    // For a full server-side sort, the action would need to handle sorting arguments.
    switch (sortOrder) {
      case 'latest':
        filtered.sort((a, b) => (b.id && a.id ? b.id.localeCompare(a.id) : 0));
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.en_name.localeCompare(b.en_name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.en_name.localeCompare(a.en_name));
        break;
      case 'age-asc':
        filtered.sort((a, b) => a.age - b.age);
        break;
      case 'age-desc':
        filtered.sort((a, b) => b.age - a.age);
        break;
      default:
        break;
    }

    return filtered;
  }, [martyrs, searchTerm, sortOrder]);
  
  const handleLoadMore = () => {
    startTransition(async () => {
      const newMartyrs = await fetchMartyrs({ page });
      if (newMartyrs && newMartyrs.length > 0) {
        setMartyrs(prev => [...prev, ...newMartyrs]);
        setPage(prevPage => prevPage + 1);
      } else {
        setHasMore(false);
      }
    });
  }

  // Note: Search and sort now only apply to the currently loaded martyrs.
  // A full server-side implementation would require passing search/sort to the action.
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
            placeholder="Search loaded names..." 
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
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="age-asc">Age (Youngest)</SelectItem>
              <SelectItem value="age-desc">Age (Oldest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedMartyrs.map(martyr => (
            <MartyrCard key={martyr.id} martyr={martyr} />
          ))}
        </div>

        {hasMore && (
            <div className="text-center mt-12">
                <Button onClick={handleLoadMore} variant="outline" size="lg" disabled={isPending}>
                    {isPending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    {isPending ? 'Loading...' : 'Load More'}
                </Button>
            </div>
        )}
      </div>
    </div>
  )
}
