'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getLast30DaysCalories, getLast30DaysWorkouts, getAllTimeWorkoutDates } from '@/lib/database';
import DashboardNav from '@/components/dashboard/nav';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [caloriesData, setCaloriesData] = useState<any[]>([]);
  const [workoutsData, setWorkoutsData] = useState<any[]>([]);
  const [allTimeDates, setAllTimeDates] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const [calories, workouts, allDates] = await Promise.all([
          getLast30DaysCalories(user.id),
          getLast30DaysWorkouts(user.id),
          getAllTimeWorkoutDates(user.id)
        ]);
        setCaloriesData(calories);
        setWorkoutsData(workouts);
        setAllTimeDates(allDates);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (user) {
      fetchData();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0f0a1a] flex flex-col">
        {user && <DashboardNav user={user} />}
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  // Calculate totals for cards
  const totalWorkouts = workoutsData.reduce((sum, day) => sum + day.count, 0);
  const avgCalories = caloriesData.length > 0 
    ? Math.round(caloriesData.reduce((sum, day) => sum + day.calories, 0) / caloriesData.length) 
    : 0;
  const totalMinutes = workoutsData.reduce((sum, day) => sum + day.duration, 0);

  // Most active day
  const dayCounts: Record<number, number> = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };
  allTimeDates.forEach(dateStr => {
    const [y, m, d] = dateStr.split('-');
    if (y && m && d) {
      const day = new Date(Number(y), Number(m)-1, Number(d)).getDay();
      dayCounts[day]++;
    }
  });
  let maxDay = 0;
  for (let i = 1; i < 7; i++) {
    if (dayCounts[i] > dayCounts[maxDay]) maxDay = i;
  }
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const mostActiveDay = (totalWorkouts > 0 || allTimeDates.length > 0) ? daysOfWeek[maxDay] : 'N/A';

  // Heatmap generation
  const today = new Date();
  const weeks = 52;
  const daysInWeek = 7;
  
  const dateCounts: Record<string, number> = {};
  allTimeDates.forEach(dateStr => {
    dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
  });

  const currentDayOfWeek = today.getDay();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (weeks - 1) * 7 - currentDayOfWeek);
  startDate.setHours(0, 0, 0, 0);

  const getHeatmapColumns = () => {
    const cols = [];
    let currDate = new Date(startDate);
    
    const normalizedToday = new Date();
    normalizedToday.setHours(23, 59, 59, 999);
    
    for (let w = 0; w < weeks; w++) {
      const colDays = [];
      for (let d = 0; d < daysInWeek; d++) {
        if (currDate > normalizedToday) {
          colDays.push(null);
        } else {
          const year = currDate.getFullYear();
          const month = String(currDate.getMonth() + 1).padStart(2, '0');
          const day = String(currDate.getDate()).padStart(2, '0');
          const dateStr = `${year}-${month}-${day}`;
          colDays.push(dateStr);
        }
        currDate.setDate(currDate.getDate() + 1);
      }
      cols.push(colDays);
    }
    return cols;
  };

  const formattedCaloriesData = caloriesData.map(d => {
    const [year, month, day] = d.date.split('-');
    let formatted = d.date;
    if (year && month && day) {
      const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      formatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return { ...d, date: formatted };
  });

  const formattedWorkoutsData = workoutsData.map(d => {
    const [year, month, day] = d.date.split('-');
    let formatted = d.date;
    if (year && month && day) {
      const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      formatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return { ...d, formattedDate: formatted };
  });

  return (
    <div className="min-h-screen bg-[#0f0a1a] text-foreground font-sans">
      <DashboardNav user={user!} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* TOP ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-effect rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-medium mb-1">Total Workouts</p>
            <p className="text-3xl font-bold text-purple-400">{totalWorkouts}</p>
          </div>
          <div className="glass-effect rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-medium mb-1">Avg Daily Calories</p>
            <p className="text-3xl font-bold text-purple-400">{avgCalories}</p>
          </div>
          <div className="glass-effect rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-medium mb-1">Total Minutes Trained</p>
            <p className="text-3xl font-bold text-purple-400">{totalMinutes}</p>
          </div>
          <div className="glass-effect rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-medium mb-1">Most Active Day</p>
            <p className="text-3xl font-bold text-purple-400">{mostActiveDay}</p>
          </div>
        </div>

        {/* SECTION 2 */}
        <div className="glass-effect rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 gradient-text">📈 Calorie Intake — Last 30 Days</h2>
          <div className="w-full">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={formattedCaloriesData}>
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide={true} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1028', border: '1px solid #3b0764', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#a78bfa' }}
                />
                <Line type="monotone" dataKey="calories" stroke="#a78bfa" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 3 */}
        <div className="glass-effect rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 text-white">🏋️ Workout Frequency — Last 30 Days</h2>
          <div className="w-full">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={formattedWorkoutsData}>
                <XAxis 
                  dataKey="formattedDate" 
                  stroke="#6b7280" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1028', border: '1px solid #3b0764', borderRadius: '8px', color: '#fff' }}
                  cursor={{ fill: '#2e1065' }}
                />
                <Bar dataKey="count" fill="#a78bfa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 4 */}
        <div className="glass-effect rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6 text-white">📅 Activity Heatmap — Last 52 Weeks</h2>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-1 min-w-max">
              {getHeatmapColumns().map((col, cIdx) => (
                <div key={cIdx} className="flex flex-col gap-1">
                  {col.map((dateStr, dIdx) => {
                    if (!dateStr) return <div key={`${cIdx}-${dIdx}`} className="w-3 h-3 rounded-sm bg-transparent" />;
                    const count = dateCounts[dateStr] || 0;
                    let bgColor = "bg-gray-800";
                    if (count === 1) bgColor = "bg-purple-700";
                    else if (count >= 2) bgColor = "bg-purple-400";
                    
                    return (
                      <div 
                        key={`${cIdx}-${dIdx}`} 
                        className={`w-3 h-3 rounded-sm ${bgColor}`} 
                        title={`${dateStr}: ${count} workouts`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
