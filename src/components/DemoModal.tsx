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
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10 group"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 md:top-4 md:right-4 z-20 p-2 bg-black/50 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 duration-300"
            >
              <X size={20} className="md:w-6 md:h-6" />
            </button>

            {/* Video Container */}
            <div className="w-full h-full relative flex items-center justify-center bg-slate-900">
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 z-0">
                  <Loader2 className="animate-spin mb-2" size={32} />
                  <p className="text-xs md:text-sm font-medium">Cargando...</p>
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
                <div className="text-center p-4 md:p-8 z-10 w-full">
                  <div className="w-12 h-12 md:w-20 md:h-20 bg-brand-pink/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 animate-pulse">
                    <Play size={24} className="text-brand-pink ml-1 md:w-10 md:h-10" fill="currentColor" />
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-white mb-2">Demo Video</h3>
                  <p className="text-xs md:text-base text-slate-400 max-w-[200px] md:max-w-md mx-auto leading-relaxed">
                    Aquí se reproducirá el video promocional.
                  </p>
                  {isLoading && (
                    <button 
                      onClick={() => setIsLoading(false)} // Simulate load complete
                      className="mt-4 md:mt-6 px-4 py-2 md:px-6 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs md:text-sm font-medium transition-colors"
                    >
                      Simular Carga
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Overlay Gradient for Title (Optional) */}
            <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none flex items-end p-4 md:p-8">
               <div className="w-full">
                  <h3 className="text-white font-bold text-base md:text-xl mb-1">Descubre FoodTook</h3>
                  <p className="text-slate-300 text-xs md:text-sm line-clamp-2 md:line-clamp-none">La revolución del delivery viral en 60 segundos.</p>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
