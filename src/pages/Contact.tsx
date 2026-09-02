import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

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
    gsap.from('.header-elem', {
      y: 30,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power2.out',
    });

    const revealElements = gsap.utils.toArray('.scroll-reveal');
    revealElements.forEach((el: any) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play reverse play reverse', // Reversible up/down
        },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
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
    
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const isAndroid = /android/i.test(userAgent);
    const isMobile = isIOS || isAndroid;

    if (isMobile) {
      const bodyMailto = encodeURIComponent(rawBody);
      // location.href es más seguro en móviles para evitar bloqueos de pop-up
      window.location.href = `mailto:Christianespinolas2317@gmail.com?subject=${subject}&body=${bodyMailto}`;
    } else {
      const bodyGmail = encodeURIComponent(rawBody);
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=Christianespinolas2317@gmail.com&su=${subject}&body=${bodyGmail}`, '_blank');
    }
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
          <h1 className="header-elem title-main text-4xl md:text-5xl mb-6 text-textMain">
            CONTACTO
          </h1>
          <p className="header-elem text-textSecondary uppercase tracking-widest text-xs font-sans">
            Hablemos sobre tu próximo proyecto
          </p>
          <div className="header-elem w-12 h-px bg-accentMain mx-auto mt-8"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-16">
          
          {/* Información de Contacto Directa */}
          <div className="w-full md:w-1/3 scroll-reveal">
            <h2 className="title-main text-xl text-textMain mb-8">ESTUDIO & CONTACTO DIRECTO</h2>
            
            <div className="mb-8">
              <span className="block text-xs uppercase tracking-widest text-textSecondary font-sans mb-2">Email</span>
              <a href="mailto:Christianespinolas2317@gmail.com" className="text-textMain font-sans font-light hover:text-accentMain transition-colors">
                Christianespinolas2317@gmail.com
              </a>
            </div>
            
            <div className="mb-8">
              <span className="block text-xs uppercase tracking-widest text-textSecondary font-sans mb-2">WhatsApp / Teléfono</span>
              <a href="https://wa.me/34640646963" target="_blank" rel="noopener noreferrer" className="text-textMain font-sans font-light hover:text-accentMain transition-colors">
                +34 640 64 69 63
              </a>
            </div>

            <div>
              <span className="block text-xs uppercase tracking-widest text-textSecondary font-sans mb-2">Redes Sociales</span>
              <a href="https://www.instagram.com/espinolafotos/" target="_blank" rel="noopener noreferrer" className="text-textMain font-sans font-light hover:text-accentMain transition-colors">
                Instagram @espinolafotos
              </a>
            </div>
          </div>

          {/* Formulario de Contacto */}
          <div className="w-full md:w-2/3 scroll-reveal bg-neutral-50 p-8 md:p-12 border border-neutral-100">
            <h2 className="title-main text-2xl text-textMain mb-8">ENVÍAME UN MENSAJE</h2>
            
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-1/2">
                  <label htmlFor="name" className="block text-[10px] uppercase tracking-widest text-textSecondary font-sans mb-2">Nombre completo</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-primary border border-neutral-200 p-3 font-sans text-sm text-textMain focus:outline-none focus:border-accentMain transition-colors"
                  />
                </div>
                <div className="w-full sm:w-1/2">
                  <label htmlFor="email" className="block text-[10px] uppercase tracking-widest text-textSecondary font-sans mb-2">Correo Electrónico</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-primary border border-neutral-200 p-3 font-sans text-sm text-textMain focus:outline-none focus:border-accentMain transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block text-[10px] uppercase tracking-widest text-textSecondary font-sans mb-2">Servicio de Interés</label>
                <select 
                  id="service" 
                  name="service"
                  required
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full bg-primary border border-neutral-200 p-3 font-sans text-sm text-textMain focus:outline-none focus:border-accentMain transition-colors appearance-none"
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
                <label htmlFor="message" className="block text-[10px] uppercase tracking-widest text-textSecondary font-sans mb-2">Mensaje o Detalles del Evento</label>
                <textarea 
                  id="message" 
                  name="message" 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-primary border border-neutral-200 p-3 font-sans text-sm text-textMain focus:outline-none focus:border-accentMain transition-colors resize-none"
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button type="submit" className="btn-primary w-full text-xs">
                  ENVIAR POR CORREO
                </button>
                <button 
                  type="button" 
                  onClick={handleWhatsAppSubmit}
                  className="btn-primary w-full text-xs bg-textMain hover:bg-neutral-700"
                >
                  ENVIAR POR WHATSAPP
                </button>
              </div>
              <p className="text-[10px] text-textSecondary text-center font-sans mt-2">
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
