# The Opposite App ⊘

> Stop doing what everyone else does. Start winning.

A gamified mobile app for people who want to succeed by doing the **opposite** of what most people do.

## Features

- **Opposite Stats Feed** — Daily curated stats showing what most people do vs. the winning opposite behavior
- **Daily Journal** — Log your opposite actions, mood, and earn Opposite Score points
- **Goal & Habit Tracker** — Set goals, track daily habits, build streaks
- **Leaderboard** — Compete weekly and all-time to become the most opposite person alive
- **Badges** — 14 achievement badges to unlock

## Tech Stack

- Expo (React Native) + Expo Router
- Supabase (Postgres + Auth + Realtime)
- NativeWind (Tailwind for RN)
- Zustand (state management)

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create a Supabase project
- Go to [supabase.com](https://supabase.com) and create a new project
- Run the SQL migrations in `supabase/migrations/` in order (001 → 004)
- Get your project URL and anon key from Settings → API

### 3. Configure environment
Create `.env.local` with your Supabase credentials:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Start the app
```bash
npx expo start
```

Scan the QR code with the **Expo Go** app (iOS/Android).

## Database

Run migrations in order via the Supabase SQL Editor:
1. `001_initial_schema.sql` — tables
2. `002_rls_policies.sql` — row-level security
3. `003_functions_triggers.sql` — auto-profile creation, score RPCs
4. `004_seed_stats.sql` — 15 opposite stats seed data

## Scoring System

| Action | Points |
|---|---|
| Journal entry | 10 pts |
| Mood ≥ 4 | +5 bonus |
| Journal linked to a stat | +5 bonus |
| Each opposite action listed | +2 pts (max 5) |
| Habit completed | 8 pts |
| 3-day streak | +15 bonus |
| 7-day streak | +40 bonus |
| 30-day streak | +150 bonus |
| Goal completed | +50 pts |
| First journal ever | +20 pts |
