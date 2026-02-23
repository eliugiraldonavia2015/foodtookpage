import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc?: string; // Optional URL for the video, defaults to placeholder
}

export function DemoModal({ isOpen, onClose, videoSrc }: DemoModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 group"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 duration-300"
            >
              <X size={24} />
            </button>

            {/* Video Container */}
            <div className="w-full h-full relative flex items-center justify-center bg-slate-900">
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 z-0">
                  <Loader2 className="animate-spin mb-2" size={48} />
                  <p className="text-sm font-medium">Cargando experiencia...</p>
                </div>
              )}
              
              {videoSrc ? (
                <video
                  src={videoSrc}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  onLoadedData={() => setIsLoading(false)}
                />
              ) : (
                /* Placeholder if no video source is provided */
                <div className="text-center p-8 z-10">
                  <div className="w-20 h-20 bg-brand-pink/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Play size={40} className="text-brand-pink ml-1" fill="currentColor" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Demo Video Placeholder</h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    Aquí se reproducirá el video promocional de la aplicación.
                    <br />
                    (Integra tu URL de video aquí)
                  </p>
                  <button 
                    onClick={() => setIsLoading(false)} // Simulate load complete
                    className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors"
                  >
                    Simular Video Cargado
                  </button>
                </div>
              )}
            </div>
            
            {/* Overlay Gradient for Title (Optional) */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none flex items-end p-8">
               <div>
                  <h3 className="text-white font-bold text-xl">Descubre FoodTook</h3>
                  <p className="text-slate-300 text-sm">La revolución del delivery viral en 60 segundos.</p>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
