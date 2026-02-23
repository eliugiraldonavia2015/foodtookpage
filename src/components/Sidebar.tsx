import { LogOut, LayoutDashboard, TrendingUp, Heart, Activity, Shield, DollarSign, Map, Users, Utensils, ClipboardList, Store } from 'lucide-react';
import { motion } from 'motion/react';
import { Tab } from '../types';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onLogout: () => void;
}

export function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'command-center', label: 'Command Center', icon: LayoutDashboard },
    { id: 'growth', label: 'Growth', icon: TrendingUp },
    { id: 'attention-content', label: 'Attention & Content', icon: Heart },
    { id: 'operations', label: 'Operations', icon: Activity },
    { id: 'quality-risk', label: 'Quality & Risk', icon: Shield },
    { id: 'financial-control', label: 'Financial Control', icon: DollarSign },
    { id: 'geography-intelligence', label: 'Geography Intelligence', icon: Map },
    { id: 'users-restaurants', label: 'Users & Restaurants', icon: Users },
    { id: 'content-product-governance', label: 'Content & Product Gov', icon: Utensils },
    { id: 'dish-requests', label: 'Dish Requests', icon: ClipboardList },
    { id: 'restaurant-requests', label: 'Restaurant Requests', icon: Store },
  ] as const;

  return (
    <aside className="w-72 h-screen fixed left-0 top-0 z-20 p-4 hidden md:flex flex-col">
      <div className="flex-1 bg-slate-950/80 backdrop-blur-2xl border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.55)] rounded-[32px] flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1f2937,transparent_65%)] opacity-70"></div>
        <div className="relative z-10 p-8 pb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-pink via-fuchsia-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_28px_rgba(244,37,123,0.45)]">
              FT
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white tracking-tight">FoodTook</h1>
              <span className="text-xs text-slate-400">Admin Suite</span>
            </div>
          </div>
          
          <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 -mr-2 custom-scrollbar">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.2em] px-4 mb-2">Menu</p>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                    isActive 
                      ? 'text-white font-semibold bg-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 w-1 h-5 bg-gradient-to-b from-brand-pink to-cyan-400 rounded-r-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <item.icon 
                    size={20} 
                    className={`transition-colors duration-300 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-200'
                    }`} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="relative z-10 text-sm text-left truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 mt-auto p-6 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-300 group border border-transparent hover:border-rose-500/20"
          >
            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-rose-500/10 transition-colors">
              <LogOut size={18} className="text-slate-400 group-hover:text-rose-300" />
            </div>
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
