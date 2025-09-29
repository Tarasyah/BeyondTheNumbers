import { login } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin Access</CardTitle>
          <CardDescription>Enter the password to access the admin dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={login} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
           <CardDescription className="mt-6 text-xs text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <div>
                <span className="font-bold">Important:</span> For this to work on Vercel/production, you must set the `ADMIN_PASSWORD` environment variable in your project settings.
              </div>
           </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
