import { createClient } from '@supabase/supabase-js';

// Usamos las credenciales reales encontradas en el código iOS (SupabaseConfig.swift)
// En producción, esto DEBE ir en variables de entorno (.env)
const supabaseUrl = 'https://nklckrihproujahogtpg.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rbGNrcmlocHJvdWphaG9ndHBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MTEwNDQsImV4cCI6MjA4ODQ4NzA0NH0.ImupGmfeTQ25FJJaT0QEFb_KH8cQS4mIaFPBk-7LZSk';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Zone {
  zone_id: number;
  zone_name: string;
  campaign_id?: string;
  // Campos adicionales mockeados para la UI si no existen en DB
  active_users?: number;
  current_ads?: number;
}

export interface Banner {
  id: string;
  zone_id: number;
  title: string; // Nombre interno para referencia
  subtitle?: string; // Deprecado, pero mantenemos compatibilidad por si acaso
  image_url: string;
  action_type: 'open_restaurant' | 'open_category' | 'none';
  action_target?: string;
  is_active: boolean;
  priority: number;
  created_at?: string;
}

export const getZones = async (): Promise<Zone[]> => {
  try {
    const { data, error } = await supabase
      .from('zones')
      .select('*');
      
    if (error) {
      console.error('Supabase error fetching zones:', error.message);
      return []; 
    }

    if (!data) return [];

    // Mapeamos los campos reales de la DB (id, name, marketing_campaign_id)
    // a los campos que espera nuestra interfaz (zone_id, zone_name, campaign_id)
    return data.map((item: any) => ({
      zone_id: item.id,
      zone_name: item.name,
      campaign_id: item.marketing_campaign_id,
      // Si la tabla tuviera columnas 'active_users' o 'current_ads', se usarían aquí.
      // Como aún no existen, dejamos 0 explícitamente en lugar de inventar números.
      active_users: item.active_users || 0, 
      current_ads: item.current_ads || 0
    }));

  } catch (e) {
    console.error('Exception fetching zones:', e);
    return []; 
  }
};

export const getBanners = async (zoneId: number): Promise<Banner[]> => {
  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('zone_id', zoneId)
      .order('priority', { ascending: true });

    if (error) {
      console.warn('Error fetching banners (tabla banners podría no existir):', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('Exception fetching banners:', e);
    return [];
  }
};

export const createBanner = async (banner: Omit<Banner, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('banners')
    .insert([banner])
    .select();
  
  if (error) throw error;
  return data?.[0];
};

export const updateBanner = async (id: string, updates: Partial<Banner>) => {
  const { data, error } = await supabase
    .from('banners')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data?.[0];
};

export const deleteBanner = async (id: string) => {
  const { error } = await supabase
    .from('banners')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Función de utilidad para inspeccionar tablas (Solo desarrollo)
export const inspectSchema = async () => {
  console.log("--- Inspeccionando Tablas Públicas ---");
  // Intentamos listar tablas accediendo a information_schema si los permisos lo permiten,
  // o probando tablas comunes.
  // Nota: Acceder a information_schema desde el cliente JS a veces está bloqueado por RLS.
  // Una estrategia alternativa es intentar un select simple a tablas conocidas o usar una función RPC si existe.
  
  try {
      // Intento 1: RPC si existiera una función de introspección (poco probable por defecto)
      // Intento 2: Probar tablas comunes para ver cuáles responden
      const commonTables = ['zones', 'users', 'restaurants', 'campaigns', 'ads'];
      const results = {};
      
      for (const table of commonTables) {
          const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
          results[table] = error ? `Error: ${error.message}` : `OK (Rows: ${count})`;
      }
      console.table(results);
      return results;
  } catch (e) {
      console.error("Error inspecting schema:", e);
  }
};

// Datos Mockeados para desarrollo/fallback
const MOCK_ZONES: Zone[] = [
  { zone_id: 1, zone_name: "Centro Histórico", campaign_id: "CAMP-001", active_users: 1250, current_ads: 5 },
  { zone_id: 2, zone_name: "Polanco", campaign_id: "CAMP-002", active_users: 850, current_ads: 12 },
  { zone_id: 3, zone_name: "Condesa", campaign_id: "CAMP-003", active_users: 920, current_ads: 8 },
  { zone_id: 4, zone_name: "Roma Norte", campaign_id: null, active_users: 780, current_ads: 3 },
  { zone_id: 5, zone_name: "Santa Fe", campaign_id: "CAMP-005", active_users: 650, current_ads: 15 },
];

export interface ZoneCampaignConfig {
  id: string;
  zone_id: number;
  zone_name: string;
  is_active: boolean;
  boost_factor: number; // 1.0 = normal, 2.0 = doble exposición
  ad_slots: number;
  price_per_day: number;
  active_campaigns: number;
}
