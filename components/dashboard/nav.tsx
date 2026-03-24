'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Menu, X, Dumbbell, LogOut, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardNav({ user }: { user: User }) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: Dumbbell },
    { label: 'Workouts', href: '/workouts', icon: Dumbbell },
    { label: 'Routines', href: '/routines', icon: Dumbbell },
    { label: 'Chat', href: '/chat', icon: MessageCircle },
  ];

  return (
    <nav className="bg-black border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="text-2xl font-bold gradient-text">
            FitMate
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/15 rounded-lg smooth-transition"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-xs font-medium text-muted-foreground">{user.email}</span>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-foreground hover:text-primary hover:bg-primary/15"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-foreground hover:text-primary hover:bg-primary/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-slide-in-left">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-foreground hover:text-primary smooth-transition"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-primary/20 pt-4 mt-4">
              <p className="text-xs text-muted-foreground px-3 mb-2">{user.email}</p>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-foreground hover:text-primary"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
