'use client';

import React from 'react';

type StreakCardProps = {
  workoutStreak: number;
  dietStreak: number;
  longestWorkout: number;
  longestDiet: number;
};

export default function StreakCard({ workoutStreak, dietStreak, longestWorkout, longestDiet }: StreakCardProps) {
  const milestones = [
    { label: 'Week Warrior', days: 7 },
    { label: 'Fortnight Fighter', days: 14 },
    { label: 'Monthly Master', days: 30 },
    { label: 'Century Club', days: 100 },
  ];

  return (
    <div className="glass-effect rounded-xl p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">🔥 Streaks</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">💪 Workout</p>
          <p className="text-4xl font-bold text-purple-400">{workoutStreak}</p>
          <p className="text-xs text-muted-foreground mt-1">Best: {longestWorkout} days</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">🥗 Diet</p>
          <p className="text-4xl font-bold text-purple-400">{dietStreak}</p>
          <p className="text-xs text-muted-foreground mt-1">Best: {longestDiet} days</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {milestones.map((m) => {
          const earned = longestWorkout >= m.days || longestDiet >= m.days;
          if (earned) {
            return (
              <span key={m.label} className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                {m.label}
              </span>
            );
          } else {
            return (
              <span key={m.label} className="bg-gray-800 text-gray-500 text-xs px-2 py-1 rounded-full font-medium">
                🔒 {m.label}
              </span>
            );
          }
        })}
      </div>
    </div>
  );
}
