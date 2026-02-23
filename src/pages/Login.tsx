import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Lock, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { HonoraryMention } from '../components/HonoraryMention';

interface LoginProps {
  onLogin: (email: string) => void;
  onBack?: () => void;
}

export function Login({ onLogin, onBack }: LoginProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHonoraryMention, setShowHonoraryMention] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (email === 'josevillavicencio@foodtook.com' && password === 'JOSE2015') {
      setIsLoading(false);
      setShowHonoraryMention(true);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      onLogin(email);
      setIsLoading(false);
    }, 1000);
  };

  const handleHonoraryComplete = () => {
    setShowHonoraryMention(false);
    onLogin(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden text-slate-100">
      {showHonoraryMention && <HonoraryMention onComplete={handleHonoraryComplete} />}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[50%] bg-brand-pink/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
        className="bg-slate-950/70 backdrop-blur-2xl w-full max-w-md rounded-[40px] shadow-[0_40px_90px_rgba(0,0,0,0.65)] border border-white/10 relative z-10 p-8 md:p-12"
      >
        {onBack && (
          <button 
            onClick={onBack}
            className="absolute top-6 left-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Volver"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-brand-pink via-fuchsia-500 to-cyan-400 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_28px_rgba(244,37,123,0.45)]">
            <span className="text-white font-bold text-2xl">FT</span>
          </div>
          <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">Bienvenido de nuevo</h1>
          <p className="text-slate-400">Ingresa tus credenciales para acceder</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Email</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-pink transition-colors" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink/50 text-white placeholder:text-slate-500 transition-all font-medium"
                placeholder="admin@foodtook.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold text-slate-300">Contraseña</label>
              <a href="#" className="text-xs font-semibold text-brand-pink hover:text-rose-400 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-pink transition-colors" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink/50 text-white placeholder:text-slate-500 transition-all font-medium"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-pink text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-[0_20px_50px_rgba(244,37,123,0.35)] hover:shadow-[0_25px_60px_rgba(244,37,123,0.45)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>Iniciar Sesión</span>
                <ArrowRight size={20} strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          ¿No tienes una cuenta?{' '}
          <a href="#" className="font-bold text-brand-pink hover:text-rose-400 transition-colors">
            Contactar soporte
          </a>
        </p>
      </motion.div>
    </div>
  );
}
