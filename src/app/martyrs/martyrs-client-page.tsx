"use client"

import { useState, useMemo, useTransition, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Martyr } from "@/lib/types";
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { fetchMartyrs } from './actions';
import { useScrollFade } from '@/hooks/use-scroll-fade';


function MartyrCard({ martyr }: { martyr: Martyr }) {
  const cardRef = useScrollFade();
  return (
    <div ref={cardRef} className="scroll-fade bg-card/20 border border-border/20 backdrop-blur-sm rounded-lg p-4 text-center shadow-md hover:shadow-primary/20 transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{martyr.en_name || 'Name not available'}</h3>
      </div>
      <div>
        <p className="text-muted-foreground mt-2">Age: {martyr.age ?? 'Unknown'}</p>
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

  useEffect(() => {
    // Prevent refetching on initial load if sort is default and no search
    if (page === 2 && sortOrder === 'latest' && searchTerm === '') return;

    setIsLoading(true);
    setMartyrs([]);
    setHasMore(true); 

    startTransition(async () => {
      const newMartyrs = await fetchMartyrs({ page: 1, sort: sortOrder });
      setMartyrs(newMartyrs);
      setPage(2);
      setHasMore(newMartyrs.length === 100);
      setIsLoading(false);
    });
  }, [sortOrder]); // Only re-run when sortOrder changes


  const filteredMartyrs = useMemo(() => {
    if (!searchTerm) return martyrs;
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
        setMartyrs(prev => [...prev, ...newMartyrs]);
        setPage(prevPage => prevPage + 1);
        if (newMartyrs.length < 100) setHasMore(false);
      } else {
        setHasMore(false);
      }
    });
  };

  const handleSortChange = (newSortOrder: string) => {
    if (newSortOrder === sortOrder) return;
    setSortOrder(newSortOrder);
  };
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center my-12">
        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-4">
          <span className="text-primary">Don't Forget</span>
          <span className="block text-foreground">Their Names</span>
        </h1>
        <p className="text-muted-foreground italic mt-6 max-w-3xl mx-auto">
          Never think of those martyred in the cause of Allah as dead. In fact, they are alive with their Lord, well provided for, rejoicing in Allah’s bounties and being delighted for those yet to join them. There will be no fear for them, nor will they grieve. (Quran 3:169-170)
        </p>
      </header>

      <div className="flex flex-col md:flex-row justify-center items-center mb-8 gap-4">
        <Input 
          placeholder="Search loaded names..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs w-full bg-card/50 backdrop-blur-sm"
        />
        <Select value={sortOrder} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full max-w-xs md:w-[180px] bg-card/50 backdrop-blur-sm">
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
          <LoaderCircle className="mx-auto h-12 w-12 animate-spin text-foreground" />
          <p className="mt-4 text-muted-foreground">Loading martyrs...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMartyrs.map((martyr, index) => (
              <MartyrCard key={`${martyr.id}-${index}`} martyr={martyr} />
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
  )
}
