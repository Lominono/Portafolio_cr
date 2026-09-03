import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MessageCircle, ShieldCheck, FileText, Clock, Check, Sparkles, ArrowRight } from 'lucide-react';
import { subscribeToAllPhotos } from '../services/photos';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface PricingItem {
  title: string;
  price: string;
  desc: string;
  layout: 'single' | 'collage';
  sectionId: string;
  fallbackId: string;
  label: string;
}

const pricingData: PricingItem[] = [
  { 
    title: 'SESIÓN INDIVIDUAL / RETRATO / MODA', 
    price: '80 € – 150 €', 
    desc: '1 hora de sesión (exterior o localización), 10 a 15 fotos editadas en alta resolución y galería digital privada.',
    layout: 'single',
    sectionId: 'pricing-portrait',
    fallbackId: 'pricing-portrait',
    label: 'Retrato / Moda'
  },
  { 
    title: 'CUMPLEAÑOS Y FIESTAS INFANTILES', 
    price: '100 € – 200 €', 
    desc: 'Cobertura del evento (2-3 horas), momentos clave (pastel, animación) y entrega de galería digital completa.',
    layout: 'collage',
    sectionId: 'pricing-birthday',
    fallbackId: 'pricing-events',
    label: 'Cumpleaños'
  },
  { 
    title: 'FIESTAS DE 15 AÑOS / QUINCEAÑERAS', 
    price: '200 € – 500 €', 
    desc: 'Cobertura de la celebración, vals, protocolo y sesión previa o de recepción con galería digital.',
    layout: 'single',
    sectionId: 'pricing-quince',
    fallbackId: 'pricing-events',
    label: '15 Años'
  },
  { 
    title: 'BAUTIZOS Y COMUNIONES', 
    price: '120 € – 220 €', 
    desc: 'Cobertura de la ceremonia y/o reportaje exterior, con entrega de galería digital (25-40 fotos).',
    layout: 'single',
    sectionId: 'pricing-baptism',
    fallbackId: 'pricing-events',
    label: 'Bautizos'
  },
  { 
    title: 'EVENTOS DEPORTIVOS', 
    price: '150 € – 350 €', 
    desc: 'Cobertura de la competición, fotos de acción y entrega de galería completa.',
    layout: 'collage',
    sectionId: 'pricing-sports',
    fallbackId: 'pricing-events',
    label: 'Deportes'
  },
  { 
    title: 'BODA BÁSICA / CIVIL', 
    price: '250 € – 450 €', 
    desc: 'Cobertura de ceremonia, fotos de pareja tras el enlace y fotos de grupo/familiares.',
    layout: 'single',
    sectionId: 'pricing-wedding-civil',
    fallbackId: 'pricing-wedding',
    label: 'Boda Civil'
  },
  { 
    title: 'BODA COMPLETA', 
    price: 'DESDE 650 €', 
    desc: 'Cobertura integral: preparativos, ceremonia, banquete y fiesta, más entrega completa en alta resolución.',
    layout: 'collage',
    sectionId: 'pricing-wedding-full',
    fallbackId: 'pricing-wedding',
    label: 'Boda Completa'
  },
  { 
    title: 'SESIONES ESPECIALES (PAREJA, PRE-MAMÁ, FAMILIA)', 
    price: '100 € – 180 €', 
    desc: '1 a 1,5 horas en exterior o domicilio con entrega digital de 20 a 30 imágenes.',
    layout: 'single',
    sectionId: 'pricing-special',
    fallbackId: 'pricing-portrait',
    label: 'Sesiones Especiales'
  }
];

const extrasData = [
  { title: 'SESIÓN PREBODA / POSTBODA INDEPENDIENTE', price: '120 € – 180 €' },
  { title: 'ÁLBUM IMPRESO PROFESIONAL', price: 'DESDE 150 €', note: '* El precio del álbum varía según el formato, número de páginas y acabados seleccionados.' }
];

const Pricing = () => {
  const container = useRef<HTMLDivElement>(null);
  const [pricingImgs, setPricingImgs] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const unsubscribe = subscribeToAllPhotos((allPhotos) => {
      setPricingImgs(allPhotos);
    });

    return () => unsubscribe();
  }, []);

  useGSAP(() => {
    gsap.from('.header-elem', {
      y: 30,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power2.out',
    });

    const rows = gsap.utils.toArray('.pricing-block');
    rows.forEach((row: any) => {
      gsap.from(row, {
        scrollTrigger: {
          trigger: row,
          start: 'top 85%',
          toggleActions: 'play reverse play reverse',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
      });
    });

    gsap.from('.extras-reveal', {
      scrollTrigger: {
        trigger: '.extras-reveal',
        start: 'top 85%',
        toggleActions: 'play reverse play reverse',
      },
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    });

    gsap.from('.policies-reveal', {
      scrollTrigger: {
        trigger: '.policies-reveal',
        start: 'top 85%',
        toggleActions: 'play reverse play reverse',
      },
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    });
  }, { scope: container });

  const createWhatsAppLink = (serviceTitle: string, price: string) => {
    const text = `¡Hola Cristian! Me gustaría consultar disponibilidad para: ${serviceTitle} (${price}).`;
    return `https://wa.me/34640646963?text=${encodeURIComponent(text)}`;
  };

  const getImagesForService = (item: PricingItem): string[] => {
    const specific = pricingImgs[item.sectionId];
    if (specific && specific.length > 0) return specific;

    const fallback = pricingImgs[item.fallbackId];
    if (fallback && fallback.length > 0) return fallback;

    return [];
  };

  return (
    <div ref={container} className="pt-32 pb-24 px-6 md:px-16 min-h-screen bg-primary">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabecera Principal */}
        <div className="text-center mb-24">
          <h1 className="header-elem title-main text-3xl md:text-5xl mb-6 text-textMain">
            TARIFAS Y SERVICIOS
          </h1>
          <p className="header-elem text-textSecondary uppercase tracking-widest text-xs max-w-lg mx-auto font-sans">
            Dossier completo de precios fotográficos
          </p>
          <div className="header-elem w-12 h-px bg-accentMain mx-auto mt-8"></div>
        </div>

        {/* Listado de Tarifas con Espacios para Fotos */}
        <div className="mb-24 flex flex-col gap-24">
          {pricingData.map((item, index) => {
            const isEven = index % 2 === 0;
            const imgs = getImagesForService(item);

            return (
              <div 
                key={index} 
                className={`pricing-block flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
              >
                {/* Lado de Fotos */}
                <div className="w-full md:w-1/2 flex gap-4 h-[380px] md:h-[420px]">
                  {item.layout === 'single' ? (
                    <div className="w-full h-full photo-card-secondary relative flex items-center justify-center overflow-hidden group bg-neutral-50">
                      {imgs[0] ? (
                        <img 
                          src={imgs[0]} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                          <span className="w-8 h-px bg-accentMain mb-3"></span>
                          <span className="text-textSecondary uppercase tracking-widest text-xs font-sans">
                            {item.label}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Layout Collage */
                    imgs.length >= 3 ? (
                      <>
                        <div className="w-1/2 h-full photo-card-secondary relative overflow-hidden group bg-neutral-50">
                          <img 
                            src={imgs[0]} 
                            alt={`${item.title} 1`} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                        </div>
                        <div className="w-1/2 h-full flex flex-col gap-4">
                          <div className="h-1/2 w-full photo-card-secondary relative overflow-hidden group bg-neutral-50">
                            <img 
                              src={imgs[1]} 
                              alt={`${item.title} 2`} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                          </div>
                          <div className="h-1/2 w-full photo-card-secondary relative overflow-hidden group bg-neutral-50">
                            <img 
                              src={imgs[2]} 
                              alt={`${item.title} 3`} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                          </div>
                        </div>
                      </>
                    ) : imgs.length === 2 ? (
                      <>
                        <div className="w-1/2 h-full photo-card-secondary relative overflow-hidden group bg-neutral-50">
                          <img 
                            src={imgs[0]} 
                            alt={`${item.title} 1`} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                        </div>
                        <div className="w-1/2 h-full photo-card-secondary relative overflow-hidden group bg-neutral-50">
                          <img 
                            src={imgs[1]} 
                            alt={`${item.title} 2`} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                        </div>
                      </>
                    ) : imgs.length === 1 ? (
                      <div className="w-full h-full photo-card-secondary relative overflow-hidden group bg-neutral-50">
                        <img 
                          src={imgs[0]} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                      </div>
                    ) : (
                      <>
                        <div className="w-1/2 h-full photo-card-secondary bg-neutral-50 flex items-center justify-center p-4 text-center">
                          <span className="text-textSecondary uppercase tracking-widest text-[10px] font-sans">
                            {item.label}
                          </span>
                        </div>
                        <div className="w-1/2 h-full flex flex-col gap-4">
                          <div className="h-1/2 w-full photo-card-secondary bg-neutral-50 flex items-center justify-center p-4 text-center">
                            <span className="text-textSecondary uppercase tracking-widest text-[10px] font-sans">Detalle</span>
                          </div>
                          <div className="h-1/2 w-full photo-card-secondary bg-neutral-50 flex items-center justify-center p-4 text-center">
                            <span className="text-textSecondary uppercase tracking-widest text-[10px] font-sans">Momentos</span>
                          </div>
                        </div>
                      </>
                    )
                  )}
                </div>

                {/* Lado de Texto */}
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <h2 className="title-main text-2xl md:text-3xl text-textMain mb-4 leading-tight">
                    {item.title}
                  </h2>
                  <div className="text-accentMain title-main text-xl mb-6">
                    {item.price}
                  </div>
                  <p className="text-textSecondary font-sans font-light leading-relaxed mb-4 text-sm md:text-base">
                    {item.desc}
                  </p>
                  
                  {/* Micro-Badges de Servicio */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    <span className="inline-flex items-center gap-1 text-[11px] bg-neutral-100 text-textSecondary px-2.5 py-1 border border-neutral-200 font-sans">
                      <Check size={12} className="text-accentMain" /> Edición Profesional
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] bg-neutral-100 text-textSecondary px-2.5 py-1 border border-neutral-200 font-sans">
                      <Check size={12} className="text-accentMain" /> Galería Digital Privada
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] bg-neutral-100 text-textSecondary px-2.5 py-1 border border-neutral-200 font-sans">
                      <Check size={12} className="text-accentMain" /> Máxima Resolución
                    </span>
                  </div>

                  <div>
                    <a 
                      href={createWhatsAppLink(item.title, item.price)}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-textMain uppercase tracking-widest text-xs font-sans border-b border-accentMain pb-1 hover:text-accentMain transition-colors"
                    >
                      <MessageCircle size={14} /> CONSULTAR DISPONIBILIDAD
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Extras y Complementos */}
        <div className="extras-reveal max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="title-main text-2xl text-textMain mb-4">EXTRAS Y COMPLEMENTOS</h2>
            <div className="w-8 h-px bg-accentMain mx-auto"></div>
          </div>
          
          <div className="bg-neutral-50 p-8 md:p-12 photo-card-secondary">
            {extrasData.map((extra, index) => (
              <div key={index} className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b border-neutral-200 last:border-0 border-dashed first:pt-0 last:pb-0">
                <div className="mb-4 md:mb-0">
                  <h3 className="title-main text-sm text-textMain">{extra.title}</h3>
                </div>
                <span className="title-main text-sm text-accentMain md:ml-4 whitespace-nowrap">
                  {extra.price}
                </span>
              </div>
            ))}
            <div className="mt-8 text-center md:text-left">
              <p className="text-xs text-textSecondary font-sans italic">
                 * El precio del álbum varía según el formato, número de páginas y acabados seleccionados.
              </p>
            </div>
          </div>
        </div>

        {/* Condiciones y Políticas de Reserva Claras y No Invasivas */}
        <div className="policies-reveal max-w-4xl mx-auto mt-24">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-accentMain font-sans mb-2 font-medium bg-neutral-100 px-3 py-1 border border-neutral-200">
              <Sparkles size={11} /> Transparencia y Garantía de Reserva
            </span>
            <h2 className="title-main text-2xl md:text-3xl text-textMain mb-3">
              CONDICIONES DE CONTRATACIÓN
            </h2>
            <div className="w-10 h-px bg-accentMain mx-auto mb-4"></div>
            <p className="text-xs text-textSecondary font-sans font-light max-w-lg mx-auto">
              Un marco simple y profesional para que disfrutes de tu evento con total tranquilidad y dedicación exclusiva.
            </p>
          </div>

          {/* Línea de Proceso en 3 Pasos Visuales */}
          <div className="hidden md:flex items-center justify-between mb-8 px-6">
            <div className="flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-textMain">
              <span className="w-6 h-6 rounded-full bg-accentMain text-white flex items-center justify-center text-[11px] font-sans font-bold">1</span>
              <span>Reserva Exclusiva</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-accentMain/50 via-neutral-300 to-accentMain/50 mx-4"></div>
            <div className="flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-textMain">
              <span className="w-6 h-6 rounded-full bg-accentMain text-white flex items-center justify-center text-[11px] font-sans font-bold">2</span>
              <span>Protección de Fecha</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-accentMain/50 via-neutral-300 to-accentMain/50 mx-4"></div>
            <div className="flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-textMain">
              <span className="w-6 h-6 rounded-full bg-accentMain text-white flex items-center justify-center text-[11px] font-sans font-bold">3</span>
              <span>Flexibilidad Horaria</span>
            </div>
          </div>

          {/* Cuadrícula de Tarjetas Luxury con Micro-Interacciones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tarjeta 1: Reserva y Adelanto */}
            <div className="relative bg-neutral-50 p-6 border border-neutral-200 photo-card-secondary card-luxury overflow-hidden flex flex-col justify-between group">
              {/* Marca de agua elegante */}
              <span className="absolute -bottom-4 -right-2 text-6xl font-serif text-neutral-200/50 select-none pointer-events-none group-hover:text-accentMain/10 transition-colors">
                01
              </span>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-white border border-neutral-200 flex items-center justify-center text-accentMain shadow-sm group-hover:bg-accentMain group-hover:text-white transition-colors">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-accentMain font-sans font-semibold bg-white border border-neutral-200 px-2 py-0.5">
                    Paso 1
                  </span>
                </div>

                <h3 className="title-main text-sm text-textMain mb-2">
                  75% DE ADELANTO
                </h3>
                <span className="text-[11px] text-accentMain font-serif italic block mb-3">
                  Bloqueo exclusivo de agenda
                </span>

                <ul className="text-xs text-textSecondary font-sans font-light space-y-2 mb-4">
                  <li className="flex items-start gap-2">
                    <Check size={13} className="text-accentMain shrink-0 mt-0.5" />
                    <span>Asegura tu fecha en exclusiva sin solapamiento de eventos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={13} className="text-accentMain shrink-0 mt-0.5" />
                    <span>Permite planificar la logística técnica con antelación.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Tarjeta 2: Cancelaciones */}
            <div className="relative bg-neutral-50 p-6 border border-neutral-200 photo-card-secondary card-luxury overflow-hidden flex flex-col justify-between group">
              <span className="absolute -bottom-4 -right-2 text-6xl font-serif text-neutral-200/50 select-none pointer-events-none group-hover:text-accentMain/10 transition-colors">
                02
              </span>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-white border border-neutral-200 flex items-center justify-center text-accentMain shadow-sm group-hover:bg-accentMain group-hover:text-white transition-colors">
                    <FileText size={20} />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-accentMain font-sans font-semibold bg-white border border-neutral-200 px-2 py-0.5">
                    Paso 2
                  </span>
                </div>

                <h3 className="title-main text-sm text-textMain mb-2">
                  CANCELACIONES
                </h3>
                <span className="text-[11px] text-accentMain font-serif italic block mb-3">
                  Cobertura por causa ajena
                </span>

                <ul className="text-xs text-textSecondary font-sans font-light space-y-2 mb-4">
                  <li className="flex items-start gap-2">
                    <Check size={13} className="text-accentMain shrink-0 mt-0.5" />
                    <span>Compensa el bloqueo del día y la renuncia a otros clientes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={13} className="text-accentMain shrink-0 mt-0.5" />
                    <span>No reembolsable si la anulación responde a motivos ajenos.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Tarjeta 3: Flexibilidad 5 días */}
            <div className="relative bg-neutral-50 p-6 border border-neutral-200 photo-card-secondary card-luxury overflow-hidden flex flex-col justify-between group">
              <span className="absolute -bottom-4 -right-2 text-6xl font-serif text-neutral-200/50 select-none pointer-events-none group-hover:text-accentMain/10 transition-colors">
                03
              </span>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-white border border-neutral-200 flex items-center justify-center text-accentMain shadow-sm group-hover:bg-accentMain group-hover:text-white transition-colors">
                    <Clock size={20} />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-accentMain font-sans font-semibold bg-white border border-neutral-200 px-2 py-0.5">
                    Paso 3
                  </span>
                </div>

                <h3 className="title-main text-sm text-textMain mb-2">
                  5 DÍAS DE AVISO
                </h3>
                <span className="text-[11px] text-accentMain font-serif italic block mb-3">
                  Reprogramación flexible
                </span>

                <ul className="text-xs text-textSecondary font-sans font-light space-y-2 mb-4">
                  <li className="flex items-start gap-2">
                    <Check size={13} className="text-accentMain shrink-0 mt-0.5" />
                    <span>Cambios de fecha u horario con 5 días mínimos de margen.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={13} className="text-accentMain shrink-0 mt-0.5" />
                    <span>Sujeto a disponibilidad de agenda sin penalizaciones extras.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>

          {/* Sello de Confianza y Calidad Flotante */}
          <div className="mt-8 bg-white p-5 border border-neutral-200 photo-card-secondary flex flex-col sm:flex-row items-center justify-between gap-4 animate-subtle-float">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accentMain/10 text-accentMain flex items-center justify-center shrink-0">
                <Sparkles size={16} />
              </div>
              <p className="text-xs text-textSecondary font-sans font-light text-center sm:text-left">
                <strong className="text-textMain font-normal">Compromiso Cristian Espinola:</strong> Precios pactados cerrados, sin costes ocultos ni sorpresas de última hora.
              </p>
            </div>

            <a
              href="/contacto"
              className="inline-flex items-center gap-1.5 text-xs text-textMain font-serif uppercase tracking-wider hover:text-accentMain transition-colors shrink-0 border-b border-accentMain pb-0.5"
            >
              <span>Consultar mi fecha</span>
              <ArrowRight size={13} />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Pricing;
