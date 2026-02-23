import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">FT</span>
            </div>
            <span className="font-bold text-xl text-white">FoodTook</span>
          </div>
          <p className="text-sm text-slate-400">
            Conectando sabores, repartidores y clientes en una sola plataforma.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-white mb-4">Plataforma</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-brand-green transition-colors">Para Restaurantes</a></li>
            <li><a href="#" className="hover:text-brand-green transition-colors">Para Riders</a></li>
            <li><a href="#" className="hover:text-brand-green transition-colors">Descargar App</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-white mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-brand-green transition-colors">Términos y Condiciones</a></li>
            <li><a href="#" className="hover:text-brand-green transition-colors">Privacidad</a></li>
            <li><a href="#" className="hover:text-brand-green transition-colors">Cookies</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-white mb-4">Síguenos</h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-green hover:text-white transition-all">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-green hover:text-white transition-all">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-green hover:text-white transition-all">
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <p>© {new Date().getFullYear()} FoodTook. Todos los derechos reservados.</p>
        <div className="flex items-center gap-1">
          <span>Hecho con</span>
          <Heart size={12} className="text-red-500 fill-red-500" />
          <span>en Latinoamérica</span>
        </div>
      </div>
    </footer>
  );
};
