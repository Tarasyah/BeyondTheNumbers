// src/app/admin/dashboard-client.tsx
"use client";

import { useState, useTransition } from 'react';
import type { GuestbookEntry } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Trash2, ShieldCheck, ShieldAlert, ShieldX, LoaderCircle } from 'lucide-react';
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
import { approveEntry, unapproveEntry, deleteEntry } from './actions';
import { useToast } from '@/hooks/use-toast';


export function AdminDashboardClient({ initialEntries }: { initialEntries: GuestbookEntry[] }) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const handleAction = (id: number, action: 'approve' | 'unapprove' | 'delete') => {
        startTransition(async () => {
            let result;
            if (action === 'approve') {
                result = await approveEntry(id);
            } else if (action === 'unapprove') {
                result = await unapproveEntry(id);
            } else if (action === 'delete') {
                result = await deleteEntry(id);
            }

            if (result?.success) {
                toast({ title: 'Success!', description: result.message });
            } else if (result?.message) {
                toast({ variant: 'destructive', title: 'Error', description: result.message });
            }
        });
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
                            {initialEntries.map(entry => (
                                <TableRow key={entry.id} className={isPending ? 'opacity-50' : ''}>
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
                                            <Button variant="outline" size="icon" onClick={() => handleAction(entry.id, 'unapprove')} title="Unapprove" disabled={isPending}>
                                                <ShieldX className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button variant="secondary" size="icon" onClick={() => handleAction(entry.id, 'approve')} title="Approve" disabled={isPending}>
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
                     {initialEntries.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No entries found to review.</p>
                    )}
                </CardContent>
            </Card>
            {isPending && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                    <LoaderCircle className="animate-spin text-white h-12 w-12" />
                </div>
            )}
        </>
    );
}