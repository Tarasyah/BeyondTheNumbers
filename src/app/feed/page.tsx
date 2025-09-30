// src/app/feed/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef, Suspense, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import type { GuestbookEntry } from '@/lib/types';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';
import { UserCircle, MessageSquare, LoaderCircle, Terminal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { login } from '../admin/actions';
import dynamic from 'next/dynamic';


const PostCard = ({ entry }: { entry: GuestbookEntry }) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    setTimeAgo(formatDistanceToNow(new Date(entry.created_at), { addSuffix: true }));
    const interval = setInterval(() => {
        setTimeAgo(formatDistanceToNow(new Date(entry.created_at), { addSuffix: true }));
    }, 60000);
    return () => clearInterval(interval);
  }, [entry.created_at]);

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader className="p-4">
        <div className="flex items-center gap-3">
          <UserCircle className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="font-semibold text-foreground">{entry.author_name}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-foreground/90 whitespace-pre-wrap">{entry.content}</p>
      </CardContent>
    </Card>
  );
};

const PostSkeleton = () => (
    <Card>
        <CardHeader className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className='space-y-2'>
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </CardContent>
    </Card>
);


function GuestbookForm() {
    const supabase = createClient();
    const { toast } = useToast();

    const [authorName, setAuthorName] = useState('');
    const [content, setContent] = useState('');
    const [hCaptchaToken, setHCaptchaToken] = useState<string | null>(null);
    const captchaRef = useRef<HCaptcha>(null);
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hCaptchaToken) {
            toast({ variant: 'destructive', title: 'Verification Failed', description: 'Please complete the CAPTCHA.' });
            return;
        }
        if (!authorName.trim() || !content.trim()) {
            toast({ variant: 'destructive', title: 'Missing Information', description: 'Please fill out your name and message.' });
            return;
        }

        setIsSubmitting(true);

        try {
            const { data: verificationData, error: verificationError } = await supabase.functions.invoke('verify-hcaptcha', {
                body: { token: hCaptchaToken },
            });
            
            if (verificationError || !verificationData.success) {
                 throw new Error(verificationError?.message || 'CAPTCHA verification failed. Please try again.');
            }

            const { error: insertError } = await supabase.from('guestbook_entries').insert({
                author_name: authorName,
                content: content,
            });

            if (insertError) {
                throw new Error(insertError.message);
            }

            toast({ title: 'Message Sent!', description: 'Thank you for your contribution. It will appear after being reviewed.' });
            setAuthorName('');
            setContent('');
            captchaRef.current?.resetCaptcha();
            setHCaptchaToken(null);

        } catch (error: any) {
            toast({ variant: 'destructive', title: 'An error occurred', description: error.message });
            console.error("Submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <Card className="mb-8 bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className='flex items-center'><MessageSquare className="mr-3"/> Share a Message</CardTitle>
            </CardHeader>
            <CardContent>
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="authorName">Your Name</Label>
                        <Input
                            id="authorName"
                            type="text"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            required
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Your Message</Label>
                        <Textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows={4}
                            placeholder="Share your thoughts, prayers, or a message of solidarity..."
                        />
                    </div>
                    
                    <div className="flex justify-center">
                        <div className="transform scale-75 sm:scale-100 origin-center">
                            <HCaptcha
                                sitekey="bf447234-0ca6-41fe-b4a4-fda06c6c73a2"
                                onVerify={(token) => setHCaptchaToken(token)}
                                onError={() => toast({ variant: 'destructive', title: 'CAPTCHA Error', description: 'Failed to load CAPTCHA.' })}
                                onExpire={() => setHCaptchaToken(null)}
                                ref={captchaRef}
                                theme='dark'
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={isSubmitting || !hCaptchaToken} className="w-full">
                        {isSubmitting ? <LoaderCircle className="animate-spin" /> : 'Post Message'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

function AdminLoginForm() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    return (
        <Card className="w-full max-w-sm mx-auto">
            <CardHeader>
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>Enter password to manage entries.</CardDescription>
            </CardHeader>
            <CardContent>
              {error === 'InvalidPassword' && (
                  <Alert variant="destructive" className="mb-4">
                      <Terminal className="h-4 w-4" />
                      <AlertDescription>Invalid password.</AlertDescription>
                  </Alert>
              )}
              <form action={login} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </CardContent>
        </Card>
    )
}

const POSTS_PER_PAGE = 20;

function FeedPageContent() {
  const supabase = createClient();
  const { toast } = useToast();

  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isPending, startTransition] = useTransition();

  const fetchEntries = useCallback(async (pageNum: number) => {
      const from = (pageNum - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from('guestbook_entries')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        toast({ variant: "destructive", title: "Error", description: `Failed to load entries: ${error.message}` });
        return [];
      } else {
        if (data.length < POSTS_PER_PAGE) {
          setHasMore(false);
        }
        return data as GuestbookEntry[];
      }
    }, [supabase, toast]);

  useEffect(() => {
    setIsLoading(true);
    fetchEntries(1).then(initialEntries => {
        setEntries(initialEntries);
        setIsLoading(false);
    });
  }, [fetchEntries]);

  const handleLoadMore = () => {
    if (!hasMore || isPending) return;

    startTransition(async () => {
        const nextPage = page + 1;
        const newEntries = await fetchEntries(nextPage);
        setEntries(prev => [...prev, ...newEntries]);
        setPage(nextPage);
    });
  }
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8 mt-12">
        
        <header className="text-center my-12 space-y-4">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-primary">Your Voice Matters</h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
                Share your information, thoughts, and support methods for Palestine.
            </p>
        </header>
        
        <div className="space-y-4">
          {isLoading && entries.length === 0 ? (
             <>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
             </>
          ) : entries.length > 0 ? (
            entries.map(entry => <PostCard key={entry.id} entry={entry} />)
          ) : (
             <p className="text-muted-foreground text-center py-8">No messages yet. Be the first to share one!</p>
          )}
        </div>
        
        {hasMore && !isLoading && (
            <div className="text-center">
                <Button onClick={handleLoadMore} variant="outline" size="lg" disabled={isPending}>
                    {isPending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Load More
                </Button>
            </div>
        )}

        <GuestbookForm />

      </div>

      <div className="pt-24 pb-12">
          <AdminLoginForm />
      </div>
    </div>
  );
}

const DynamicFeedPageContent = dynamic(
    () => Promise.resolve(FeedPageContent), // We just need to make it dynamic
    { 
        ssr: false,
        loading: () => (
             <div className="container mx-auto p-4 md:p-8">
                <div className="max-w-2xl mx-auto space-y-8 mt-12">
                    <header className="text-center my-12 space-y-4">
                        <Skeleton className="h-16 w-3/4 mx-auto" />
                        <Skeleton className="h-10 w-full max-w-xl mx-auto" />
                    </header>
                    <div className="space-y-4">
                        <PostSkeleton />
                        <PostSkeleton />
                        <PostSkeleton />
                    </div>
                </div>
            </div>
        )
    }
);


export default function FeedPage() {
    return (
        <Suspense>
            <DynamicFeedPageContent />
        </Suspense>
    )
}
