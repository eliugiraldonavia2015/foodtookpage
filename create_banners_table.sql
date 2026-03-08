-- Script completo para crear la tabla 'banners' desde cero
-- Ejecuta esto si recibes el error "relation public.banners does not exist"

create table if not exists public.banners (
  id uuid default gen_random_uuid() primary key,
  zone_id bigint references public.zones(id),
  screen_id text not null default 'discovery', -- Nueva columna para multi-pantalla
  title text not null,
  subtitle text,
  image_url text not null,
  action_type text default 'none',
  action_target text,
  slides jsonb default '[]'::jsonb, -- Soporte para múltiples slides
  is_active boolean default true,
  priority int default 0,
  created_at timestamp with time zone default now()
);

-- Habilitar seguridad (RLS)
alter table public.banners enable row level security;

-- Política de acceso total (ajustar según necesidad en producción)
create policy "Allow all access to banners"
on public.banners
for all
using (true)
with check (true);

-- Crear índice para mejorar consultas
create index if not exists idx_banners_screen_zone on public.banners(screen_id, zone_id);
