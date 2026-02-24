import React from 'react';
import { motion } from 'motion/react';
import { LogOut } from 'lucide-react';

interface StaffDashboardProps {
  role: string;
  email: string;
  onLogout: () => void;
}

export function StaffDashboard({ role, email, onLogout }: StaffDashboardProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Bienvenido
          </h1>
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">
              Tu Rol Asignado
            </p>
            <p className="text-3xl font-bold text-indigo-600 break-words">
              {role}
            </p>
          </div>
          <p className="text-gray-500 text-sm">
            Sesión iniciada como <span className="font-medium text-gray-700">{email}</span>
          </p>
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
