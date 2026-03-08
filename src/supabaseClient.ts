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

export interface BannerSlide {
  id: string; // uuid para identificar el slide
  image_url: string;
  action_type: 'open_restaurant' | 'open_category' | 'none';
  action_target?: string;
  // Campos para texto superpuesto
  use_text_overlay?: boolean;
  text_content?: string;
  highlighted_text?: string; // Parte del texto que va en negrita/color
}

export interface Banner {
  id: string;
  zone_id: number;
  screen_id?: string; // Nuevo campo para filtrar por pantalla (discovery, supermarkets, etc)
  title: string; 
  subtitle?: string; 
  image_url: string; 
  action_type: 'open_restaurant' | 'open_category' | 'none'; 
  action_target?: string; 
  slides?: BannerSlide[]; 
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

export const getBanners = async (zoneId: number, screenId: string = 'discovery'): Promise<Banner[]> => {
  try {
    let query = supabase
      .from('banners')
      .select('*')
      .eq('zone_id', zoneId)
      .order('priority', { ascending: true });

    // Intentamos filtrar por screen_id si la columna existe.
    // Como no podemos saber si existe sin fallar, lo intentamos.
    // Si falla, es probable que la columna no exista, así que retornamos lo que hay (fallback legacy)
    // O mejor: asumimos que el usuario ya corrió el script SQL.
    query = query.eq('screen_id', screenId);

    const { data, error } = await query;

    if (error) {
      // Si el error es sobre la columna 'screen_id', hacemos fallback a solo zone_id
      if (error.message.includes('column "screen_id" does not exist')) {
        console.warn("Columna screen_id no existe. Fallback a legacy mode.");
        const { data: legacyData } = await supabase
          .from('banners')
          .select('*')
          .eq('zone_id', zoneId)
          .order('priority', { ascending: true });
        return legacyData || [];
      }
      console.warn('Error fetching banners:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('Exception fetching banners:', e);
    return [];
  }
};

export const createBanner = async (banner: Omit<Banner, 'id' | 'created_at'>) => {
  // Aseguramos que tenga screen_id
  const bannerToSave = {
    ...banner,
    screen_id: banner.screen_id || 'discovery'
  };

  const { data, error } = await supabase
    .from('banners')
    .insert([bannerToSave])
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

export const uploadBannerImage = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from('banners')
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('banners')
    .getPublicUrl(filePath);

  return publicUrl;
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

export interface DiscoveryConfig {
  id: string;
  zone_id: number;
  section_key: string;
  config_json: any;
  updated_at: string;
}

export const getDiscoveryConfig = async (zoneId: number, sectionKey: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('discovery_config')
      .select('config_json')
      .eq('zone_id', zoneId)
      .eq('section_key', sectionKey)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      console.warn(`Error fetching config for ${sectionKey}:`, error.message);
      return null;
    }
    return data?.config_json || null;
  } catch (e) {
    console.error(`Exception fetching config for ${sectionKey}:`, e);
    return null;
  }
};

export const saveDiscoveryConfig = async (zoneId: number, sectionKey: string, config: any) => {
  try {
    const { error } = await supabase
      .from('discovery_config')
      .upsert(
        { zone_id: zoneId, section_key: sectionKey, config_json: config, updated_at: new Date() },
        { onConflict: 'zone_id, section_key' }
      );
    
    if (error) throw error;
  } catch (e) {
    console.error(`Exception saving config for ${sectionKey}:`, e);
    throw e;
  }
};
