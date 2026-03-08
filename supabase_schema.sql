
-- Create a table to store screen configurations per zone
create table if not exists public.discovery_config (
  id uuid default gen_random_uuid() primary key,
  zone_id bigint references public.zones(id),
  section_key text not null, -- 'restaurants_featured', 'categories_grid'
  config_json jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default now(),
  unique(zone_id, section_key)
);

-- Enable RLS
alter table public.discovery_config enable row level security;

-- Create policy to allow all access (for now, or adjust as needed)
create policy "Allow all access to discovery_config"
on public.discovery_config
for all
using (true)
with check (true);
