-- Añadir columna 'screen_id' a la tabla 'banners'
-- Por defecto 'discovery' para no romper lo existente
alter table public.banners 
add column if not exists screen_id text not null default 'discovery';

-- Crear índice para mejorar consultas por pantalla y zona
create index if not exists idx_banners_screen_zone on public.banners(screen_id, zone_id);

-- La tabla 'discovery_config' ya soporta 'section_key' flexible, 
-- así que usaremos claves compuestas como 'supermarket_categories_grid' sin cambiar el esquema.
