import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed w-full top-0 bg-primary/95 backdrop-blur-sm z-50 py-5 px-8 md:px-16 border-b border-gray-100 flex justify-between items-center hero-elem">
      <Link to="/" className="title-main text-lg md:text-xl tracking-widest cursor-pointer hover:text-accentMain transition-colors">
        Cristian Espinola
      </Link>
      <div className="hidden md:flex gap-10 text-xs text-textSecondary uppercase tracking-widest font-medium">
        <Link to="/" className={`hover:text-accentMain transition-colors ${location.pathname === '/' ? 'text-accentMain' : ''}`}>Inicio</Link>
        <Link to="/tarifas" className={`hover:text-accentMain transition-colors ${location.pathname === '/tarifas' ? 'text-accentMain' : ''}`}>Tarifas y Servicios</Link>
      </div>
      <a href="https://wa.me/34640646963" target="_blank" rel="noopener noreferrer" className="hidden md:inline-block btn-primary text-xs py-2 px-5 text-center">
        Contactar
      </a>
      <button className="md:hidden text-textMain"><Camera size={24} strokeWidth={1.5} /></button>
    </nav>
  );
};

export default Navbar;
