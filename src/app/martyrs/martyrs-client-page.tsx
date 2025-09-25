"use client"

import { useState, useMemo, useTransition, useEffect } from 'react';
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
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(initialMartyrs.length === 100);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  // Effect to handle re-fetching when sort order changes
  useEffect(() => {
    setIsLoading(true);
    setMartyrs([]); // Clear existing martyrs
    setPage(1); // Reset to page 1 for the new sort
    setHasMore(true); // Assume there is more data

    startTransition(async () => {
      // Fetch page 1 for the new sort order
      const newMartyrs = await fetchMartyrs({ page: 1, sort: sortOrder });
      setMartyrs(newMartyrs);
      setPage(2); // Set up for the next "load more" call
      setHasMore(newMartyrs.length === 100);
      setIsLoading(false);
    });
  }, [sortOrder]);


  const filteredMartyrs = useMemo(() => {
    if (!searchTerm) {
      return martyrs;
    }
    return martyrs.filter(m => 
        (m.en_name && m.en_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (m.name && m.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [martyrs, searchTerm]);
  
  const handleLoadMore = () => {
    if (!hasMore || isPending || isLoading) return;

    startTransition(async () => {
      const newMartyrs = await fetchMartyrs({ page, sort: sortOrder });
      if (newMartyrs && newMartyrs.length > 0) {
        setMartyrs(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const uniqueNewMartyrs = newMartyrs.filter(m => !existingIds.has(m.id));
          return [...prev, ...uniqueNewMartyrs];
        });
        setPage(prevPage => prevPage + 1);
        if (newMartyrs.length < 100) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    });
  }

  const handleSortChange = (newSortOrder: string) => {
    // Prevent re-fetch if the sort order is the same
    if (newSortOrder === sortOrder) return;
    setSortOrder(newSortOrder);
  };
  
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
          <Select value={sortOrder} onValueChange={handleSortChange}>
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
        
        {isLoading && martyrs.length === 0 ? (
          <div className="text-center py-12">
            <LoaderCircle className="mx-auto h-12 w-12 animate-spin" />
            <p className="mt-4 text-muted-foreground">Loading martyrs...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMartyrs.map(martyr => (
                <MartyrCard key={`${martyr.id}-${martyr.en_name}`} martyr={martyr} />
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
          </>
        )}
      </div>
    </div>
  )
}
