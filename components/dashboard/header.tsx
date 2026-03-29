'use client';

import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import Link from 'next/link';
import { Pencil } from 'lucide-react';

export default function DashboardHeader({ profile }: { profile: any }) {
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

  return (
    <Card className="glass-effect border-primary/20 mb-8 p-8 animate-slide-in-right">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-muted-foreground">{today}</p>
        </div>
        {profile && (
          <Link 
            href="/onboarding"
            className="p-2 rounded-full hover:bg-primary/20 bg-secondary/50 text-muted-foreground hover:text-primary transition-all duration-300 group"
            title="Edit Profile"
          >
            <Pencil className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </Link>
        )}
      </div>
      {profile && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <p className="text-sm text-muted-foreground">Height</p>
            <p className="text-xl font-bold text-primary">{profile.height_cm || '--'} cm</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <p className="text-sm text-muted-foreground">Weight</p>
            <p className="text-xl font-bold text-primary">{profile.weight_kg || '--'} kg</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <p className="text-sm text-muted-foreground">Goal</p>
            <p className="text-xl font-bold text-primary capitalize">{profile.goal ? profile.goal.replace('_', ' ') : '--'}</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <p className="text-sm text-muted-foreground">Level</p>
            <p className="text-xl font-bold text-primary capitalize">{profile.fitness_level || '--'}</p>
          </div>
        </div>
      )}
    </Card>
  );
}
