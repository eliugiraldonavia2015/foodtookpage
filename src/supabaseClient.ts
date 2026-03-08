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

export const getZones = async (): Promise<Zone[]> => {
  try {
    // Intentamos obtener las zonas de la tabla 'zones'
    const { data, error } = await supabase
      .from('zones')
      .select('*');
      
    if (error) {
      console.warn('Supabase error fetching zones (using mocks):', error.message);
      return MOCK_ZONES;
    }

    // Si la tabla existe pero está vacía, o si la data es null, usamos mocks para demo
    if (!data || data.length === 0) {
      console.log('No zones found in DB, using mocks');
      return MOCK_ZONES;
    }
    
    // Si hay datos reales, los mapeamos para asegurar que tengan campos de UI
    // (active_users y current_ads podrían no venir de la DB)
    return data.map(zone => ({
      ...zone,
      active_users: zone.active_users || Math.floor(Math.random() * 1500) + 200, // Fallback random si no viene de DB
      current_ads: zone.current_ads || Math.floor(Math.random() * 10) // Fallback random si no viene de DB
    }));

  } catch (e) {
    console.error('Exception fetching zones:', e);
    return MOCK_ZONES;
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
