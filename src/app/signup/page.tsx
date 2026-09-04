"use client";

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

function SignUpForm() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user && !isSubmitting) router.replace('/');
  }, [isSubmitting, isUserLoading, router, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 6) {
      toast({ title: 'Password Too Short', description: 'Use at least 6 characters.', variant: 'destructive' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'Passwords Do Not Match', description: 'Please re-enter your password.', variant: 'destructive' });
      return;
    }

    try {
      setIsSubmitting(true);
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await Promise.allSettled([
        updateProfile(credential.user, { displayName: name.trim() }),
        sendEmailVerification(credential.user),
      ]);
      toast({ title: 'Account Created', description: 'Welcome to InFaith Journey!' });
      router.replace('/');
    } catch (error: any) {
      const message = error?.code === 'auth/email-already-in-use'
        ? 'An account already exists for this email. Please sign in instead.'
        : error?.code === 'auth/invalid-email'
          ? 'Enter a valid email address.'
          : error?.code === 'auth/weak-password'
            ? 'Choose a stronger password with at least 6 characters.'
            : 'We could not create your account. Please try again.';
      toast({ title: 'Sign Up Failed', description: message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col watercolor-bg">
      <Navbar />
      <main id="main-content" className="flex flex-1 items-center justify-center p-6 pt-56 md:pt-[120px]">
        <Card className="w-full max-w-md overflow-hidden rounded-[24px] border border-border bg-card shadow-2xl md:rounded-[32px]">
          <CardHeader className="space-y-3 pb-6 pt-8 text-center md:pt-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserPlus className="h-5 w-5" />
            </div>
            <CardTitle className="font-headline text-[28px] leading-tight md:text-[32px]">Create Vendor Account</CardTitle>
            <CardDescription className="text-[14px] italic md:text-[15px]">
              Create your login to join InFaith Journey.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-10 md:px-10 md:pb-12">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full Name</Label>
                <Input id="signup-name" value={name} onChange={event => setName(event.target.value)} required autoComplete="name" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
                <Input id="signup-email" type="email" value={email} onChange={event => setEmail(event.target.value)} required autoComplete="email" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Password</Label>
                <div className="relative">
                  <Input id="signup-password" type={showPassword ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)} required minLength={6} autoComplete="new-password" className="h-12 rounded-xl pr-12" />
                  <button type="button" onClick={() => setShowPassword(current => !current)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Confirm Password</Label>
                <div className="relative">
                  <Input id="signup-confirm-password" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} required minLength={6} autoComplete="new-password" className="h-12 rounded-xl pr-12" />
                  <button type="button" onClick={() => setShowConfirmPassword(current => !current)} aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting} className="button-rose h-12 w-full font-bold tracking-widest md:h-14">
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'CREATE ACCOUNT'}
              </Button>
            </form>
            <p className="mt-6 text-center text-[13px] font-medium text-muted-foreground">
              Already have an account? <Link href="/dashboard" className="font-bold text-primary hover:underline">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default function SignUpPage() {
  return <SignUpForm />;
}
