import { Instagram, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary pt-24 pb-12 px-6 md:px-16 text-center border-t border-neutral-100">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <h2 className="title-main text-2xl md:text-3xl mb-8 text-textMain">CRISTIAN ESPINOLA</h2>
        <p className="text-textSecondary font-sans font-light mb-12 max-w-sm mx-auto text-sm leading-relaxed">
          Contáctame para consultar disponibilidad y organizar nuestra sesión fotográfica.
        </p>
        
        <div className="flex justify-center gap-8 mb-16">
          <a href="https://wa.me/34640646963" target="_blank" rel="noopener noreferrer" className="text-textSecondary hover:text-accentMain transition-colors">
            <Phone size={18} strokeWidth={1.5} />
          </a>
          <a href="mailto:Christianespinolas2317@gmail.com" className="text-textSecondary hover:text-accentMain transition-colors">
            <Mail size={18} strokeWidth={1.5} />
          </a>
          <a href="https://www.instagram.com/espinolafotos/" target="_blank" rel="noopener noreferrer" className="text-textSecondary hover:text-accentMain transition-colors">
            <Instagram size={18} strokeWidth={1.5} />
          </a>
        </div>
        
        <div className="border-t border-neutral-100 pt-8 w-full flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-textSecondary uppercase tracking-widest font-sans">
            © {new Date().getFullYear()} CRISTIAN ESPINOLA. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <a href="/legal" className="text-[10px] text-textSecondary uppercase tracking-widest font-sans hover:text-accentMain transition-colors">
            Aviso Legal y Privacidad
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
