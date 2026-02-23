import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Play, UtensilsCrossed, Zap, TrendingUp, ShoppingBag, ShieldCheck, Smartphone, Globe, Heart, Mail, MapPin, Phone, Instagram, Facebook, CheckCircle, Bike, ChefHat, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DemoModal } from '../components/DemoModal';

const TikTokIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v4a9 9 0 0 1-9-9Z" />
  </svg>
);

interface LandingPageProps {
  onAdminClick: () => void;
  onUserLoginClick: () => void;
  onRiderClick: () => void;
  onRestaurantClick: () => void;
}

export function LandingPage({ onAdminClick, onUserLoginClick, onRiderClick, onRestaurantClick }: LandingPageProps) {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden font-sans selection:bg-brand-pink selection:text-white relative">
      
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-brand-pink/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-500/5 rounded-full blur-3xl" />
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[5%] text-brand-pink/10"
        >
          <TrendingUp size={120} strokeWidth={1} />
        </motion.div>
        <motion.div 
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] right-[10%] text-brand-pink/10"
        >
          <UtensilsCrossed size={140} strokeWidth={1} />
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 pointer-events-none px-4"
      >
        <div className="bg-white/80 backdrop-blur-2xl border border-white/40 shadow-xl shadow-slate-200/50 rounded-full pl-6 pr-2 py-2 flex items-center justify-between gap-8 pointer-events-auto w-full max-w-5xl transition-all duration-300 hover:shadow-2xl hover:bg-white/90">
          
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 bg-brand-pink rounded-full flex items-center justify-center shadow-lg shadow-brand-pink/30 group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-sm">FT</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800 group-hover:text-brand-pink transition-colors block">FoodTook</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: 'Inicio', href: '#home' },
              { label: 'Nosotros', href: '#about' },
              { label: 'Únete', href: '#ecosystem' },
              { label: 'Contacto', href: '#contact' }
            ].map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector(item.href);
                  if (element) {
                    const headerOffset = 100; // Ajuste para el header flotante
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth"
                    });
                  }
                }}
                className="px-4 py-2 rounded-full text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 transition-all duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={onUserLoginClick}
              className="px-5 py-2.5 rounded-full font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all text-sm hidden sm:block"
            >
              Iniciar Sesión
            </button>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <button 
              onClick={onAdminClick}
              className="pl-4 pr-5 py-2.5 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2 text-sm group border border-transparent hover:border-slate-700 hidden sm:flex"
            >
              <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-brand-pink group-hover:text-white transition-colors duration-300">
                <ShieldCheck size={12} className="text-slate-300 group-hover:text-white transition-colors" />
              </div>
              <span>Admin Panel</span>
            </button>
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors ml-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] h-[100dvh] bg-white z-[70] shadow-2xl md:hidden flex flex-col p-6 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand-pink rounded-full flex items-center justify-center shadow-lg shadow-brand-pink/30">
                      <span className="text-white font-bold text-xs">FT</span>
                    </div>
                    <span className="font-bold text-lg text-slate-800">Menú</span>
                 </div>
                 <button 
                   onClick={() => setIsMobileMenuOpen(false)}
                   className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                 >
                   <X size={24} />
                 </button>
              </div>
              
              <nav className="flex flex-col gap-2 mb-8">
                {[
                  { label: 'Inicio', href: '#home' },
                  { label: 'Nosotros', href: '#about' },
                  { label: 'Únete', href: '#ecosystem' },
                  { label: 'Contacto', href: '#contact' }
                ].map((item) => (
                  <a 
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      const element = document.querySelector(item.href);
                      if (element) {
                        const headerOffset = 100;
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: "smooth"
                        });
                      }
                    }}
                    className="px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="mt-auto space-y-4">
                <button 
                  onClick={() => {
                    onUserLoginClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all text-sm"
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={() => {
                    onAdminClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 text-sm"
                >
                  <ShieldCheck size={16} />
                  <span>Admin Panel</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <main id="home" className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 lg:pt-28 lg:pb-32 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-pink/10 text-brand-pink font-semibold text-sm">
            <Zap size={16} fill="currentColor" />
            <span>La revolución del delivery viral</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
            Donde la <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-purple-600">Comida</span> se encuentra con la <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-brand-pink">Viralidad</span>.
          </h1>
          
          <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
            Descubre platos increíbles a través de videos cortos. La primera plataforma que fusiona el entretenimiento viral con la entrega inmediata.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="px-8 py-4 rounded-full bg-brand-pink text-white font-bold text-lg hover:bg-pink-600 transition-all shadow-xl shadow-brand-pink/30 hover:shadow-2xl hover:shadow-brand-pink/40 active:scale-95 flex items-center justify-center gap-2 group">
              <span>Descargar App</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => setIsDemoOpen(true)}
              className="px-8 py-4 rounded-full bg-white border-2 border-slate-100 text-slate-700 font-bold text-lg hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group"
            >
              <Play size={20} className="fill-current group-hover:scale-110 transition-transform" />
              <span>Ver Demo</span>
            </button>
          </div>

          <div className="pt-8 flex items-center gap-8 text-slate-400">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-slate-900">+50K</span>
              <span className="text-sm font-medium">Usuarios Activos</span>
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-slate-900">+1.2K</span>
              <span className="text-sm font-medium">Restaurantes</span>
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-slate-900">4.9/5</span>
              <span className="text-sm font-medium">Calificación</span>
            </div>
          </div>
        </motion.div>

        {/* Right Content - Visuals */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          className="relative h-[600px] w-full hidden lg:block"
        >
          {/* Phone Mockup 1 - Video Feed */}
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-10 w-[280px] h-[580px] bg-slate-900 rounded-[40px] border-[8px] border-slate-900 overflow-hidden shadow-2xl shadow-slate-900/40 z-20"
          >
            <div className="w-full h-full bg-slate-800 relative">
              {/* Fake Video Content */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10"></div>
              <div className="absolute bottom-20 left-4 right-4 z-20 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-brand-pink"></div>
                  <span className="font-bold text-sm">BurgerKing_Official</span>
                </div>
                <p className="text-sm line-clamp-2">¡La nueva Mega Stacker está aquí! 🍔🔥 #FoodTook #BurgerLover</p>
              </div>
              
              {/* Floating Action Buttons */}
              <div className="absolute bottom-24 right-2 z-20 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">❤️</div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">💬</div>
                <div className="w-10 h-10 rounded-full bg-brand-pink text-white flex items-center justify-center shadow-lg shadow-brand-pink/50 animate-pulse">
                   <ShoppingBag size={18} />
                </div>
              </div>

              {/* Mockup Video Placeholder */}
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                 <Play size={48} className="text-white/50" />
              </div>
            </div>
          </motion.div>

          {/* Phone Mockup 2 - Delivery Tracking (Behind) */}
          <motion.div 
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-20 left-10 w-[260px] h-[540px] bg-white rounded-[36px] border-[8px] border-slate-200 overflow-hidden shadow-xl z-10 opacity-90 transform -rotate-6"
          >
            <div className="w-full h-full bg-slate-50 p-4">
               <div className="w-full h-40 bg-brand-pink/10 rounded-2xl mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xs font-bold text-brand-pink uppercase tracking-wider mb-1">En camino</p>
                    <h3 className="text-xl font-bold text-slate-900">12:45 PM</h3>
                  </div>
               </div>
               <div className="space-y-3">
                 <div className="h-2 w-3/4 bg-slate-200 rounded-full"></div>
                 <div className="h-2 w-1/2 bg-slate-200 rounded-full"></div>
                 <div className="h-2 w-full bg-slate-200 rounded-full"></div>
               </div>
            </div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-[40%] left-[-20px] bg-white p-4 rounded-2xl shadow-xl z-30 flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Nueva Orden</p>
              <p className="font-bold text-slate-900">Hamburguesa Doble</p>
            </div>
          </motion.div>

        </motion.div>
      </main>

      {/* About Us Section */}
      <section id="about" className="relative z-10 bg-slate-50 py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Más que comida, una experiencia</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                En FoodTook, no solo te llevamos comida; te conectamos con las tendencias culinarias del momento. 
                Somos la primera plataforma que permite a los usuarios descubrir platos a través de videos cortos y pedirlos al instante.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Smartphone size={32} />,
                title: "Descubre en Video",
                desc: "Olvídate de las fotos estáticas. Mira la textura, el humo y la frescura en videos de alta calidad antes de pedir."
              },
              {
                icon: <Globe size={32} />,
                title: "Conecta con Chefs",
                desc: "Sigue a tus restaurantes y chefs favoritos. Interactúa, da like y comparte tus propios descubrimientos gastronómicos."
              },
              {
                icon: <Heart size={32} />,
                title: "Apoya lo Local",
                desc: "Impulsamos a los negocios locales dándoles una plataforma visual potente para mostrar su arte culinario."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-brand-pink/10 rounded-2xl flex items-center justify-center text-brand-pink mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section id="ecosystem" className="py-24 bg-white relative z-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
             <h2 className="text-4xl font-bold text-slate-900 mb-4">Únete al ecosistema FoodTook</h2>
             <p className="text-slate-600 max-w-2xl mx-auto">
               Hay un lugar para todos en nuestra plataforma. Elige cómo quieres participar en la revolución del delivery viral.
             </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             {/* User Card */}
             <motion.div 
               whileHover={{ y: -10 }}
               className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 shadow-lg flex flex-col items-center text-center group cursor-pointer"
               onClick={onUserLoginClick}
             >
                <div className="w-20 h-20 bg-brand-pink/10 rounded-full flex items-center justify-center text-brand-pink mb-6 group-hover:bg-brand-pink group-hover:text-white transition-all duration-300">
                   <User size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Usuarios</h3>
                <p className="text-slate-600 mb-8 flex-1">
                   Descubre comida increíble, sigue a tus restaurantes favoritos y recibe tus antojos en minutos.
                </p>
                <button className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold group-hover:bg-brand-pink group-hover:text-white group-hover:border-transparent transition-all w-full">
                   Pedir Comida
                </button>
             </motion.div>

             {/* Restaurant Card */}
             <motion.div 
               whileHover={{ y: -10 }}
               className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 shadow-lg flex flex-col items-center text-center group cursor-pointer"
               onClick={onRestaurantClick}
             >
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                   <ChefHat size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Restaurantes</h3>
                <p className="text-slate-600 mb-8 flex-1">
                   Haz que tus platos se vuelvan virales. Aumenta tus ventas con nuestra plataforma de video-delivery.
                </p>
                <button className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold group-hover:bg-orange-500 group-hover:text-white group-hover:border-transparent transition-all w-full">
                   Registrar Restaurante
                </button>
             </motion.div>

             {/* Rider Card */}
             <motion.div 
               whileHover={{ y: -10 }}
               className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 shadow-lg flex flex-col items-center text-center group cursor-pointer"
               onClick={onRiderClick}
             >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                   <Bike size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Riders</h3>
                <p className="text-slate-600 mb-8 flex-1">
                   Sé tu propio jefe. Genera ingresos extra entregando pedidos con horarios flexibles y pagos rápidos.
                </p>
                <button className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold group-hover:bg-green-600 group-hover:text-white group-hover:border-transparent transition-all w-full">
                   Ser Rider
                </button>
             </motion.div>
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="relative z-10 py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-900 rounded-[48px] p-12 md:p-24 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-pink/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  Lleva el sabor viral en tu bolsillo
                </h2>
                <p className="text-lg text-slate-300 max-w-md">
                  Descarga FoodTook hoy y obtén un 20% de descuento en tu primer pedido con el código <span className="text-brand-pink font-bold">VIRAL20</span>.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex items-center gap-3 bg-white text-slate-900 px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors font-bold group">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-8" />
                  </button>
                  <button className="flex items-center gap-3 bg-transparent border border-white/30 text-white px-6 py-3 rounded-xl hover:bg-white/10 transition-colors font-bold">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-8" />
                  </button>
                </div>

                <div className="flex gap-6 pt-4">
                   <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <CheckCircle size={16} className="text-brand-pink" />
                      <span>iOS 14+</span>
                   </div>
                   <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <CheckCircle size={16} className="text-brand-pink" />
                      <span>Android 8.0+</span>
                   </div>
                </div>
              </div>

              <div className="hidden md:block relative">
                 <motion.img 
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop" 
                    alt="App Preview" 
                    className="rounded-3xl shadow-2xl border-8 border-slate-800 rotate-3 hover:rotate-0 transition-transform duration-500 max-w-sm mx-auto"
                 />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 bg-white py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Contáctanos</h2>
              <p className="text-lg text-slate-600 mb-8">
                ¿Tienes preguntas? ¿Eres un restaurante y quieres unirte? Estamos aquí para ayudarte.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-brand-pink shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Email</h4>
                    <p className="text-slate-600">soporte@foodtook.com</p>
                    <p className="text-slate-600">alianzas@foodtook.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-brand-pink shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Oficinas</h4>
                    <p className="text-slate-600">Av. Siempre Viva 123</p>
                    <p className="text-slate-600">Ciudad de México, México</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-brand-pink shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Teléfono</h4>
                    <p className="text-slate-600">+52 55 1234 5678</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Nombre</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink outline-none transition-all" placeholder="Juan Pérez" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Teléfono</label>
                    <input type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink outline-none transition-all" placeholder="+52..." />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink outline-none transition-all" placeholder="juan@ejemplo.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Mensaje</label>
                  <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink outline-none transition-all resize-none" placeholder="¿En qué podemos ayudarte?"></textarea>
                </div>

                <button className="w-full py-4 bg-brand-pink text-white font-bold rounded-xl shadow-lg shadow-brand-pink/30 hover:shadow-xl hover:bg-pink-600 transition-all">
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 py-16 relative overflow-hidden z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-pink via-purple-500 to-brand-pink opacity-50"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-brand-pink rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">FT</span>
                </div>
                <span className="font-bold text-xl tracking-tight text-white">FoodTook</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-sm">
                Revolucionando la forma en que el mundo descubre y disfruta la comida. Únete a la comunidad de foodies más grande.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-pink hover:text-white transition-all"><Instagram size={20} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-pink hover:text-white transition-all"><Facebook size={20} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-pink hover:text-white transition-all"><TikTokIcon size={20} /></a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Compañía</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-brand-pink transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-brand-pink transition-colors">Carreras</a></li>
                <li><a href="#" className="hover:text-brand-pink transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-brand-pink transition-colors">Prensa</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-brand-pink transition-colors">Términos y Condiciones</a></li>
                <li><a href="#" className="hover:text-brand-pink transition-colors">Política de Privacidad</a></li>
                <li><a href="#" className="hover:text-brand-pink transition-colors">Cookies</a></li>
                <li><a href="#" className="hover:text-brand-pink transition-colors">Licencias</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© {new Date().getFullYear()} FoodTook Inc. Todos los derechos reservados.</p>
            <div className="flex gap-6 text-sm">
              <button onClick={onUserLoginClick} className="hover:text-white transition-colors">Iniciar Sesión</button>
              <button onClick={onAdminClick} className="hover:text-white transition-colors">Admin Login</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
