import { motion } from 'motion/react';
import { Award, Star, Heart, Crown } from 'lucide-react';
import { useEffect } from 'react';

interface HonoraryMentionProps {
  onComplete: () => void;
}

export function HonoraryMention({ onComplete }: HonoraryMentionProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Allow user to read it for a few seconds before showing a continue button or auto-proceeding
      // But let's just provide a button for better UX
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-brand-pink/20 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-fuchsia-500/20 rounded-full blur-3xl" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="bg-gradient-to-br from-slate-900 to-slate-800 border border-brand-pink/30 w-full max-w-2xl rounded-3xl p-10 relative overflow-hidden text-center shadow-[0_0_100px_rgba(244,37,123,0.2)]"
      >
        {/* Confetti/Sparkles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 0, x: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              y: -100 - Math.random() * 100,
              x: (Math.random() - 0.5) * 200,
              rotate: Math.random() * 360
            }}
            transition={{ 
              duration: 2 + Math.random(), 
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute bottom-0 left-1/2 text-brand-pink"
          >
            <Star size={10 + Math.random() * 20} fill="currentColor" />
          </motion.div>
        ))}

        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-24 h-24 bg-gradient-to-tr from-brand-pink via-fuchsia-500 to-rose-600 rounded-full mx-auto mb-8 flex items-center justify-center shadow-[0_0_40px_rgba(244,37,123,0.6)]"
        >
          <Crown size={48} className="text-white drop-shadow-md" strokeWidth={2.5} />
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-200 via-brand-pink to-pink-200 mb-6"
        >
          ¡Mención Honorífica!
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-4 text-slate-200 text-lg leading-relaxed mb-10"
        >
          <p className="font-semibold text-xl text-pink-100">
            A nuestro estimado José Villavicencio
          </p>
          <p>
            Queremos expresar nuestro más profundo agradecimiento por ser el <span className="text-brand-pink font-bold">Primer Inversionista</span> de FoodTook.
          </p>
          <p>
            Su visión, confianza y apoyo incondicional fueron la semilla que hizo posible este sueño. Sin usted, FoodTook no existiría hoy.
          </p>
          <div className="flex items-center justify-center gap-2 text-brand-pink mt-4">
            <Heart fill="currentColor" size={24} />
            <span className="font-bold">Gracias infinitas</span>
            <Heart fill="currentColor" size={24} />
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          onClick={onComplete}
          className="bg-gradient-to-r from-brand-pink to-fuchsia-600 text-white font-bold py-3 px-10 rounded-full shadow-[0_10px_30px_rgba(244,37,123,0.4)] hover:shadow-[0_15px_40px_rgba(244,37,123,0.6)] hover:scale-105 transition-all active:scale-95"
        >
          Continuar al Portal
        </motion.button>
      </motion.div>
    </div>
  );
}
