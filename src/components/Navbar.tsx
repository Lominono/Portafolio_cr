/* Apple UI Design System – Verified: 8pt Grid, SF Pro Typography, Material-Depth, Natural Spring Motion */
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const closeMenu = () => setMobileMenuOpen(false);

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
    { path: '/', label: 'INICIO' },
    { path: '/sobre-mi', label: 'SOBRE MÍ' },
    { path: '/tarifas', label: 'TARIFAS Y SERVICIOS' },
    { path: '/contacto', label: 'CONTACTO' },
  ];

  return (
    <header className="fixed w-full top-0 z-50 transition-all duration-300">
      <nav 
        className={`w-full px-6 md:px-16 border-b flex justify-between items-center transition-all duration-300 ${
          isScrolled 
            ? 'py-3.5 apple-glass border-black/[0.08] shadow-apple-subtle' 
            : 'py-5 md:py-6 bg-white/70 backdrop-blur-md saturate-180 border-black/[0.04]'
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
          className="title-main text-base md:text-lg tracking-title cursor-pointer hover:text-accentMain transition-colors text-textMain active:scale-[0.98] transition-transform"
        >
          CRISTIAN ESPINOLA
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-sans text-xs text-textSecondary uppercase tracking-widest">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path}
                to={link.path} 
                className={`nav-link py-1 hover:text-accentMain transition-colors ${
                  isActive ? 'text-textMain font-medium active' : ''
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
            className="ml-2 inline-flex items-center gap-2 text-[11px] font-sans text-accentMain border border-accentMain/30 rounded-apple-btn px-4 py-2 hover:bg-accentMain hover:text-white transition-all duration-300 active:scale-95 shadow-sm"
          >
            <MessageCircle size={14} />
            <span>WHATSAPP</span>
          </a>
        </div>

        {/* Mobile Hamburger Button (Touch Target estándar Apple: 44x44px) */}
        <div className="flex md:hidden items-center">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="w-11 h-11 flex items-center justify-center rounded-apple-btn text-textMain hover:bg-black/[0.04] active:scale-90 transition-all"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* Mobile iOS-Style Frosted Sheet Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-transparent animate-fade-in">
          <div className="apple-glass rounded-apple-card border border-black/[0.08] shadow-apple-card p-6 flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.path}
                  to={link.path} 
                  onClick={closeMenu}
                  className={`min-h-[44px] px-4 rounded-apple-btn flex items-center font-sans text-xs uppercase tracking-widest transition-all duration-200 ${
                    isActive 
                      ? 'bg-accentMain/10 text-accentMain font-medium' 
                      : 'text-textMain hover:bg-black/[0.03] active:scale-[0.98]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-3 mt-1 border-t border-black/[0.06]">
              <a 
                href="https://wa.me/34640646963" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="min-h-[44px] px-4 rounded-apple-btn bg-accentMain text-white font-sans text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-apple-subtle hover:bg-accentSecondary active:scale-[0.97] transition-all"
              >
                <MessageCircle size={16} />
                <span>CONTACTAR POR WHATSAPP</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
