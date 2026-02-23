import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, AlertCircle, Clock, DollarSign, Search, ChevronRight, ArrowLeft, UtensilsCrossed, MapPin, Filter, ChevronDown, Download } from 'lucide-react';
import { dishesData, usersData } from '../data';
import { Dish } from '../types';
import { exportToCSV } from '../utils/csvExport';

interface RestaurantGroup {
  id: string;
  name: string;
  count: number;
  latestDate: string;
  country: string;
  province: string;
}

const LOCATIONS = {
  'Ecuador': ['Pichincha', 'Guayas', 'Azuay', 'Manabí', 'Loja'],
  'Colombia': ['Cundinamarca', 'Antioquia', 'Valle del Cauca', 'Atlántico', 'Bolívar']
};

export function DishRequests() {
  const [requests, setRequests] = useState<Dish[]>(dishesData.filter(d => d.status === 'pending'));
  const [view, setView] = useState<'restaurants' | 'dishes'>('restaurants');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  
  // Modal State
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // Group requests by restaurant
  const restaurantGroups = requests.reduce<Record<string, RestaurantGroup>>((acc: Record<string, RestaurantGroup>, dish: Dish) => {
    if (!acc[dish.restaurantId]) {
      const restaurantUser = usersData.find(u => u.id === dish.restaurantId);
      acc[dish.restaurantId] = {
        id: dish.restaurantId,
        name: dish.restaurantName,
        count: 0,
        latestDate: dish.submittedAt || '',
        country: restaurantUser?.country || 'Desconocido',
        province: restaurantUser?.province || 'Desconocido'
      };
    }
    acc[dish.restaurantId].count++;
    // Keep the most recent date
    if (dish.submittedAt && dish.submittedAt > acc[dish.restaurantId].latestDate) {
      acc[dish.restaurantId].latestDate = dish.submittedAt;
    }
    return acc;
  }, {});

  const restaurants = Object.values(restaurantGroups) as RestaurantGroup[];

  const filteredRestaurants = restaurants.filter((r: RestaurantGroup) => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry ? r.country === selectedCountry : true;
    const matchesProvince = selectedProvince ? r.province === selectedProvince : true;
    return matchesSearch && matchesCountry && matchesProvince;
  });

  const handleRestaurantClick = (id: string) => {
    setSelectedRestaurantId(id);
    setView('dishes');
  };

  const handleBack = () => {
    setView('restaurants');
    setSelectedRestaurantId(null);
  };

  const handleApprove = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
    // Check if there are remaining dishes for this restaurant
    const remaining = requests.filter(r => r.id !== id && r.restaurantId === selectedRestaurantId);
    if (remaining.length === 0) {
      handleBack();
    }
  };

  const openRejectModal = (dish: Dish) => {
    setSelectedDish(dish);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const handleReject = () => {
    if (!selectedDish) return;
    console.log(`Rejecting dish ${selectedDish.id} for reason: ${rejectReason}`);
    setRequests(requests.filter(r => r.id !== selectedDish.id));
    
    // Check if there are remaining dishes for this restaurant
    const remaining = requests.filter(r => r.id !== selectedDish.id && r.restaurantId === selectedRestaurantId);
    if (remaining.length === 0) {
      handleBack();
    }

    setIsRejectModalOpen(false);
    setSelectedDish(null);
  };

  const currentRestaurantDishes = selectedRestaurantId 
    ? requests.filter(d => d.restaurantId === selectedRestaurantId)
    : [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <AnimatePresence mode="wait">
        {view === 'restaurants' ? (
          <motion.div
            key="restaurants"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl font-semibold text-white tracking-tight">Solicitudes de Platos</h2>
              <p className="text-slate-400 font-medium mt-1">Selecciona un restaurante para revisar sus platos pendientes</p>
            </div>

            <div className="bg-slate-950/70 p-6 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-pink transition-colors" size={20} />
                <input 
                  type="text"
                  placeholder="Buscar restaurante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-brand-pink/30 text-white placeholder:text-slate-500 transition-all"
                />
              </div>

              <div className="flex gap-4 w-full md:w-auto">
                <button 
                  onClick={() => exportToCSV(requests, 'dish_requests')}
                  className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Exportar CSV"
                >
                  <Download size={20} />
                </button>
                <div className="relative w-full md:w-48 group">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setSelectedProvince('');
                    }}
                    className="w-full pl-12 pr-10 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand-pink/30 appearance-none cursor-pointer text-white"
                  >
                    <option value="">Todos los Países</option>
                    {Object.keys(LOCATIONS).map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                </div>

                <div className="relative w-full md:w-48 group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    disabled={!selectedCountry}
                    className="w-full pl-12 pr-10 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand-pink/30 appearance-none cursor-pointer disabled:opacity-50 text-white"
                  >
                    <option value="">Todas las Provincias</option>
                    {selectedCountry && (LOCATIONS as any)[selectedCountry].map((province: string) => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredRestaurants.length === 0 ? (
                <div className="bg-slate-950/70 p-16 rounded-3xl text-center border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="text-slate-500" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Sin resultados</h3>
                  <p className="text-slate-400">No se encontraron solicitudes con los filtros actuales.</p>
                </div>
              ) : (
                filteredRestaurants.map((restaurant) => (
                  <motion.div 
                    key={restaurant.id}
                    layoutId={`restaurant-${restaurant.id}`}
                    onClick={() => handleRestaurantClick(restaurant.id)}
                    className="bg-slate-950/70 p-6 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.45)] border border-white/10 hover:border-white/20 hover:-translate-y-1 transition-all cursor-pointer group flex items-center justify-between relative overflow-hidden"
                  >
                    <div className="flex items-center space-x-6 relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white font-bold text-2xl shadow-[0_12px_30px_rgba(0,0,0,0.35)] border border-white/10 shrink-0 overflow-hidden">
                        {restaurant.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white group-hover:text-brand-pink transition-colors mb-2">{restaurant.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center text-sm font-medium text-slate-400 gap-2 sm:gap-4">
                          <span className="flex items-center bg-white/5 px-3 py-1 rounded-lg text-slate-300 border border-white/10">
                            <UtensilsCrossed size={14} className="mr-2 text-brand-pink" />
                            {restaurant.count} platos pendientes
                          </span>
                          <span className="flex items-center bg-white/5 px-3 py-1 rounded-lg text-slate-300 border border-white/10">
                            <MapPin size={14} className="mr-2 text-cyan-400" />
                            {restaurant.country}, {restaurant.province}
                          </span>
                          <span className="flex items-center bg-white/5 px-3 py-1 rounded-lg text-slate-300 border border-white/10">
                            <Clock size={14} className="mr-2 text-amber-400" />
                            {new Date(restaurant.latestDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-brand-pink group-hover:text-white transition-all shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
                      <ChevronRight size={20} strokeWidth={3} />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dishes"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBack}
                className="p-3 bg-white/5 rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.35)] border border-white/10 hover:bg-white/10 transition-colors group"
              >
                <ArrowLeft size={20} className="text-slate-400 group-hover:text-white" />
              </button>
              <div>
                <h2 className="text-3xl font-semibold text-white tracking-tight">Revisión de Platos</h2>
                <p className="text-slate-400 font-medium mt-1">Restaurante: <span className="text-brand-pink">{currentRestaurantDishes[0]?.restaurantName}</span></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentRestaurantDishes.map((dish, index) => (
                <motion.div 
                  key={dish.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-950/70 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 group flex flex-col h-full"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={dish.image} 
                      alt={dish.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border border-white/10 text-white">
                      {dish.category}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-white leading-tight">{dish.name}</h3>
                      <span className="text-xl font-bold text-white bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                        ${dish.price.toFixed(2)}
                      </span>
                    </div>
                    
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed flex-1">{dish.description}</p>
                    
                    <div className="space-y-3 pt-6 border-t border-white/10">
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span className="flex items-center gap-2">
                          <Clock size={16} className="text-slate-500" />
                          Enviado:
                        </span>
                        <span className="font-medium text-slate-200">
                          {dish.submittedAt ? new Date(dish.submittedAt).toLocaleDateString() : '-'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <button 
                          onClick={() => handleApprove(dish.id)}
                          className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 px-4 rounded-xl font-bold hover:bg-emerald-400 transition-colors shadow-[0_14px_30px_rgba(16,185,129,0.35)] active:scale-95"
                        >
                          <Check size={18} strokeWidth={3} />
                          Aprobar
                        </button>
                        <button 
                          onClick={() => openRejectModal(dish)}
                          className="flex items-center justify-center gap-2 bg-white/5 border border-rose-500/30 text-rose-300 py-3 px-4 rounded-xl font-bold hover:bg-rose-500/10 transition-colors active:scale-95"
                        >
                          <X size={18} strokeWidth={3} />
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-slate-950/90 rounded-[32px] max-w-md w-full p-8 shadow-[0_40px_90px_rgba(0,0,0,0.7)] border border-white/10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center">
                <AlertCircle className="text-rose-300" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Rechazar Solicitud</h3>
                <p className="text-sm text-slate-400">Esta acción notificará al restaurante</p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Motivo del rechazo
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-4 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink/50 outline-none min-h-[120px] resize-none text-sm bg-white/5 text-white placeholder:text-slate-500"
                placeholder="Explica por qué se rechaza este plato..."
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsRejectModalOpen(false)}
                className="flex-1 py-3 px-4 border border-white/10 rounded-xl text-slate-300 font-bold hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="flex-1 py-3 px-4 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[0_16px_40px_rgba(244,63,94,0.35)]"
              >
                Confirmar Rechazo
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
