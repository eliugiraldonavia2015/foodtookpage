import { useState } from 'react';
import { motion } from 'motion/react';
import { LogOut, UtensilsCrossed, Store, Menu, X, Bell, User } from 'lucide-react';
import { RestaurantRequests } from './RestaurantRequests';
import { DishRequests } from './DishRequests';

interface OnboardingDashboardProps {
  name: string;
  email: string;
  onLogout: () => void;
  state?: string;
  role?: string;
}

type Tab = 'restaurant-requests' | 'dish-requests';

export function OnboardingDashboard({ name, email, onLogout, state = 'active', role = 'Onboarding Supervisor' }: OnboardingDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('restaurant-requests');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'restaurant-requests':
        return <RestaurantRequests />;
      case 'dish-requests':
        return <DishRequests />;
      default:
        return <RestaurantRequests />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-brand-pink selection:text-white flex overflow-hidden">
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="w-10 h-10 bg-gradient-to-tr from-brand-pink to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-pink/20">
              <span className="text-white font-bold text-xl">FT</span>
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-white block">FoodTook</span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Onboarding</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <button
              onClick={() => {
                setActiveTab('restaurant-requests');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === 'restaurant-requests' 
                  ? 'bg-gradient-to-r from-brand-pink/20 to-transparent text-white border-l-4 border-brand-pink' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Store size={20} className={activeTab === 'restaurant-requests' ? 'text-brand-pink' : 'text-slate-500 group-hover:text-white'} />
              <span className="font-medium">Restaurantes</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('dish-requests');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === 'dish-requests' 
                  ? 'bg-gradient-to-r from-brand-pink/20 to-transparent text-white border-l-4 border-brand-pink' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <UtensilsCrossed size={20} className={activeTab === 'dish-requests' ? 'text-brand-pink' : 'text-slate-500 group-hover:text-white'} />
              <span className="font-medium">Platos</span>
            </button>
          </nav>

          {/* User Profile & Logout */}
          <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
            
            {/* User Info Details */}
            <div className="px-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-white/10 shrink-0">
                  <User size={20} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{name}</p>
                  <p className="text-xs text-slate-500 truncate">{email}</p>
                </div>
              </div>

              <div className="bg-slate-800/30 rounded-lg p-3 space-y-2 border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Rol</span>
                  <span className="text-indigo-400 font-bold">{role}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Estado</span>
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${state === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${state === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    <span className="capitalize">{state}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/50 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 border border-white/5 hover:border-rose-500/20 transition-all duration-200"
            >
              <LogOut size={18} />
              <span className="font-medium text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-950 relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
             <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-white">FoodTook Onboarding</span>
          </div>
        </header>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-2">
              <div className="flex items-center gap-3">
                <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  En línea
                </div>
                <button className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-950"></span>
                </button>
              </div>
            </div>

            {/* Dynamic Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
