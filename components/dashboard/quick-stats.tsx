'use client';

import { Card } from '@/components/ui/card';
import { Activity, Flame, TrendingUp } from 'lucide-react';

export default function QuickStats({ workouts, dietLogs }: { workouts: any[]; dietLogs: any[] }) {
  const totalCalories = dietLogs.reduce((sum, log) => sum + (log.calories || 0), 0);
  const totalDuration = workouts.reduce((sum, w) => sum + (w.duration_minutes || w.duration || 0), 0);
  const intensityMap: Record<string, number> = { low: 1, moderate: 2, medium: 2, high: 3 };
  const avgIntensityRaw =
    workouts.length > 0
      ? workouts.reduce((sum, w) => sum + (intensityMap[w.intensity?.toLowerCase()] || 2), 0) / workouts.length
      : 0;
  const avgIntensityLabel = avgIntensityRaw === 0 ? '—' : avgIntensityRaw < 1.5 ? 'Low' : avgIntensityRaw < 2.5 ? 'Med' : 'High';

  const stats = [
    {
      label: 'Calories Today',
      value: totalCalories,
      unit: 'kcal',
      icon: Flame,
      color: 'text-[#FF6B35]',
      bgColor: 'bg-[#FF6B35]/20',
      glowColor: 'shadow-lg shadow-orange-500/20',
    },
    {
      label: 'Total Workout Time',
      value: totalDuration,
      unit: 'mins',
      icon: Activity,
      color: 'text-[#FF6B35]',
      bgColor: 'bg-[#FF6B35]/20',
      glowColor: 'shadow-lg shadow-orange-500/20',
    },
    {
      label: 'Avg Intensity',
      value: avgIntensityLabel,
      unit: '',
      icon: TrendingUp,
      color: 'text-[#00D4FF]',
      bgColor: 'bg-[#00D4FF]/20',
      glowColor: 'shadow-lg shadow-cyan-500/20',
    },
  ];

  return (
    <>
      {stats.map((stat, i) => (
        <Card
          key={i}
          className={`card-elevated p-6 hover:border-primary/60 smooth-transition animate-fade-in ${stat.glowColor}`}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold text-foreground">{stat.value}</p>
                <span className="text-sm text-muted-foreground">{stat.unit}</span>
              </div>
            </div>
            <div className={`${stat.bgColor} rounded-xl p-4`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </>
  );
}
