import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Edit2, Image as ImageIcon, Zap, Smartphone, Upload, Crop as CropIcon, X, GripVertical } from 'lucide-react';
import { getZones, getBanners, createBanner, updateBanner, deleteBanner, uploadBannerImage, Zone, Banner, BannerSlide } from '../supabaseClient';
import { motion, Reorder } from 'framer-motion';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';

export const BannerManagerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado del formulario
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);
  const [slides, setSlides] = useState<BannerSlide[]>([]);

  // Estado para Crop
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const zonesData = await getZones();
      setZones(zonesData);
      
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

  useEffect(() => {
    if (editingBanner) {
      if (editingBanner.slides && editingBanner.slides.length > 0) {
        setSlides(editingBanner.slides);
      } else if (editingBanner.image_url) {
        // Migración de banner simple a slides
        setSlides([{
          id: crypto.randomUUID(),
          image_url: editingBanner.image_url,
          action_type: editingBanner.action_type || 'none',
          action_target: editingBanner.action_target
        }]);
      } else {
        setSlides([]);
      }
    } else {
      setSlides([]);
    }
  }, [editingBanner]);

  const fetchBanners = async (zoneId: number) => {
    const data = await getBanners(zoneId);
    setBanners(data);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => setCropImage(reader.result as string));
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (!cropImage || !croppedAreaPixels) return;
    setUploading(true);
    try {
      const croppedImageBlob = await getCroppedImg(cropImage, croppedAreaPixels);
      const file = new File([croppedImageBlob], `banner-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const publicUrl = await uploadBannerImage(file);
      
      // Añadir como nuevo slide
      const newSlide: BannerSlide = {
        id: crypto.randomUUID(),
        image_url: publicUrl,
        action_type: 'none',
        action_target: ''
      };
      
      setSlides([...slides, newSlide]);
      setCropImage(null);
    } catch (e) {
      console.error(e);
      alert('Error al subir imagen');
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!selectedZoneId || slides.length === 0) return;

    try {
      const bannerData = {
        zone_id: selectedZoneId,
        title: editingBanner?.title || 'Campaña Sin Nombre',
        subtitle: '',
        image_url: slides[0].image_url, // Principal para compatibilidad
        action_type: slides[0].action_type, // Principal para compatibilidad
        action_target: slides[0].action_target, // Principal para compatibilidad
        slides: slides, // Array completo
        is_active: editingBanner?.is_active ?? true,
        priority: editingBanner?.priority || (banners.length + 1)
      };

      if (editingBanner?.id) {
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
    if (confirm("¿Eliminar campaña?")) {
      await deleteBanner(id);
      if (selectedZoneId) fetchBanners(selectedZoneId);
    }
  };

  const updateSlide = (id: string, updates: Partial<BannerSlide>) => {
    setSlides(slides.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removeSlide = (id: string) => {
    setSlides(slides.filter(s => s.id !== id));
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
            Nueva Campaña
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Lista de Campañas Activas */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Smartphone size={20} className="text-slate-400" />
            Campañas en {selectedZoneName}
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
               <div className="w-8 h-8 border-2 border-brand-pink border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : banners.length === 0 ? (
            <div className="bg-slate-900/50 border border-dashed border-white/10 rounded-2xl p-12 text-center">
              <ImageIcon className="mx-auto text-slate-600 mb-3" size={48} />
              <p className="text-slate-400">No hay campañas configuradas.</p>
              <button 
                onClick={() => setEditingBanner({ is_active: true })}
                className="text-brand-pink font-bold mt-2 hover:underline"
              >
                Crear la primera
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {banners.map((banner) => (
                <motion.div 
                  key={banner.id}
                  layoutId={banner.id}
                  className="bg-slate-900 border border-white/10 rounded-2xl p-4 flex gap-4 group hover:border-white/20 transition-all cursor-pointer"
                  onClick={() => setEditingBanner(banner)}
                >
                  {/* Preview Imagen */}
                  <div className="w-32 h-20 bg-slate-800 rounded-lg overflow-hidden shrink-0 relative">
                    <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                    {banner.slides && banner.slides.length > 1 && (
                      <div className="absolute top-1 right-1 bg-black/60 px-1.5 rounded text-[10px] text-white font-bold">
                        +{banner.slides.length - 1}
                      </div>
                    )}
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
                      {banner.slides?.length || 1} Slides activos
                    </p>
                    <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingBanner(banner); }}
                        className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1"
                      >
                        <Edit2 size={12} /> Editar
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(banner.id); }}
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
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 sticky top-6 shadow-xl max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
                {editingBanner.id ? 'Editar Campaña' : 'Nueva Campaña'}
                <button onClick={() => setEditingBanner(null)} className="text-slate-400 hover:text-white"><X size={20} /></button>
              </h3>

              <div className="space-y-6">
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

                {/* Lista de Slides */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Slides ({slides.length})</label>
                    <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                      <Upload size={14} />
                      Añadir Foto
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>

                  <div className="space-y-3">
                    {slides.map((slide, index) => (
                      <div key={slide.id} className="bg-slate-950 border border-white/10 rounded-xl p-3 relative group">
                        <div className="flex gap-3">
                          <div className="w-20 h-12 bg-black rounded-lg overflow-hidden shrink-0 relative">
                            <img src={slide.image_url} className="w-full h-full object-cover" />
                            <div className="absolute top-0 left-0 bg-black/60 px-1.5 rounded-br text-[10px] font-bold">#{index + 1}</div>
                          </div>
                          <div className="flex-1 space-y-2">
                            <select 
                              value={slide.action_type}
                              onChange={e => updateSlide(slide.id, { action_type: e.target.value as any })}
                              className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs outline-none"
                            >
                              <option value="none">Solo Ver</option>
                              <option value="open_restaurant">Abrir Restaurante</option>
                              <option value="open_category">Abrir Categoría</option>
                            </select>
                            {slide.action_type !== 'none' && (
                              <input 
                                type="text" 
                                value={slide.action_target || ''}
                                onChange={e => updateSlide(slide.id, { action_target: e.target.value })}
                                className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs outline-none"
                                placeholder="ID Destino..."
                              />
                            )}
                          </div>
                          <button 
                            onClick={() => removeSlide(slide.id)}
                            className="text-slate-500 hover:text-rose-400 self-start"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {slides.length === 0 && (
                      <div className="text-center py-8 border border-dashed border-white/10 rounded-xl text-slate-500 text-sm">
                        Sube una imagen para comenzar
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                   <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-10 h-6 rounded-full p-1 transition-colors ${editingBanner.is_active !== false ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${editingBanner.is_active !== false ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                      <span className="text-sm font-medium text-slate-300">Campaña Activa</span>
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
                  disabled={slides.length === 0}
                  className="w-full bg-gradient-to-r from-brand-pink to-pink-600 hover:from-brand-pink/90 hover:to-pink-600/90 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-pink/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Guardar Campaña
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-slate-900/30 border border-dashed border-white/5 rounded-2xl p-8 text-center text-slate-500 flex flex-col items-center justify-center h-64">
              <Zap size={32} className="mb-3 opacity-20" />
              <p className="text-sm">Selecciona una campaña para editar o crea una nueva.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Recorte */}
      {cropImage && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex flex-col">
          <div className="flex-1 relative bg-black">
            <Cropper
              image={cropImage}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="p-6 bg-slate-900 border-t border-white/10 flex items-center justify-between gap-4">
            <div className="text-white text-sm">
              Ajusta la imagen al formato del card (16:9)
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setCropImage(null)}
                className="px-6 py-2.5 rounded-xl font-bold text-white hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCropSave}
                disabled={uploading}
                className="px-6 py-2.5 bg-brand-pink text-white rounded-xl font-bold hover:bg-brand-pink/90 transition-colors flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <CropIcon size={18} />
                    Recortar y Guardar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
