// src/app/feed/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { Post, Profile } from '@/lib/types';
import type { User } from '@supabase/supabase-js';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageSquare, Send, UserCircle, LoaderCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const PostCard = ({ post }: { post: Post }) => {
  const username = post.profiles?.username || 'Anonymous';
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader className="p-4">
        <div className="flex items-center gap-3">
          <UserCircle className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="font-semibold text-foreground">{username}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-foreground/90 whitespace-pre-wrap">{post.content}</p>
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
)

export default function FeedPage() {
  const supabase = createClient();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  const fetchPosts = useCallback(async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false });

      if (error) {
        toast({ variant: "destructive", title: "Error", description: `Failed to load posts: ${error.message}` });
      } else {
        setPosts(data as Post[]);
      }
    }, [supabase, toast]);


  useEffect(() => {
    const getSessionAndProfile = async (user: User) => {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(userProfile);
        await fetchPosts();
        setIsLoading(false);
    }
    
    // Check for initial session on mount
    const checkInitialSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            setUser(session.user);
            await getSessionAndProfile(session.user);
        } else {
            setIsLoading(false);
        }
    }
    checkInitialSession();


    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        if (_event === 'SIGNED_IN') {
           setIsLoading(true); // Show loading when signing in
           await getSessionAndProfile(currentUser);
        }
      } else {
        setProfile(null);
        setPosts([]); // Clear posts on logout
        setIsLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, fetchPosts]);


  useEffect(() => {
     // Subscribe to post changes
    const channel = supabase
      .channel('realtime-posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, 
        (payload) => {
            fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchPosts]);


  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() || !user) return;

    setIsPosting(true);
    const { error } = await supabase.from('posts').insert({ content: postContent, user_id: user.id });
    
    if (error) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
        setPostContent('');
    }
    setIsPosting(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center my-12">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">COMMUNITY FEED</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A space to share information, thoughts, and support for Palestine.
        </p>
         {profile?.role === 'admin' && (
            <Button asChild variant="outline" className="mt-4">
                <Link href="/admin">Go to Admin Dashboard</Link>
            </Button>
        )}
      </header>

      <div className="max-w-2xl mx-auto space-y-8">
        {isLoading ? (
            <Skeleton className="h-40 w-full" />
        ) : user ? (
            <Card>
                <CardHeader>
                    <p className="text-sm font-medium">Welcome, {profile?.username || user.email}</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePostSubmit} className="space-y-4">
                    <Textarea
                      id="post-content"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="Share something..."
                      required
                      disabled={isPosting}
                    />
                    <Button type="submit" disabled={isPosting}>
                        {isPosting ? <LoaderCircle className="animate-spin mr-2 h-4 w-4"/> : <Send className="mr-2 h-4 w-4"/>}
                        {isPosting ? 'Posting...' : 'Post'}
                    </Button>
                  </form>
                </CardContent>
            </Card>
        ) : (
            <Card className="text-center p-8">
                <CardHeader>
                    <h3 className="font-semibold text-lg">Join the Conversation</h3>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Please <Link href="/login" className="underline text-primary">log in or sign up</Link> to create a post.
                    </p>
                </CardContent>
            </Card>
        )}

        <hr />

        <h2 className="text-2xl font-bold tracking-tight flex items-center"><MessageSquare className="mr-3"/>Recent Posts</h2>
        <div className="space-y-4">
          {isLoading && posts.length === 0 ? (
             <>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
             </>
          ) : posts.length > 0 ? (
            posts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
             <p className="text-muted-foreground text-center">No posts yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
}
