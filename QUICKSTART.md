# FitMate - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Copy Environment Variables
```bash
cp .env.example .env.local
```

### Step 2: Set Up Supabase
1. Go to https://supabase.com and create a free account
2. Create a new project
3. Go to **Project Settings → API Keys**
4. Copy `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
5. Copy `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Anon public key)
6. Update your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
CRON_SECRET=any_random_string_like_123abc456def
```

### Step 3: Run Database Migration
1. Go to Supabase Dashboard → SQL Editor
2. Open a new query
3. Copy and paste the SQL from `/scripts/init-database.sql`
4. Click "Run" to create all tables

### Step 4: Run Locally
```bash
npm install
npm run dev
```

Visit http://localhost:3000

### Step 5: Create Your Account
1. Click "Get Started" on the landing page
2. Sign up with email and password
3. Complete the profile setup
4. Start using FitMate!

## 📱 Main Features Quick Access

### Dashboard
- View your fitness stats
- See recent workouts
- Track today's calories
- Access: http://localhost:3000/dashboard

### Log Workouts
- Record exercises with sets, reps, duration
- Track intensity and calories burned
- Access: http://localhost:3000/workouts

### Exercise Routines
- Browse 6 pre-built routines
- Copy routines to clipboard
- Choose by fitness level
- Access: http://localhost:3000/routines

### AI Fitness Coach
- Chat 24/7 with AI
- Get workout advice
- Nutrition tips
- Recovery guidance
- Access: http://localhost:3000/chat

### Diet Tracker
- Log meals on dashboard
- Track calories
- Automatic daily reset at midnight
- Access: Dashboard right sidebar

## 🎨 Customization

### Change Daily Calorie Goal
Edit `/components/dashboard/diet-summary.tsx`:
```tsx
const calorieGoal = 2000; // Change this value
```

### Change Colors
Edit `/app/globals.css`:
```css
--color-primary: #a78bfa;  /* Purple tone */
--background: 15 10 26;     /* Dark purple */
```

### Change AI System Prompt
Edit `/app/api/chat/route.ts`:
```typescript
const systemPrompt = `Your fitness guidance here...`;
```

### Modify Exercise Routines
Edit `/app/routines/page.tsx`:
```typescript
const defaultRoutines = [
  // Add or modify routines here
];
```

## 🔑 Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase database URL | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public API key for database | `eyJhbG...` |
| `CRON_SECRET` | Security token for cron jobs | `my_secret_token_123` |

**Note:** Variables starting with `NEXT_PUBLIC_` are visible in the browser (safe for public keys).

## 📊 Database Quick Reference

### User Profiles
```sql
SELECT * FROM user_profiles WHERE id = 'user_id';
```

### Today's Workouts
```sql
SELECT * FROM workouts 
WHERE user_id = 'user_id' 
AND DATE(date) = TODAY();
```

### Today's Diet
```sql
SELECT * FROM diet_logs 
WHERE user_id = 'user_id' 
AND date = TODAY();
```

### All Chat History
```sql
SELECT * FROM chat_history 
WHERE user_id = 'user_id' 
ORDER BY created_at DESC;
```

## 🐛 Troubleshooting

### "Can't connect to database"
✅ Check `.env.local` has correct SUPABASE_URL and ANON_KEY
✅ Verify Supabase project is active
✅ Check network connection

### "Login doesn't work"
✅ Verify Supabase Auth is enabled
✅ Check email is valid
✅ Clear browser cache and try again

### "AI Chat not responding"
✅ Check internet connection
✅ Verify Supabase is accessible
✅ Check OpenAI/Vercel API status

### "Diet doesn't reset"
✅ Cron jobs only work on Vercel (not localhost)
✅ Add `vercel.json` configuration
✅ Deploy to Vercel to enable cron

### "Animations not smooth"
✅ Clear browser cache
✅ Check hardware acceleration is enabled
✅ Try a different browser

## 📦 Deployment to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial FitMate commit"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com/new
2. Select your GitHub repository
3. Click "Import"

### Step 3: Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
CRON_SECRET=your_secret
```

### Step 4: Deploy
Click "Deploy" - Vercel will build and deploy automatically

## 🎯 Next Steps

1. ✅ Create Supabase account
2. ✅ Set up environment variables
3. ✅ Run database migration
4. ✅ Test locally with `npm run dev`
5. ✅ Create user account
6. ✅ Log first workout
7. ✅ Chat with AI
8. ✅ Deploy to Vercel

## 💡 Pro Tips

- **AI Coaching**: Ask the chatbot about your workout form or nutrition
- **Routine Templates**: Copy pre-built routines and customize them
- **Daily Reset**: Your diet tracker automatically resets at midnight
- **Mobile Friendly**: Use on phone for quick workout logging
- **Dark Theme**: Better for eyes, optimized for the purple aesthetic

## 🆘 Getting Help

1. Check `/SETUP.md` for detailed setup instructions
2. Review `/PROJECT_SUMMARY.md` for technical details
3. Look at `/scripts/init-database.sql` for database schema
4. Check Supabase documentation: https://supabase.com/docs
5. Check Next.js documentation: https://nextjs.org/docs

## 🎉 You're Ready!

Your FitMate AI fitness companion is ready to help users achieve their goals. Start using it now! 💪

---

**Questions?** Review the other documentation files included in the project.
