// LOKASI: src/app/admin/dashboard-client.tsx
"use client";

import { useState, useEffect, useTransition } from 'react';
import { createClient } from '@/utils/supabase/client';
import { approveEntry, deleteEntry } from './actions';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AdminDashboardClient() {
  const supabase = createClient();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const fetchMessages = async () => {
    console.log("[DEBUG] Fetching messages from Supabase...");
    const { data, error } = await supabase
      .from('guestbook_entries')
      .select('*')
      .order('is_approved', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("[DEBUG] Error fetching messages:", error);
      alert(`Failed to load: ${error.message}`);
    } else {
      console.log("[DEBUG] Messages fetched successfully:", data);
      setMessages(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleAction = (action: 'approve' | 'delete', id: number) => {
    startTransition(async () => {
      console.log(`[DEBUG] 1. Action started: ${action} for ID ${id}`);
      try {
        const result = action === 'approve' ? await approveEntry(id) : await deleteEntry(id);
        
        console.log('[DEBUG] 2. Server action returned:', result);

        if (result.success) {
          console.log('[DEBUG] 3. Action was successful. Re-fetching messages...');
          await fetchMessages();
          console.log('[DEBUG] 4. Re-fetch complete. You should NOT be redirected.');
        } else {
          console.error('[DEBUG] Server action returned an error:', result.message);
          alert(`Server Error: ${result.message}`);
        }
      } catch (e) {
          console.error('[DEBUG] A critical error occurred while calling the action:', e);
          alert(`Client Error: ${e}`);
      }
    });
  };

  // Kode JSX/render tidak berubah
  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>
      <div className="space-y-4">
        {isLoading ? <p>Loading...</p> : messages.length > 0 ? (
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
                  {!msg.is_approved && (
                    <Button onClick={() => handleAction('approve', msg.id)} disabled={isPending}>
                      Approve
                    </Button>
                  )}
                  <Button onClick={() => handleAction('delete', msg.id)} disabled={isPending} variant="destructive">
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
