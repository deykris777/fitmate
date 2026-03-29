import { supabase } from './supabase-client';

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      console.log('[v0] Profile not found, attempting to create one for user:', userId);
      const { data: authData } = await supabase.auth.getUser();
      
      try {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: userId, 
            email: authData?.user?.email || `user-${userId}@example.com`,
            full_name: authData?.user?.user_metadata?.full_name || 'User'
          }])
          .select()
          .single();
          
        if (!insertError && newProfile) return newProfile;
      } catch (err) {
        console.error('[v0] Failed to auto-create profile:', err);
      }
    }
    throw error;
  }
  return data;
}

export async function updateUserProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getTodayDiet(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('diet_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('logged_date', today);

  if (error) throw error;
  return data || [];
}

export async function addDietEntry(userId: string, entry: any) {
  const today = new Date().toISOString().split('T')[0];
  
  // Ensure user profile exists before adding diet entry
  await getUserProfile(userId);
  
  const { data, error } = await supabase
    .from('diet_entries')
    .insert([
      {
        user_id: userId,
        logged_date: today,
        meal_type: entry.meal_name || entry.meal_type || 'snack',
        food_items: entry.meal_name || entry.food_items || '',
        calories: parseInt(entry.calories) || 0,
        protein_g: entry.protein_g || null,
        carbs_g: entry.carbs_g || null,
        fat_g: entry.fat_g || null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getWorkoutHistory(userId: string, limit = 10) {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function addWorkout(userId: string, workout: any) {
  // Ensure user profile exists
  await getUserProfile(userId);

  const { data, error } = await supabase
    .from('workouts')
    .insert([
      {
        ...workout,
        user_id: userId,
        completed_at: workout.completed_at || new Date().toISOString(),
        exercise_name: workout.exercise_name || '',
        intensity: workout.intensity || 'moderate',
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getExerciseRoutines() {
  const { data, error } = await supabase
    .from('exercise_routines')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getExerciseRoutineById(id: string) {
  const { data, error } = await supabase
    .from('exercise_routines')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function saveChatMessage(userId: string, message: any) {
  await getUserProfile(userId);

  const { data, error } = await supabase
    .from('chat_messages')
    .insert([
      {
        user_id: userId,
        ...message,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getChatHistory(userId: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(50);

  if (error) throw error;
  return data || [];
}

// Delete functions
export async function deleteWorkout(workoutId: string) {
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', workoutId);

  if (error) throw error;
}

export async function deleteDietEntry(entryId: string) {
  const { error } = await supabase
    .from('diet_entries')
    .delete()
    .eq('id', entryId);

  if (error) throw error;
}

// Update functions
export async function updateWorkout(workoutId: string, updates: any) {
  const { data, error } = await supabase
    .from('workouts')
    .update(updates)
    .eq('id', workoutId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDietEntry(entryId: string, updates: any) {
  const { data, error } = await supabase
    .from('diet_entries')
    .update(updates)
    .eq('id', entryId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getLast30DaysCalories(userId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const dateString = thirtyDaysAgo.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('diet_entries')
    .select('logged_date, calories')
    .eq('user_id', userId)
    .gte('logged_date', dateString);

  if (error) throw error;

  const grouped = data.reduce((acc: any, curr: any) => {
    if (!acc[curr.logged_date]) {
      acc[curr.logged_date] = 0;
    }
    acc[curr.logged_date] += curr.calories;
    return acc;
  }, {});

  const result = Object.keys(grouped).map(date => ({
    date,
    calories: grouped[date]
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return result;
}

export async function getLast30DaysWorkouts(userId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const dateString = thirtyDaysAgo.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('workouts')
    .select('completed_at, duration_minutes')
    .eq('user_id', userId)
    .gte('completed_at', dateString);

  if (error) throw error;

  const grouped = data.reduce((acc: any, curr: any) => {
    const date = curr.completed_at.split('T')[0];
    if (!acc[date]) {
      acc[date] = { count: 0, duration: 0 };
    }
    acc[date].count += 1;
    acc[date].duration += (curr.duration_minutes || 0);
    return acc;
  }, {});

  const result = Object.keys(grouped).map(date => ({
    date,
    count: grouped[date].count,
    duration: grouped[date].duration
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return result;
}

export async function getAllTimeWorkoutDates(userId: string) {
  const aYearAgo = new Date();
  aYearAgo.setDate(aYearAgo.getDate() - 365);
  const dateString = aYearAgo.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('workouts')
    .select('completed_at')
    .eq('user_id', userId)
    .gte('completed_at', dateString);

  if (error) throw error;

  const dates = data.map((d: any) => d.completed_at.split('T')[0]);
  return dates;
}

export async function getOrCreateStreak(userId: string) {
  const { data: existing, error: fetchErr } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchErr && fetchErr.code !== 'PGRST116') throw fetchErr;

  if (existing) return existing;

  const { data: newRow, error: insertErr } = await supabase
    .from('user_streaks')
    .insert([{ user_id: userId }])
    .select()
    .single();

  if (insertErr) throw insertErr;
  return newRow;
}

export async function updateWorkoutStreak(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  const streak = await getOrCreateStreak(userId);

  if (streak.last_workout_date === today) {
    return streak;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newWorkoutStreak = 1;
  if (streak.last_workout_date === yesterdayStr) {
    newWorkoutStreak = (streak.workout_streak || 0) + 1;
  }

  const newLongestWorkout = Math.max(newWorkoutStreak, streak.longest_workout_streak || 0);

  const { data, error } = await supabase
    .from('user_streaks')
    .upsert({
      user_id: userId,
      workout_streak: newWorkoutStreak,
      longest_workout_streak: newLongestWorkout,
      last_workout_date: today,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDietStreak(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  
  // Verify they logged today
  const { count, error: countErr } = await supabase
    .from('diet_entries')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('logged_date', today);
    
  if (countErr) throw countErr;
  if (!count || count === 0) return null;

  const streak = await getOrCreateStreak(userId);

  if (streak.last_diet_date === today) {
    return streak;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newDietStreak = 1;
  if (streak.last_diet_date === yesterdayStr) {
    newDietStreak = (streak.diet_streak || 0) + 1;
  }

  const newLongestDiet = Math.max(newDietStreak, streak.longest_diet_streak || 0);

  const { data, error } = await supabase
    .from('user_streaks')
    .upsert({
      user_id: userId,
      diet_streak: newDietStreak,
      longest_diet_streak: newLongestDiet,
      last_diet_date: today,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCurrentWeekPlan(userId: string) {
  const now = new Date();
  const day = now.getDay();
  // Get Monday of current week
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  const mondayStr = monday.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('weekly_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('week_start', mondayStr)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function saveWeeklyPlan(userId: string, plan: object) {
  await getUserProfile(userId);
  
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  const mondayStr = monday.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('weekly_plans')
    .upsert(
      { user_id: userId, week_start: mondayStr, plan },
      { onConflict: 'user_id, week_start' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getRecentWorkoutSummary(userId: string) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const dateString = sevenDaysAgo.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('workouts')
    .select('exercise_name, muscle_group, intensity, completed_at')
    .eq('user_id', userId)
    .gte('completed_at', dateString);

  if (error) throw error;
  return data || [];
}

export async function getLatestVisualization(userId: string) {
  const { data, error } = await supabase
    .from('body_visualizations')
    .select('*')
    .eq('user_id', userId)
    .order('generated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function saveVisualization(userId: string, imageUrl: string, promptUsed: string) {
  await getUserProfile(userId);

  const { data, error } = await supabase
    .from('body_visualizations')
    .insert([{ user_id: userId, image_url: imageUrl, prompt_used: promptUsed }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getDietConsistency(userId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const dateString = thirtyDaysAgo.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('diet_entries')
    .select('logged_date')
    .eq('user_id', userId)
    .gte('logged_date', dateString);

  if (error) throw error;

  const uniqueDates = new Set((data || []).map((entry: any) => entry.logged_date));
  const daysLogged = uniqueDates.size;
  const percentage = (daysLogged / 30) * 100;

  return { daysLogged, percentage };
}

export async function getTodayWater(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('water_logs')
    .select('glasses')
    .eq('user_id', userId)
    .eq('logged_date', today)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') throw error;
  return data ? { glasses: data.glasses } : { glasses: 0 };
}

export async function incrementWater(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  const current = await getTodayWater(userId);
  const newGlasses = (current?.glasses || 0) + 1;
  
  const { data, error } = await supabase
    .from('water_logs')
    .upsert({
      user_id: userId,
      logged_date: today,
      glasses: newGlasses,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id, logged_date'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function decrementWater(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  const current = await getTodayWater(userId);
  
  if (!current || current.glasses <= 0) {
    return { glasses: 0 };
  }
  
  const { data, error } = await supabase
    .from('water_logs')
    .update({ glasses: current.glasses - 1, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('logged_date', today)
    .select()
    .single();

  if (error) throw error;
  return data;
}
