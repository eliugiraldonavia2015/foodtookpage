
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Plus, Trash2, Edit2, Image as ImageIcon, 
  Zap, Smartphone, Upload, Crop as CropIcon, X, GripVertical,
  Store, List, Layers, Search, Check, AlertTriangle
} from 'lucide-react';
import { 
  getZones, getBanners, createBanner, updateBanner, deleteBanner, uploadBannerImage, 
  getDiscoveryConfig, saveDiscoveryConfig,
  Zone, Banner, BannerSlide 
} from '../supabaseClient';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Tipos para configuración
interface RestaurantConfig {
  id: string; // Firebase UID
  name: string;
  image?: string;
  rating?: number;
}

interface CategoryItem {
  id: string;
  name: string;
  image_url: string;
}

export const BannerManagerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'banners' | 'restaurants' | 'categories'>('banners');
  
  // Estados Globales
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Selector de Pantalla
  const [selectedScreen, setSelectedScreen] = useState('discovery');
  const SCREENS = [
    { id: 'discovery', label: 'Discovery Food', icon: Zap },
    { id: 'pharmacy', label: 'Farmacias', icon: Check },
    { id: 'supermarkets', label: 'Supermercados', icon: Store },
    { id: 'restaurants', label: 'Restaurantes', icon: Store },
  ];

  // --- ESTADOS BANNERS ---
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploading, setUploading] = useState(false);

  // --- ESTADOS RESTAURANTES ---
  const [allRestaurants, setAllRestaurants] = useState<RestaurantConfig[]>([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState<RestaurantConfig[]>([]);
  const [restSearch, setRestSearch] = useState('');
  const [restConfigLoading, setRestConfigLoading] = useState(false);
  const [restConfigSettings, setRestConfigSettings] = useState({
    strategy: 'fixed_order', // 'fixed_order' | 'top_20_random'
    limit: 40
  });

  // --- ESTADOS CATEGORÍAS ---
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [customSections, setCustomSections] = useState<any[]>([]); // Nuevas secciones dinámicas para Discovery
  const [catConfigLoading, setCatConfigLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryItem> | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState<string | null>(null); // Para crear nueva sección

  // Inicialización
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
      
      // Pre-fetch restaurants from Firebase
      try {
        const q = query(collection(db, "users"), where("role", "==", "restaurant"));
        const snapshot = await getDocs(q);
        const rests: RestaurantConfig[] = [];
        snapshot.forEach(doc => {
          const d = doc.data();
          rests.push({
            id: doc.id,
            name: d.name || d.firstName || 'Sin Nombre',
            image: d.image || d.photoURL,
            rating: d.rating
          });
        });
        setAllRestaurants(rests);
      } catch (e) {
        console.error("Error fetching restaurants:", e);
      }

      setLoading(false);
    };
    init();
  }, []);

  // Cambio de Zona o Pantalla
  useEffect(() => {
    if (selectedZoneId) {
      if (activeTab === 'banners') fetchBanners(selectedZoneId, selectedScreen);
      if (activeTab === 'restaurants') fetchRestaurantConfig(selectedZoneId, selectedScreen);
      if (activeTab === 'categories') fetchCategoryConfig(selectedZoneId, selectedScreen);
    }
  }, [selectedZoneId, activeTab, selectedScreen]);

  // --- LOGICA BANNERS ---
  const fetchBanners = async (zoneId: number, screenId: string) => {
    const data = await getBanners(zoneId, screenId);
    setBanners(data);
  };

  useEffect(() => {
    if (editingBanner) {
      if (editingBanner.slides && editingBanner.slides.length > 0) {
        setSlides(editingBanner.slides);
      } else if (editingBanner.image_url) {
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

  const handleSaveBanner = async () => {
    if (!selectedZoneId || slides.length === 0) return;
    try {
      const bannerData = {
        zone_id: selectedZoneId,
        screen_id: selectedScreen, // Incluir screen_id
        title: editingBanner?.title || 'Campaña Sin Nombre',
        subtitle: '',
        image_url: slides[0].image_url,
        action_type: slides[0].action_type,
        action_target: slides[0].action_target,
        slides: slides,
        is_active: editingBanner?.is_active ?? true,
        priority: editingBanner?.priority || (banners.length + 1)
      };

      if (editingBanner?.id) {
        await updateBanner(editingBanner.id, bannerData);
      } else {
        await createBanner(bannerData as any);
      }
      await fetchBanners(selectedZoneId, selectedScreen);
      setEditingBanner(null);
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("Error al guardar");
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (confirm("¿Eliminar campaña?")) {
      await deleteBanner(id);
      if (selectedZoneId) fetchBanners(selectedZoneId, selectedScreen);
    }
  };

  const updateSlide = (id: string, updates: Partial<BannerSlide>) => {
    setSlides(slides.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removeSlide = (id: string) => {
    setSlides(slides.filter(s => s.id !== id));
  };


  // --- LOGICA RESTAURANTES ---
  const fetchRestaurantConfig = async (zoneId: number, screenId: string) => {
    setRestConfigLoading(true);
    const config = await getDiscoveryConfig(zoneId, `${screenId}_restaurants_featured`);
    if (config) {
      // Reconstruct objects from IDs
      const orderedIds = config.ordered_ids || [];
      const orderedRests = orderedIds
        .map((id: string) => allRestaurants.find(r => r.id === id))
        .filter(Boolean) as RestaurantConfig[];
      
      setFeaturedRestaurants(orderedRests);
      setRestConfigSettings({
        strategy: config.strategy || 'fixed_order',
        limit: config.limit || 40
      });
    } else {
      setFeaturedRestaurants([]);
    }
    setRestConfigLoading(false);
  };

  const handleSaveRestConfig = async () => {
    if (!selectedZoneId) return;
    try {
      await saveDiscoveryConfig(selectedZoneId, `${selectedScreen}_restaurants_featured`, {
        ordered_ids: featuredRestaurants.map(r => r.id),
        strategy: restConfigSettings.strategy,
        limit: restConfigSettings.limit
      });
      alert('Configuración de restaurantes guardada');
    } catch (e) {
      alert('Error guardando configuración');
    }
  };

  const addToFeatured = (rest: RestaurantConfig) => {
    if (!featuredRestaurants.find(r => r.id === rest.id)) {
      setFeaturedRestaurants([...featuredRestaurants, rest]);
    }
  };

  const removeFromFeatured = (id: string) => {
    setFeaturedRestaurants(featuredRestaurants.filter(r => r.id !== id));
  };


  // --- ESTADOS SECCIONES (Supermercados/Farmacias) ---
  const [sections, setSections] = useState<any[]>([]);
  const [editingSection, setEditingSection] = useState<any | null>(null);

  // --- LOGICA CATEGORÍAS/SECCIONES ---
  const fetchCategoryConfig = async (zoneId: number, screenId: string) => {
    setCatConfigLoading(true);
    
    if (screenId === 'discovery') {
      // Modo Simple: Solo categorías para Discovery
      const config = await getDiscoveryConfig(zoneId, `${screenId}_categories_grid`);
      if (config && config.items) {
        setCategories(config.items);
      } else {
        setCategories([]);
      }

      // Cargar secciones dinámicas de Discovery
      const customConfig = await getDiscoveryConfig(zoneId, `${screenId}_custom_sections`);
      if (customConfig && customConfig.sections) {
        setCustomSections(customConfig.sections);
      } else {
        setCustomSections([]);
      }
    } else {
      // Modo Avanzado: Secciones Dinámicas para Supermercados/Farmacias
      const config = await getDiscoveryConfig(zoneId, `${screenId}_layout`);
      if (config && config.sections) {
        setSections(config.sections);
      } else {
        // Default sections if empty
        setSections([
          { id: 'cat_grid', type: 'category_grid', title: 'Categorías', items: [] },
          { id: 'feat_prods', type: 'product_row', title: 'Productos Destacados', items: [] }
        ]);
      }
    }
    
    setCatConfigLoading(false);
  };

  const handleSaveSections = async (newSections: any[]) => {
    if (!selectedZoneId) return;
    try {
      await saveDiscoveryConfig(selectedZoneId, `${selectedScreen}_layout`, {
        sections: newSections
      });
      alert('Diseño de pantalla guardado');
    } catch (e) {
      alert('Error guardando secciones');
    }
  };

  const handleUpdateSectionItems = (sectionId: string, newItems: any[]) => {
    const newSections = sections.map(s => s.id === sectionId ? { ...s, items: newItems } : s);
    setSections(newSections);
    handleSaveSections(newSections);
  };

  const handleAddSectionItem = (sectionId: string, item: any) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    
    const newItem = {
      id: item.id || crypto.randomUUID(),
      name: item.name,
      image_url: item.image_url || 'https://via.placeholder.com/150',
      ...item
    };
    
    const newItems = [...(section.items || []), newItem];
    handleUpdateSectionItems(sectionId, newItems);
  };

  const handleDeleteSectionItem = (sectionId: string, itemId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    const newItems = section.items.filter((i: any) => i.id !== itemId);
    handleUpdateSectionItems(sectionId, newItems);
  };


  const handleSaveCatConfig = async (newCats?: CategoryItem[]) => {
    if (!selectedZoneId) return;
    const catsToSave = newCats || categories;
    try {
      await saveDiscoveryConfig(selectedZoneId, `${selectedScreen}_categories_grid`, {
        items: catsToSave
      });
      if (!newCats) alert('Categorías guardadas');
    } catch (e) {
      alert('Error guardando categorías');
    }
  };

  // --- LOGICA SECCIONES PERSONALIZADAS DISCOVERY ---
  const handleSaveCustomSections = async (newSections: any[]) => {
    if (!selectedZoneId) return;
    try {
      await saveDiscoveryConfig(selectedZoneId, `${selectedScreen}_custom_sections`, {
        sections: newSections
      });
      // No alertar cada vez, solo en error o acción manual
    } catch (e) {
      alert('Error guardando secciones del feed');
    }
  };

  const handleAddCustomSection = () => {
    if (!editingSectionTitle) return;
    
    const newSection = {
      id: crypto.randomUUID(),
      title: editingSectionTitle,
      type: 'product_carousel', // Por defecto carrusel de productos
      items: []
    };
    
    const newSections = [...customSections, newSection];
    setCustomSections(newSections);
    handleSaveCustomSections(newSections);
    setEditingSectionTitle(null);
  };

  const handleDeleteCustomSection = (id: string) => {
    if (confirm("¿Eliminar esta sección del feed?")) {
      const newSections = customSections.filter(s => s.id !== id);
      setCustomSections(newSections);
      handleSaveCustomSections(newSections);
    }
  };

  const handleAddCategory = () => {
    if (editingCategory && editingCategory.name) {
      // Si estamos en modo secciones (no discovery), añadimos al editingSection actual
      if (selectedScreen !== 'discovery' && editingSection) {
        handleAddSectionItem(editingSection.id, editingCategory);
        setEditingCategory(null);
        setEditingSection(null);
        return;
      }

      const newCat = {
        id: editingCategory.id || crypto.randomUUID(),
        name: editingCategory.name,
        image_url: editingCategory.image_url || 'https://via.placeholder.com/150'
      };
      
      let newCats;
      if (editingCategory.id) {
        newCats = categories.map(c => c.id === newCat.id ? newCat : c);
      } else {
        newCats = [...categories, newCat];
      }
      
      setCategories(newCats);
      handleSaveCatConfig(newCats);
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm("¿Eliminar categoría de la pantalla?")) {
      const newCats = categories.filter(c => c.id !== id);
      setCategories(newCats);
      handleSaveCatConfig(newCats);
    }
  };


  const selectedZoneName = zones.find(z => z.zone_id === selectedZoneId)?.zone_name || 'Zona';

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="text-amber-400" />
              Gestor de Discovery
            </h1>
            <p className="text-slate-400 text-sm">Configura qué ven los usuarios en la pantalla principal</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Selector de Pantalla */}
          <div className="flex bg-slate-900 border border-white/10 rounded-xl p-1">
            {SCREENS.map(screen => {
              const Icon = screen.icon;
              return (
                <button
                  key={screen.id}
                  onClick={() => setSelectedScreen(screen.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                    selectedScreen === screen.id 
                      ? 'bg-brand-pink text-white shadow-md' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  {screen.label}
                </button>
              );
            })}
          </div>

          <select 
            value={selectedZoneId || ''}
            onChange={(e) => setSelectedZoneId(Number(e.target.value))}
            className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-pink outline-none w-full md:w-auto"
          >
            {zones.map(z => (
              <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-6 flex gap-2 overflow-x-auto pb-2">
        <button 
          onClick={() => setActiveTab('banners')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'banners' ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
        >
          <Smartphone size={18} />
          Banners & Cards
        </button>
        
        {/* Restaurantes solo en Discovery */}
        {(selectedScreen === 'discovery' || selectedScreen === 'restaurants') && (
          <button 
            onClick={() => setActiveTab('restaurants')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'restaurants' ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            <Store size={18} />
            Orden de Restaurantes
          </button>
        )}

        <button 
          onClick={() => setActiveTab('categories')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'categories' ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
        >
          <List size={18} />
          {selectedScreen === 'discovery' ? 'Categorías' : 'Secciones & Categorías'}
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-7xl mx-auto">
        
        {/* --- TAB BANNERS --- */}
        {activeTab === 'banners' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">Campañas Activas</h2>
                <button onClick={() => setEditingBanner({ is_active: true })} className="text-sm text-brand-pink font-bold hover:underline">+ Nueva</button>
              </div>
              
              {loading ? (
                 <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-brand-pink border-t-transparent rounded-full animate-spin"></div></div>
              ) : banners.length === 0 ? (
                <div className="bg-slate-900/50 border border-dashed border-white/10 rounded-2xl p-12 text-center text-slate-500">Sin campañas activas</div>
              ) : (
                <div className="space-y-4">
                  {banners.map((banner) => (
                    <motion.div 
                      key={banner.id}
                      layoutId={banner.id}
                      className="bg-slate-900 border border-white/10 rounded-2xl p-4 flex gap-4 group hover:border-white/20 transition-all cursor-pointer"
                      onClick={() => setEditingBanner(banner)}
                    >
                      <div className="w-32 h-20 bg-slate-800 rounded-lg overflow-hidden shrink-0 relative">
                        <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                        {banner.slides && banner.slides.length > 1 && (
                          <div className="absolute top-1 right-1 bg-black/60 px-1.5 rounded text-[10px] text-white font-bold">+{banner.slides.length - 1}</div>
                        )}
                        {!banner.is_active && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="text-[10px] font-bold bg-slate-700 px-2 py-0.5 rounded text-slate-300">INACTIVO</span></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white truncate">{banner.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 truncate">{banner.slides?.length || 1} Slides activos</p>
                        <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); setEditingBanner(banner); }} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1"><Edit2 size={12} /> Editar</button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteBanner(banner.id); }} className="text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1"><Trash2 size={12} /> Eliminar</button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              {editingBanner ? (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-900 border border-white/10 rounded-2xl p-6 sticky top-6 shadow-xl max-h-[90vh] overflow-y-auto">
                  <h3 className="text-lg font-bold mb-6 flex items-center justify-between">{editingBanner.id ? 'Editar Campaña' : 'Nueva Campaña'} <button onClick={() => setEditingBanner(null)} className="text-slate-400 hover:text-white"><X size={20} /></button></h3>
                  <div className="space-y-6">
                    <div><label className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 block">Nombre Interno</label><input type="text" value={editingBanner.title || ''} onChange={e => setEditingBanner({...editingBanner, title: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-pink outline-none text-white" placeholder="Ej: Promo Pizza" /></div>
                    <div>
                      <div className="flex justify-between items-center mb-3"><label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Slides ({slides.length})</label><label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"><Upload size={14} /> Añadir Foto <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} /></label></div>
                      <div className="space-y-3">{slides.map((slide, index) => (<div key={slide.id} className="bg-slate-950 border border-white/10 rounded-xl p-3 relative group"><div className="flex gap-3"><div className="w-20 h-12 bg-black rounded-lg overflow-hidden shrink-0 relative"><img src={slide.image_url} className="w-full h-full object-cover" /><div className="absolute top-0 left-0 bg-black/60 px-1.5 rounded-br text-[10px] font-bold">#{index + 1}</div></div><div className="flex-1 space-y-2"><select value={slide.action_type} onChange={e => updateSlide(slide.id, { action_type: e.target.value as any })} className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs outline-none"><option value="none">Solo Ver</option><option value="open_restaurant">Abrir Restaurante</option><option value="open_category">Abrir Categoría</option></select>{slide.action_type !== 'none' && (<input type="text" value={slide.action_target || ''} onChange={e => updateSlide(slide.id, { action_target: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs outline-none" placeholder="ID Destino..." />)}</div><button onClick={() => removeSlide(slide.id)} className="text-slate-500 hover:text-rose-400 self-start"><Trash2 size={16} /></button></div></div>))}{slides.length === 0 && (<div className="text-center py-8 border border-dashed border-white/10 rounded-xl text-slate-500 text-sm">Sube una imagen para comenzar</div>)}</div>
                    </div>
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between"><label className="flex items-center gap-3 cursor-pointer"><div className={`w-10 h-6 rounded-full p-1 transition-colors ${editingBanner.is_active !== false ? 'bg-emerald-500' : 'bg-slate-700'}`}><div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${editingBanner.is_active !== false ? 'translate-x-4' : 'translate-x-0'}`} /></div><span className="text-sm font-medium text-slate-300">Campaña Activa</span><input type="checkbox" className="hidden" checked={editingBanner.is_active !== false} onChange={e => setEditingBanner({...editingBanner, is_active: e.target.checked})} /></label></div>
                    <button onClick={handleSaveBanner} disabled={slides.length === 0} className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-pink/20 flex items-center justify-center gap-2"><Save size={18} /> Guardar Campaña</button>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-slate-900/30 border border-dashed border-white/5 rounded-2xl p-8 text-center text-slate-500 flex flex-col items-center justify-center h-64"><Zap size={32} className="mb-3 opacity-20" /><p className="text-sm">Selecciona una campaña para editar o crea una nueva.</p></div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB RESTAURANTS --- */}
        {activeTab === 'restaurants' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-250px)]">
            {/* Columna Izquierda: Disponibles */}
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-slate-900">
                <h3 className="font-bold text-white mb-2">Restaurantes Disponibles</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Buscar restaurante..." 
                    value={restSearch}
                    onChange={(e) => setRestSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm focus:border-brand-pink outline-none"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {allRestaurants
                  .filter(r => 
                    r.name.toLowerCase().includes(restSearch.toLowerCase()) && 
                    !featuredRestaurants.find(fr => fr.id === r.id)
                  )
                  .map(rest => (
                    <div key={rest.id} className="flex items-center justify-between p-3 bg-slate-950 border border-white/5 rounded-xl hover:border-white/20 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden">
                          {rest.image && <img src={rest.image} className="w-full h-full object-cover" />}
                        </div>
                        <span className="text-sm font-medium">{rest.name}</span>
                      </div>
                      <button onClick={() => addToFeatured(rest)} className="p-1.5 bg-brand-pink/10 text-brand-pink rounded-lg hover:bg-brand-pink/20"><Plus size={16} /></button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Columna Derecha: Destacados (Ordenables) */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-xl">
              <div className="p-4 border-b border-white/10 bg-slate-900 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Layers className="text-amber-400" size={18} />
                    Orden de Visualización
                  </h3>
                  <p className="text-xs text-slate-400">Arrastra para reordenar (Top {restConfigSettings.limit})</p>
                </div>
                <button onClick={handleSaveRestConfig} className="bg-brand-pink text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"><Save size={14} /> Guardar</button>
              </div>
              
              <div className="p-4 bg-slate-950/50 border-b border-white/5">
                <div className="flex items-center gap-4 text-xs text-slate-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="strategy" checked={restConfigSettings.strategy === 'fixed_order'} onChange={() => setRestConfigSettings({...restConfigSettings, strategy: 'fixed_order'})} />
                    Orden Fijo Estricto
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="strategy" checked={restConfigSettings.strategy === 'top_20_random'} onChange={() => setRestConfigSettings({...restConfigSettings, strategy: 'top_20_random'})} />
                    Top 20 Fijo + Random
                  </label>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 relative">
                <Reorder.Group axis="y" values={featuredRestaurants} onReorder={setFeaturedRestaurants} className="space-y-2">
                  {featuredRestaurants.map((rest, index) => (
                    <Reorder.Item key={rest.id} value={rest} className="cursor-grab active:cursor-grabbing">
                      <div className="flex items-center justify-between p-3 bg-slate-800 border border-white/10 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-700 text-xs font-bold flex items-center justify-center text-slate-400">#{index + 1}</span>
                          <div className="w-10 h-10 rounded-lg bg-slate-900 overflow-hidden">
                            {rest.image && <img src={rest.image} className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <span className="text-sm font-bold block">{rest.name}</span>
                            {index >= 20 && restConfigSettings.strategy === 'top_20_random' && (
                              <span className="text-[10px] text-amber-400 flex items-center gap-1"><AlertTriangle size={10} /> Zona Aleatoria</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <GripVertical size={16} className="text-slate-500" />
                          <button onClick={() => removeFromFeatured(rest.id)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-rose-400"><X size={16} /></button>
                        </div>
                      </div>
                    </Reorder.Item>
                  ))}
                  {featuredRestaurants.length === 0 && (
                    <div className="text-center py-10 text-slate-500 text-sm border-2 border-dashed border-white/5 rounded-xl">
                      Arrastra o añade restaurantes aquí
                    </div>
                  )}
                </Reorder.Group>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB CATEGORIES / SECTIONS --- */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {selectedScreen === 'discovery' ? 'Diseño de Pantalla' : 'Diseño de Pantalla'}
                </h2>
                <p className="text-sm text-slate-400">Configura los elementos visibles en la pantalla</p>
              </div>
            </div>

            {/* MODO DISCOVERY: GRID SIMPLE + SECCIONES PERSONALIZADAS */}
            {selectedScreen === 'discovery' && (
              <div className="space-y-10">
                
                {/* 1. GRID DE CATEGORÍAS (ICONOS) */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">1. Iconos de Acceso Rápido</h3>
                        <p className="text-xs text-slate-500">Círculos superiores con imagen (Ej: Supermercado, Farmacia)</p>
                     </div>
                     <button 
                        onClick={() => setEditingCategory({})} 
                        className="bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border border-white/10"
                      >
                        <Plus size={14} /> Añadir Icono (Requiere Foto)
                      </button>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {categories.map((cat) => (
                      <div key={cat.id} className="bg-slate-900 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-3 group relative hover:border-brand-pink/50 transition-all">
                        <div className="w-16 h-16 rounded-full bg-slate-800 overflow-hidden border-2 border-white/5 group-hover:border-brand-pink transition-colors">
                          <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm font-bold text-center">{cat.name}</span>
                        
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <button onClick={() => setEditingCategory(cat)} className="p-1 bg-white/10 rounded hover:bg-white/20"><Edit2 size={12} /></button>
                          <button onClick={() => handleDeleteCategory(cat.id)} className="p-1 bg-rose-500/20 text-rose-400 rounded hover:bg-rose-500/30"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    ))}
                    {categories.length === 0 && (
                      <div className="col-span-full py-8 text-center text-slate-500 border border-dashed border-white/10 rounded-xl text-sm">
                        No hay iconos configurados
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. SECCIONES DEL FEED */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">2. Secciones del Feed</h3>
                        <p className="text-xs text-slate-500">Listas horizontales de productos (Ej: "Tendencias", "Lo Nuevo")</p>
                    </div>
                    <button 
                      onClick={() => setEditingSectionTitle('')}
                      className="bg-brand-pink text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-pink/20"
                    >
                      <Plus size={14} /> Nueva Sección (Solo Título)
                    </button>
                  </div>
                  
                  <div className="space-y-6">

                    {customSections.map((section) => (
                      <div key={section.id} className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 relative group">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold text-white">{section.title}</h3>
                          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg">Editar Items (Próximamente)</button>
                            <button onClick={() => handleDeleteCustomSection(section.id)} className="text-rose-400 hover:bg-rose-500/10 p-2 rounded-lg"><Trash2 size={16} /></button>
                          </div>
                        </div>

                        {/* Placeholder para Sección Vacía */}
                        {(!section.items || section.items.length === 0) ? (
                          <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-950/30">
                            <Layers className="text-slate-600 mb-2" size={32} />
                            <p className="text-slate-400 font-bold mb-1">{section.title}</p>
                            <p className="text-xs text-slate-500">Esta sección está vacía. Añade productos para que sea visible.</p>
                          </div>
                        ) : (
                          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                             {/* Aquí irían los items si los hubiera */}
                             <div className="text-slate-500 text-sm">Items configurados ({section.items.length})</div>
                          </div>
                        )}
                      </div>
                    ))}

                    {customSections.length === 0 && (
                      <div className="py-12 text-center text-slate-500 border border-dashed border-white/10 rounded-xl">
                        No hay secciones personalizadas. Se mostrarán solo las predeterminadas (Recomendados, etc).
                      </div>
                    )}
                  </div>

                  {/* Formulario Inline para Nueva Sección */}
                  {editingSectionTitle !== null && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-4">Nueva Sección del Feed</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs text-slate-400 mb-1 block">Título de la Sección</label>
                            <input 
                              type="text" 
                              value={editingSectionTitle} 
                              onChange={e => setEditingSectionTitle(e.target.value)} 
                              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-brand-pink" 
                              placeholder="Ej: Platillos en Tendencia"
                              autoFocus
                            />
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button onClick={() => setEditingSectionTitle(null)} className="flex-1 py-2 bg-white/5 rounded-xl font-bold text-sm">Cancelar</button>
                            <button onClick={handleAddCustomSection} disabled={!editingSectionTitle.trim()} className="flex-1 py-2 bg-brand-pink rounded-xl font-bold text-sm disabled:opacity-50">Crear</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MODO AVANZADO: SECCIONES (Super, Farmacia) */}
            {selectedScreen !== 'discovery' && (
              <div className="space-y-8">
                {sections.map((section) => (
                  <div key={section.id} className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {section.type === 'category_grid' ? <List size={20} className="text-blue-400" /> : <Store size={20} className="text-amber-400" />}
                        {section.title}
                      </h3>
                      <button 
                        onClick={() => {
                          setEditingSection(section);
                          setEditingCategory({}); // Reusamos el modal de categoría para ítems
                        }}
                        className="text-sm text-brand-pink font-bold hover:underline flex items-center gap-1"
                      >
                        <Plus size={14} /> Añadir Ítem
                      </button>
                    </div>

                    {/* Renderizado según tipo de sección */}
                    {section.type === 'category_grid' ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {section.items?.map((item: any) => (
                          <div key={item.id} className="bg-slate-800 border border-white/5 rounded-xl p-3 flex flex-col items-center gap-2 group relative">
                            <div className="w-14 h-14 rounded-xl bg-slate-700 overflow-hidden">
                              <img src={item.image_url} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xs font-bold text-center leading-tight">{item.name}</span>
                            <button 
                              onClick={() => handleDeleteSectionItem(section.id, item.id)}
                              className="absolute -top-1 -right-1 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                        {(!section.items || section.items.length === 0) && (
                          <div className="col-span-full py-6 text-center text-slate-500 text-xs border border-dashed border-white/5 rounded-xl">
                            Sección vacía
                          </div>
                        )}
                      </div>
                    ) : (
                      // Product Row / List
                      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                        {section.items?.map((item: any) => (
                          <div key={item.id} className="w-32 shrink-0 bg-slate-800 border border-white/5 rounded-xl overflow-hidden group relative">
                            <div className="h-24 bg-slate-700">
                              <img src={item.image_url} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-2">
                              <p className="text-xs font-bold truncate">{item.name}</p>
                              <p className="text-[10px] text-slate-400">Destacado</p>
                            </div>
                            <button 
                              onClick={() => handleDeleteSectionItem(section.id, item.id)}
                              className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                        {(!section.items || section.items.length === 0) && (
                          <div className="w-full py-6 text-center text-slate-500 text-xs border border-dashed border-white/5 rounded-xl">
                            Sin productos destacados
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Modals & Overlays */}
      
      {/* Modal Editar Categoría */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">{editingCategory.id ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Nombre</label>
                <input type="text" value={editingCategory.name || ''} onChange={e => setEditingCategory({...editingCategory, name: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-brand-pink" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">URL Icono/Imagen</label>
                <input type="text" value={editingCategory.image_url || ''} onChange={e => setEditingCategory({...editingCategory, image_url: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-brand-pink" />
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setEditingCategory(null)} className="flex-1 py-2 bg-white/5 rounded-xl font-bold text-sm">Cancelar</button>
                <button onClick={handleAddCategory} className="flex-1 py-2 bg-brand-pink rounded-xl font-bold text-sm">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cropper Modal */}
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
            <div className="text-white text-sm">Ajusta la imagen al formato del card (16:9)</div>
            <div className="flex gap-3">
              <button onClick={() => setCropImage(null)} className="px-6 py-2.5 rounded-xl font-bold text-white hover:bg-white/10 transition-colors">Cancelar</button>
              <button onClick={handleCropSave} disabled={uploading} className="px-6 py-2.5 bg-brand-pink text-white rounded-xl font-bold hover:bg-brand-pink/90 transition-colors flex items-center gap-2">{uploading ? 'Subiendo...' : <><CropIcon size={18} /> Recortar y Guardar</>}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
