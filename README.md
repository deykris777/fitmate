<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,50:7c3aed,100:0f172a&height=200&section=header&text=FitMate&fontSize=72&fontColor=ffffff&fontAlignY=38&desc=AI-Powered%20Personal%20Fitness%20Companion&descAlignY=60&descSize=22&animation=fadeIn" width="100%" />

<br/>

[![Next.js](https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%204-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Groq](https://img.shields.io/badge/Groq%20AI-F55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com/)
[![Replicate](https://img.shields.io/badge/Replicate-000000?style=for-the-badge&logo=replicate&logoColor=white)](https://replicate.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<br/>

> **FitMate** is a modern, full-stack AI fitness coaching platform that unifies workout tracking, nutrition logging, progress analytics, and generative AI into one beautifully designed experience. Stop juggling spreadsheets and generic apps — FitMate adapts to *you*.

<br/>

[🚀 Live Demo](#) &nbsp;|&nbsp; [📖 Quickstart](#-local-setup--installation) &nbsp;|&nbsp; [🐛 Report a Bug](https://github.com/deykris777/fitmate/issues) &nbsp;|&nbsp; [💡 Request a Feature](https://github.com/deykris777/fitmate/issues)

</div>

---

## 📋 Table of Contents

- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Prerequisites](#-prerequisites)
- [🔐 Environment Variables](#-environment-variables)
- [⚡ Local Setup / Installation](#-local-setup--installation)
- [🗂️ Project Structure](#️-project-structure)
- [🗄️ Database Schema](#️-database-schema)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Key Features

FitMate combines the power of modern LLMs with a clean, data-driven UI to deliver a fitness experience that genuinely rivals premium apps.

### 🤖 AI-Powered Chat Assistant
A real-time fitness coaching chatbot built on **Groq's ultra-fast inference** and the **Vercel AI SDK**. The assistant streams responses token-by-token for an instant, fluid feel. It understands workout form, nutrition science, recovery strategies, and more — with a graceful **offline fallback mode** so you're never left without guidance.

### 📅 Adaptive Weekly Workout Planner
No two users are the same. FitMate uses **Groq's LLM** to generate fully personalized **7-day training plans** grounded in your profile — body metrics (height, weight), fitness goals, experience level, and your *actual recent training history*. Plans are dynamic and regenerate as you progress.

### 🎨 Body Transformation Visualizer
Powered by the **Replicate SDK**, this feature generates AI-driven fitness illustrations and transformation previews. Users can visualize their body transformation goals, providing powerful motivation backed by generative image AI.

### 🏋️ Smart Workout Tracking
A hybrid exercise input system lets users log sessions with full flexibility — choose from a curated **preloaded suggestion dropdown** or free-type any custom exercise. Track sets, reps, duration, intensity, and estimated calories burned all in one place.

### 💧 Water Intake Tracker
A delightfully simple daily habit tracker for hydration. Features a **custom Vercel cron job** that automatically resets water intake logs every midnight, ensuring a clean slate each day without any manual action from the user.

### 📊 Progress Analytics Dashboard
Beautiful, interactive dashboards powered by **Recharts** let you visualize your entire fitness journey at a glance. Track weekly volume, diet consistency scores, calorie trends, and workout frequency over time — all rendered in responsive, animated charts.

### 🔐 Secure Authentication & Data Isolation
Full authentication flow via **Supabase Auth** (email/password + JWT sessions). Every database table is protected with **Row-Level Security (RLS)** policies, ensuring each user can only ever access their own data.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router), React 19 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4, `tailwindcss-animate` |
| **UI Primitives** | Radix UI (`@radix-ui/react-*`), Shadcn/UI, Embla Carousel |
| **Icons** | Lucide React |
| **Database** | Supabase (PostgreSQL) with Row-Level Security |
| **Authentication** | Supabase Auth (JWT-based) |
| **AI — Chat & Planner** | Groq API (`groq-sdk`, `@ai-sdk/groq`), Vercel AI SDK (`ai`, `@ai-sdk/react`) |
| **AI — Visuals** | Replicate API (`replicate`) |
| **Charts** | Recharts |
| **Forms & Validation** | `react-hook-form`, `zod` |
| **Deployment** | Vercel (with Cron Jobs support) |

---

## 📦 Prerequisites

Before you begin, make sure you have the following installed and accounts created:

- **Node.js** `v18.17+` — [Download](https://nodejs.org/)
- **pnpm** (recommended) or npm/yarn — Install via `npm i -g pnpm`
- **Git** — [Download](https://git-scm.com/)
- A free **[Supabase](https://supabase.com)** account and project
- A **[Groq](https://console.groq.com)** API key (free tier available)
- A **[Replicate](https://replicate.com)** API token

---

## 🔐 Environment Variables

Create a `.env.local` file in the root of your project and populate it with the following keys:

```env
# ─── Supabase ────────────────────────────────────────────────────────────────
# Found in: Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>

# ─── Groq (AI Chat & Workout Planner) ────────────────────────────────────────
# Found in: https://console.groq.com/keys
GROQ_API_KEY=gsk_<your-groq-api-key>

# ─── Replicate (Body Transformation Visualizer) ──────────────────────────────
# Found in: https://replicate.com/account/api-tokens
REPLICATE_API_TOKEN=r8_<your-replicate-token>

# ─── Cron Job Security ───────────────────────────────────────────────────────
# Generate a random secret string to protect the /api/cron/* endpoints
CRON_SECRET=<your-random-secret-string>
```

> **⚠️ Security Notice:** Never commit `.env.local` to version control. It is already included in `.gitignore`. When deploying to Vercel, add these as **Environment Variables** in the project settings dashboard.

---

## ⚡ Local Setup / Installation

Follow these steps to get FitMate running on your local machine in under 5 minutes.

**1. Clone the repository**

```bash
git clone https://github.com/deykris777/fitmate.git
cd fitmate
```

**2. Install dependencies**

```bash
pnpm install
# or
npm install
```

**3. Configure environment variables**

```bash
cp .env.example .env.local
# Now open .env.local and fill in your keys (see section above)
```

**4. Initialize the database**

In your **Supabase project dashboard**, navigate to the **SQL Editor** and run the contents of:

```
scripts/init-database.sql
```

This will create all required tables, indexes, and Row-Level Security policies automatically.

**5. Start the development server**

```bash
pnpm dev
# or
npm run dev
```

**6. Open the app**

Navigate to [http://localhost:3000](http://localhost:3000) in your browser. Create an account, complete onboarding, and start your fitness journey. 🎉

---

## 🗂️ Project Structure

```
fitmate/
│
├── app/                            # Next.js 15 App Router root
│   ├── (auth)/                     # Authentication route group
│   │   ├── login/                  # Login page
│   │   └── signup/                 # Registration page
│   ├── onboarding/                 # First-time user profile setup
│   ├── dashboard/                  # Main authenticated home
│   ├── workouts/                   # Workout logging & history
│   ├── diet/                       # Nutrition & calorie tracking
│   ├── chat/                       # AI fitness chatbot interface
│   ├── planner/                    # AI weekly workout planner
│   ├── visualizer/                 # Body transformation visualizer
│   ├── analytics/                  # Progress charts & dashboards
│   ├── water/                      # Hydration tracker
│   │
│   └── api/                        # Backend API route handlers
│       ├── chat/route.ts           # Groq streaming chat endpoint
│       ├── planner/route.ts        # AI plan generation endpoint
│       ├── visualizer/route.ts     # Replicate image generation
│       └── cron/
│           └── reset-water/        # Daily water log reset (cron)
│
├── components/                     # Shared React component library
│   ├── ui/                         # Base Radix/Shadcn primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── dashboard/                  # Dashboard-specific widgets
│   ├── workout/                    # Workout logging components
│   ├── chat/                       # Chat UI components
│   └── layout/                     # Navbar, sidebar, page wrappers
│
├── lib/                            # Utilities, clients, and helpers
│   ├── supabase-client.ts          # Lazy-loaded Supabase proxy client
│   ├── supabase-server.ts          # Server-side Supabase client
│   ├── database.ts                 # Typed DB query helpers
│   ├── auth-context.tsx            # React auth context & hooks
│   └── utils.ts                    # General utility functions (cn, etc.)
│
├── scripts/                        # Database & tooling scripts
│   └── init-database.sql           # Full Supabase schema migration
│
├── public/                         # Static assets
│   └── icons/                      # App icons and imagery
│
├── styles/                         # Global stylesheets
│   └── globals.css                 # Tailwind base + CSS custom properties
│
├── .env.local                      # ⚠️ Local secrets (never commit)
├── .gitignore
├── components.json                 # Shadcn/UI configuration
├── next.config.mjs                 # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── vercel.json                     # Vercel deployment & cron config
└── package.json
```

---

## 🗄️ Database Schema

FitMate uses a PostgreSQL database via Supabase. All tables are protected with Row-Level Security (RLS).

| Table | Description |
|---|---|
| `user_profiles` | Stores user biometrics, goals, and experience level |
| `workouts` | Individual workout session logs per user |
| `diet_logs` | Daily meal and calorie entries per user |
| `water_logs` | Daily hydration tracking entries per user |
| `chat_history` | Persisted AI chat conversations per user |

> Run `scripts/init-database.sql` in Supabase SQL Editor to scaffold the full schema.

---

## 🚀 Deployment

FitMate is optimized for deployment on **Vercel** with zero additional configuration.

**1. Push your code to GitHub**

```bash
git add .
git commit -m "feat: initial deploy"
git push origin main
```

**2. Import your project on Vercel**

- Go to [vercel.com/new](https://vercel.com/new)
- Select your `fitmate` repository
- Vercel will auto-detect Next.js settings

**3. Add Environment Variables**

In the Vercel project settings, add all keys from your `.env.local` (see [Environment Variables](#-environment-variables) section).

**4. Deploy**

Click **Deploy**. Vercel will build and deploy your app. Cron jobs defined in `vercel.json` (e.g., the daily water log reset) will activate automatically on Vercel's infrastructure.

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how to get started:

1. **Fork** the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and write clean, typed TypeScript
4. Commit with a descriptive message: `git commit -m "feat: add [feature]"`
5. Push to your branch: `git push origin feature/your-feature-name`
6. Open a **Pull Request** against `main`

Please open an [issue](https://github.com/deykris777/fitmate/issues) first for major changes to discuss the approach.

---

## 📄 License

This project is licensed under the **MIT License** — you are free to use, modify, and distribute it. See [`LICENSE`](LICENSE) for details.

---

<div align="center">

Built with 💜 by the **FitMate Team**

<br/>

| 👤 Name | 🔗 GitHub |
|---|---|
| Krishna Dey | [@deykris777](https://github.com/deykris777) |
| Ayush Raj | [@Ayushraj240](https://github.com/Ayushraj240) |
| Hari Suryansh Singh | [@HariSuryansh](https://github.com/HariSuryansh) |
| Shivanand Giri | [@Girvan08](https://github.com/Girvan08) |
| Arpit Vishwakarma | [@arpitvishwa23](https://github.com/arpitvishwa23) |
| Prabuddha Kumar Singh | [@prabuddha7](https://github.com/prabuddha7) |

<br/>

*If FitMate helped you, consider giving it a ⭐ on GitHub — it means a lot!*

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,50:7c3aed,100:0f172a&height=100&section=footer" width="100%" />

</div>
