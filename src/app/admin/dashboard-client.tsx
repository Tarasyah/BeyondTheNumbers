"use client";

import { useState, useEffect } from 'react';
import { getAdminEntries, approveEntry, deleteEntry, logout } from './actions';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import type { GuestbookEntry } from '@/lib/types';

export function AdminDashboardClient() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // FUNGSI KUNCI: Sekarang memanggil Server Action
  const fetchMessages = async () => {
    const result = await getAdminEntries(); // <-- PERUBAHAN UTAMA
    
    if (result.success) {
      setMessages(result.data || []);
    } else {
      toast({ variant: "destructive", title: "Failed to load entries", description: result.error });
    }
    setIsLoading(false);
  };

  // useEffect tidak berubah
  useEffect(() => {
    fetchMessages();
  }, []);

  // handleAction tidak berubah
  const handleAction = async (action: 'approve' | 'delete', id: number) => {
    const result = action === 'approve' ? await approveEntry(id) : await deleteEntry(id);
    if (result.success) {
      toast({ title: "Success!", description: `Message has been ${action}d.` });
      await fetchMessages(); 
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading entries...</div>;
  }

  return (
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
              <p className="mb-4 whitespace-pre-wrap">{msg.content}</p>
              <div className="flex gap-4">
                {!msg.is_approved && (
                  <Button type="button" onClick={() => handleAction('approve', msg.id)}>
                    Approve
                  </Button>
                )}
                <Button type="button" onClick={() => handleAction('delete', msg.id)} variant="destructive">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center text-gray-500 py-8">No entries found to review.</p>
      )}
    </div>
  );
}
