
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LandingHeader } from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/landing-footer';
import { Logo } from '@/components/common/logo';
import { Mail, KeyRound, CheckCircle, AlertCircle } from 'lucide-react';

// Placeholder for Firebase Auth functions
async function signInWithEmail(email: string, password: string) {
  console.log("Attempting to sign in:", { email, password });
  // Replace with actual Firebase Auth call:
  // await firebase.auth().signInWithEmailAndPassword(email, password);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email.includes("error") || password === "wrong") {
        reject(new Error("Mockup: Identifiants incorrects."));
      } else {
        resolve({ user: { uid: "mockUserId", email } });
        // router.push('/dashboard'); // Redirect after successful login
      }
    }, 1000);
  });
}

async function signInWithGoogle() {
  console.log("Attempting to sign in with Google");
  // Replace with actual Firebase Auth call:
  // const provider = new firebase.auth.GoogleAuthProvider();
  // await firebase.auth().signInWithPopup(provider);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ user: { uid: "mockGoogleUserId", email: "googleuser@example.com", displayName: "Google User" } });
      // router.push('/dashboard'); // Redirect after successful login
    }, 1000);
  });
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      setSuccess("Connexion réussie ! Redirection...");
      // In a real app, you'd redirect to /dashboard
      // For now, clear form or show success message
       setEmail(''); setPassword('');
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      setSuccess("Connexion avec Google réussie ! Redirection...");
      // In a real app, you'd redirect to /dashboard
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la connexion avec Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <LandingHeader />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
             <div className="mx-auto mb-4">
                <Logo isTextVisible={true} />
            </div>
            <CardTitle className="text-2xl">Connexion à coccinelle.ai</CardTitle>
            <CardDescription>Accédez à votre tableau de bord et gérez vos agents.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="vous@agence.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link href="#" className="text-sm text-primary hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10" />
                </div>
              </div>

              {error && (
                <div className="flex items-center p-3 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}
              {success && (
                 <div className="flex items-center p-3 text-sm text-emerald-700 bg-emerald-500/10 border border-emerald-500/30 rounded-md">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {success}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Connexion en cours...' : "Se connecter"}
              </Button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Ou continuer avec
                </span>
              </div>
            </div>
             <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
               {/* Simple Google-like icon placeholder */}
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
              </svg>
              Se connecter avec Google
            </Button>
          </CardContent>
          <CardFooter className="text-center text-sm">
            <p className="w-full">
              Pas encore de compte ?{' '}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                S'inscrire
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      <LandingFooter />
    </div>
  );
}
