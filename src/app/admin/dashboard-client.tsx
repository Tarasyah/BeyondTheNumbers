// src/app/admin/dashboard-client.tsx
"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { GuestbookEntry } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Trash2, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
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

export function AdminDashboardClient({ initialEntries }: { initialEntries: GuestbookEntry[] }) {
    const supabase = createClient();
    const [entries, setEntries] = useState<GuestbookEntry[]>(initialEntries);

    const handleAction = async (entryId: number, action: 'approve' | 'delete' | 'unapprove') => {
        if (action === 'delete') {
            const { error } = await supabase.from('guestbook_entries').delete().eq('id', entryId);
            if (error) {
                console.error("Failed to delete entry:", error.message);
            } else {
                setEntries(entries.filter(e => e.id !== entryId));
            }
        } else {
            const newStatus = action === 'approve';
            const { data, error } = await supabase
                .from('guestbook_entries')
                .update({ is_approved: newStatus })
                .eq('id', entryId)
                .select()
                .single();
            
            if (error) {
                console.error(`Failed to ${action} entry:`, error.message);
            } else if (data) {
                setEntries(entries.map(e => (e.id === entryId ? data : e)));
            }
        }
    };

    return (
        <>
            <header className="text-center my-12">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-4">Manage all guestbook entries.</p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Guestbook Entries</CardTitle>
                </CardHeader>
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
                            {entries.map(entry => (
                                <TableRow key={entry.id}>
                                    <TableCell>
                                        <Badge variant={entry.is_approved ? 'secondary' : 'default'} className="flex items-center gap-1 w-fit">
                                            {entry.is_approved ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                                            {entry.is_approved ? 'Approved' : 'Pending'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate">{entry.content}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{entry.author_name}</Badge>
                                    </TableCell>
                                    <TableCell>{format(new Date(entry.created_at), 'MMM d, yyyy, h:mm a')}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {entry.is_approved ? (
                                            <Button variant="outline" size="icon" onClick={() => handleAction(entry.id, 'unapprove')} title="Unapprove">
                                                <ShieldX className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button variant="secondary" size="icon" onClick={() => handleAction(entry.id, 'approve')} title="Approve">
                                                <ShieldCheck className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="icon" title="Delete">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the entry.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleAction(entry.id, 'delete')}>
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
                     {entries.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No entries found.</p>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
