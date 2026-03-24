# FitMate - AI Fitness Companion Setup Guide

## Overview
FitMate is a comprehensive AI-powered fitness platform with:
- User authentication via Supabase
- Workout tracking and logging
- Diet monitoring with daily reset
- AI fitness chatbot powered by OpenAI
- Exercise routine library
- Dark purple theme with smooth animations

## Prerequisites
1. **Supabase Account** - For authentication and database
2. **Vercel Account** - For deployment (optional)
3. **OpenAI API Key** - For AI chatbot

## Setup Instructions

### 1. Supabase Configuration
- Create a new Supabase project at https://supabase.com
- Go to Project Settings → API Keys
- Copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Add these to your `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 2. Database Setup
The SQL migration has already been created at `/scripts/init-database.sql`
It creates:
- `user_profiles` - User fitness information
- `workouts` - Logged workouts
- `diet_logs` - Daily diet entries
- `exercise_routines` - Pre-built workout routines
- `chat_history` - AI chat conversation history
- Row Level Security (RLS) policies for data privacy

### 3. AI Chatbot Setup
- Get an OpenAI API key from https://platform.openai.com/api-keys
- The API Gateway is configured by default with Vercel
- No additional setup needed if using Vercel's AI Gateway

### 4. Environment Variables
Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
CRON_SECRET=your_random_secret_for_cron
```

### 5. Daily Diet Reset (Optional)
To enable automatic daily diet reset at midnight:
1. Set up a Vercel Cron job at `/api/cron/reset-diet`
2. Add the cron trigger to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/reset-diet",
    "schedule": "0 0 * * *"
  }]
}
```

## File Structure
```
/app
  /dashboard      - Main dashboard
  /workouts       - Workout logging
  /routines       - Exercise routines
  /chat          - AI chatbot
  /api/chat      - Chat API endpoint
  /api/cron      - Cron jobs
  /login         - Login page
  /signup        - Signup page
  /onboarding    - Profile setup

/components
  /dashboard     - Dashboard components
  /ui           - Shadcn UI components

/lib
  /supabase-client.ts    - Supabase client
  /database.ts           - Database queries
  /auth-context.tsx      - Auth context
  /utils.ts              - Utility functions
```

## Key Features

### 1. Authentication
- Email/password signup and login
- Supabase Auth integration
- Protected routes with auth context

### 2. Workout Tracking
- Log exercises with duration, intensity, calories
- View workout history
- Track sets and reps

### 3. Diet Monitoring
- Log meals and calories
- Daily calorie goal tracking (2000 kcal default)
- Progress bar visualization
- Automatic daily reset

### 4. Exercise Routines
- 6 pre-built routines (Beginner to Advanced)
- Copy routine instructions
- Organized by fitness level

### 5. AI Chatbot
- 24/7 fitness guidance
- Real-time streaming responses
- Workout form tips
- Nutrition advice
- Recovery guidance

### 6. Dark Purple Theme
- Custom dark purple color scheme
- Smooth animations:
  - `animate-fade-in` - Fade in effect
  - `animate-slide-in-left/right` - Slide animations
  - `animate-pulse-glow` - Glowing effect
  - `animate-bounce-smooth` - Smooth bouncing
- Glass morphism effects
- Gradient text for headings

## Database Schema

### user_profiles
- id (UUID, Primary Key)
- email (String, Unique)
- full_name (String)
- height (Integer)
- weight (Integer)
- fitness_goal (String)
- experience_level (String)
- created_at (Timestamp)

### workouts
- id (UUID, Primary Key)
- user_id (UUID, FK)
- exercise_name (String)
- date (Date)
- duration (Integer) - in minutes
- intensity (String) - low/medium/high
- calories_burned (Integer)
- sets (Integer)
- notes (Text)
- created_at (Timestamp)

### diet_logs
- id (UUID, Primary Key)
- user_id (UUID, FK)
- meal_name (String)
- calories (Integer)
- date (Date)
- created_at (Timestamp)

### exercise_routines
- id (UUID, Primary Key)
- name (String)
- description (Text)
- level (String)
- exercises (JSONB) - array of exercises
- created_at (Timestamp)

### chat_history
- id (UUID, Primary Key)
- user_id (UUID, FK)
- message (Text)
- response (Text)
- created_at (Timestamp)

## API Endpoints

### GET /api/chat
- Stream AI responses
- Accept: messages array
- Response: Server-Sent Events (SSE)

### GET/POST /api/cron/reset-diet
- Daily diet reset (requires CRON_SECRET)
- Triggered by Vercel Cron

## Security

### Row Level Security (RLS)
All tables have RLS enabled:
- Users can only see their own data
- Admin policies for profile creation
- Full isolation between users

### Authentication
- Password hashing via Supabase Auth
- JWT token-based sessions
- HTTP-only secure cookies

### API Security
- Cron endpoint requires secret header
- Auth context protection on routes
- Input validation on forms

## Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

### Build for Production
```bash
npm run build
npm start
```

## Deployment on Vercel

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Add environment variables in Vercel Settings
4. Deploy

Cron jobs work automatically with Vercel when configured.

## Troubleshooting

### "Database not connected"
- Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

### "Chat not working"
- Check OpenAI API key configuration
- Verify Vercel AI Gateway is accessible

### "Login fails"
- Ensure Supabase Auth is enabled
- Check user email is verified

### "No workout history shown"
- Complete onboarding first
- Check browser console for errors

## Future Enhancements
- Social features (friend leaderboards)
- Advanced analytics (monthly reports)
- Custom meal database
- Video tutorials for exercises
- Mobile app (React Native)
- Push notifications
- Wearable device integration

## Support
For issues, check:
1. Supabase dashboard for data
2. Browser console for errors
3. Vercel logs for server errors
4. Environment variables configuration
