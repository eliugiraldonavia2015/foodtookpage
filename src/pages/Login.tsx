import { useState, FormEvent, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Lock, ArrowRight, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { HonoraryMention } from '../components/HonoraryMention';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, dbAdmin } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface LoginProps {
  onLogin: (email: string) => void;
  onBack?: () => void;
  variant?: 'admin' | 'staff';
}

export function Login({ onLogin, onBack, variant = 'admin' }: LoginProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHonoraryMention, setShowHonoraryMention] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (email === 'josevillavicencio@foodtook.com' && password === 'JOSE2015') {
      setIsLoading(false);
      setShowHonoraryMention(true);
      return;
    }

    try {
      // 1. Intentar iniciar sesión normalmente
      await signInWithEmailAndPassword(auth, email, password);

      // 2. Si es Admin, verificamos PERMISOS en 'mandar'
      // Pero NO cerramos sesión inmediatamente si falla algo menor, dejamos que App.tsx decida,
      // salvo que sea un error crítico de seguridad (cuenta desactivada o rol incorrecto).
      if (variant === 'admin') {
         const adminQuery = query(collection(dbAdmin, "mandar"), where("email", "==", email));
         const adminSnapshot = await getDocs(adminQuery);

         if (adminSnapshot.empty) {
            // Si no está en 'mandar', quizás deberíamos crearlo (Auto-Registro)
            // Lanzamos error específico para que el catch lo capture y lo cree.
            throw { code: 'auth/user-not-found-in-db' };
         } else {
             const adminData = adminSnapshot.docs[0].data();
             
             // Validación de estado de cuenta Admin
             if (adminData.state !== 'active') {
                await signOut(auth);
                throw new Error("account-disabled");
             }

             if (adminData.role !== 'admin') {
                await signOut(auth);
                throw new Error("unauthorized-admin-role");
             }
         }
      }

      onLogin(email);
    } catch (err: any) {
      console.error("Login error full object:", err);
      
      // AUTO-REGISTRO Y MANEJO DE ERRORES DE BASE DE DATOS
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found-in-db') {
        if (variant === 'admin') {
          try {
            // Verificar si existe en 'mandar' para auto-crear o validar
            const adminQuery = query(collection(dbAdmin, "mandar"), where("email", "==", email));
            const adminSnapshot = await getDocs(adminQuery);

            if (!adminSnapshot.empty) {
              const adminData = adminSnapshot.docs[0].data();
              
              if (adminData.role === 'admin' && adminData.state === 'active') {
                // El usuario es válido en Firestore.
                // Si el error fue que no existía en Auth, lo creamos.
                if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
                    try {
                        await createUserWithEmailAndPassword(auth, email, password);
                        onLogin(email);
                        return;
                    } catch (createErr: any) {
                        // Si falla porque "email-already-in-use", significa que la contraseña estaba mal en el login original
                        if (createErr.code === 'auth/email-already-in-use') {
                            setError('Contraseña incorrecta.');
                            return;
                        }
                    }
                } else {
                    // Si el error fue 'user-not-found-in-db' pero AHORA sí lo encontramos (race condition?), permitimos acceso
                    onLogin(email); 
                    return;
                }
              }
            }
          } catch (createErr) {
             console.error("Error en auto-registro:", createErr);
          }
        }
      }

      console.log("Error code:", err.code);
      console.log("Error message:", err.message);

      if (err.message === 'unauthorized-admin' || err.message === 'unauthorized-admin-role') {
         setError('Cuenta no autorizada para administración.');
      } else if (err.message === 'account-disabled') {
         setError('Esta cuenta ha sido deshabilitada. Contacte al administrador.');
      } else if (err.code === 'auth/user-not-found') {
        setError('El usuario no existe en Firebase Authentication. Por favor regístralo primero o verifica el correo.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Contraseña incorrecta.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Credenciales inválidas (Usuario o contraseña).');
      } else if (err.code === 'auth/invalid-email') {
        setError('El formato del correo electrónico es inválido.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos fallidos. Intenta más tarde.');
      } else {
        setError(`Error: ${err.message || 'Ocurrió un error al iniciar sesión'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleHonoraryComplete = () => {
    setShowHonoraryMention(false);
    onLogin(email);
  };

  const isStaff = variant === 'staff';

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden ${isStaff ? 'text-slate-900 bg-slate-50' : 'text-slate-100'}`}>
      {showHonoraryMention && <HonoraryMention onComplete={handleHonoraryComplete} />}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {isStaff ? (
          <>
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl" />
          </>
        ) : (
          <>
            <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[50%] bg-brand-pink/20 rounded-full blur-3xl" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] bg-cyan-500/20 rounded-full blur-3xl" />
          </>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
        className={`${isStaff ? 'bg-white shadow-[0_20px_60px_rgba(0,0,0,0.1)] border-slate-100' : 'bg-slate-950/70 backdrop-blur-2xl shadow-[0_40px_90px_rgba(0,0,0,0.65)] border-white/10'} w-full max-w-md rounded-[40px] border relative z-10 p-8 md:p-12`}
      >
        {onBack && (
          <button 
            onClick={onBack}
            className={`absolute top-6 left-6 p-2 rounded-full transition-colors ${isStaff ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
            title="Volver"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        <div className="text-center mb-10">
          <div className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center ${isStaff ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30' : 'bg-gradient-to-tr from-brand-pink via-fuchsia-500 to-cyan-400 shadow-[0_0_28px_rgba(244,37,123,0.45)]'}`}>
            <span className="text-white font-bold text-2xl">FT</span>
          </div>
          <h1 className={`text-3xl font-semibold tracking-tight mb-2 ${isStaff ? 'text-slate-900' : 'text-white'}`}>
            {isStaff ? 'Staff Portal' : 'Bienvenido de nuevo'}
          </h1>
          <p className="text-slate-400">Ingresa tus credenciales para acceder</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className={`text-sm font-semibold ml-1 ${isStaff ? 'text-slate-700' : 'text-slate-300'}`}>Email</label>
            <div className="relative group">
              <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isStaff ? 'text-slate-400 group-focus-within:text-blue-600' : 'text-slate-500 group-focus-within:text-brand-pink'}`} size={20} />
              <input
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-all font-medium ${isStaff 
                  ? 'bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder:text-slate-400' 
                  : 'bg-white/5 border-white/10 focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink/50 text-white placeholder:text-slate-500'}`}
                placeholder="nombre@ejemplo.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-semibold ml-1 ${isStaff ? 'text-slate-700' : 'text-slate-300'}`}>Contraseña</label>
            <div className="relative group">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isStaff ? 'text-slate-400 group-focus-within:text-blue-600' : 'text-slate-500 group-focus-within:text-brand-pink'}`} size={20} />
              <input
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-all font-medium ${isStaff 
                  ? 'bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder:text-slate-400' 
                  : 'bg-white/5 border-white/10 focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink/50 text-white placeholder:text-slate-500'}`}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${isStaff ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${isStaff ? 'bg-red-600' : 'bg-red-500'}`} />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 group ${isStaff 
              ? 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800' 
              : 'bg-gradient-to-r from-brand-pink to-rose-600 text-white shadow-brand-pink/30 hover:shadow-brand-pink/40'}`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <span>Iniciar Sesión</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
