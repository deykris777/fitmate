'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Clock, Flame, TrendingUp, Trash2 } from 'lucide-react';
import { deleteWorkout } from '@/lib/database';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function WorkoutCard({ workout, onDelete }: { workout: any; onDelete?: () => void }) {
  const [deleting, setDeleting] = useState(false);
  const formattedDate = format(new Date(workout.completed_at || workout.date), 'MMM d, yyyy');
  const intensityMap: Record<string, { color: string; bg: string; label: string }> = {
    low: { color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Low' },
    medium: { color: 'text-[#FFD60A]', bg: 'bg-[#FFD60A]/20', label: 'Medium' },
    high: { color: 'text-[#FF6B35]', bg: 'bg-[#FF6B35]/20', label: 'High' },
  };
  const key = workout.intensity?.toLowerCase() || 'medium';
  const intensityConfig = intensityMap[key] || intensityMap['medium'];

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this workout?')) return;
    setDeleting(true);
    try {
      await deleteWorkout(workout.id);
      onDelete?.();
    } catch (error) {
      console.error('[v0] Failed to delete workout:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="card-elevated p-6 hover:border-[#FF6B35]/40 smooth-transition animate-fade-in shadow-lg shadow-orange-500/5 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground capitalize mb-1">{workout.exercise_name}</h3>
          <p className="text-xs text-muted-foreground font-medium">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <div className={`px-3 py-1.5 rounded-lg ${intensityConfig.bg} border border-current/30`}>
            <p className={`text-xs font-bold ${intensityConfig.color}`}>
              {intensityConfig.label}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-500 hover:text-red-400 hover:bg-red-500/15 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 smooth-transition"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <p className="text-foreground mb-4">{workout.notes || 'No notes'}</p>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="font-semibold text-foreground">{workout.duration_minutes ?? workout.duration ?? 0} min</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <div>
            <p className="text-xs text-muted-foreground">Calories</p>
            <p className="font-semibold text-foreground">{workout.calories_burned || 0}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <div>
            <p className="text-xs text-muted-foreground">Sets</p>
            <p className="font-semibold text-foreground">{workout.sets || 0}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
