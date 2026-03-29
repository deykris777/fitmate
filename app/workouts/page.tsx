'use client';

import React from "react"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { addWorkout, getWorkoutHistory, updateWorkoutStreak } from '@/lib/database';
import DashboardNav from '@/components/dashboard/nav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import WorkoutCard from '@/components/dashboard/workout-card';
import { Loader2, Plus } from 'lucide-react';

const COMMON_EXERCISES = [
  "Push-ups",
  "Pull-ups",
  "Squats",
  "Deadlifts",
  "Bench Press",
  "Overhead Press",
  "Barbell Rows",
  "Lunges",
  "Plank",
  "Bicep Curls",
  "Tricep Extensions",
  "Leg Press",
  "Lat Pulldown"
];

export default function WorkoutsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    exercise_name: '',
    duration: '',
    intensity: 'medium',
    calories_burned: '',
    sets: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadWorkouts();
    }
  }, [user]);

  const loadWorkouts = async () => {
    try {
      const data = await getWorkoutHistory(user!.id, 100);
      setWorkouts(data);
    } catch (error) {
      console.error('Failed to load workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.exercise_name.trim() || !formData.duration) {
      alert('Please fill in exercise name and duration');
      return;
    }

    setSubmitting(true);
    try {
      console.log('[v0] Adding workout for user:', user.id);
      await addWorkout(user.id, {
        exercise_name: formData.exercise_name,
        duration_minutes: parseInt(formData.duration),
        intensity: formData.intensity,
        notes: formData.notes || null,
        sets: formData.sets ? parseInt(formData.sets) : null,
      });

      await updateWorkoutStreak(user!.id).catch(console.error);

      setFormData({
        exercise_name: '',
        duration: '',
        intensity: 'medium',
        calories_burned: '',
        sets: '',
        notes: '',
      });
      await loadWorkouts();
      alert('Workout added successfully!');
    } catch (error: any) {
      console.error('[v0] Failed to add workout:', error);
      alert('Error: ' + (error.message || 'Failed to add workout'));
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={user!} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-slide-in-right">
          <h1 className="text-4xl font-bold gradient-text mb-2">My Workouts</h1>
          <p className="text-muted-foreground">Track and log your fitness activities</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="glass-effect border-primary/20 p-6 h-fit animate-slide-in-left lg:col-span-1">
            <h2 className="text-xl font-bold text-foreground mb-6">Log New Workout</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Exercise Name</label>
                <Input
                  type="text"
                  list="exercise-suggestions"
                  placeholder="e.g., Push-ups"
                  value={formData.exercise_name}
                  onChange={(e) => setFormData({ ...formData, exercise_name: e.target.value })}
                  required
                  className="bg-secondary/50 border-primary/20"
                />
                <datalist id="exercise-suggestions">
                  {COMMON_EXERCISES.map((exercise) => (
                    <option key={exercise} value={exercise} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Duration (min)</label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                    className="bg-secondary/50 border-primary/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Intensity</label>
                  <select
                    value={formData.intensity}
                    onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
                    className="w-full bg-secondary/50 border border-primary/20 rounded-md px-3 py-2 text-foreground"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Calories Burned</label>
                  <Input
                    type="number"
                    placeholder="250"
                    value={formData.calories_burned}
                    onChange={(e) => setFormData({ ...formData, calories_burned: e.target.value })}
                    className="bg-secondary/50 border-primary/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Sets</label>
                  <Input
                    type="number"
                    placeholder="3"
                    value={formData.sets}
                    onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                    className="bg-secondary/50 border-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Notes</label>
                <textarea
                  placeholder="How did it feel?"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-secondary/50 border border-primary/20 rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground resize-none"
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Log Workout
                  </>
                )}
              </Button>
            </form>
          </Card>

          <div className="lg:col-span-2 animate-slide-in-right">
            <h2 className="text-2xl font-bold text-foreground mb-4">Workout History</h2>
            <div className="space-y-4">
              {workouts.length > 0 ? (
                workouts.map((workout) => (
                  <WorkoutCard key={workout.id} workout={workout} onDelete={loadWorkouts} />
                ))
              ) : (
                <Card className="glass-effect p-12 text-center border-primary/20">
                  <p className="text-muted-foreground">No workouts logged yet. Start your first one!</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
