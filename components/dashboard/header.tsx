'use client';

import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

export default function DashboardHeader({ profile }: { profile: any }) {
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

  return (
    <Card className="glass-effect border-primary/20 mb-8 p-8 animate-slide-in-right">
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-muted-foreground">{today}</p>
      </div>
      {profile && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <p className="text-sm text-muted-foreground">Height</p>
            <p className="text-xl font-bold text-primary">{profile.height || '--'} cm</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <p className="text-sm text-muted-foreground">Weight</p>
            <p className="text-xl font-bold text-primary">{profile.weight || '--'} kg</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <p className="text-sm text-muted-foreground">Goal</p>
            <p className="text-xl font-bold text-primary">{profile.fitness_goal || '--'}</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <p className="text-sm text-muted-foreground">Level</p>
            <p className="text-xl font-bold text-primary">{profile.experience_level || '--'}</p>
          </div>
        </div>
      )}
    </Card>
  );
}
