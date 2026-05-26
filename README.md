# HabitFlow 🌿

A production-ready habit tracker built with React + Vite + Supabase.

---

## ⚡ Quick Start (Local Dev)

### Step 1 — Install dependencies 
```bash
npm install
```

### Step 2 — Set up Supabase (free)

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Choose a name, region, and database password → **Create Project**
3. Go to **SQL Editor** → **New query**
4. Paste the entire contents of `supabase-schema.sql` → **Run**
5. Go to **Settings → API** → copy your **Project URL** and **anon public key**

### Step 3 — Configure environment
```bash
cp .env.example .env.local
```
Open `.env.local` and fill in:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4 — Run locally
```bash
npm run dev
```
Visit `http://localhost:5173`

---

## 🚀 Deploy to Vercel (free)

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
# Follow prompts — it auto-detects Vite
```
When prompted for environment variables, add:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Option B — GitHub + Vercel Dashboard
1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Framework: **Vite** (auto-detected)
4. Add environment variables:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
5. Click **Deploy** — done!

---

## 🌐 Deploy to Netlify (alternative)

```bash
npm run build
# Then drag the /dist folder to netlify.com/drop
```
Or connect GitHub and set the same two env vars in **Site settings → Environment**.

---

## 📁 Project Structure

```
habitflow/
├── src/
│   ├── lib/
│   │   ├── supabase.js        # Supabase client
│   │   └── AuthContext.jsx    # Auth state (sign in/up/out)
│   ├── hooks/
│   │   └── useHabits.js       # All DB operations + streak logic
│   ├── pages/
│   │   ├── AuthPage.jsx       # Login / signup screen
│   │   ├── TodayPage.jsx      # Daily check-in + heatmap
│   │   ├── ProgressPage.jsx   # Analytics + streaks
│   │   └── AllHabitsPage.jsx  # Habit library
│   ├── components/
│   │   └── AddHabitModal.jsx  # Add new habit modal
│   ├── App.jsx                # Shell + sidebar nav
│   ├── main.jsx               # React entry point
│   └── index.css              # All styles
├── public/
│   └── favicon.svg
├── supabase-schema.sql        # Run this in Supabase SQL editor
├── .env.example               # Copy to .env.local
├── vercel.json                # SPA routing fix
├── vite.config.js
└── package.json
```

---

## 🔐 Auth Notes

- Supabase handles auth with email/password by default
- Email confirmation is enabled by default in Supabase — you can **disable it** in:
  Supabase Dashboard → Authentication → Providers → Email → toggle off "Confirm email"
- Each user's data is isolated via Row Level Security (RLS) policies

---

## 🔧 Customization Tips

- **Add more habit categories**: Edit the `<select>` in `AddHabitModal.jsx` and the `CAT_COLORS` map in `useHabits.js`
- **Change color theme**: Edit CSS variables in `src/index.css` `:root`
- **Add edit habit**: Extend `AddHabitModal` to accept an existing habit and call `supabase.from('habits').update()`
- **Add push notifications**: Use Web Push API or a service like OneSignal
