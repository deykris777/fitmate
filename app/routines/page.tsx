'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getExerciseRoutines } from '@/lib/database';
import DashboardNav from '@/components/dashboard/nav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, CheckCircle2 } from 'lucide-react';

const defaultRoutines = [
  {
    id: 'beginner-strength',
    name: 'Beginner Strength',
    description: 'Perfect for building a solid foundation',
    level: 'Beginner',
    days: 3,
    exercises: [
      { name: 'Push-ups', sets: '3', reps: '10-12' },
      { name: 'Squats', sets: '3', reps: '12-15' },
      { name: 'Plank', sets: '3', duration: '30s' },
    ],
  },
  {
    id: 'intermediate-hypertrophy',
    name: 'Intermediate Hypertrophy',
    description: 'Build muscle size and strength',
    level: 'Intermediate',
    days: 4,
    exercises: [
      { name: 'Bench Press', sets: '4', reps: '8-10' },
      { name: 'Squats', sets: '4', reps: '8-10' },
      { name: 'Deadlifts', sets: '3', reps: '6-8' },
      { name: 'Pull-ups', sets: '3', reps: '8-12' },
    ],
  },
  {
    id: 'advanced-periodized',
    name: 'Advanced Periodized',
    description: 'Optimal gains with periodization',
    level: 'Advanced',
    days: 5,
    exercises: [
      { name: 'Heavy Squats', sets: '5', reps: '3-5' },
      { name: 'Bench Press', sets: '5', reps: '3-5' },
      { name: 'Deadlifts', sets: '3', reps: '3-5' },
      { name: 'Accessory Work', sets: '3', reps: '8-12' },
    ],
  },
  {
    id: 'cardio-endurance',
    name: 'Cardio & Endurance',
    description: 'Improve cardiovascular health',
    level: 'Intermediate',
    days: 4,
    exercises: [
      { name: 'Running', sets: '1', duration: '30-45 min' },
      { name: 'Cycling', sets: '1', duration: '45 min' },
      { name: 'HIIT', sets: '5', duration: '30s sprint, 30s rest' },
    ],
  },
  {
    id: 'flexibility-mobility',
    name: 'Flexibility & Mobility',
    description: 'Increase range of motion and reduce injury',
    level: 'Beginner',
    days: 5,
    exercises: [
      { name: 'Yoga', sets: '1', duration: '30-45 min' },
      { name: 'Stretching', sets: '1', duration: '15 min' },
      { name: 'Foam Rolling', sets: '1', duration: '10 min' },
    ],
  },
  {
    id: 'crossfit-style',
    name: 'CrossFit Style WOD',
    description: 'Functional fitness and intensity',
    level: 'Intermediate',
    days: 5,
    exercises: [
      { name: 'Warm-up', sets: '1', duration: '10 min' },
      { name: 'Strength', sets: '5', reps: 'Varies' },
      { name: 'WOD', sets: '1', duration: '15 min' },
    ],
  },
];

export default function RoutinesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [routines] = useState(defaultRoutines);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleCopyRoutine = async (routine: any) => {
    try {
      const text = `${routine.name}\n\n${routine.description}\n\nLevel: ${routine.level}\nDays per week: ${routine.days}\n\nExercises:\n${routine.exercises.map((e: any) => `- ${e.name}: ${e.sets} sets ${e.reps || e.duration}`).join('\n')}`;
      await navigator.clipboard.writeText(text);
      setCopied(routine.id);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
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
    <div className="min-h-screen bg-background">
      <DashboardNav user={user!} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-slide-in-right">
          <h1 className="text-4xl font-bold gradient-text mb-2">Exercise Routines</h1>
          <p className="text-muted-foreground">Choose a routine that matches your fitness level and goals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routines.map((routine, i) => (
            <Card
              key={routine.id}
              className="glass-effect border-primary/20 p-6 hover:border-primary/40 smooth-transition animate-fade-in flex flex-col"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-foreground">{routine.name}</h3>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary/20 border border-primary/30 text-primary">
                    {routine.level}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{routine.description}</p>
              </div>

              <div className="mb-4 flex-grow">
                <p className="text-xs font-semibold text-muted-foreground mb-3">
                  {routine.days} days/week
                </p>
                <div className="space-y-2">
                  {routine.exercises.map((exercise: any, j: number) => (
                    <div key={j} className="bg-secondary/30 rounded p-2 text-sm">
                      <p className="font-medium text-foreground">{exercise.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {exercise.sets} × {exercise.reps || exercise.duration}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => handleCopyRoutine(routine)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground smooth-transition"
              >
                {copied === routine.id ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Routine
                  </>
                )}
              </Button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
