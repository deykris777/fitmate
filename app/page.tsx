'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, Dumbbell, Brain, Utensils, TrendingUp } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 glass-effect border-b border-primary/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold gradient-text">FitMate</h1>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="animate-slide-in-left mb-8">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Your AI-Powered Fitness Companion</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Get personalized workout routines, nutrition guidance, and 24/7 AI coaching to transform
            your fitness journey.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Start Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-primary/30 text-foreground hover:bg-secondary/50 bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h3 className="text-3xl font-bold text-center mb-12 gradient-text">Why Choose FitMate?</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Dumbbell,
              title: 'Smart Workouts',
              description: 'AI-personalized routines matched to your level and goals',
            },
            {
              icon: Brain,
              title: 'AI Coach',
              description: 'Get real-time feedback and guidance from your fitness AI',
            },
            {
              icon: Utensils,
              title: 'Nutrition Tracking',
              description: 'Log meals and track daily calories with ease',
            },
            {
              icon: TrendingUp,
              title: 'Progress Analytics',
              description: 'Visualize your improvement with detailed metrics',
            },
          ].map((feature, i) => (
            <Card
              key={i}
              className="glass-effect border-primary/20 p-6 hover:border-primary/40 smooth-transition animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <feature.icon className="w-8 h-8 text-primary mb-4" />
              <h4 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Card className="glass-effect border-primary/20 p-12 animate-slide-in-right">
          <h3 className="text-3xl font-bold text-foreground mb-4">Ready to Transform Your Fitness?</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users building their best selves with FitMate's AI-powered platform.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Start Your Journey
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-primary/20 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>© 2024 FitMate. Your AI fitness companion. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
