// LOKASI: src/app/admin/dashboard-client.tsx
"use client";

import { useState, useEffect, useTransition } from 'react';
import { getAllEntries, approveEntry, unapproveEntry, deleteEntry } from '../admin/actions';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { GuestbookEntry } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { logout } from './actions';

export function AdminDashboardClient() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const fetchMessages = async () => {
    setIsLoading(true);
    const data = await getAllEntries();
    setMessages(data);
    setIsLoading(false);
  };
  
  useEffect(() => {
    fetchMessages();
  }, []);

  const handleAction = (action: 'approve' | 'unapprove' | 'delete', id: number) => {
    startTransition(async () => {
      const originalMessages = [...messages];
      
      // Optimistic UI Update
      setMessages(prevMessages => {
        if (action === 'delete') {
          return prevMessages.filter(msg => msg.id !== id);
        }
        return prevMessages.map(msg => 
          msg.id === id ? { ...msg, is_approved: action === 'approve' } : msg
        ).sort((a, b) => {
          // Keep sorting consistent after update
          if (a.is_approved !== b.is_approved) {
            return a.is_approved ? 1 : -1;
          }
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
      });

      let result;
      if (action === 'approve') {
        result = await approveEntry(id);
      } else if (action === 'delete') {
        result = await deleteEntry(id);
      } else {
        result = await unapproveEntry(id);
      }

      if (result.success) {
        toast({ title: "Success", description: `Message ${action}d successfully.` });
        // Data is already updated optimistically, no need to re-fetch
      } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
        // Revert UI on error
        setMessages(originalMessages);
      }
    });
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading entries...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 relative">
       <div className="absolute top-4 right-4">
        <form action={logout}>
          <Button type="submit" variant="outline">Logout</Button>
        </form>
      </div>
      <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>
      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <Card key={msg.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{msg.author_name}</CardTitle>
                    <p className="text-sm text-gray-500">{new Date(msg.created_at).toLocaleString()}</p>
                  </div>
                  <Badge variant={msg.is_approved ? "default" : "secondary"}>
                    {msg.is_approved ? 'Approved' : 'Pending'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{msg.content}</p>
                <div className="flex gap-4">
                  {msg.is_approved ? (
                     <Button type="button" onClick={() => handleAction('unapprove', msg.id)} disabled={isPending} variant="secondary">
                        Unapprove
                     </Button>
                  ) : (
                    <Button type="button" onClick={() => handleAction('approve', msg.id)} disabled={isPending}>
                      Approve
                    </Button>
                  )}
                  <Button type="button" onClick={() => handleAction('delete', msg.id)} disabled={isPending} variant="destructive">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No entries found.</p>
        )}
      </div>
    </div>
  );
}
