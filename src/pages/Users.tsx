import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MoreVertical, Edit2, Utensils, Ban, CheckCircle, Search, Trash2, Mail, Phone, X, Shield, User as UserIcon, Store, Briefcase, Lock, DollarSign, TrendingUp, Activity, AlertTriangle, PieChart, Download } from 'lucide-react';
import { User, Restaurant } from '../types';
import { exportToCSV } from '../utils/csvExport';

interface UsersListProps {
  onViewDishes?: (restaurantId: string) => void;
  users: (User | Restaurant)[];
  searchTerm: string;
  onToggleBan: (userId: string) => void;
  onAddUser: (newUser: User | Restaurant) => void;
  onModalStateChange?: (isOpen: boolean) => void;
}

type CreateUserRole = 'admin' | 'staff' | 'restaurant' | null;
type StaffRole = 'Secretario' | 'Ventas' | 'Servicio al cliente' | 'Legal' | 'Financiero' | 'Inversor';

export function UsersList({ onViewDishes, users, searchTerm, onToggleBan, onAddUser, onModalStateChange }: UsersListProps) {
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | Restaurant | null>(null);
  const [viewMode, setViewMode] = useState<'restaurants' | 'users'>('restaurants');
  const [selectedRole, setSelectedRole] = useState<CreateUserRole>(null);
  const [formData, setFormData] = useState({
    globalAdminUser: '',
    globalAdminPass: '',
    newUser: '',
    newPass: '',
    permissions: '', // For admin
    staffRole: 'Secretario' as StaffRole,
    restaurantName: '',
    ruc: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    province: ''
  });

  useEffect(() => {
    onModalStateChange?.(isCreateModalOpen);
  }, [isCreateModalOpen, onModalStateChange]);

  const toggleBanStatus = (userId: string) => {
    onToggleBan(userId);
  };

  const resetForm = () => {
    setSelectedRole(null);
    setFormData({
      globalAdminUser: '',
      globalAdminPass: '',
      newUser: '',
      newPass: '',
      permissions: '',
      staffRole: 'Secretario',
      restaurantName: '',
      ruc: '',
      ownerName: '',
      email: '',
      phone: '',
      address: '',
      country: '',
      province: ''
    });
  };

  const handleCreateUser = () => {
    // Logic to create user would go here
    console.log('Creating user with data:', { role: selectedRole, ...formData });
    
    // Mock adding user
    const newUser: User = {
      id: `u${Date.now()}`,
      name: selectedRole === 'restaurant' ? formData.restaurantName : formData.newUser,
      email: formData.email || `${formData.newUser}@example.com`,
      status: 'active',
      role: selectedRole as any,
      joinedDate: new Date().toISOString(),
      staffRole: selectedRole === 'staff' ? formData.staffRole : undefined,
      phone: formData.phone,
      address: formData.address,
      country: formData.country,
      province: formData.province,
      ruc: formData.ruc
    };

    onAddUser(newUser);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = viewMode === 'restaurants' 
      ? user.role === 'restaurant'
      : user.role !== 'restaurant';

    return matchesSearch && matchesType;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-6 mb-6">
        <div className="bg-slate-950/50 p-1 rounded-xl border border-white/10 flex items-center">
          <button 
            onClick={() => setViewMode('restaurants')}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              viewMode === 'restaurants' 
                ? 'bg-white/10 text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-white/5' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Restaurantes
          </button>
          <button 
            onClick={() => setViewMode('users')}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              viewMode === 'users' 
                ? 'bg-white/10 text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-white/5' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Usuarios
          </button>
        </div>

        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-brand-pink text-white px-6 py-3 rounded-2xl font-bold shadow-[0_18px_40px_rgba(244,37,123,0.35)] hover:shadow-[0_22px_50px_rgba(244,37,123,0.5)] transition-all active:scale-95 whitespace-nowrap"
        >
          + Nuevo Usuario
        </button>
      </div>

      <div className="bg-slate-950/70 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-white/10 max-w-[calc(100vw-3rem)] md:max-w-[calc(100vw-18rem)] mx-auto overflow-hidden">
        <div 
          className="w-full overflow-x-auto pb-6 custom-scrollbar"
          style={{ 
            scrollbarWidth: 'auto', 
            scrollbarColor: '#F4257B rgba(255, 255, 255, 0.05)'
          }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            .custom-scrollbar::-webkit-scrollbar {
              height: 14px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.05);
              border-radius: 8px;
              margin: 0 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: #F4257B;
              border-radius: 8px;
              border: 3px solid rgba(0, 0, 0, 0.2);
              background-clip: padding-box;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: #ff4d94;
            }
          `}} />
          <table className="w-full min-w-[2000px]">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="text-left py-5 px-8 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Usuario / Restaurante</th>
                <th className="text-left py-5 px-6 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Rol</th>
                
                {/* Dynamic Headers based on type - this assumes mixed list but we will render conditionally in cells or split columns if needed. 
                    Given the request to "make it wider" and "include all info", we will create specific columns. 
                    However, since rows are mixed, we need a smart layout. 
                    Let's use a combined approach with wider dedicated columns for the most important metrics and a "Details" column.
                    Actually, better to have specific columns that can be empty if not applicable, or smart columns.
                */}
                <th className="text-left py-5 px-6 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                  <div>Financials</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">(GMV/LTV)</div>
                </th>
                <th className="text-left py-5 px-6 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                  <div>Performance</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">(Margin/Freq)</div>
                </th>
                <th className="text-left py-5 px-6 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                  <div>Engagement</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">/ Conv</div>
                </th>
                <th className="text-left py-5 px-6 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                  <div>Risk</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">/ Dependency</div>
                </th>
                <th className="text-left py-5 px-6 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                  <div>Marketing</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">(Ads/Stories)</div>
                </th>

                <th className="text-left py-5 px-6 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Estado</th>
                <th className="text-left py-5 px-6 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                  <td className="py-5 px-8 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-slate-300 font-bold mr-4 shadow-[0_10px_25px_rgba(0,0,0,0.35)] text-lg border border-white/10 shrink-0 overflow-hidden">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-base">{user.name}</div>
                        <div className="text-xs text-slate-500 font-medium">
                          {user.email}
                          {user.ruc && <span className="block mt-0.5 text-slate-600">RUC: {user.ruc}</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {user.role === 'admin' && <Shield size={16} className="text-brand-pink" />}
                      {user.role === 'restaurant' && <Store size={16} className="text-cyan-400" />}
                      {user.role === 'staff' && <Briefcase size={16} className="text-amber-400" />}
                      <span className="text-sm font-medium text-slate-300 capitalize">
                        {user.role === 'staff' ? user.staffRole : user.role}
                      </span>
                    </div>
                  </td>

                  {/* Financials Column: GMV for Restaurants, LTV for Users */}
                  <td className="py-5 px-6 whitespace-nowrap">
                    {user.role === 'restaurant' ? (
                       <div className="flex flex-col">
                         <span className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">GMV</span>
                         <span className="text-sm font-bold text-emerald-400">${(user as Restaurant).gmv?.toLocaleString()}</span>
                       </div>
                    ) : (
                       <div className="flex flex-col">
                         <span className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">LTV</span>
                         <span className="text-sm font-bold text-emerald-400">${(user as any).ltv || 0}</span>
                       </div>
                    )}
                  </td>

                  {/* Performance Column: Margin for Restaurants, Frequency for Users */}
                  <td className="py-5 px-6 whitespace-nowrap">
                    {user.role === 'restaurant' ? (
                       <div className="flex flex-col">
                         <span className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Margin Contrib.</span>
                         <div className="flex items-center gap-1">
                           <TrendingUp size={14} className="text-blue-400" />
                           <span className="text-sm font-medium text-white">{(user as Restaurant).marginContribution}%</span>
                         </div>
                       </div>
                    ) : (
                       <div className="flex flex-col">
                         <span className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Frequency</span>
                         <span className="text-sm font-medium text-white">{(user as any).frequency || 0}x/mo</span>
                       </div>
                    )}
                  </td>

                  {/* Engagement / Conversion Column */}
                  <td className="py-5 px-6 whitespace-nowrap">
                    {user.role === 'restaurant' ? (
                       <div className="flex flex-col">
                         <span className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Conversion</span>
                         <span className="text-sm font-medium text-white">{(user as Restaurant).conversionRate}%</span>
                       </div>
                    ) : (
                       <div className="flex flex-col">
                         <span className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Engagement</span>
                         <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
                           <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(user as any).engagementScore || 0}%` }}></div>
                         </div>
                         <span className="text-[10px] text-slate-400 mt-0.5">{(user as any).engagementScore || 0}/100</span>
                       </div>
                    )}
                  </td>

                  {/* Risk / Dependency Column */}
                  <td className="py-5 px-6 whitespace-nowrap">
                    {user.role === 'restaurant' ? (
                       <div className="flex flex-col">
                         <span className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Dependency</span>
                         <span className={`text-sm font-medium ${(user as Restaurant).dependencyIndex && (user as Restaurant).dependencyIndex! > 50 ? 'text-rose-400' : 'text-slate-300'}`}>
                           {(user as Restaurant).dependencyIndex}%
                         </span>
                       </div>
                    ) : (
                       <div className="flex flex-col">
                         <span className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Risk Flag</span>
                         {(user as any).riskFlag ? (
                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md uppercase ${
                              (user as any).riskFlag === 'high' ? 'bg-rose-500/20 text-rose-400' :
                              (user as any).riskFlag === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {(user as any).riskFlag}
                            </span>
                         ) : <span className="text-slate-500 text-xs">-</span>}
                       </div>
                    )}
                  </td>

                  {/* Marketing Column (Restaurant Only mostly) */}
                  <td className="py-5 px-6 whitespace-nowrap">
                    {user.role === 'restaurant' ? (
                       <div className="space-y-1">
                         <div className="flex justify-between items-center text-xs">
                           <span className="text-slate-500">Ads:</span>
                           <span className="text-white font-medium">${(user as Restaurant).adsSpend}</span>
                         </div>
                         <div className="flex justify-between items-center text-xs">
                           <span className="text-slate-500">Stories:</span>
                           <span className="text-pink-400 font-medium">{(user as Restaurant).ordersFromStories}%</span>
                         </div>
                       </div>
                    ) : (
                       <span className="text-slate-600 text-xs">-</span>
                    )}
                  </td>

                  <td className="py-5 px-6 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                      user.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' 
                        : user.status === 'banned'
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                        : 'bg-white/10 text-slate-300 border-white/10'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        user.status === 'active' ? 'bg-emerald-400' : user.status === 'banned' ? 'bg-rose-400' : 'bg-slate-400'
                      }`}></span>
                      {user.status === 'active' ? 'Activo' : user.status === 'banned' ? 'Baneado' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-5 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      {user.role === 'restaurant' && (
                        <button 
                          onClick={() => onViewDishes?.(user.id)}
                          className="p-2 text-slate-400 hover:text-brand-pink hover:bg-brand-pink/10 rounded-xl transition-colors" 
                          title="Ver Platos"
                        >
                          <Utensils size={18} strokeWidth={2.5} />
                        </button>
                      )}
                      <button className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-xl transition-colors" title="Editar">
                        <Edit2 size={18} strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={() => toggleBanStatus(user.id)}
                        className={`p-2 rounded-xl transition-colors ${
                          user.status === 'banned' 
                            ? 'text-emerald-300 hover:bg-emerald-500/10' 
                            : 'text-slate-400 hover:text-rose-300 hover:bg-rose-500/10'
                        }`}
                        title={user.status === 'banned' ? "Activar" : "Banear"}
                      >
                        {user.status === 'banned' ? <CheckCircle size={18} strokeWidth={2.5} /> : <Ban size={18} strokeWidth={2.5} />}
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
          <span className="text-sm text-slate-400 font-medium">Mostrando 1-{Math.min(10, filteredUsers.length)} de {filteredUsers.length} resultados</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-white/10 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 disabled:opacity-50">Anterior</button>
            <button className="px-4 py-2 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/20">Siguiente</button>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setIsCreateModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-950 rounded-[32px] max-w-2xl w-full p-8 shadow-[0_40px_90px_rgba(0,0,0,0.7)] border border-white/10 relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Crear Nuevo Usuario</h3>
                <p className="text-slate-400">Selecciona el tipo de usuario y completa la información requerida.</p>
              </div>

              {!selectedRole ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setSelectedRole('admin')}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-pink/50 hover:bg-brand-pink/5 transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-brand-pink/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Shield className="text-brand-pink" size={24} />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-1">Admin</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Acceso total al sistema y gestión de usuarios.</p>
                  </button>

                  <button 
                    onClick={() => setSelectedRole('staff')}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-amber-400/5 transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-400/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Briefcase className="text-amber-400" size={24} />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-1">Staff</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Roles específicos como Ventas, Legal, Finanzas, etc.</p>
                  </button>

                  <button 
                    onClick={() => setSelectedRole('restaurant')}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-cyan-400/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Store className="text-cyan-400" size={24} />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-1">Restaurante</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Cuenta para gestionar menú y pedidos de un restaurante.</p>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <button 
                    onClick={() => setSelectedRole(null)}
                    className="text-sm text-slate-400 hover:text-white flex items-center gap-2 mb-4"
                  >
                    ← Volver a selección de rol
                  </button>

                  {/* ADMIN FORM */}
                  {selectedRole === 'admin' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-brand-pink/5 border border-brand-pink/20 rounded-xl p-4 mb-6">
                        <h4 className="text-brand-pink font-semibold flex items-center gap-2 mb-3">
                          <Lock size={16} /> Autenticación Global Requerida
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input 
                            type="text" 
                            placeholder="Usuario Admin Global"
                            value={formData.globalAdminUser}
                            onChange={(e) => setFormData({...formData, globalAdminUser: e.target.value})}
                            className="bg-slate-950/50 border border-brand-pink/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-pink/50"
                          />
                          <input 
                            type="password" 
                            placeholder="Contraseña Admin Global"
                            value={formData.globalAdminPass}
                            onChange={(e) => setFormData({...formData, globalAdminPass: e.target.value})}
                            className="bg-slate-950/50 border border-brand-pink/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-pink/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-300">Nuevo Usuario</label>
                          <input 
                            type="text" 
                            value={formData.newUser}
                            onChange={(e) => setFormData({...formData, newUser: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-pink/50 transition-colors"
                            placeholder="Nombre de usuario"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-300">Contraseña</label>
                          <input 
                            type="password" 
                            value={formData.newPass}
                            onChange={(e) => setFormData({...formData, newPass: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-pink/50 transition-colors"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Permisos y Accesos</label>
                        <textarea 
                          value={formData.permissions}
                          onChange={(e) => setFormData({...formData, permissions: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-pink/50 transition-colors h-24 resize-none"
                          placeholder="Describa los permisos o niveles de acceso..."
                        />
                      </div>
                    </div>
                  )}

                  {/* STAFF FORM */}
                  {selectedRole === 'staff' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-4 mb-6">
                        <h4 className="text-amber-400 font-semibold flex items-center gap-2 mb-3">
                          <Lock size={16} /> Autenticación Global Requerida
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input 
                            type="text" 
                            placeholder="Usuario Admin Global"
                            value={formData.globalAdminUser}
                            onChange={(e) => setFormData({...formData, globalAdminUser: e.target.value})}
                            className="bg-slate-950/50 border border-amber-400/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-400/50"
                          />
                          <input 
                            type="password" 
                            placeholder="Contraseña Admin Global"
                            value={formData.globalAdminPass}
                            onChange={(e) => setFormData({...formData, globalAdminPass: e.target.value})}
                            className="bg-slate-950/50 border border-amber-400/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-400/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Rol de Staff</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {['Secretario', 'Ventas', 'Servicio al cliente', 'Legal', 'Financiero', 'Inversor'].map((role) => (
                            <button
                              key={role}
                              onClick={() => setFormData({...formData, staffRole: role as StaffRole})}
                              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                                formData.staffRole === role 
                                  ? 'bg-amber-400 text-slate-950 border-amber-400' 
                                  : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                              }`}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-300">Nuevo Usuario</label>
                          <input 
                            type="text" 
                            value={formData.newUser}
                            onChange={(e) => setFormData({...formData, newUser: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400/50 transition-colors"
                            placeholder="Nombre de usuario"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-300">Contraseña</label>
                          <input 
                            type="password" 
                            value={formData.newPass}
                            onChange={(e) => setFormData({...formData, newPass: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400/50 transition-colors"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* RESTAURANT FORM */}
                  {selectedRole === 'restaurant' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-300">Nombre del Restaurante</label>
                          <input 
                            type="text" 
                            value={formData.restaurantName}
                            onChange={(e) => setFormData({...formData, restaurantName: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                            placeholder="Ej. El Buen Sabor"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-300">RUC / ID Legal</label>
                          <input 
                            type="text" 
                            value={formData.ruc}
                            onChange={(e) => setFormData({...formData, ruc: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                            placeholder="Número de identificación"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-300">Nombre del Propietario</label>
                          <input 
                            type="text" 
                            value={formData.ownerName}
                            onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                            placeholder="Nombre completo"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-300">Email</label>
                          <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                            placeholder="contacto@restaurante.com"
                          />
                        </div>
                         <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-300">Teléfono</label>
                          <input 
                            type="text" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                            placeholder="+593 99..."
                          />
                        </div>
                         <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-300">Dirección</label>
                          <input 
                            type="text" 
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                            placeholder="Dirección del local"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-300">País</label>
                          <input 
                            type="text" 
                            value={formData.country}
                            onChange={(e) => setFormData({...formData, country: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                            placeholder="País"
                          />
                        </div>
                         <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-300">Provincia / Ciudad</label>
                          <input 
                            type="text" 
                            value={formData.province}
                            onChange={(e) => setFormData({...formData, province: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                            placeholder="Provincia"
                          />
                        </div>
                      </div>
                      
                      <div className="bg-white/5 border border-dashed border-white/20 rounded-xl p-8 text-center hover:bg-white/10 transition-colors cursor-pointer group">
                         <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                           <Store className="text-slate-400" size={20} />
                         </div>
                         <p className="text-sm font-medium text-slate-300">Subir documentos de registro</p>
                         <p className="text-xs text-slate-500 mt-1">RUC, Permiso de funcionamiento, etc.</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex gap-3">
                    <button 
                      onClick={() => {
                        setIsCreateModalOpen(false);
                        resetForm();
                      }}
                      className="flex-1 py-3 px-4 border border-white/10 rounded-xl text-slate-300 font-bold hover:bg-white/5 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleCreateUser}
                      className="flex-1 py-3 px-4 bg-brand-pink text-white rounded-xl font-bold hover:shadow-lg hover:shadow-brand-pink/25 transition-all active:scale-95"
                    >
                      Crear Usuario
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
