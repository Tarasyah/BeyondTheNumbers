// src/app/feed/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { Post, Profile } from '@/lib/types';
import type { User } from '@supabase/supabase-js';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { LogIn, LogOut, MessageSquare, Send, UserCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';

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
  const [email, setEmail] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: userProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
        setProfile(userProfile);
      }
      setIsLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (_event === 'SIGNED_OUT') {
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(*)')
        .order('created_at', { ascending: false });

      if (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to load posts." });
      } else {
        setPosts(data as Post[]);
      }
    };

    fetchPosts();

    const channel = supabase
      .channel('realtime-posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, async (payload) => {
        // This is a simplified real-time update. For production, you might need more sophisticated logic.
        fetchPosts(); 
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast({ variant: "destructive", title: "Login Error", description: error.message });
    } else {
      toast({ title: "Check your email", description: "A magic link has been sent to you." });
      setEmail('');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out" });
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    const { error } = await supabase.from('posts').insert({ content: postContent, user_id: user!.id });
    
    if (error) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
        setPostContent('');
    }
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
                <a href="/admin">Go to Admin Dashboard</a>
            </Button>
        )}
      </header>

      <div className="max-w-2xl mx-auto space-y-8">
        {isLoading ? (
            <Skeleton className="h-40 w-full" />
        ) : user ? (
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">Logged in as {user.email}</p>
                        <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4"/>Logout</Button>
                    </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePostSubmit} className="space-y-4">
                    <Textarea
                      id="post-content"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="Share something..."
                      required
                    />
                    <Button type="submit"><Send className="mr-2 h-4 w-4"/>Post</Button>
                  </form>
                </CardContent>
            </Card>
        ) : (
            <Card>
                <CardHeader>
                    <h3 className="font-semibold text-lg flex items-center"><LogIn className="mr-2"/>Login to Post</h3>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Enter your email to receive a magic link to log in. No password required.</p>
                    <form onSubmit={handleLogin} className="flex items-center gap-2">
                        <Input
                        type="email"
                        id="email-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        />
                        <Button type="submit">Send Link</Button>
                    </form>
                </CardContent>
            </Card>
        )}

        <hr />

        <h2 className="text-2xl font-bold tracking-tight flex items-center"><MessageSquare className="mr-3"/>Recent Posts</h2>
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            <>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
