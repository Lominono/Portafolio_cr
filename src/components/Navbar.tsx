import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { path: '/', label: 'INICIO' },
    { path: '/sobre-mi', label: 'SOBRE MÍ' },
    { path: '/tarifas', label: 'TARIFAS Y SERVICIOS' },
    { path: '/contacto', label: 'CONTACTO' },
  ];

  return (
    <nav className="fixed w-full top-0 bg-primary/95 backdrop-blur-md z-50 py-6 px-6 md:px-16 border-b border-neutral-100 flex justify-between items-center transition-all">
      <Link 
        to="/" 
        onClick={closeMenu}
        className="title-main text-lg tracking-title cursor-pointer hover:text-accentMain transition-colors text-textMain"
      >
        CRISTIAN ESPINOLA
      </Link>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-10 font-sans text-xs text-textSecondary uppercase tracking-widest">
        {navLinks.map((link) => (
          <Link 
            key={link.path}
            to={link.path} 
            className={`nav-link hover:text-accentMain transition-colors ${
              location.pathname === link.path ? 'text-textMain active' : ''
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile Hamburger Button */}
      <div className="flex md:hidden items-center gap-4">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="text-textMain p-1"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-primary border-b border-neutral-100 p-8 flex flex-col gap-6 md:hidden animate-fade-in shadow-xl shadow-primary/20">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              onClick={closeMenu}
              className={`font-sans text-xs uppercase tracking-widest transition-colors ${
                location.pathname === link.path ? 'text-accentMain' : 'text-textMain'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <a 
              href="https://wa.me/34640646963" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-accentMain font-sans text-xs uppercase tracking-widest inline-block nav-link"
            >
              CONTACTAR POR WHATSAPP
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
