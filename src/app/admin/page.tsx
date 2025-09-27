// src/app/admin/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import type { Post, Profile } from '@/lib/types';
import type { User } from '@supabase/supabase-js';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function AdminPage() {
    const supabase = createClient();
    const router = useRouter();
    const { toast } = useToast();

    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast({ variant: 'destructive', title: "Access Denied", description: "Please log in." });
                router.push('/login');
                return;
            }
            setUser(user);

            const { data: profileData, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (error || !profileData || profileData.role !== 'admin') {
                toast({ variant: 'destructive', title: "Access Denied", description: "You do not have admin privileges." });
                router.push('/feed');
                return;
            }
            setProfile(profileData as Profile);
            fetchAllPosts();
            setIsLoading(false);
        };
        initializeAdmin();
    }, [supabase, router, toast]);

    const fetchAllPosts = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*, profiles(username)')
            .order('created_at', { ascending: false });

        if (error) {
            toast({ variant: 'destructive', title: 'Error', description: `Failed to fetch posts: ${error.message}` });
        } else {
            setPosts(data as Post[]);
        }
    };
    
    const handleDeletePost = async (postId: number) => {
        const { error } = await supabase.from('posts').delete().eq('id', postId);
        if (error) {
            toast({ variant: 'destructive', title: 'Error', description: `Failed to delete post: ${error.message}` });
        } else {
            toast({ title: 'Success', description: 'Post deleted successfully.' });
            setPosts(posts.filter(p => p.id !== postId));
        }
    }


    if (isLoading) {
        return <div className="container p-8">Loading admin dashboard...</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <header className="text-center my-12">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-4">Manage all user posts.</p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>All Posts</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Content</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.map(post => (
                                <TableRow key={post.id}>
                                    <TableCell className="max-w-xs truncate">{post.content}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{post.profiles?.username || post.user_id.substring(0, 8)}</Badge>
                                    </TableCell>
                                    <TableCell>{format(new Date(post.created_at), 'MMM d, yyyy, h:mm a')}</TableCell>
                                    <TableCell className="text-right">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="icon">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the post.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeletePost(post.id)}>
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
