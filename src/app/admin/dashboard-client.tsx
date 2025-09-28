// src/app/admin/dashboard-client.tsx
"use client";

import { useState, useEffect, useTransition } from 'react';
import { createClient } from '@/utils/supabase/client';
import { approveEntry, unapproveEntry, deleteEntry } from './actions';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import type { GuestbookEntry } from '@/lib/types';
import { format } from 'date-fns';
import { LoaderCircle, ShieldCheck, ShieldX, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


export function AdminDashboardClient() {
  const supabase = createClient();
  const { toast } = useToast();
  const [messages, setMessages] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchMessages = async () => {
      // Ambil SEMUA entri, diurutkan berdasarkan status
      const { data, error } = await supabase
        .from('guestbook_entries')
        .select('*')
        .order('is_approved', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({ variant: "destructive", title: "Failed to load entries", description: error.message });
      } else {
        setMessages(data || []);
      }
      setIsLoading(false);
    };

    fetchMessages();

    // Set up a real-time listener
    const channel = supabase
      .channel('guestbook-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'guestbook_entries' },
        (payload) => {
          console.log('Change received!', payload)
          // Re-fetch data whenever a change occurs
          fetchMessages();
        }
      )
      .subscribe()

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };

  }, [supabase, toast]); 

  const handleAction = (action: 'approve' | 'unapprove' | 'delete', id: number) => {
    startTransition(async () => {
      let result;
      if (action === 'approve') result = await approveEntry(id);
      else if (action === 'unapprove') result = await unapproveEntry(id);
      else result = await deleteEntry(id);
      
      if (result.success) {
        toast({ title: "Success!", description: `Message has been updated.` });
      } else if (result.message){
        toast({ variant: "destructive", title: "Error", description: result.message });
      }
    });
  };

  return (
    <div>
        <header className="text-center my-12">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-4">Manage all guestbook entries.</p>
        </header>

        <Card>
            <CardHeader><CardTitle>Guestbook Entries</CardTitle></CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Content</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : messages.length > 0 ? (
                            messages.map(entry => (
                                <TableRow key={entry.id} className={isPending ? 'opacity-50' : ''}>
                                    <TableCell>
                                        <Badge variant={entry.is_approved ? 'secondary' : 'default'} className="w-fit">
                                            {entry.is_approved ? 'Approved' : 'Pending'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate">{entry.content}</TableCell>
                                    <TableCell><Badge variant="outline">{entry.author_name}</Badge></TableCell>
                                    <TableCell>{format(new Date(entry.created_at), 'MMM d, yyyy, h:mm a')}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {entry.is_approved ? (
                                            <Button variant="outline" size="icon" onClick={() => handleAction('unapprove', entry.id)} title="Unapprove" disabled={isPending}>
                                                <ShieldX className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button variant="secondary" size="icon" onClick={() => handleAction('approve', entry.id)} title="Approve" disabled={isPending}>
                                                <ShieldCheck className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="icon" title="Delete" disabled={isPending}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>This will permanently delete the entry.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleAction('delete', entry.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">No entries found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
         {isPending && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                    <LoaderCircle className="animate-spin text-white h-12 w-12" />
                </div>
            )}
    </div>
  );
}
