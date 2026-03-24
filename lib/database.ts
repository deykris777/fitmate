import { supabase } from './supabase-client';

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
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
  try {
    const profileCheck = await getUserProfile(userId);
    if (!profileCheck) {
      console.error('[v0] User profile not found:', userId);
      throw new Error('User profile not found. Please complete onboarding.');
    }
  } catch (err: any) {
    if (err.code === 'PGRST116') {
      // Profile doesn't exist, try to create it
      console.log('[v0] Creating missing profile for user:', userId);
      try {
        await supabase
          .from('profiles')
          .insert([{ id: userId, email: '', full_name: 'User' }])
          .select()
          .single();
      } catch (createErr) {
        console.error('[v0] Failed to create profile:', createErr);
      }
    }
  }
  
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
  try {
    await getUserProfile(userId);
  } catch (err: any) {
    if (err.code === 'PGRST116') {
      console.log('[v0] Creating missing profile for user:', userId);
      try {
        await supabase
          .from('profiles')
          .insert([{ id: userId, email: '', full_name: 'User' }])
          .select()
          .single();
      } catch (createErr) {
        console.error('[v0] Failed to create profile:', createErr);
      }
    }
  }

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
