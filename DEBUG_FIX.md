# Database Fix - Debug Report

## Issue
The app was throwing error: `Could not find the table 'public.user_profiles' in the schema cache`

## Root Cause
**Table Name Mismatch** - The database utility functions were trying to access tables with wrong names:
- ❌ Tried: `user_profiles`, `diet_logs`, `chat_history`
- ✅ Created: `profiles`, `diet_entries`, `chat_messages`

## Fixes Applied

### 1. Database Utilities (`/lib/database.ts`)
Fixed all table references:
- `user_profiles` → `profiles`
- `diet_logs` → `diet_entries`
- `chat_history` → `chat_messages`
- `date` field → `logged_date` (diet entries)
- `date` field → `completed_at` (workouts)

Added safety checks with default values for required fields:
- `meal_type` defaults to `'snack'`
- `food_items` defaults to empty string
- `calories` defaults to 0
- `exercise_name` defaults to empty string
- `intensity` defaults to `'moderate'`

### 2. Authentication Flow (`/lib/supabase-client.ts`)
Added `createProfile()` function to auto-create user profile on signup:
```ts
export async function createProfile(userId, email, fullName, fitnessLevel)
```

### 3. Signup Page (`/app/signup/page.tsx`)
Updated to create profile immediately after auth signup:
- Calls `createProfile()` with user data
- Redirects to `/onboarding` instead of login
- User profile exists in database before reaching onboarding

### 4. Dashboard Page (`/app/dashboard/page.tsx`)
Added graceful error handling:
- Profile can be null/missing
- Workouts and diet logs default to empty arrays
- Uses `.catch()` instead of throwing errors

### 5. Exercise Routines Seed Data (`/scripts/seed-routines.sql`)
Created 6 pre-built routines with proper JSON exercise data:
- Beginner Full Body (45 min)
- Intermediate Strength (60 min)
- Advanced HIIT (40 min)
- Upper Body Focus (50 min)
- Lower Body Specialist (55 min)
- CrossFit Inspired (75 min)

## Steps to Complete the Fix

### Step 1: Run Database Migration (if not done)
Execute `/scripts/init-database.sql` in Supabase SQL Editor

### Step 2: Seed Exercise Routines
Execute `/scripts/seed-routines.sql` to add pre-built routines

### Step 3: Test the Flow
1. Go to signup page
2. Create new account
3. System will:
   - Create auth user
   - Create profile record
   - Redirect to onboarding
4. Complete onboarding profile
5. Access dashboard

## Verification Checklist
- [ ] Tables created in Supabase (check in SQL Editor)
- [ ] Routines seeded (check exercise_routines table)
- [ ] Signup creates profile (check profiles table after signup)
- [ ] Dashboard loads without errors
- [ ] Workouts can be logged
- [ ] Diet entries can be added
- [ ] Chat works with AI

## If Issues Persist

### Check Supabase Auth Settings
1. Go to Supabase dashboard → SQL Editor
2. Verify all tables exist:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

### Check RLS Policies
1. Ensure all tables have RLS enabled
2. Verify policies allow user access:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
   ```

### Verify Environment Variables
Check `.env.local` has:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Clear Cache
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear localStorage: Open DevTools → Application → Clear Storage
3. Restart dev server: `npm run dev`

## Technical Details

### Schema Mapping
| File Reference | Actual Table | Key Field |
|---|---|---|
| user_profiles | profiles | id (uuid) |
| diet_logs | diet_entries | user_id, logged_date |
| chat_history | chat_messages | user_id |
| date | logged_date | diet_entries |
| date | completed_at | workouts |

### Default Values
All insert operations now include safe defaults to prevent null constraint errors.

### Error Handling Pattern
```ts
// Before: Would crash app
const data = await getData()

// After: Graceful fallback
const data = await getData().catch(() => [])
```

## Success Indicators
✅ App loads dashboard after login
✅ Profile data displays correctly
✅ Can add workouts
✅ Can add diet entries  
✅ Chat interface works
✅ Routines display with exercises
