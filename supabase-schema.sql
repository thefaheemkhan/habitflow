-- ============================================================
-- HabitFlow Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Habits table
create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  icon text default '🎯',
  category text default 'other',
  frequency text default 'daily',
  description text default '',
  color text default '#1e1e2a',
  created_at date default current_date
);

-- Habit logs table (one row per habit per day completed)
create table if not exists habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  habit_id uuid references habits(id) on delete cascade not null,
  log_date date not null default current_date,
  created_at timestamptz default now(),
  unique(habit_id, log_date)
);

-- Row Level Security: users can only see their own data
alter table habits enable row level security;
alter table habit_logs enable row level security;

create policy "Users own habits"
  on habits for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users own logs"
  on habit_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Indexes for fast queries
create index if not exists habits_user_id_idx on habits(user_id);
create index if not exists logs_user_habit_idx on habit_logs(user_id, habit_id);
create index if not exists logs_date_idx on habit_logs(user_id, log_date);
