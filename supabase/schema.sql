-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  name text not null default '',
  avatar_url text,
  cycle_length integer not null default 28,
  last_period_date date,
  symptoms_to_track text[] default array['mood', 'energy', 'cramps', 'bloating', 'flow_intensity'],
  notifications_enabled boolean default true,
  onboarding_complete boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Period logs table
create table if not exists period_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  start_date date not null,
  end_date date,
  created_at timestamptz default now()
);

-- Symptom logs table
create table if not exists symptom_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  mood integer check (mood between 1 and 5),
  energy integer check (energy between 1 and 5),
  cramps integer check (cramps between 1 and 5),
  bloating integer check (bloating between 1 and 5),
  flow_intensity integer check (flow_intensity between 1 and 5),
  notes text,
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- Row Level Security
alter table profiles enable row level security;
alter table period_logs enable row level security;
alter table symptom_logs enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = user_id);

-- Period logs policies
create policy "Users can view own period logs"
  on period_logs for select using (auth.uid() = user_id);

create policy "Users can insert own period logs"
  on period_logs for insert with check (auth.uid() = user_id);

create policy "Users can update own period logs"
  on period_logs for update using (auth.uid() = user_id);

create policy "Users can delete own period logs"
  on period_logs for delete using (auth.uid() = user_id);

-- Symptom logs policies
create policy "Users can view own symptom logs"
  on symptom_logs for select using (auth.uid() = user_id);

create policy "Users can insert own symptom logs"
  on symptom_logs for insert with check (auth.uid() = user_id);

create policy "Users can update own symptom logs"
  on symptom_logs for update using (auth.uid() = user_id);

create policy "Users can delete own symptom logs"
  on symptom_logs for delete using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
  before update on profiles
  for each row execute procedure public.set_updated_at();
