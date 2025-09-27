// src/app/login/page.tsx
"use client";

import { useState, useEffect, useTransition } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Terminal, LoaderCircle } from 'lucide-react';
import './login.css';
import { cn } from '@/lib/utils';

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

  // Sync tab state with URL changes
  useEffect(() => {
    const tab = searchParams.get('tab') === 'signin' ? 'login' : 'signup';
    setActiveTab(tab);
  }, [searchParams]);

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
            .update({ username: username })
            .eq('id', data.user.id)

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
    <div className="login-page-wrapper">
       <div className="form-wrap">
        <div className="tabs">
          <h3 className="signup-tab">
            <a 
              className={cn(activeTab === 'signup' && 'active')} 
              href="#signup"
              onClick={(e) => {e.preventDefault(); setActiveTab('signup')}}
            >
              Sign Up
            </a>
          </h3>
          <h3 className="login-tab">
            <a 
              className={cn(activeTab === 'login' && 'active')} 
              href="#login"
              onClick={(e) => {e.preventDefault(); setActiveTab('login')}}
            >
              Login
            </a>
          </h3>
        </div>

        <div className="tabs-content">
          {error && (
              <Alert variant="destructive" className="mb-4">
                  <Terminal className="h-4 w-4" />
                  <AlertDescription>
                      {error}
                  </AlertDescription>
              </Alert>
          )}

          <div id="signup-tab-content" className={cn(activeTab === 'signup' && 'active')}>
            <form className="signup-form" onSubmit={handleSignUp}>
              <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="Email" />
              <input type="text" className="input" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" placeholder="Username" />
              <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" placeholder="Password" />
              <button type="submit" className="button" disabled={isLoading}>
                 {isLoading && activeTab ==='signup' ? <LoaderCircle className="animate-spin mx-auto"/> : 'Sign Up'}
              </button>
            </form>
            <div className="help-text">
              <p>By signing up, you agree to our</p>
              <p><a href="#">Terms of service</a></p>
            </div>
          </div>

          <div id="login-tab-content" className={cn(activeTab === 'login' && 'active')}>
            <form className="login-form" onSubmit={handleSignIn}>
              <input type="text" className="input" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required autoComplete="email" placeholder="Email" />
              <input type="password" className="input" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required autoComplete="current-password" placeholder="Password" />
              <input type="checkbox" className="checkbox" id="remember_me" />
              <label htmlFor="remember_me">Remember me</label>
              <button type="submit" className="button" disabled={isLoading}>
                 {isLoading && activeTab === 'login' ? <LoaderCircle className="animate-spin mx-auto"/> : 'Login'}
              </button>
            </form>
            <div className="help-text">
              <p><a href="#">Forget your password?</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
