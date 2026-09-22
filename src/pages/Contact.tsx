import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Send, MessageCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Contact = () => {
  const container = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitFeedback, setSubmitFeedback] = useState<string | null>(null);

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
    setValidationError(null);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setValidationError('Por favor, ingresa tu nombre completo.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setValidationError('Por favor, ingresa un correo electrónico válido.');
      return;
    }
    if (!formData.message.trim()) {
      setValidationError('Por favor, déjame un breve mensaje con los detalles de tu consulta.');
      return;
    }

    setValidationError(null);
    setSubmitFeedback('Abriendo tu gestor de correo electrónico...');
    setTimeout(() => setSubmitFeedback(null), 5000);

    const subject = encodeURIComponent(`Nueva consulta de ${formData.name} - ${formData.service || 'Fotografía'}`);
    const rawBody = `Hola Cristian,\n\nMi nombre es: ${formData.name}\nMi correo es: ${formData.email}\nServicio de interés: ${formData.service || 'General'}\n\nMensaje:\n${formData.message}`;
    
    const bodyMailto = encodeURIComponent(rawBody);
    window.location.href = `mailto:Christianespinolas2317@gmail.com?subject=${subject}&body=${bodyMailto}`;
  };

  const handleWhatsAppSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setValidationError('Por favor, ingresa tu nombre para poder saludarte en WhatsApp.');
      return;
    }
    if (!formData.message.trim()) {
      setValidationError('Por favor, escribe un breve mensaje o fecha antes de abrir WhatsApp.');
      return;
    }

    setValidationError(null);
    setSubmitFeedback('Conectando directamente con WhatsApp...');
    setTimeout(() => setSubmitFeedback(null), 5000);

    const serviceText = formData.service ? ` para el servicio de ${formData.service}` : '';
    const text = encodeURIComponent(`Hola Cristian, soy ${formData.name}. Me gustaría consultar disponibilidad${serviceText}.\n\n${formData.message}`);
    
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
        
        {/* Cabecera Editorial */}
        <div className="text-center mb-20">
          <span className="header-elem font-serif italic text-accentMain text-base md:text-lg mb-2 block">
            Conversación directa
          </span>
          <h1 className="header-elem font-serif text-4xl sm:text-5xl md:text-6xl mb-4 text-textMain font-normal tracking-[-0.02em]">
            Contacto y reservas
          </h1>
          <p className="header-elem text-textSecondary text-sm md:text-base font-sans font-light max-w-lg mx-auto">
            Cuéntame los detalles de tu evento, fecha estimada y la atmósfera que deseas capturar.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-16 items-start">
          
          {/* Información Editorial del Estudio */}
          <div className="w-full md:w-5/12 scroll-reveal flex flex-col gap-8">
            <div>
              <h2 className="title-main text-2xl text-textMain mb-3">Estudio de fotografía</h2>
              <p className="text-textSecondary font-sans font-light text-sm leading-relaxed mb-6">
                Disponible para bodas, retratos y eventos en Santander, Cantabria y desplazamientos en todo el territorio nacional.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div className="border-b border-black/[0.06] pb-4">
                <span className="text-xs text-textSecondary block mb-1">Correo electrónico</span>
                <a 
                  href="mailto:Christianespinolas2317@gmail.com"
                  className="font-sans text-sm text-textMain hover:text-accentMain transition-colors"
                >
                  Christianespinolas2317@gmail.com
                </a>
              </div>

              <div className="border-b border-black/[0.06] pb-4">
                <span className="text-xs text-textSecondary block mb-1">WhatsApp y teléfono</span>
                <a 
                  href="https://wa.me/34640646963"
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-sans text-sm text-textMain hover:text-accentMain transition-colors"
                >
                  +34 640 64 69 63
                </a>
              </div>

              <div className="border-b border-black/[0.06] pb-4">
                <span className="text-xs text-textSecondary block mb-1">Galería en Instagram</span>
                <a 
                  href="https://www.instagram.com/espinolafotos/"
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-sans text-sm text-textMain hover:text-accentMain transition-colors"
                >
                  @espinolafotos
                </a>
              </div>
            </div>

            {/* Cuadro de Compromiso de Tiempo de Respuesta */}
            <div className="apple-glass p-5 rounded-apple-card border border-black/[0.06]">
              <span className="font-serif italic text-accentMain text-sm block mb-1">Atención personalizada</span>
              <p className="text-xs text-textSecondary font-sans font-light leading-relaxed">
                Respondo habitualmente a todas las solicitudes en un plazo máximo de 24 horas con disponibilidad y propuesta detallada.
              </p>
            </div>
          </div>

          {/* Formulario de Contacto (Apple Card con 44px inputs) */}
          <div className="w-full md:w-7/12 scroll-reveal apple-card p-8 md:p-10 rounded-apple-card border border-black/[0.06] shadow-apple-card">
            <h2 className="title-main text-2xl text-textMain mb-6">Envíame un mensaje</h2>
            
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-1/2">
                  <label htmlFor="name" className="block text-xs text-textSecondary font-sans mb-2">
                    Nombre y apellidos
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className="apple-input w-full bg-white border border-black/[0.1] rounded-apple-btn px-4 font-sans text-sm text-textMain focus:outline-none focus:border-accentMain focus:ring-2 focus:ring-accentMain/20 transition-all"
                  />
                </div>
                <div className="w-full sm:w-1/2">
                  <label htmlFor="email" className="block text-xs text-textSecondary font-sans mb-2">
                    Correo electrónico
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
                <label htmlFor="service" className="block text-xs text-textSecondary font-sans mb-2">
                  Servicio de interés
                </label>
                <select 
                  id="service" 
                  name="service" 
                  required
                  value={formData.service}
                  onChange={handleChange}
                  className="apple-input w-full bg-white border border-black/[0.1] rounded-apple-btn px-4 font-sans text-sm text-textMain focus:outline-none focus:border-accentMain focus:ring-2 focus:ring-accentMain/20 transition-all cursor-pointer"
                >
                  <option value="" disabled>Selecciona el tipo de sesión o reportaje</option>
                  <option value="Boda Completa">Boda completa de autor</option>
                  <option value="Boda Civil">Boda civil o íntima</option>
                  <option value="Retrato">Sesión individual, retrato o moda</option>
                  <option value="15 Años">Fiestas de 15 años y quinceañeras</option>
                  <option value="Cumpleaños">Cumpleaños y celebraciones infantiles</option>
                  <option value="Bautizo">Bautizo o primera comunión</option>
                  <option value="Deportes">Eventos deportivos</option>
                  <option value="Sesión Especial">Sesión especial de pareja o familia</option>
                  <option value="Otro">Otro proyecto personalizado</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs text-textSecondary font-sans mb-2">
                  Detalles del evento o fecha estimada
                </label>
                <textarea 
                  id="message" 
                  name="message" 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Cuéntame sobre la fecha deseada, la ubicación y qué tipo de momentos te gustaría recordar..."
                  className="w-full bg-white border border-black/[0.1] rounded-apple-btn p-4 font-sans text-sm text-textMain focus:outline-none focus:border-accentMain focus:ring-2 focus:ring-accentMain/20 transition-all resize-none"
                ></textarea>
              </div>

              {/* Aviso de Validación o Feedback */}
              {validationError && (
                <div className="apple-glass p-3.5 rounded-apple-btn border border-red-500/20 bg-red-50/50 flex items-center gap-2.5 text-xs text-red-800 animate-fade-in">
                  <AlertCircle size={16} className="text-red-600 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {submitFeedback && (
                <div className="apple-glass p-3.5 rounded-apple-btn border border-accentMain/20 bg-accentMain/5 flex items-center gap-2.5 text-xs text-textMain animate-fade-in">
                  <CheckCircle2 size={16} className="text-accentMain shrink-0" />
                  <span>{submitFeedback}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <button 
                  type="submit" 
                  className="btn-primary w-full text-xs gap-2"
                >
                  <Send size={14} />
                  <span>Enviar por correo</span>
                </button>
                <button 
                  type="button" 
                  onClick={handleWhatsAppSubmit}
                  className="min-h-[44px] px-6 rounded-apple-btn border border-black/[0.12] text-textMain font-sans text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-black/[0.03] hover:border-accentMain/40 active:scale-[0.97] transition-all w-full"
                >
                  <MessageCircle size={15} className="text-accentMain" />
                  <span>Escribir por WhatsApp</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
