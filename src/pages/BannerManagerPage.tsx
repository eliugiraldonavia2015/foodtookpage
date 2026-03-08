import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Edit2, Image as ImageIcon, Zap, Smartphone } from 'lucide-react';
import { getZones, getBanners, createBanner, updateBanner, deleteBanner, Zone, Banner } from '../supabaseClient';
import { motion } from 'framer-motion';

export const BannerManagerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado del formulario
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const zonesData = await getZones();
      setZones(zonesData);
      
      // Intentar recuperar zona de la navegación o usar la primera
      const stateZoneId = location.state?.zoneId;
      if (stateZoneId) {
        setSelectedZoneId(Number(stateZoneId));
      } else if (zonesData.length > 0) {
        setSelectedZoneId(zonesData[0].zone_id);
      }
      
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (selectedZoneId) {
      fetchBanners(selectedZoneId);
    }
  }, [selectedZoneId]);

  const fetchBanners = async (zoneId: number) => {
    const data = await getBanners(zoneId);
    setBanners(data);
  };

  const handleSave = async () => {
    if (!selectedZoneId || !editingBanner?.image_url) return;

    try {
      const bannerData = {
        zone_id: selectedZoneId,
        title: editingBanner.title || 'Banner Sin Nombre',
        subtitle: '',
        image_url: editingBanner.image_url,
        action_type: editingBanner.action_type || 'none',
        action_target: editingBanner.action_target || '',
        is_active: editingBanner.is_active ?? true,
        priority: editingBanner.priority || (banners.length + 1)
      };

      if (editingBanner.id) {
        await updateBanner(editingBanner.id, bannerData);
      } else {
        await createBanner(bannerData as any);
      }

      await fetchBanners(selectedZoneId);
      setEditingBanner(null);
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("Error al guardar");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar banner?")) {
      await deleteBanner(id);
      if (selectedZoneId) fetchBanners(selectedZoneId);
    }
  };

  const selectedZoneName = zones.find(z => z.zone_id === selectedZoneId)?.zone_name || 'Zona';

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="text-amber-400" />
              Gestor de Campañas
            </h1>
            <p className="text-slate-400 text-sm">Configuración visual de banners para la App</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <select 
            value={selectedZoneId || ''}
            onChange={(e) => setSelectedZoneId(Number(e.target.value))}
            className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-pink outline-none"
          >
            {zones.map(z => (
              <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>
            ))}
          </select>
          
          <button 
            onClick={() => setEditingBanner({ is_active: true })}
            className="bg-brand-pink hover:bg-brand-pink/90 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Nuevo Banner
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Lista de Banners Activos */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Smartphone size={20} className="text-slate-400" />
            Banners en {selectedZoneName}
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
               <div className="w-8 h-8 border-2 border-brand-pink border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : banners.length === 0 ? (
            <div className="bg-slate-900/50 border border-dashed border-white/10 rounded-2xl p-12 text-center">
              <ImageIcon className="mx-auto text-slate-600 mb-3" size={48} />
              <p className="text-slate-400">No hay banners configurados para esta zona.</p>
              <button 
                onClick={() => setEditingBanner({ is_active: true })}
                className="text-brand-pink font-bold mt-2 hover:underline"
              >
                Crear el primero
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {banners.map((banner) => (
                <motion.div 
                  key={banner.id}
                  layoutId={banner.id}
                  className="bg-slate-900 border border-white/10 rounded-2xl p-4 flex gap-4 group hover:border-white/20 transition-all"
                >
                  {/* Preview Imagen */}
                  <div className="w-32 h-20 bg-slate-800 rounded-lg overflow-hidden shrink-0 relative">
                    <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                    {!banner.is_active && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-[10px] font-bold bg-slate-700 px-2 py-0.5 rounded text-slate-300">INACTIVO</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate">{banner.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 truncate">
                      Acción: <span className="text-slate-300">{banner.action_type === 'none' ? 'Solo ver' : banner.action_type}</span>
                      {banner.action_target && <span className="text-slate-500 ml-1">({banner.action_target})</span>}
                    </p>
                    <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingBanner(banner)}
                        className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1"
                      >
                        <Edit2 size={12} /> Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(banner.id)}
                        className="text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Eliminar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Panel Editor (Sidebar) */}
        <div className="lg:col-span-1">
          {editingBanner ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 sticky top-6 shadow-xl"
            >
              <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
                {editingBanner.id ? 'Editar Banner' : 'Nuevo Banner'}
                <button onClick={() => setEditingBanner(null)} className="text-slate-400 hover:text-white"><Trash2 size={18} className="rotate-45" /></button>
              </h3>

              <div className="space-y-5">
                {/* Preview Phone */}
                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10 relative group">
                   {editingBanner.image_url ? (
                     <img src={editingBanner.image_url} className="w-full h-full object-cover" />
                   ) : (
                     <div className="flex items-center justify-center h-full text-slate-600">
                       <ImageIcon size={32} />
                     </div>
                   )}
                   <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] font-mono text-white/70">
                     Preview App
                   </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 block">Imagen URL</label>
                  <input 
                    type="text" 
                    value={editingBanner.image_url || ''}
                    onChange={e => setEditingBanner({...editingBanner, image_url: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-pink outline-none font-mono text-slate-300"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 block">Nombre Interno</label>
                  <input 
                    type="text" 
                    value={editingBanner.title || ''}
                    onChange={e => setEditingBanner({...editingBanner, title: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-pink outline-none text-white"
                    placeholder="Ej: Promo Pizza Viernes"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 block">Acción</label>
                    <select 
                      value={editingBanner.action_type || 'none'}
                      onChange={e => setEditingBanner({...editingBanner, action_type: e.target.value as any})}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-3 text-sm outline-none text-white appearance-none"
                    >
                      <option value="none">Solo Ver</option>
                      <option value="open_restaurant">Abrir Rest.</option>
                      <option value="open_category">Abrir Cat.</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 block">ID Destino</label>
                    <input 
                      type="text" 
                      value={editingBanner.action_target || ''}
                      onChange={e => setEditingBanner({...editingBanner, action_target: e.target.value})}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-3 text-sm outline-none text-white"
                      placeholder="ID..."
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                   <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-10 h-6 rounded-full p-1 transition-colors ${editingBanner.is_active !== false ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${editingBanner.is_active !== false ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                      <span className="text-sm font-medium text-slate-300">Activo</span>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={editingBanner.is_active !== false}
                        onChange={e => setEditingBanner({...editingBanner, is_active: e.target.checked})}
                      />
                   </label>
                </div>

                <button 
                  onClick={handleSave}
                  disabled={!editingBanner.image_url}
                  className="w-full bg-gradient-to-r from-brand-pink to-pink-600 hover:from-brand-pink/90 hover:to-pink-600/90 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-pink/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Guardar Cambios
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-slate-900/30 border border-dashed border-white/5 rounded-2xl p-8 text-center text-slate-500 flex flex-col items-center justify-center h-64">
              <Zap size={32} className="mb-3 opacity-20" />
              <p className="text-sm">Selecciona un banner para editar o crea uno nuevo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
