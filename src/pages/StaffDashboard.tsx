import React from 'react';
import { motion } from 'motion/react';
import { LogOut } from 'lucide-react';
import { OnboardingDashboard } from './OnboardingDashboard';
import { CustomerSupportDashboard } from './CustomerSupportDashboard';

interface StaffDashboardProps {
  name: string;
  role: string;
  email: string;
  state: string;
  onLogout: () => void;
}

export function StaffDashboard({ name, role, email, state, onLogout }: StaffDashboardProps) {
  // Normalize role string for comparison
  const normalizedRole = role ? role.toLowerCase().trim() : '';
  
  if (normalizedRole === 'onboarding supervisor' || normalizedRole === 'onboarding_supervisor') {
    return <OnboardingDashboard name={name} email={email} onLogout={onLogout} role={role} state={state} />;
  }

  if (normalizedRole === 'customer support' || normalizedRole === 'servicio al cliente') {
    return <CustomerSupportDashboard name={name} email={email} onLogout={onLogout} role={role} state={state} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">
              Bienvenido
            </h1>
            <p className="text-xl text-gray-600 font-medium">
              {name}
            </p>
          </div>

          <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-left">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">
                Rol Asignado
              </p>
              <p className="text-2xl font-bold text-indigo-600 break-words leading-tight">
                {role}
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-200/50">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">
                  Email Corporativo
                </p>
                <p className="text-sm font-medium text-gray-700 break-all">
                  {email}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">
                  Estado de Cuenta
                </p>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${state === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  <span className={`w-2 h-2 rounded-full ${state === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                  {state}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </motion.div>
    </div>
  );
}
