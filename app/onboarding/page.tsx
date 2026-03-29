'use client';

import React from "react"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { updateUserProfile } from '@/lib/database';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [formData, setFormData] = useState({
    height_cm: '',
    weight_kg: '',
    goal: 'muscle_gain',
    fitness_level: 'beginner',
  });

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      try {
        const { getUserProfile } = await import('@/lib/database');
        const data = await getUserProfile(user.id);
        if (data && (data.height_cm || data.goal)) {
          setFormData({
            height_cm: data.height_cm || '',
            weight_kg: data.weight_kg || '',
            goal: data.goal || 'muscle_gain',
            fitness_level: data.fitness_level || 'beginner',
          });
          setHasProfile(true);
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        fetchProfile();
      }
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await updateUserProfile(user.id, formData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background animate-fade-in">
      <Card className="w-full max-w-md glass-effect border-primary/30">
        <div className="p-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            {hasProfile ? 'Edit Profile' : 'Welcome!'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {hasProfile ? 'Update your fitness statistics and goals' : "Let's set up your fitness profile"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Height (cm)</label>
              <Input
                type="number"
                placeholder="170"
                value={formData.height_cm}
                onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })}
                required
                className="bg-secondary/50 border-primary/20 text-foreground"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Weight (kg)</label>
              <Input
                type="number"
                placeholder="75"
                value={formData.weight_kg}
                onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                required
                className="bg-secondary/50 border-primary/20 text-foreground"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Fitness Goal</label>
              <select
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="w-full bg-secondary/50 border border-primary/20 rounded-md px-3 py-2 text-foreground"
              >
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="endurance">Endurance</option>
                <option value="flexibility">Flexibility</option>
                <option value="general_fitness">General Fitness</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Experience Level
              </label>
              <select
                value={formData.fitness_level}
                onChange={(e) => setFormData({ ...formData, fitness_level: e.target.value })}
                className="w-full bg-secondary/50 border border-primary/20 rounded-md px-3 py-2 text-foreground"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="professional">Professional</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground smooth-transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Setting up...
                </>
              ) : (
                hasProfile ? 'Save Changes' : 'Complete Setup'
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
