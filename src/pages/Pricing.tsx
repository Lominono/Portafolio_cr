/* Apple UI Design System – Verified: 8pt Grid, SF Pro Typography, Material-Depth, Natural Spring Motion */
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
    // 1. Cabecera
    gsap.from('.header-elem', {
      y: 28,
      opacity: 0,
      duration: 1,
      stagger: 0.12,
      ease: 'power2.out',
      clearProps: 'all'
    });

    // 2. Líneas divisoras en bronce
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

    // 3. Bloques de tarifas
    const rows = gsap.utils.toArray('.pricing-block');
    rows.forEach((row: any) => {
      gsap.from(row, {
        scrollTrigger: {
          trigger: row,
          start: 'top 88%',
          once: true,
        },
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'all'
      });
    });

    // 4. Extras y Políticas
    gsap.from('.extras-reveal', {
      scrollTrigger: {
        trigger: '.extras-reveal',
        start: 'top 88%',
        once: true,
      },
      y: 24,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'all'
    });

    gsap.from('.policies-reveal', {
      scrollTrigger: {
        trigger: '.policies-reveal',
        start: 'top 88%',
        once: true,
      },
      y: 24,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'all'
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
          <h1 className="header-elem title-main text-3xl md:text-5xl mb-4 text-textMain">
            TARIFAS Y SERVICIOS
          </h1>
          <p className="header-elem text-textSecondary uppercase tracking-widest text-xs max-w-lg mx-auto font-sans">
            Dossier completo de precios fotográficos
          </p>
          <div className="header-elem w-12 h-px bg-accentMain mx-auto mt-6 accent-divider origin-center"></div>
        </div>

        {/* Listado de Tarifas con Espacios para Fotos (20px radii, 8pt spacing) */}
        <div className="mb-28 flex flex-col gap-24">
          {pricingData.map((item, index) => {
            const isEven = index % 2 === 0;
            const imgs = getImagesForService(item);

            return (
              <div 
                key={index} 
                className={`pricing-block flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
              >
                {/* Lado de Fotos con Proporciones Exactas */}
                <div className="w-full md:w-1/2 flex justify-center">
                  {item.layout === 'single' ? (
                    <div className="w-full max-w-[380px] aspect-[3/4] photo-card-secondary relative flex items-center justify-center overflow-hidden group bg-neutral-50 shadow-apple-card">
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
                            {item.label} (3:4 Vertical)
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Layout Collage Calibrado al Milímetro: Izquierda 3:4, Derecha dos de 4:3 */
                    <div className="w-full max-w-[560px] flex gap-4 aspect-[10/7]">
                      {imgs.length >= 3 ? (
                        <>
                          <div className="w-[54%] h-full photo-card-secondary relative overflow-hidden group bg-neutral-50 shadow-apple-card">
                            <img 
                              src={imgs[0]} 
                              alt={`${item.title} 1`} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                          </div>
                          <div className="w-[46%] h-full flex flex-col gap-4">
                            <div className="h-[calc(50%-8px)] w-full photo-card-secondary relative overflow-hidden group bg-neutral-50 shadow-apple-card">
                              <img 
                                src={imgs[1]} 
                                alt={`${item.title} 2`} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                              />
                            </div>
                            <div className="h-[calc(50%-8px)] w-full photo-card-secondary relative overflow-hidden group bg-neutral-50 shadow-apple-card">
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
                          <div className="w-[54%] h-full photo-card-secondary relative overflow-hidden group bg-neutral-50 shadow-apple-card">
                            <img 
                              src={imgs[0]} 
                              alt={`${item.title} 1`} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                          </div>
                          <div className="w-[46%] h-full flex flex-col gap-4">
                            <div className="h-[calc(50%-8px)] w-full photo-card-secondary relative overflow-hidden group bg-neutral-50 shadow-apple-card">
                              <img 
                                src={imgs[1]} 
                                alt={`${item.title} 2`} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                              />
                            </div>
                            <div className="h-[calc(50%-8px)] w-full photo-card-secondary bg-neutral-50 flex items-center justify-center p-4 text-center shadow-apple-card">
                              <span className="text-textSecondary uppercase tracking-widest text-[9px] font-sans">Momento (4:3)</span>
                            </div>
                          </div>
                        </>
                      ) : imgs.length === 1 ? (
                        <>
                          <div className="w-[54%] h-full photo-card-secondary relative overflow-hidden group bg-neutral-50 shadow-apple-card">
                            <img 
                              src={imgs[0]} 
                              alt={`${item.title} 1`} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                          </div>
                          <div className="w-[46%] h-full flex flex-col gap-4">
                            <div className="h-[calc(50%-8px)] w-full photo-card-secondary bg-neutral-50 flex items-center justify-center p-4 text-center shadow-apple-card">
                              <span className="text-textSecondary uppercase tracking-widest text-[9px] font-sans">Detalle (4:3)</span>
                            </div>
                            <div className="h-[calc(50%-8px)] w-full photo-card-secondary bg-neutral-50 flex items-center justify-center p-4 text-center shadow-apple-card">
                              <span className="text-textSecondary uppercase tracking-widest text-[9px] font-sans">Momento (4:3)</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-[54%] h-full photo-card-secondary bg-neutral-50 flex items-center justify-center p-4 text-center shadow-apple-card">
                            <span className="text-textSecondary uppercase tracking-widest text-[10px] font-sans">
                              {item.label} (3:4)
                            </span>
                          </div>
                          <div className="w-[46%] h-full flex flex-col gap-4">
                            <div className="h-[calc(50%-8px)] w-full photo-card-secondary bg-neutral-50 flex items-center justify-center p-4 text-center shadow-apple-card">
                              <span className="text-textSecondary uppercase tracking-widest text-[9px] font-sans">Detalle (4:3)</span>
                            </div>
                            <div className="h-[calc(50%-8px)] w-full photo-card-secondary bg-neutral-50 flex items-center justify-center p-4 text-center shadow-apple-card">
                              <span className="text-textSecondary uppercase tracking-widest text-[9px] font-sans">Momento (4:3)</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Lado de Texto */}
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <h2 className="title-main text-2xl md:text-3xl text-textMain mb-3 leading-tight">
                    {item.title}
                  </h2>
                  <div className="text-accentMain title-main text-xl mb-4 font-medium">
                    {item.price}
                  </div>
                  <p className="text-textSecondary font-sans font-light leading-relaxed mb-6 text-sm md:text-base">
                    {item.desc}
                  </p>
                  
                  {/* Micro-Badges Apple (8px) */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    <span className="apple-badge text-textSecondary bg-black/[0.03] border border-black/[0.06]">
                      <Check size={12} className="text-accentMain" /> Edición Profesional
                    </span>
                    <span className="apple-badge text-textSecondary bg-black/[0.03] border border-black/[0.06]">
                      <Check size={12} className="text-accentMain" /> Galería Digital Privada
                    </span>
                    <span className="apple-badge text-textSecondary bg-black/[0.03] border border-black/[0.06]">
                      <Check size={12} className="text-accentMain" /> Máxima Resolución
                    </span>
                  </div>

                  <div>
                    <a 
                      href={createWhatsAppLink(item.title, item.price)}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="min-h-[44px] px-6 rounded-apple-btn bg-accentMain text-white uppercase tracking-widest text-xs font-sans inline-flex items-center justify-center gap-2 shadow-apple-subtle hover:bg-accentSecondary transition-all duration-300 active:scale-95"
                    >
                      <MessageCircle size={15} />
                      <span>CONSULTAR DISPONIBILIDAD</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Extras y Complementos */}
        <div className="extras-reveal max-w-4xl mx-auto mb-24">
          <div className="text-center mb-10">
            <h2 className="title-main text-2xl text-textMain mb-3">EXTRAS Y COMPLEMENTOS</h2>
            <div className="w-8 h-px bg-accentMain mx-auto"></div>
          </div>
          
          <div className="apple-card p-8 md:p-12 rounded-apple-card border border-black/[0.06] shadow-apple-card">
            {extrasData.map((extra, index) => (
              <div key={index} className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b border-black/[0.06] last:border-0 border-dashed first:pt-0 last:pb-0">
                <div className="mb-3 md:mb-0">
                  <h3 className="title-main text-sm text-textMain">{extra.title}</h3>
                </div>
                <span className="title-main text-sm text-accentMain md:ml-4 whitespace-nowrap font-medium">
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

        {/* Condiciones y Políticas de Reserva */}
        <div className="policies-reveal max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-accentMain font-sans mb-3 font-medium apple-badge bg-black/[0.02] border border-black/[0.06]">
              <Sparkles size={12} /> Transparencia y Garantía de Reserva
            </span>
            <h2 className="title-main text-2xl md:text-3xl text-textMain mb-3">
              CONDICIONES DE CONTRATACIÓN
            </h2>
            <div className="w-10 h-px bg-accentMain mx-auto mb-4"></div>
            <p className="text-xs text-textSecondary font-sans font-light max-w-lg mx-auto leading-relaxed">
              Un marco simple y profesional para que disfrutes de tu evento con total tranquilidad y dedicación exclusiva.
            </p>
          </div>

          {/* Cuadrícula de Tarjetas con Acabado Apple */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tarjeta 1: Reserva y Adelanto */}
            <div className="relative apple-card p-6 rounded-apple-card border border-black/[0.06] shadow-apple-card flex flex-col justify-between group">
              <span className="absolute -bottom-4 -right-2 text-6xl font-serif text-black/[0.03] select-none pointer-events-none group-hover:text-accentMain/10 transition-colors">
                01
              </span>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-apple-btn bg-accentMain/10 text-accentMain flex items-center justify-center shadow-sm">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-accentMain font-sans font-semibold apple-badge bg-white border border-black/[0.08]">
                    Paso 1
                  </span>
                </div>

                <h3 className="title-main text-sm text-textMain mb-1">
                  75% DE ADELANTO
                </h3>
                <span className="text-[11px] text-accentMain font-serif italic block mb-3">
                  Bloqueo exclusivo de agenda
                </span>

                <ul className="text-xs text-textSecondary font-sans font-light space-y-2 mb-4 leading-relaxed">
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
            <div className="relative apple-card p-6 rounded-apple-card border border-black/[0.06] shadow-apple-card flex flex-col justify-between group">
              <span className="absolute -bottom-4 -right-2 text-6xl font-serif text-black/[0.03] select-none pointer-events-none group-hover:text-accentMain/10 transition-colors">
                02
              </span>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-apple-btn bg-accentMain/10 text-accentMain flex items-center justify-center shadow-sm">
                    <FileText size={20} />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-accentMain font-sans font-semibold apple-badge bg-white border border-black/[0.08]">
                    Paso 2
                  </span>
                </div>

                <h3 className="title-main text-sm text-textMain mb-1">
                  CANCELACIONES
                </h3>
                <span className="text-[11px] text-accentMain font-serif italic block mb-3">
                  Cobertura por causa ajena
                </span>

                <ul className="text-xs text-textSecondary font-sans font-light space-y-2 mb-4 leading-relaxed">
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
            <div className="relative apple-card p-6 rounded-apple-card border border-black/[0.06] shadow-apple-card flex flex-col justify-between group">
              <span className="absolute -bottom-4 -right-2 text-6xl font-serif text-black/[0.03] select-none pointer-events-none group-hover:text-accentMain/10 transition-colors">
                03
              </span>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-apple-btn bg-accentMain/10 text-accentMain flex items-center justify-center shadow-sm">
                    <Clock size={20} />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-accentMain font-sans font-semibold apple-badge bg-white border border-black/[0.08]">
                    Paso 3
                  </span>
                </div>

                <h3 className="title-main text-sm text-textMain mb-1">
                  5 DÍAS DE AVISO
                </h3>
                <span className="text-[11px] text-accentMain font-serif italic block mb-3">
                  Reprogramación flexible
                </span>

                <ul className="text-xs text-textSecondary font-sans font-light space-y-2 mb-4 leading-relaxed">
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

          {/* Sello de Confianza y Calidad */}
          <div className="mt-8 apple-glass p-6 rounded-apple-card border border-black/[0.08] shadow-apple-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
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
