import { useState, FormEvent, useEffect, ChangeEvent } from 'react';
import { motion } from 'motion/react';
import { User, Lock, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, dbAdmin } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface StaffLoginProps {
  onLogin: (email: string) => void;
  onBack?: () => void;
}

export function StaffLogin({ onLogin, onBack }: StaffLoginProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Verificación adicional de seguridad para Staff
      const staffQuery = query(collection(dbAdmin, "staff"), where("email", "==", email));
      const staffSnapshot = await getDocs(staffQuery);

      if (staffSnapshot.empty) {
        await signOut(auth);
        throw new Error("unauthorized-staff");
      }

      const staffData = staffSnapshot.docs[0].data();

      // Validación de estado de cuenta
      if (staffData.state !== 'active') {
        await signOut(auth);
        throw new Error("account-disabled");
      }

      // Si es admin, rechazar acceso en este portal
      if (staffData.role === 'admin') {
        await signOut(auth);
        throw new Error("admin-restricted");
      }

      onLogin(email);
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.message === 'unauthorized-staff' || err.message === 'admin-restricted') {
         setError('Cuenta no reconocida o no autorizada para este portal.');
      } else if (err.message === 'account-disabled') {
         setError('Esta cuenta ha sido deshabilitada. Contacte al administrador.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Credenciales inválidas.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Correo inválido.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Espera unos minutos.');
      } else {
        setError('Error de conexión.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden font-sans text-slate-900">
      {/* Clean, Corporate Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 relative z-10"
      >
        {onBack && (
          <button 
            onClick={onBack}
            className="absolute top-6 left-6 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Volver"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-slate-900 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-slate-900/20">
            <span className="text-white font-bold text-xl tracking-tight">FT</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Portal de Staff</h1>
          <p className="text-slate-500 text-sm">Acceso exclusivo para personal autorizado</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Email Corporativo</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-slate-900 placeholder:text-slate-400 transition-all font-medium text-sm"
                placeholder="usuario@foodtook.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Contraseña</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-slate-900 placeholder:text-slate-400 transition-all font-medium text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <span>Ingresar al Sistema</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            Sistema de Gestión Interna v1.0
          </p>
        </div>
      </motion.div>
    </div>
  );
}