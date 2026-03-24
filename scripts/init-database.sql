-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  age integer,
  fitness_level text DEFAULT 'beginner', -- beginner, intermediate, advanced
  goal text, -- weight_loss, muscle_gain, endurance, flexibility
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_name text NOT NULL,
  muscle_group text,
  sets integer,
  reps integer,
  weight_kg numeric,
  duration_minutes integer,
  intensity text DEFAULT 'moderate', -- light, moderate, intense
  notes text,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Create diet_entries table
CREATE TABLE IF NOT EXISTS diet_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  meal_type text NOT NULL, -- breakfast, lunch, dinner, snack
  food_items text NOT NULL,
  calories integer,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  logged_date date NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create daily_diet_reset (to track when diet was last reset)
CREATE TABLE IF NOT EXISTS daily_diet_reset (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_reset_date date NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Create exercise_routines table
CREATE TABLE IF NOT EXISTS exercise_routines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  difficulty text, -- beginner, intermediate, advanced
  duration_minutes integer,
  exercises jsonb NOT NULL, -- Array of exercise objects
  created_at timestamp with time zone DEFAULT now()
);

-- Create user_routines (track which routines user is following)
CREATE TABLE IF NOT EXISTS user_routines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  routine_id uuid NOT NULL REFERENCES exercise_routines(id) ON DELETE CASCADE,
  started_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, routine_id)
);

-- Create chat_messages table for chatbot interaction history
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  response text NOT NULL,
  message_type text, -- workout, diet, general, routine
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_diet_reset ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can read their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for workouts
CREATE POLICY "Users can read their own workouts" ON workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own workouts" ON workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own workouts" ON workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own workouts" ON workouts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for diet_entries
CREATE POLICY "Users can read their own diet entries" ON diet_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own diet entries" ON diet_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own diet entries" ON diet_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own diet entries" ON diet_entries FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for daily_diet_reset
CREATE POLICY "Users can read their diet reset info" ON daily_diet_reset FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their diet reset info" ON daily_diet_reset FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their diet reset info" ON daily_diet_reset FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_routines
CREATE POLICY "Users can read their own routines" ON user_routines FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own routines" ON user_routines FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own routines" ON user_routines FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can read their own chat messages" ON chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own chat messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_completed_at ON workouts(completed_at);
CREATE INDEX IF NOT EXISTS idx_diet_entries_user_id ON diet_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_diet_entries_logged_date ON diet_entries(logged_date);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
