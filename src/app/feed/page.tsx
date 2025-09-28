// src/app/feed/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { GuestbookEntry } from '@/lib/types';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';
import { UserCircle, MessageSquare, LoaderCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const PostCard = ({ entry }: { entry: GuestbookEntry }) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    // Menjalankan formatDistanceToNow hanya di client
    setTimeAgo(formatDistanceToNow(new Date(entry.created_at), { addSuffix: true }));
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


function GuestbookForm({ onNewEntry }: { onNewEntry: () => void }) {
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
            // 1. Verifikasi token hCaptcha via Edge Function
            const { data: verificationData, error: verificationError } = await supabase.functions.invoke('verify-hcaptcha', {
                body: { token: hCaptchaToken },
            });
            
            // Log for debugging
            console.log('hCaptcha verification response:', verificationData);

            if (verificationError) {
                 throw new Error(`Function invoke error: ${verificationError.message}`);
            }
            if (!verificationData.success) {
                throw new Error('CAPTCHA verification failed. Please try again.');
            }

            // 2. Jika verifikasi sukses, simpan data ke database
            const { error: insertError } = await supabase.from('guestbook_entries').insert({
                author_name: authorName,
                content: content,
            });

            if (insertError) {
                throw new Error(insertError.message);
            }

            // 3. Berhasil!
            toast({ title: 'Message Sent!', description: 'Thank you for your contribution. It will appear after being reviewed.' });
            setAuthorName('');
            setContent('');
            captchaRef.current?.resetCaptcha();
            setHCaptchaToken(null);
            onNewEntry(); // Notify parent to potentially show a message, but not refetch

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

                    <HCaptcha
                        sitekey="bf447234-0ca6-41fe-b4a4-fda06c6c73a2"
                        onVerify={(token) => setHCaptchaToken(token)}
                        onError={() => toast({ variant: 'destructive', title: 'CAPTCHA Error', description: 'Failed to load CAPTCHA.' })}
                        onExpire={() => setHCaptchaToken(null)}
                        ref={captchaRef}
                        theme='dark'
                    />

                    <Button type="submit" disabled={isSubmitting || !hCaptchaToken} className="w-full">
                        {isSubmitting ? <LoaderCircle className="animate-spin" /> : 'Post Message'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default function FeedPage() {
  const supabase = createClient();
  const { toast } = useToast();

  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [])


  const fetchEntries = useCallback(async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('guestbook_entries')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) {
        toast({ variant: "destructive", title: "Error", description: `Failed to load entries: ${error.message}` });
      } else {
        setEntries(data as GuestbookEntry[]);
      }
      setIsLoading(false);
    }, [supabase, toast]);


  useEffect(() => {
    if (isClient) {
        fetchEntries();

        const channel = supabase
          .channel('realtime-guestbook')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'guestbook_entries' }, 
            (payload) => {
                // Refetch all entries when any change happens to the table
                fetchEntries();
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
    }
  }, [isClient, supabase, fetchEntries]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8 mt-12">
        
        <GuestbookForm onNewEntry={() => {
            // Since new entries are not approved by default, we don't need to refetch here.
            // The realtime subscription will handle updates when an admin approves a post.
        }} />

        <div className="space-y-4">
          {isLoading || !isClient ? (
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

      </div>
    </div>
  );
}
