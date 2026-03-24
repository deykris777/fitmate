'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp, createProfile } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const authData = await signUp(formData.email, formData.password, formData.fullName);
      if (authData.user) {
        try {
          await createProfile(authData.user.id, formData.email, formData.fullName);
          console.log('[v0] Profile created successfully for user:', authData.user.id);
        } catch (profileErr: any) {
          console.error('[v0] Profile creation error:', profileErr);
          // Don't fail signup if profile creation fails - user can continue
        }
      }
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
      console.error('[v0] Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-md bg-card border border-border/30">
        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold gradient-text mb-2">FitMate</h1>
            <p className="text-muted-foreground text-sm">Join your fitness revolution</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Full Name</label>
            <Input
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              className="bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/60"
            />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/60"
            />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Password</label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/60"
            />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Confirm Password</label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/60"
            />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-destructive/15 border border-destructive/30 rounded-lg p-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground smooth-transition"
          >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {'Already have an account? '}
            <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
