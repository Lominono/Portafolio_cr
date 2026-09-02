import React from 'react';
import { Instagram, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-textMain text-primary pt-24 pb-12 px-6 md:px-16 text-center">
      <h2 className="title-main text-3xl md:text-5xl mb-8">¿Listo para crear recuerdos?</h2>
      <p className="text-neutral-400 font-light mb-10 max-w-md mx-auto">
        Contáctame para consultar disponibilidad y organizar nuestra sesión fotográfica.
      </p>
      
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-20">
        <a href="https://wa.me/34640646963" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
          <Phone size={18} /> WhatsApp
        </a>
        <a href="mailto:Christianespinolas2317@gmail.com" className="text-primary hover:text-accentMain transition-colors border-b border-transparent hover:border-accentMain pb-1">
          Christianespinolas2317@gmail.com
        </a>
      </div>
      
      <div className="flex justify-center gap-8 mb-12 border-t border-neutral-700 pt-12 max-w-4xl mx-auto">
        <a href="https://www.instagram.com/espinolafotos/" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-accentMain transition-colors flex items-center gap-2 text-sm uppercase tracking-widest">
          <Instagram size={20} strokeWidth={1.2} /> Instagram
        </a>
      </div>
      <p className="text-xs text-neutral-500 uppercase tracking-widest">
        © {new Date().getFullYear()} Cristian Espinola Fotografía. Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default Footer;
