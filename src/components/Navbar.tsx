/* Apple UI Design System – Verified: 8pt Grid, SF Pro Typography, Material-Depth, Natural Spring Motion */
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const closeMenu = () => setMobileMenuOpen(false);

  // Bloqueo de scroll cuando el menú móvil está abierto para evitar solapamientos con el fondo
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Cierre con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
          setScrollProgress(progress);
          setIsScrolled(window.scrollY > 16);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/sobre-mi', label: 'Sobre mí' },
    { path: '/tarifas', label: 'Tarifas' },
    { path: '/contacto', label: 'Contacto' },
  ];

  return (
    <header className="fixed w-full top-0 z-50 transition-all duration-300">
      {/* Mobile Backdrop Blur Overlay (aísla la página inferior evitando cualquier solapamiento visual o funcional) */}
      <div 
        className={`fixed inset-0 bg-black/35 backdrop-blur-md -z-10 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <nav 
        className={`w-full px-6 md:px-16 border-b flex justify-between items-center transition-all duration-300 relative z-10 ${
          isScrolled 
            ? 'py-3.5 apple-glass border-black/[0.08] shadow-apple-subtle' 
            : 'py-5 md:py-6 bg-white/80 backdrop-blur-md saturate-180 border-black/[0.04]'
        }`}
      >
        {/* Barra de progreso de lectura / scroll */}
        <div 
          className="absolute bottom-0 left-0 h-[2px] bg-accentMain transition-all duration-75 pointer-events-none"
          style={{ width: `${scrollProgress}%` }}
        />
        
        <Link 
          to="/" 
          onClick={closeMenu}
          className="font-serif text-lg md:text-xl text-textMain tracking-[-0.01em] hover:text-accentMain transition-colors active:scale-[0.98]"
        >
          Cristian Espinola
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-sans text-sm text-textSecondary">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path}
                to={link.path} 
                className={`nav-link py-1 transition-colors ${
                  isActive ? 'text-textMain font-medium active' : 'hover:text-textMain'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <a 
            href="https://wa.me/34640646963"
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-3 inline-flex items-center gap-2 text-xs font-sans text-accentMain border border-accentMain/35 rounded-apple-btn px-3.5 py-1.5 hover:bg-accentMain hover:text-white transition-all duration-300 active:scale-95 shadow-sm"
          >
            <MessageCircle size={14} />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Mobile Hamburger Button Animado Estilo Apple (Área táctil 44x44px) */}
        <div className="flex md:hidden items-center">
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="w-11 h-11 flex flex-col items-center justify-center gap-[5px] rounded-apple-btn hover:bg-black/[0.04] active:scale-95 transition-all duration-300 focus:outline-none"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileMenuOpen}
          >
            {/* Línea Superior */}
            <span 
              className={`w-5 h-[1.75px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] origin-center ${
                mobileMenuOpen ? 'translate-y-[6.75px] rotate-45 bg-accentMain' : 'bg-textMain'
              }`} 
            />
            {/* Línea Central */}
            <span 
              className={`w-5 h-[1.75px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                mobileMenuOpen ? 'opacity-0 scale-x-0 bg-accentMain' : 'bg-textMain opacity-100'
              }`} 
            />
            {/* Línea Inferior */}
            <span 
              className={`w-5 h-[1.75px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] origin-center ${
                mobileMenuOpen ? '-translate-y-[6.75px] -rotate-45 bg-accentMain' : 'bg-textMain'
              }`} 
            />
          </button>
        </div>
      </nav>

      {/* Mobile iOS-Style Frosted Sheet Menu (Despliegue limpio sin solapamientos) */}
      <div 
        className={`md:hidden px-4 pt-2 pb-6 relative z-10 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
          mobileMenuOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-3 pointer-events-none'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-2xl rounded-apple-card border border-black/[0.08] shadow-apple-card p-5 flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path}
                to={link.path} 
                onClick={closeMenu}
                className={`min-h-[44px] px-4 rounded-apple-btn flex items-center font-sans text-sm tracking-[-0.011em] transition-all duration-200 ${
                  isActive 
                    ? 'bg-accentMain/10 text-accentMain font-medium' 
                    : 'text-textMain hover:bg-black/[0.03] active:scale-[0.98]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-3 mt-2 border-t border-black/[0.06]">
            <a 
              href="https://wa.me/34640646963" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="min-h-[44px] px-4 rounded-apple-btn bg-accentMain text-white font-sans text-xs flex items-center justify-center gap-2 shadow-apple-subtle hover:bg-accentSecondary active:scale-[0.97] transition-all"
            >
              <MessageCircle size={16} />
              <span>Contactar por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
