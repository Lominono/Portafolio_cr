/* Apple UI Design System – Verified: 8pt Grid, SF Pro Typography, Material-Depth, Natural Spring Motion */
import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ShieldCheck, Mail, Phone, Instagram, Send, MessageCircle } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Contact = () => {
  const container = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  });

  useGSAP(() => {
    // 1. Cabecera
    gsap.from('.header-elem', {
      y: 28,
      opacity: 0,
      duration: 1,
      stagger: 0.12,
      ease: 'power2.out',
      clearProps: 'all'
    });

    // 2. Divisor en bronce
    const dividers = gsap.utils.toArray('.accent-divider');
    dividers.forEach((d: any) => {
      gsap.from(d, {
        scrollTrigger: {
          trigger: d,
          start: 'top 92%',
          once: true,
        },
        scaleX: 0,
        transformOrigin: 'center',
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'all'
      });
    });

    // 3. Secciones y formularios
    const revealElements = gsap.utils.toArray('.scroll-reveal');
    revealElements.forEach((el: any) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'all'
      });
    });
  }, { scope: container });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Nueva consulta de ${formData.name} - ${formData.service}`);
    const rawBody = `Hola Cristian,\n\nMi nombre es: ${formData.name}\nMi correo es: ${formData.email}\nServicio de interés: ${formData.service}\n\nMensaje:\n${formData.message}`;
    
    const bodyMailto = encodeURIComponent(rawBody);
    window.location.href = `mailto:Christianespinolas2317@gmail.com?subject=${subject}&body=${bodyMailto}`;
  };

  const handleWhatsAppSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(`Hola Cristian, soy ${formData.name}. Estoy interesado/a en el servicio de ${formData.service}.\n\n${formData.message}`);
    
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const isAndroid = /android/i.test(userAgent);
    const isMobile = isIOS || isAndroid;
    
    if (isMobile) {
      window.location.href = `https://wa.me/34640646963?text=${text}`;
    } else {
      window.open(`https://web.whatsapp.com/send?phone=34640646963&text=${text}`, '_blank');
    }
  };

  return (
    <div ref={container} className="pt-32 pb-24 px-6 md:px-16 min-h-screen bg-primary">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabecera */}
        <div className="text-center mb-20">
          <h1 className="header-elem title-main text-4xl md:text-5xl mb-4 text-textMain">
            CONTACTO
          </h1>
          <p className="header-elem text-textSecondary uppercase tracking-widest text-xs font-sans">
            Hablemos sobre tu próximo proyecto
          </p>
          <div className="header-elem w-12 h-px bg-accentMain mx-auto mt-6 accent-divider origin-center"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-start">
          
          {/* Información de Contacto Directa */}
          <div className="w-full md:w-1/3 scroll-reveal flex flex-col gap-6">
            <h2 className="title-main text-lg text-textMain mb-2">ESTUDIO & CONTACTO</h2>
            
            <a 
              href="mailto:Christianespinolas2317@gmail.com" 
              className="apple-card p-5 rounded-apple-card border border-black/[0.06] shadow-apple-subtle flex items-center gap-4 hover:scale-[1.02] transition-transform group"
            >
              <div className="w-10 h-10 rounded-apple-btn bg-accentMain/10 text-accentMain flex items-center justify-center shrink-0">
                <Mail size={18} />
              </div>
              <div className="overflow-hidden">
                <span className="block text-[10px] uppercase tracking-widest text-textSecondary font-sans">Email</span>
                <span className="text-xs font-sans text-textMain truncate block group-hover:text-accentMain transition-colors">
                  Christianespinolas2317@gmail.com
                </span>
              </div>
            </a>
            
            <a 
              href="https://wa.me/34640646963" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="apple-card p-5 rounded-apple-card border border-black/[0.06] shadow-apple-subtle flex items-center gap-4 hover:scale-[1.02] transition-transform group"
            >
              <div className="w-10 h-10 rounded-apple-btn bg-accentMain/10 text-accentMain flex items-center justify-center shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-textSecondary font-sans">WhatsApp / Teléfono</span>
                <span className="text-xs font-sans text-textMain block group-hover:text-accentMain transition-colors">
                  +34 640 64 69 63
                </span>
              </div>
            </a>

            <a 
              href="https://www.instagram.com/espinolafotos/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="apple-card p-5 rounded-apple-card border border-black/[0.06] shadow-apple-subtle flex items-center gap-4 hover:scale-[1.02] transition-transform group"
            >
              <div className="w-10 h-10 rounded-apple-btn bg-accentMain/10 text-accentMain flex items-center justify-center shrink-0">
                <Instagram size={18} />
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-textSecondary font-sans">Instagram</span>
                <span className="text-xs font-sans text-textMain block group-hover:text-accentMain transition-colors">
                  @espinolafotos
                </span>
              </div>
            </a>
          </div>

          {/* Formulario de Contacto (Apple Card con 44px inputs) */}
          <div className="w-full md:w-2/3 scroll-reveal apple-card p-8 md:p-10 rounded-apple-card border border-black/[0.06] shadow-apple-card">
            <h2 className="title-main text-xl text-textMain mb-6">ENVÍAME UN MENSAJE</h2>
            
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-1/2">
                  <label htmlFor="name" className="block text-[11px] uppercase tracking-widest text-textSecondary font-sans mb-2">
                    Nombre completo
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    className="apple-input w-full bg-white border border-black/[0.1] rounded-apple-btn px-4 font-sans text-sm text-textMain focus:outline-none focus:border-accentMain focus:ring-2 focus:ring-accentMain/20 transition-all"
                  />
                </div>
                <div className="w-full sm:w-1/2">
                  <label htmlFor="email" className="block text-[11px] uppercase tracking-widest text-textSecondary font-sans mb-2">
                    Correo Electrónico
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ejemplo@correo.com"
                    className="apple-input w-full bg-white border border-black/[0.1] rounded-apple-btn px-4 font-sans text-sm text-textMain focus:outline-none focus:border-accentMain focus:ring-2 focus:ring-accentMain/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block text-[11px] uppercase tracking-widest text-textSecondary font-sans mb-2">
                  Servicio de Interés
                </label>
                <select 
                  id="service" 
                  name="service" 
                  required
                  value={formData.service}
                  onChange={handleChange}
                  className="apple-input w-full bg-white border border-black/[0.1] rounded-apple-btn px-4 font-sans text-sm text-textMain focus:outline-none focus:border-accentMain focus:ring-2 focus:ring-accentMain/20 transition-all cursor-pointer"
                >
                  <option value="" disabled>Selecciona un servicio</option>
                  <option value="Boda">Boda Completa / Civil</option>
                  <option value="Retrato">Retrato / Sesión Individual</option>
                  <option value="Eventos">Quinceañeras / Cumpleaños / Bautizos</option>
                  <option value="Deportes">Eventos Deportivos</option>
                  <option value="Otro">Otro tipo de proyecto</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-[11px] uppercase tracking-widest text-textSecondary font-sans mb-2">
                  Mensaje o Detalles del Evento
                </label>
                <textarea 
                  id="message" 
                  name="message" 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Cuéntame sobre las fechas, lugar y lo que sueñas para tu sesión..."
                  className="w-full bg-white border border-black/[0.1] rounded-apple-btn p-4 font-sans text-sm text-textMain focus:outline-none focus:border-accentMain focus:ring-2 focus:ring-accentMain/20 transition-all resize-none"
                ></textarea>
              </div>

              {/* Condiciones de Reserva */}
              <div className="bg-black/[0.02] border border-black/[0.06] p-4 rounded-apple-btn">
                <div className="flex items-center gap-1.5 mb-2">
                  <ShieldCheck size={14} className="text-accentMain" />
                  <span className="text-[10px] uppercase font-sans tracking-widest text-textMain font-medium">
                    Condiciones Clave de Contratación
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="apple-badge bg-white border border-black/[0.06] text-textSecondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-accentMain"></span>
                    <strong>75%</strong> Adelanto de Reserva
                  </span>
                  <span className="apple-badge bg-white border border-black/[0.06] text-textSecondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-accentMain"></span>
                    Fecha Exclusiva Bloqueada
                  </span>
                  <span className="apple-badge bg-white border border-black/[0.06] text-textSecondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-accentMain"></span>
                    Aviso 5 días para cambios
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <button 
                  type="submit" 
                  className="btn-primary w-full text-xs gap-2"
                >
                  <Send size={14} />
                  <span>ENVIAR POR CORREO</span>
                </button>
                <button 
                  type="button" 
                  onClick={handleWhatsAppSubmit}
                  className="min-h-[44px] px-6 rounded-apple-btn bg-textMain text-white font-sans text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-apple-subtle hover:bg-neutral-800 active:scale-[0.97] transition-all w-full"
                >
                  <MessageCircle size={15} />
                  <span>ENVIAR POR WHATSAPP</span>
                </button>
              </div>
              <p className="text-[11px] text-textSecondary text-center font-sans mt-1">
                * En PC se abrirá Gmail Web o WhatsApp Web. En móvil se abrirá tu aplicación nativa.
              </p>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
