'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getTodayDiet, getWorkoutHistory, getUserProfile } from '@/lib/database';
import DashboardHeader from '@/components/dashboard/header';
import DashboardNav from '@/components/dashboard/nav';
import WorkoutCard from '@/components/dashboard/workout-card';
import DietSummary from '@/components/dashboard/diet-summary';
import QuickStats from '@/components/dashboard/quick-stats';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [dietLogs, setDietLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [profileData, workoutsData, dietData] = await Promise.all([
        getUserProfile(user!.id).catch(() => null),
        getWorkoutHistory(user!.id).catch(() => []),
        getTodayDiet(user!.id).catch(() => []),
      ]);
      setProfile(profileData);
      setWorkouts(workoutsData || []);
      setDietLogs(dietData || []);
    } catch (error) {
      console.error('[v0] Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
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
        <DashboardHeader profile={profile} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
          <QuickStats workouts={workouts} dietLogs={dietLogs} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in-left">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-4">Recent Workouts</h2>
            <div className="space-y-4">
              {workouts.length > 0 ? (
                workouts.map((workout: any) => <WorkoutCard key={workout.id} workout={workout} onDelete={loadDashboardData} />)
              ) : (
                <div className="text-center py-12 glass-effect rounded-lg">
                  <p className="text-muted-foreground">No workouts yet. Start your fitness journey!</p>
                </div>
              )}
            </div>
          </div>

          <div className="animate-slide-in-right">
            <DietSummary dietLogs={dietLogs} onRefresh={loadDashboardData} />
          </div>
        </div>
      </main>
    </div>
  );
}
