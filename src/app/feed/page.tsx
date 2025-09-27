// src/app/feed/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { Post } from '@/lib/types';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageSquare, UserCircle } from 'lucide-react';
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

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false });

      if (error) {
        toast({ variant: "destructive", title: "Error", description: `Failed to load posts: ${error.message}` });
      } else {
        setPosts(data as Post[]);
      }
      setIsLoading(false);
    }, [supabase, toast]);


  useEffect(() => {
    fetchPosts();

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

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8 mt-12">
        <h2 className="text-2xl font-bold tracking-tight flex items-center"><MessageSquare className="mr-3"/>Recent Posts</h2>
        <div className="space-y-4">
          {isLoading ? (
             <>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
             </>
          ) : posts.length > 0 ? (
            posts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
             <p className="text-muted-foreground text-center">No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
