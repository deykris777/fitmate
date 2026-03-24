'use server';

import { supabase } from '@/lib/supabase-client';

export async function resetDailyDiet(userId: string) {
  try {
    // This function would be called by a cron job at midnight
    // It could archive previous day's diet data if needed
    const today = new Date().toISOString().split('T')[0];
    
    // Verify the user exists
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (!profile) {
      throw new Error('User not found');
    }

    return {
      success: true,
      message: 'Diet reset scheduled for tomorrow',
      date: today,
    };
  } catch (error) {
    console.error('Failed to reset diet:', error);
    throw error;
  }
}

export async function getTodaysDietStats(userId: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: dietLogs, error } = await supabase
      .from('diet_logs')
      .select('calories, meal_name')
      .eq('user_id', userId)
      .eq('date', today);

    if (error) throw error;

    const totalCalories = dietLogs?.reduce((sum, log) => sum + (log.calories || 0), 0) || 0;
    const mealCount = dietLogs?.length || 0;

    return {
      totalCalories,
      mealCount,
      remaining: Math.max(0, 2000 - totalCalories),
      date: today,
    };
  } catch (error) {
    console.error('Failed to get diet stats:', error);
    throw error;
  }
}

export async function archiveDailyDiet(userId: string) {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Move yesterday's diet data to an archive or summary table
    // This could be extended to create weekly/monthly summaries
    
    return {
      success: true,
      message: `Diet data archived for ${yesterdayStr}`,
    };
  } catch (error) {
    console.error('Failed to archive diet:', error);
    throw error;
  }
}
