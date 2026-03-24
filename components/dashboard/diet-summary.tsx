'use client';

import React from "react"

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { addDietEntry, deleteDietEntry } from '@/lib/database';
import { useAuth } from '@/lib/auth-context';
import { Loader2, Plus, Trash2 } from 'lucide-react';

export default function DietSummary({
  dietLogs,
  onRefresh,
}: {
  dietLogs: any[];
  onRefresh: () => void;
}) {
  const { user } = useAuth();
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const totalCalories = dietLogs.reduce((sum, log) => sum + (log.calories || 0), 0);
  const calorieGoal = 2000;
  const remaining = calorieGoal - totalCalories;

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName || !calories || !user) {
      console.error('[v0] Missing data:', { mealName, calories, userId: user?.id });
      return;
    }

    setLoading(true);
    try {
      console.log('[v0] Adding meal with user_id:', user.id);
      await addDietEntry(user.id, {
        meal_name: mealName,
        calories: parseInt(calories),
      });
      setMealName('');
      setCalories('');
      onRefresh();
    } catch (error: any) {
      console.error('[v0] Failed to add meal:', error);
      alert('Error: ' + (error.message || 'Failed to add meal'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    if (!confirm('Delete this meal?')) return;
    setDeleting(mealId);
    try {
      await deleteDietEntry(mealId);
      onRefresh();
    } catch (error) {
      console.error('[v0] Failed to delete meal:', error);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Card className="card-elevated p-6 h-full shadow-lg shadow-orange-500/10">
      <h3 className="text-2xl font-bold gradient-text mb-6">Today's Diet</h3>

      <div className="space-y-4 mb-8">
        <div className="bg-gradient-to-br from-[#FF6B35]/25 to-[#FFD60A]/25 rounded-2xl p-6 border border-[#FF6B35]/40">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Total Calories</p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-foreground">{totalCalories}</p>
            <p className="text-sm text-muted-foreground">/ {calorieGoal}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {remaining > 0 ? `${remaining} remaining` : 'Goal exceeded!'}
          </p>
        </div>

        <div className="w-full bg-secondary rounded-full h-4 overflow-hidden border border-border/40">
          <div
            className="h-full gradient-primary smooth-transition shadow-lg shadow-orange-500/40"
            style={{ width: `${Math.min((totalCalories / calorieGoal) * 100, 100)}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleAddMeal} className="space-y-4 mb-8 bg-secondary/40 border border-border/50 rounded-xl p-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Meal Name</label>
          <Input
            type="text"
            placeholder="e.g., Breakfast, Lunch, Snack..."
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-lg"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Calories</label>
          <Input
            type="number"
            placeholder="e.g., 500"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-lg"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-[#FF8A5E] text-white font-semibold smooth-transition rounded-lg h-10"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Meal
            </>
          )}
        </Button>
      </form>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Meals</p>
        {dietLogs.length > 0 ? (
          dietLogs.map((log: any) => (
            <div key={log.id} className="flex justify-between items-center text-sm p-3 bg-secondary/60 rounded-lg border border-border/40 hover:border-[#FF6B35]/40 hover:bg-secondary/80 smooth-transition group">
              <div className="flex-1 min-w-0">
                <span className="text-foreground font-medium block truncate">{log.food_items || log.meal_name}</span>
                <span className="text-[#FF6B35] font-semibold text-sm">{log.calories} cal</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteMeal(log.id)}
                disabled={deleting === log.id}
                className="text-red-500 hover:text-red-400 hover:bg-red-500/15 h-7 w-7 p-0 ml-2 opacity-0 group-hover:opacity-100 smooth-transition"
              >
                {deleting === log.id ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Trash2 className="w-3 h-3" />
                )}
              </Button>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground italic py-4">No meals logged yet. Add one to get started!</p>
        )}
      </div>
    </Card>
  );
}
