// src/app/admin/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { Post } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/alert-dialog";

export default function AdminPage() {
    const supabase = createClient();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllPosts = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('posts')
                .select('*, profiles(username)')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Failed to fetch posts:", error.message);
            } else {
                setPosts(data as Post[]);
            }
            setIsLoading(false);
        };
        
        fetchAllPosts();
    }, [supabase]);

    const handleDeletePost = async (postId: number) => {
        const { error } = await supabase.from('posts').delete().eq('id', postId);
        if (error) {
            console.error("Failed to delete post:", error.message);
        } else {
            console.log("Post deleted successfully.");
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
