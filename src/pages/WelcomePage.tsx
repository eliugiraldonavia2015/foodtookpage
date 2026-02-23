import { motion } from 'motion/react';
import { User } from '../types';

interface WelcomePageProps {
  user: User;
  onLogout: () => void;
}

export const WelcomePage = ({ user, onLogout }: WelcomePageProps) => {
  const getRoleName = (role: string) => {
    switch (role) {
      case 'rider': return 'Rider';
      case 'restaurant': return 'Restaurante';
      case 'user': return 'Cliente';
      case 'admin': return 'Administrador';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-brand-pink/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800/50 backdrop-blur-xl border border-white/10 p-12 rounded-[40px] text-center max-w-2xl w-full mx-4 shadow-2xl relative z-10"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Bienvenido, <span className="text-brand-pink">{getRoleName(user.role)}</span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8">
            Hola <span className="font-semibold text-white">{user.name || user.email}</span>, has iniciado sesión correctamente.
          </p>

          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 mb-8">
            <p className="text-sm text-slate-400 mb-2">Tu ID de usuario:</p>
            <code className="bg-black/30 px-3 py-1.5 rounded-lg text-emerald-400 font-mono text-sm">
              {user.id}
            </code>
          </div>

          <button
            onClick={onLogout}
            className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all"
          >
            Cerrar Sesión
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
