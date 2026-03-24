# FitMate - AI-Powered Fitness Companion Platform

> Your personal AI fitness coach, workout tracker, and nutrition manager in one beautiful, dark-themed application.

![FitMate Banner](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-DB-green?style=for-the-badge&logo=supabase)
![OpenAI](https://img.shields.io/badge/OpenAI-API-blue?style=for-the-badge&logo=openai)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🏋️ Workout Tracking
- **Log Exercises** - Record workouts with duration, intensity, calories, sets
- **Workout History** - View all past workouts with filtering
- **Progress Stats** - Track total workout time and frequency
- **Intensity Levels** - Low, Medium, High classifications

### 🥗 Nutrition Management
- **Daily Diet Logging** - Add meals and track calories
- **Calorie Counter** - Real-time progress toward daily goal (2000 cal)
- **Visual Progress** - Animated progress bar
- **Automatic Reset** - Daily reset at midnight via cron job
- **Meal History** - See what you've logged today

### 🤖 AI Fitness Coach
- **24/7 Availability** - Get advice anytime
- **Real-time Streaming** - Stream responses for instant feedback
- **Personalized Guidance** - Workout form, nutrition, recovery
- **Chat History** - Access past conversations
- **Expert System Prompt** - Trained on fitness expertise

### 📚 Exercise Routines
- **6 Pre-built Routines** - From Beginner to Advanced
- **Routine Templates** - 
  - Beginner Strength (3 days/week)
  - Intermediate Hypertrophy (4 days/week)
  - Advanced Periodized (5 days/week)
  - Cardio & Endurance (4 days/week)
  - Flexibility & Mobility (5 days/week)
  - CrossFit Style WOD (5 days/week)
- **Copy to Clipboard** - Easy routine sharing
- **Level-based Search** - Find routines for your level

### 👤 User Profiles
- **Onboarding Setup** - Height, weight, fitness goal, experience level
- **Profile Management** - Update fitness information
- **Personalized Dashboard** - Your stats and recent activity
- **Secure Authentication** - Email/password via Supabase

### 🎨 Dark Purple Theme
- **Beautiful Aesthetics** - Dark purple color scheme
- **Smooth Animations** - Fade-in, slide, glow, bounce effects
- **Glass Morphism** - Modern frosted glass UI effects
- **Responsive Design** - Works perfectly on mobile and desktop
- **Gradient Text** - Eye-catching headings

### 🔐 Security & Privacy
- **Row Level Security** - Each user sees only their data
- **Secure Authentication** - Industry-standard auth
- **Data Isolation** - Complete user data privacy
- **Encrypted Connections** - Secure API endpoints

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free)
- Internet connection

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd fitmate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   CRON_SECRET=your_random_secret
   ```

4. **Create database**
   - Go to Supabase dashboard
   - Run the SQL from `/scripts/init-database.sql`
   - Tables are created automatically

5. **Run locally**
   ```bash
   npm run dev
   ```

6. **Visit the app**
   - Open http://localhost:3000
   - Sign up and start using FitMate!

For detailed setup, see **[QUICKSTART.md](./QUICKSTART.md)**.

## 📖 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- **[SETUP.md](./SETUP.md)** - Comprehensive setup guide
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Technical details and architecture

## 📁 Project Structure

```
fitmate/
├── app/                          # Next.js app router
│   ├── api/                      # API routes
│   │   ├── chat/route.ts         # AI chat endpoint
│   │   └── cron/reset-diet/      # Daily reset
│   ├── dashboard/                # Main dashboard
│   ├── workouts/                 # Workout logging
│   ├── routines/                 # Exercise library
│   ├── chat/                     # AI chatbot
│   ├── login/, signup/           # Auth pages
│   └── onboarding/               # Profile setup
├── components/                   # React components
│   ├── dashboard/                # Dashboard widgets
│   └── ui/                       # Shadcn components
├── lib/                          # Utilities
│   ├── supabase-client.ts        # DB client
│   ├── database.ts               # DB queries
│   └── auth-context.tsx          # Auth state
├── scripts/                      # SQL migrations
├── public/                       # Static assets
├── styles/                       # Global styles
└── config files                  # TypeScript, Tailwind, Next.js
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS v4, Shadcn/UI |
| **Backend** | Supabase PostgreSQL, Auth |
| **AI** | OpenAI API (via Vercel Gateway) |
| **Deployment** | Vercel (with cron jobs) |
| **Database** | PostgreSQL with RLS |
| **Icons** | Lucide React |

## 🎯 Key Pages

| Page | Purpose | Route |
|------|---------|-------|
| Landing | Marketing & signup | `/` |
| Login | User authentication | `/login` |
| Signup | Account creation | `/signup` |
| Onboarding | Profile setup | `/onboarding` |
| Dashboard | Home & stats | `/dashboard` |
| Workouts | Logging & history | `/workouts` |
| Routines | Exercise templates | `/routines` |
| Chat | AI coaching | `/chat` |

## 🔄 Daily Workflow

1. **User wakes up** → Visits dashboard
2. **Sees fresh diet** → Daily reset happened at midnight
3. **Logs breakfast** → Adds meal to diet tracker
4. **Does workout** → Logs exercise with details
5. **Asks AI coach** → Gets form or nutrition tips
6. **Checks progress** → Views stats and calories
7. **Browses routines** → Gets ideas for next week

## 🎨 Customization

### Change Theme Colors
Edit `app/globals.css`:
```css
--color-primary: #a78bfa;      /* Primary purple */
--background: 15 10 26;         /* Dark background */
```

### Modify Calorie Goal
Edit `components/dashboard/diet-summary.tsx`:
```typescript
const calorieGoal = 2500; // Your custom goal
```

### Update AI Personality
Edit `app/api/chat/route.ts`:
```typescript
const systemPrompt = `You are...`;
```

### Add Exercise Routines
Edit `app/routines/page.tsx`:
```typescript
const defaultRoutines = [
  // Add your routines
];
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy FitMate"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit https://vercel.com/new
   - Select your GitHub repo
   - Add environment variables
   - Click Deploy

3. **Enable Cron Jobs**
   - Vercel automatically reads `vercel.json`
   - Daily diet reset runs at midnight UTC

### Other Deployment Options
- **Netlify** - Only for frontend (needs API elsewhere)
- **Railway** - Full stack option
- **Self-hosted** - Node.js VPS

## 📊 Database Schema

### user_profiles
```sql
id (UUID) | email | full_name | height | weight | fitness_goal | experience_level
```

### workouts
```sql
id | user_id | exercise_name | date | duration | intensity | calories_burned | sets
```

### diet_logs
```sql
id | user_id | meal_name | calories | date
```

### exercise_routines
```sql
id | name | description | level | exercises (JSONB)
```

### chat_history
```sql
id | user_id | message | response | created_at
```

## 🔐 Security Features

- ✅ **JWT Authentication** - Secure user sessions
- ✅ **Row Level Security** - Database-level isolation
- ✅ **HTTPS Only** - Encrypted connections
- ✅ **Input Validation** - Server-side validation
- ✅ **SQL Parameterization** - Prevents injection
- ✅ **Cron Secret** - Protected endpoint
- ✅ **Password Hashing** - Bcrypt via Supabase

## 🐛 Troubleshooting

### Database Connection Issues
```
✅ Check Supabase credentials in .env.local
✅ Verify Supabase project is active
✅ Test connection with simple query
```

### AI Chat Not Working
```
✅ Check internet connection
✅ Verify OpenAI API is accessible
✅ Check browser console for errors
```

### Styling Issues
```
✅ Clear Next.js cache: rm -rf .next
✅ Clear browser cache
✅ Restart dev server
```

### Authentication Problems
```
✅ Clear browser cookies
✅ Check email is verified in Supabase
✅ Verify SUPABASE_ANON_KEY is correct
```

## 📈 Performance

- **Fast Initial Load** - Server-side rendering
- **Optimized Images** - Next.js image optimization
- **Streaming Responses** - Real-time AI chat
- **Database Indexing** - Efficient queries
- **Code Splitting** - Minimal JS bundles

## 🤝 Contributing

Want to improve FitMate? Here are ideas:
- Add strength progression tracking
- Create social leaderboards
- Add wearable device integration
- Build mobile app (React Native)
- Add video tutorials for exercises
- Create nutrition database
- Add water intake tracking
- Implement friend challenges

## 📝 License

This project is open source. Feel free to use and modify!

## 🙋 Support

- 📚 Check documentation files
- 🔍 Review code comments
- 💬 Open an issue on GitHub
- 📧 Contact project creator

## 🎉 Getting Started Now

1. Run `npm install`
2. Copy `.env.example` to `.env.local`
3. Add Supabase credentials
4. Run database migration
5. Run `npm run dev`
6. Visit http://localhost:3000
7. Sign up and start your fitness journey!

---

## 📱 Features at a Glance

| Feature | Desktop | Mobile | AI | Secure |
|---------|---------|--------|----|----|
| Workouts | ✅ | ✅ | - | ✅ |
| Diet | ✅ | ✅ | - | ✅ |
| Routines | ✅ | ✅ | - | ✅ |
| Chat | ✅ | ✅ | ✅ | ✅ |
| Analytics | ✅ | ✅ | - | ✅ |
| Auth | ✅ | ✅ | - | ✅ |

## 🌟 Why FitMate?

- **Complete Solution** - Everything you need for fitness
- **AI Powered** - Get real-time coaching advice
- **Beautiful Design** - Dark purple theme with smooth animations
- **Privacy First** - Your data is yours alone
- **Free to Start** - No credit card needed
- **Production Ready** - Built with best practices

---

**Start your fitness transformation with FitMate today! 💪**

[Get Started](./QUICKSTART.md) | [Full Setup Guide](./SETUP.md) | [Technical Details](./PROJECT_SUMMARY.md)
