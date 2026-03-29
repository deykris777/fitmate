'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getTodayWater, incrementWater, decrementWater } from '@/lib/database';

export default function WaterTracker() {
  const { user } = useAuth();
  const [glasses, setGlasses] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWater();
    }
  }, [user]);

  const loadWater = async () => {
    try {
      const data = await getTodayWater(user!.id);
      setGlasses(data.glasses || 0);
    } catch (error) {
      console.error('Failed to load water:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!user || glasses >= 8) return;
    setGlasses((prev) => prev + 1);
    try {
      await incrementWater(user.id);
    } catch (error) {
      console.error('Failed to increment water:', error);
      setGlasses((prev) => prev - 1);
    }
  };

  const handleRemove = async () => {
    if (!user || glasses <= 0) return;
    setGlasses((prev) => prev - 1);
    try {
      await decrementWater(user.id);
    } catch (error) {
      console.error('Failed to decrement water:', error);
      setGlasses((prev) => prev + 1);
    }
  };

  if (loading) return null;

  return (
    <div className="glass-effect rounded-xl p-6 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-foreground">💧 Water Intake</h3>
        <span className="text-sm text-purple-400 font-semibold">{glasses} / 8 glasses</span>
      </div>

      <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
        <div
          style={{ width: `${Math.min((glasses / 8) * 100, 100)}%` }}
          className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full h-2 transition-all duration-300"
        />
      </div>

      <div className="flex gap-1 mb-4 flex-wrap">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className={`text-xl ${i < glasses ? 'text-blue-400' : 'opacity-30 grayscale'}`}
          >
            💧
          </span>
        ))}
      </div>

      <div className="flex gap-3 items-center">
        <button
          onClick={handleRemove}
          disabled={glasses === 0}
          className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-bold disabled:opacity-30"
        >
          −
        </button>
        <button
          onClick={handleAdd}
          disabled={glasses >= 8}
          className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-bold disabled:opacity-30"
        >
          +
        </button>
      </div>

      <div className="mt-3 text-sm">
        {glasses >= 8 ? (
          <p className="text-green-400 font-medium">✅ Daily goal reached! Great job!</p>
        ) : glasses < 4 && new Date().getHours() >= 14 ? (
          <p className="text-yellow-400 font-medium">⚠️ You're behind on hydration today</p>
        ) : (
          <p className="text-muted-foreground font-medium">Keep going! {8 - glasses} more to reach your goal</p>
        )}
      </div>
    </div>
  );
}
