import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChefHat, TrendingUp, Users, Video, DollarSign, BarChart3, Star } from 'lucide-react';
import { RestaurantRegistration } from './RestaurantRegistration';

interface RestaurantLandingPageProps {
  onBack: () => void;
}

export function RestaurantLandingPage({ onBack }: RestaurantLandingPageProps) {
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isRegistering]);

  if (isRegistering) {
    return <RestaurantRegistration onBack={() => setIsRegistering(false)} />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-500 selection:text-white relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-yellow-500/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
            <span className="text-white font-bold text-xl">FT</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">FoodTook Partner</span>
        </div>
        
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-slate-600 hover:text-orange-500 hover:bg-orange-500/5 transition-all"
        >
          <ArrowLeft size={18} />
          <span>Volver al inicio</span>
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-12 grid lg:grid-cols-2 gap-12 items-center">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 font-semibold text-sm">
            <ChefHat size={16} fill="currentColor" />
            <span>Potencia tu Cocina</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
            Tus Platos Merecen ser <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Virales</span>.
          </h1>
          
          <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
            Únete a la primera plataforma de delivery impulsada por video. Muestra la preparación, el sabor y la pasión detrás de cada plato.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => setIsRegistering(true)}
              className="px-8 py-4 rounded-full bg-orange-500 text-white font-bold text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 active:scale-95 flex items-center justify-center gap-2 group"
            >
              <span>Registrar mi Restaurante</span>
              <TrendingUp className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="pt-8 flex items-center gap-8 text-slate-500">
             <div className="flex items-center gap-2">
                <Video className="text-orange-500" />
                <span className="font-medium">Marketing Visual</span>
             </div>
             <div className="flex items-center gap-2">
                <Users className="text-orange-500" />
                <span className="font-medium">+50K Usuarios</span>
             </div>
          </div>
        </motion.div>

        {/* Right Content - Visuals */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[500px] w-full hidden lg:flex items-center justify-center"
        >
          <div className="relative w-full max-w-md aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
             {/* Dashboard Mockup */}
             <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">B</div>
                   <div>
                      <h4 className="font-bold text-slate-900">Burger King Dashboard</h4>
                      <p className="text-xs text-slate-500">Estado: Abierto</p>
                   </div>
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">En línea</div>
             </div>
             <div className="p-6 grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                   <p className="text-xs text-slate-500 mb-1">Pedidos Hoy</p>
                   <p className="text-2xl font-bold text-slate-900">124</p>
                   <div className="flex items-center text-green-500 text-xs mt-2 font-bold">
                      <TrendingUp size={12} className="mr-1" /> +12%
                   </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                   <p className="text-xs text-slate-500 mb-1">Ventas</p>
                   <p className="text-2xl font-bold text-slate-900">$2,450</p>
                   <div className="flex items-center text-green-500 text-xs mt-2 font-bold">
                      <DollarSign size={12} className="mr-1" /> +8%
                   </div>
                </div>
             </div>
             <div className="px-6 pb-6">
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                   <div className="flex items-center gap-3 mb-2">
                      <Video size={18} className="text-orange-500" />
                      <h5 className="font-bold text-slate-900 text-sm">Video Más Viral</h5>
                   </div>
                   <p className="text-xs text-slate-600 mb-2">"Mega Stacker Challenge" - 45k Vistas</p>
                   <div className="w-full bg-orange-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-orange-500 w-[85%] h-full"></div>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </main>

      {/* Benefits Section */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Herramientas para crecer</h2>
            <p className="text-lg text-slate-600">
              No solo entregamos comida, entregamos experiencias. Nuestra plataforma está diseñada para maximizar tu alcance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Video size={32} />,
                title: "Menu en Video",
                desc: "Convierte tu menú en una experiencia visual. Los usuarios compran lo que se les antoja ver."
              },
              {
                icon: <BarChart3 size={32} />,
                title: "Analytics Avanzados",
                desc: "Conoce qué platos son tendencia, quiénes son tus mejores clientes y optimiza tu oferta."
              },
              {
                icon: <Star size={32} />,
                title: "Gestión de Reputación",
                desc: "Herramientas integradas para gestionar reseñas y mantener una calificación de 5 estrellas."
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl hover:shadow-xl transition-all border border-slate-100 shadow-sm">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-slate-900 py-16 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/20 rounded-full blur-3xl"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Únete a la revolución FoodTook</h2>
          <p className="text-slate-400 mb-8 text-lg">
            Registra tu restaurante hoy y obtén 0% de comisión en tus primeros 30 días.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setIsRegistering(true)}
              className="px-8 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all"
            >
              Comenzar Registro
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
