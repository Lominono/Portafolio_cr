/* Apple UI Design System – Verified: 8pt Grid, SF Pro Typography, Material-Depth, Natural Spring Motion */
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const toggleVisibility = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 320);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Volver arriba"
      className={`fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full apple-glass shadow-apple-card flex items-center justify-center transition-all duration-300 group hover:scale-105 active:scale-95 border border-black/[0.08] ${
        isVisible 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp 
        size={20} 
        strokeWidth={1.75} 
        className="text-accentMain group-hover:-translate-y-0.5 transition-transform duration-300" 
      />
    </button>
  );
};

export default ScrollToTopButton;
