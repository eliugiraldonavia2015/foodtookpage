import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Lock, ArrowRight, Loader2, ArrowLeft, Mail, Eye, EyeOff, CheckCircle, X, Smartphone, ShieldCheck } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

interface UserAuthProps {
  onLogin: (email: string) => void;
  onBack: () => void;
}

export function UserAuth({ onLogin, onBack }: UserAuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin(email);
    } catch (err: any) {
      console.error("User Login error:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Correo o contraseña incorrectos.');
      } else if (err.code === 'auth/invalid-email') {
        setError('El correo electrónico no es válido.');
      } else {
        setError('Error al iniciar sesión. Verifica tus datos.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Background Elements - Matching Landing Page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-brand-pink/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
        className="bg-white w-full max-w-md rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 relative z-10 p-8 md:p-12"
      >
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Volver"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-pink rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-brand-pink/30">
            <span className="text-white font-bold text-2xl">FT</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
            {isLogin ? '¡Hola de nuevo!' : 'Únete a FoodTook'}
          </h1>
          <p className="text-slate-500">
            {isLogin ? 'Ingresa para continuar disfrutando' : 'Crea tu cuenta y descubre sabores'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Nombre Completo</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-pink transition-colors" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink outline-none text-slate-900 placeholder:text-slate-400 transition-all font-medium"
                  placeholder="Juan Pérez"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-pink transition-colors" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink outline-none text-slate-900 placeholder:text-slate-400 transition-all font-medium"
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-slate-700">Contraseña</label>
              {isLogin && (
                <a href="#" className="text-xs font-bold text-brand-pink hover:text-pink-600 transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              )}
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-pink transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink outline-none text-slate-900 placeholder:text-slate-400 transition-all font-medium"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-2xl text-sm flex items-center gap-2 mt-2">
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-pink text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-brand-pink/30 hover:shadow-xl hover:shadow-brand-pink/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-4"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
                <ArrowRight size={20} strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-brand-pink hover:text-pink-600 transition-colors"
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
