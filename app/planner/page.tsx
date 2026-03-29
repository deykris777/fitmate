'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getCurrentWeekPlan, getUserProfile, getRecentWorkoutSummary, saveWeeklyPlan } from '@/lib/database';
import DashboardNav from '@/components/dashboard/nav';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Exercise {
  name: string;
  sets?: number;
  reps?: number | string;
  rest_seconds?: number;
}

interface DayPlan {
  day: string;
  type: string;
  focus?: string;
  exercises?: Exercise[];
  duration_minutes?: number;
}

const PlannerCard = ({ dayPlan }: { dayPlan: DayPlan }) => {
  const [expanded, setExpanded] = useState(false);

  // Badge mapping
  const badgeClasses: Record<string, string> = {
    strength: 'bg-purple-700',
    cardio: 'bg-blue-700',
    rest: 'bg-gray-700',
    flexibility: 'bg-green-700',
  };

  const badgeColor = badgeClasses[dayPlan.type?.toLowerCase()] || 'bg-gray-700';

  return (
    <div className="glass-effect rounded-xl p-4 flex flex-col h-full animate-fade-in shadow-lg border border-border">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg text-foreground">{dayPlan.day}</h3>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${badgeColor}`}>
          {dayPlan.type?.toUpperCase()}
        </span>
      </div>
      
      {dayPlan.focus && (
        <p className="text-sm font-medium text-purple-300 mb-3">{dayPlan.focus}</p>
      )}

      {dayPlan.exercises && dayPlan.exercises.length > 0 ? (
        <div className="flex-1 mt-2">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-2"
          >
            {expanded ? 'Hide exercises ▴' : 'Show exercises ▾'}
          </button>
          
          {expanded && (
            <ul className="space-y-2 mb-4 text-sm text-foreground">
              {dayPlan.exercises.map((ex, idx) => (
                <li key={idx} className="bg-black/20 p-2 rounded-lg border border-white/5">
                  <span className="font-semibold">{ex.name}</span>
                  {(ex.sets || ex.reps) && (
                    <span className="text-muted-foreground ml-1">
                      — {ex.sets} sets × {ex.reps} reps
                    </span>
                  )}
                  {ex.rest_seconds && (
                    <span className="text-muted-foreground ml-1">
                      ({ex.rest_seconds}s rest)
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="flex-1" />
      )}

      <div className="mt-auto pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          {dayPlan.duration_minutes ? `~${dayPlan.duration_minutes} min` : 'Duration varies'}
        </p>
      </div>
    </div>
  );
};

export default function PlannerPage() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<DayPlan[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchPlan = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getCurrentWeekPlan(user.id);
      if (data && data.plan) {
        setPlan(data.plan);
      } else {
        setPlan(null);
      }
    } catch (err) {
      console.error('Failed to fetch plan', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [user]);

  const generatePlan = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      // Fetch data fully authenticated on frontend first
      const [profile, recentSummary] = await Promise.all([
        getUserProfile(user.id),
        getRecentWorkoutSummary(user.id)
      ]);

      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, recentSummary })
      });
      
      const data = await res.json();
      if (data.plan) {
        try {
          await saveWeeklyPlan(user.id, data.plan);
        } catch (saveErr: any) {
          console.warn('Failed to save to Supabase:', saveErr);
          if (saveErr?.message?.includes('schema cache') || saveErr?.message?.includes('weekly_plans')) {
            alert("The AI generated your plan! However, we couldn't save it to your database because the 'weekly_plans' table hasn't been created in your Supabase dashboard yet.\n\nPlease copy and run the SQL from scripts/init-database.sql into your Supabase SQL Editor so it persists perfectly permanently next time!");
          }
        }
        setPlan(data.plan);
      } else {
        alert(data.error ? `${data.error}: ${data.details || ''}` : 'Failed to generate plan');
      }
    } catch (err: any) {
      console.error('Generation failed', err);
      // Fallback check to inform user if profile is missing
      if (err.code === 'PGRST116') {
         alert(`Profile missing. Please add a diet entry or workout first to initialize your profile.`);
      } else {
         alert(`An error occurred during generation: ${err.message || 'Check terminal logs'}`);
      }
    } finally {
      setGenerating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-foreground">
      <DashboardNav user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">📅 Weekly Workout Planner</h1>
          <p className="text-muted-foreground mt-2 font-medium">Your personalized AI-adapted weekly schedule.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : generating ? (
          <div className="flex flex-col justify-center items-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-lg font-medium text-purple-300 animate-pulse">Building your personalized plan...</p>
          </div>
        ) : plan && plan.length > 0 ? (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
              {plan.map((dayPlan, idx) => (
                <PlannerCard key={idx} dayPlan={dayPlan} />
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Button onClick={generatePlan} variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                Regenerate Plan
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center py-20">
            <div className="glass-effect p-8 rounded-2xl max-w-md w-full text-center border border-primary/20 shadow-2xl">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h2 className="text-xl font-bold mb-2">No plan for this week yet.</h2>
              <p className="text-muted-foreground mb-6">Let FitMate's AI build a customized 7-day workout plan based on your goals, level, and recent history.</p>
              <Button onClick={generatePlan} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all hover:scale-[1.02]">
                Generate My Week's Plan
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
