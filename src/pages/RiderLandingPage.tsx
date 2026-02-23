import { motion } from 'motion/react';
import { ArrowLeft, Bike, CheckCircle, Clock, DollarSign, MapPin, ShieldCheck, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';

interface RiderLandingPageProps {
  onBack: () => void;
  onRegisterClick: () => void;
}

export function RiderLandingPage({ onBack, onRegisterClick }: RiderLandingPageProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-green selection:text-white relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-brand-green/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center shadow-lg shadow-brand-green/30">
            <span className="text-white font-bold text-xl">FT</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">FoodTook Riders</span>
        </div>
        
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-slate-600 hover:text-brand-green hover:bg-brand-green/5 transition-all"
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-green/10 text-brand-green font-semibold text-sm">
            <Bike size={16} fill="currentColor" />
            <span>Sé tu propio jefe</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
            Entrega, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-emerald-600">Gana</span> y Disfruta la Libertad.
          </h1>
          
          <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
            Únete a la flota de FoodTook. Horarios flexibles, pagos semanales y bonos por desempeño. Tu moto, tus reglas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={onRegisterClick}
              className="px-8 py-4 rounded-full bg-brand-green text-white font-bold text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-brand-green/30 hover:shadow-2xl hover:shadow-brand-green/40 active:scale-95 flex items-center justify-center gap-2 group"
            >
              <span>Registrarme como Rider</span>
              <CheckCircle className="group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <div className="pt-8 flex items-center gap-8 text-slate-500">
             <div className="flex items-center gap-2">
                <DollarSign className="text-brand-green" />
                <span className="font-medium">Pagos Semanales</span>
             </div>
             <div className="flex items-center gap-2">
                <Clock className="text-brand-green" />
                <span className="font-medium">Horario Flexible</span>
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
          <div className="relative w-[350px] h-[350px] bg-brand-green/10 rounded-full flex items-center justify-center animate-pulse">
             <div className="absolute inset-0 bg-brand-green/5 rounded-full blur-3xl transform scale-150"></div>
             <Bike size={200} className="text-brand-green drop-shadow-2xl relative z-10" strokeWidth={1} />
             
             {/* Floating stats cards */}
             <motion.div 
               animate={{ y: [-10, 10, -10] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-0 right-[-20px] bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3"
             >
               <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                 <TrendingUp size={20} />
               </div>
               <div>
                 <p className="text-xs text-slate-500 font-medium">Ganancias hoy</p>
                 <p className="font-bold text-slate-900">$1,250.00</p>
               </div>
             </motion.div>

             <motion.div 
               animate={{ y: [10, -10, 10] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute bottom-10 left-[-40px] bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3"
             >
               <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                 <MapPin size={20} />
               </div>
               <div>
                 <p className="text-xs text-slate-500 font-medium">Próxima entrega</p>
                 <p className="font-bold text-slate-900">2.5 km</p>
               </div>
             </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">¿Por qué elegir FoodTook?</h2>
            <p className="text-lg text-slate-600">
              Somos la plataforma que más valora a sus socios repartidores. Ofrecemos beneficios exclusivos y la mejor tecnología.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <DollarSign size={32} />,
                title: "Ganancias Competitivas",
                desc: "Gana por cada entrega más propinas. Sin comisiones ocultas y con bonos por metas cumplidas."
              },
              {
                icon: <ShieldCheck size={32} />,
                title: "Seguro de Accidentes",
                desc: "Tu seguridad es primero. Todos nuestros riders activos cuentan con cobertura de seguro durante sus entregas."
              },
              {
                icon: <Clock size={32} />,
                title: "Tú Eliges Cuándo",
                desc: "Conéctate cuando quieras. Sin turnos forzosos. Ideal para estudiantes o como ingreso extra."
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-50 p-8 rounded-3xl hover:shadow-lg transition-all border border-slate-100">
                <div className="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green mb-6">
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
      <section className="bg-slate-900 py-16 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">¿Listo para empezar a rodar?</h2>
          <p className="text-slate-400 mb-8 text-lg">
            Descarga la app "FoodTook Riders" y completa tu registro en menos de 10 minutos.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 rounded-xl bg-brand-green text-white font-bold hover:bg-emerald-600 transition-all">
              Descargar App Rider
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
