/* Apple UI Design System – Verified: 8pt Grid, SF Pro Typography, Material-Depth, Natural Spring Motion */
import { Instagram, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary pt-24 pb-12 px-6 md:px-16 text-center border-t border-black/[0.06]">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <h2 className="title-main text-2xl md:text-3xl mb-6 text-textMain tracking-title">
          CRISTIAN ESPINOLA
        </h2>
        <p className="text-textSecondary font-sans font-light mb-10 max-w-sm mx-auto text-sm leading-relaxed">
          Contáctame para consultar disponibilidad y organizar nuestra sesión fotográfica.
        </p>
        
        {/* Enlaces Sociales con Touch Targets Apple (44x44px) */}
        <div className="flex justify-center gap-4 mb-16">
          <a 
            href="https://wa.me/34640646963" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-11 h-11 rounded-apple-btn flex items-center justify-center bg-black/[0.03] text-textSecondary hover:text-accentMain hover:bg-accentMain/10 transition-all duration-300 active:scale-90 shadow-sm" 
            aria-label="WhatsApp"
          >
            <Phone size={18} strokeWidth={1.5} />
          </a>
          <a 
            href="mailto:Christianespinolas2317@gmail.com" 
            className="w-11 h-11 rounded-apple-btn flex items-center justify-center bg-black/[0.03] text-textSecondary hover:text-accentMain hover:bg-accentMain/10 transition-all duration-300 active:scale-90 shadow-sm" 
            aria-label="Correo Electrónico"
          >
            <Mail size={18} strokeWidth={1.5} />
          </a>
          <a 
            href="https://www.instagram.com/espinolafotos/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-11 h-11 rounded-apple-btn flex items-center justify-center bg-black/[0.03] text-textSecondary hover:text-accentMain hover:bg-accentMain/10 transition-all duration-300 active:scale-90 shadow-sm" 
            aria-label="Instagram"
          >
            <Instagram size={18} strokeWidth={1.5} />
          </a>
        </div>
        
        <div className="border-t border-black/[0.06] pt-8 w-full flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-textSecondary uppercase tracking-widest font-sans">
            © {new Date().getFullYear()} CRISTIAN ESPINOLA. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <Link 
            to="/legal" 
            className="text-[11px] text-textSecondary uppercase tracking-widest font-sans hover:text-accentMain transition-colors"
          >
            Aviso Legal y Privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
