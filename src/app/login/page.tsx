// src/app/login/page.tsx
"use client";

import { useState, useEffect, useTransition } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Terminal, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';


export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const initialTab = searchParams.get('tab') === 'signin' ? 'login' : 'signup';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
    } else if (data.user) {
        // Also insert into profiles table, but this can be done via a trigger as well.
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({ id: data.user.id, username: username })

        if (profileError) {
             setError(`Sign up successful, but failed to set username: ${profileError.message}`);
        } else {
            toast({
                title: "Registration Successful!",
                description: "Please check your email to confirm your account.",
            });
            setActiveTab('login'); // Switch to login tab
        }
    }
    setIsLoading(false);
  };
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
    } else {
      toast({ title: "Login Successful", description: "Welcome back! Redirecting..." });
      // Hard refresh is the most reliable way to ensure the new session is picked up everywhere
      window.location.href = '/feed';
    }
  };


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        
        {error && (
            <Alert variant="destructive" className="mt-4">
                <Terminal className="h-4 w-4" />
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
        )}

        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                   <Label htmlFor="username">Username</Label>
                   <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" placeholder="your_username" />
                </div>
                <div className="space-y-2">
                   <Label htmlFor="password">Password</Label>
                   <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                   {isLoading ? <LoaderCircle className="animate-spin"/> : 'Sign Up'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com" />
                </div>
                 <div className="space-y-2">
                   <Label htmlFor="login-password">Password</Label>
                   <Input id="login-password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required autoComplete="current-password" placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <LoaderCircle className="animate-spin"/> : 'Login'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
