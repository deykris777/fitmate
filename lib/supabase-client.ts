import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy singleton — only created on first use (at request time, not build time).
// Avoids "supabaseUrl is required" errors during Next.js static build analysis.
// NOTE: We export a getter function instead of a Proxy to prevent infinite
// recursion when React inspects exported module bindings during SSR/client hydration.
let _supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!_supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      console.error(
        '[FitMate] CRITICAL: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
        'Please add these environment variables to your Vercel project settings and redeploy.'
      );
      // Return a dummy client that won't crash the app on import
      // All actual calls will fail gracefully with network errors
      return createClient('https://placeholder.supabase.co', 'placeholder-key') as SupabaseClient;
    }
    _supabase = createClient(supabaseUrl, supabaseKey);
  }
  return _supabase;
}

export async function signUp(email: string, password: string, fullName: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function resetPassword(email: string) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

export async function createProfile(
  userId: string,
  email: string,
  fullName: string,
  fitnessLevel = 'beginner'
) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        email,
        full_name: fullName,
        fitness_level: fitnessLevel,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

