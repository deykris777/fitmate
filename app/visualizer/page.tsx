'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getUserProfile, getLatestVisualization, getDietConsistency } from '@/lib/database';
import DashboardNav from '@/components/dashboard/nav';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function VisualizerPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [visualization, setVisualization] = useState<any>(null);
  const [consistency, setConsistency] = useState<{ daysLogged: number, percentage: number }>({ daysLogged: 0, percentage: 0 });
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const [profileData, visualData, consistencyData] = await Promise.all([
          getUserProfile(user.id),
          getLatestVisualization(user.id),
          getDietConsistency(user.id)
        ]);

        setProfile(profileData);
        setVisualization(visualData);
        setConsistency(consistencyData);
      } catch (err) {
        console.error('Failed to load visualizer data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  const generatePreview = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/generate-visualization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          userId: user.id,
          goal: profile?.goal || 'weight_loss',
          daysLogged: consistency.daysLogged
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate preview');
      }

      
      // Save it safely on the client side where we have an active auth session!
      await import('@/lib/database').then(db => db.saveVisualization(user.id, data.imageUrl, data.prompt));

      // Reload visualization
      const newVisualData = await getLatestVisualization(user.id);
      setVisualization(newVisualData);
    } catch (err) {
      console.error(err);
      alert(`Error generating preview: ${(err as any)?.message || err}`);
    } finally {
      setGenerating(false);
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <h1 className="text-3xl font-bold gradient-text mb-8">✨ Body Transformation Visualizer</h1>

        {/* Consistency Bar */}
        <div className="mb-8 p-6 glass-effect rounded-xl">
          <p className="text-lg font-medium mb-3">You've logged meals {consistency.daysLogged}/30 days this month</p>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-purple-500 transition-all duration-1000 ease-out" 
              style={{ width: `${consistency.percentage}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* LEFT CARd */}
          <div className="glass-effect rounded-xl p-6 flex flex-col items-center">
            <h2 className="text-sm font-medium text-muted-foreground w-full mb-4">Your Starting Point</h2>
            
            <div className="flex-1 flex flex-col items-center justify-center mb-6 w-full">
              <svg 
                viewBox="0 0 100 250" 
                className="h-[200px] w-auto drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="50" cy="30" r="15" fill="#1f2937" stroke="#a855f7" strokeWidth="3" />
                <path d="M 35 55 Q 50 45 65 55 L 75 110 L 60 110 L 55 160 L 65 240 L 45 240 L 50 160 L 40 160 L 35 240 L 15 240 L 25 160 L 20 110 L 5 110 Z" fill="#1f2937" stroke="#a855f7" strokeWidth="3" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 text-center">
              <div className="bg-black/50 p-3 rounded-lg border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Goal</p>
                <p className="text-sm font-semibold capitalize">{profile?.goal?.replace('_', ' ') || 'Not set'}</p>
              </div>
              <div className="bg-black/50 p-3 rounded-lg border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Fitness Level</p>
                <p className="text-sm font-semibold capitalize">{profile?.fitness_level || 'Not set'}</p>
              </div>
              {profile?.body_type && (
                <div className="bg-black/50 p-3 rounded-lg border border-primary/20 col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Body Type</p>
                  <p className="text-sm font-semibold capitalize">{profile.body_type}</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="glass-effect rounded-xl p-6 flex flex-col">
            <h2 className="text-sm font-medium text-muted-foreground mb-4">Your Transformation Preview</h2>
            
            <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
              {generating ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
                  <p className="text-sm text-center text-muted-foreground">Generating your preview...<br/>This may take up to 30 seconds.</p>
                </div>
              ) : visualization ? (
                <div className="flex flex-col items-center w-full">
                  <div className="relative w-full max-w-sm rounded-lg overflow-hidden border border-primary/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                    <img 
                      src={visualization.image_url} 
                      alt="Transformation preview" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Generated on {new Date(visualization.generated_at).toLocaleDateString()}
                  </p>
                  <Button 
                    onClick={generatePreview}
                    variant="ghost" 
                    className="mt-4 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                  >
                    Regenerate Preview
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center w-full max-w-sm">
                  <div className="w-full bg-gray-800/50 backdrop-blur-sm h-64 rounded-lg flex items-center justify-center border border-dashed border-gray-600 mb-6">
                    <DumbbellIcon className="w-12 h-12 text-gray-600 opacity-50" />
                  </div>
                  <p className="text-center text-muted-foreground mb-6">Generate your transformation preview to visualize your goal.</p>
                  <Button 
                    onClick={generatePreview}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
                  >
                    Generate Visualization
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          ⚠️ AI-generated projection for motivational purposes only. Individual results vary based on diet, training, and genetics.
        </p>
      </main>
    </div>
  );
}

function DumbbellIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.4 14.4 9.6 9.6" />
      <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
      <path d="M2.515 5.343a2 2 0 1 1 2.828-2.829l1.767-1.767a2 2 0 1 1 2.829 2.828l-6.364 6.364a2 2 0 1 1-2.829-2.828l1.768-1.768a2 2 0 1 1-2.828-2.829z" />
      <path d="M11.5 6.5 6.5 11.5" />
      <path d="M17.5 12.5 12.5 17.5" />
    </svg>
  );
}
