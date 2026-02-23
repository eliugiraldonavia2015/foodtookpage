import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { dishesData, usersData } from '../data';
import { Edit2, Trash2, Filter, ChevronDown, Plus, Download } from 'lucide-react';
import { exportToCSV } from '../utils/csvExport';

interface DishesListProps {
  initialRestaurantId?: string | null;
}

export function DishesList({ initialRestaurantId }: DishesListProps) {
  const [filterRestaurant, setFilterRestaurant] = useState(initialRestaurantId || 'all');

  useEffect(() => {
    if (initialRestaurantId) {
      setFilterRestaurant(initialRestaurantId);
    }
  }, [initialRestaurantId]);


  const filteredDishes = filterRestaurant === 'all'
    ? dishesData
    : dishesData.filter(d => d.restaurantId === filterRestaurant);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-white tracking-tight">Catálogo de Platos</h2>
          <p className="text-slate-400 font-medium mt-1">Administra el menú y disponibilidad de productos</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => exportToCSV(filteredDishes, 'dishes_catalog')}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Exportar CSV"
          >
            <Download size={20} />
          </button>
          <div className="relative group">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-slate-300 transition-colors" size={18} />
            <select
              value={filterRestaurant}
              onChange={(e) => setFilterRestaurant(e.target.value)}
              className="pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium focus:border-brand-pink/50 focus:ring-2 focus:ring-brand-pink/30 outline-none appearance-none cursor-pointer hover:border-white/20 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.25)] text-white min-w-[200px]"
            >
              <option value="all">Todos los Restaurantes</option>
              {usersData.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
          </div>
          <button className="bg-brand-pink text-white px-5 py-3 rounded-2xl font-bold shadow-[0_18px_40px_rgba(244,37,123,0.35)] hover:shadow-[0_22px_50px_rgba(244,37,123,0.5)] transition-all active:scale-95 flex items-center gap-2">
            <Plus size={18} strokeWidth={3} />
            <span className="hidden sm:inline">Nuevo Plato</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-950/70 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="text-left py-5 px-8 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Producto</th>
                <th className="text-left py-5 px-6 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Precio</th>
                <th className="text-left py-5 px-6 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Categoría</th>
                <th className="text-left py-5 px-6 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Restaurante</th>
                <th className="text-left py-5 px-6 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Estado</th>
                <th className="text-right py-5 px-8 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDishes.map((dish) => (
                <tr key={dish.id} className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-8">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white/5 shadow-[0_12px_30px_rgba(0,0,0,0.35)] border border-white/10 shrink-0">
                        <img 
                          src={dish.image} 
                          alt={dish.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-semibold text-white text-base">{dish.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-bold text-white">
                    ${dish.price.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-400">
                    <span className="inline-flex items-center px-3 py-1 rounded-xl bg-white/10 text-slate-300 text-xs font-bold border border-white/10">
                      {dish.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-400">
                    {dish.restaurantName}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                      dish.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' 
                        : 'bg-white/10 text-slate-300 border-white/10'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        dish.status === 'active' ? 'bg-emerald-400' : 'bg-slate-400'
                      }`}></span>
                      {dish.status === 'active' ? 'Disponible' : 'No disponible'}
                    </span>
                  </td>
                  <td className="py-4 px-8 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                      <button className="p-2 text-slate-400 hover:text-brand-pink hover:bg-brand-pink/10 rounded-xl transition-colors" title="Editar">
                        <Edit2 size={18} strokeWidth={2.5} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors" title="Eliminar">
                        <Trash2 size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="px-8 py-5 border-t border-white/10 flex items-center justify-between">
          <span className="text-sm text-slate-400 font-medium">Mostrando {filteredDishes.length} resultados</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-white/10 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 disabled:opacity-50">Anterior</button>
            <button className="px-4 py-2 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/20">Siguiente</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
