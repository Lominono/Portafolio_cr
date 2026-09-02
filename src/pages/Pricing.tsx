import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MessageCircle } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const pricingData = [
  { 
    title: 'SESIÓN INDIVIDUAL / RETRATO / MODA', 
    price: '80 € – 150 €', 
    desc: '1 hora de sesión (exterior o localización), 10 a 15 fotos editadas en alta resolución y galería digital privada.',
    layout: 'single' // Layout type for the photo placeholders
  },
  { 
    title: 'CUMPLEAÑOS Y FIESTAS INFANTILES', 
    price: '100 € – 200 €', 
    desc: 'Cobertura del evento (2-3 horas), momentos clave (pastel, animación) y entrega de galería digital completa.',
    layout: 'collage' 
  },
  { 
    title: 'FIESTAS DE 15 AÑOS / QUINCEAÑERAS', 
    price: '200 € – 500 €', 
    desc: 'Cobertura de la celebración, vals, protocolo y sesión previa o de recepción con galería digital.',
    layout: 'single'
  },
  { 
    title: 'BAUTIZOS Y COMUNIONES', 
    price: '120 € – 220 €', 
    desc: 'Cobertura de la ceremonia y/o reportaje exterior, con entrega de galería digital (25-40 fotos).',
    layout: 'single'
  },
  { 
    title: 'EVENTOS DEPORTIVOS', 
    price: '150 € – 350 €', 
    desc: 'Cobertura de la competición, fotos de acción y entrega de galería completa.',
    layout: 'collage'
  },
  { 
    title: 'BODA BÁSICA / CIVIL', 
    price: '250 € – 450 €', 
    desc: 'Cobertura de ceremonia, fotos de pareja tras el enlace y fotos de grupo/familiares.',
    layout: 'single'
  },
  { 
    title: 'BODA COMPLETA', 
    price: 'DESDE 650 €', 
    desc: 'Cobertura integral: preparativos, ceremonia, banquete y fiesta, más entrega completa en alta resolución.',
    layout: 'collage'
  },
  { 
    title: 'SESIONES ESPECIALES (PAREJA, PRE-MAMÁ, FAMILIA)', 
    price: '100 € – 180 €', 
    desc: '1 a 1,5 horas en exterior o domicilio con entrega digital de 20 a 30 imágenes.',
    layout: 'single'
  }
];

const extrasData = [
  { title: 'SESIÓN PREBODA / POSTBODA INDEPENDIENTE', price: '120 € – 180 €' },
  { title: 'ÁLBUM IMPRESO PROFESIONAL', price: 'DESDE 150 €', note: '* El precio del álbum varía según el formato, número de páginas y acabados seleccionados.' }
];

const Pricing = () => {
  const container = useRef<HTMLDivElement>(null);

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
  }, { scope: container });

  const createWhatsAppLink = (serviceTitle: string, price: string) => {
    const text = `¡Hola Cristian! Me gustaría consultar disponibilidad para: ${serviceTitle} (${price}).`;
    return `https://wa.me/34640646963?text=${encodeURIComponent(text)}`;
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
            return (
              <div 
                key={index} 
                className={`pricing-block flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
              >
                {/* Lado de Fotos (Placeholders) */}
                <div className="w-full md:w-1/2 flex gap-4 h-[400px]">
                  {item.layout === 'single' ? (
                    <div className="w-full h-full photo-card-secondary bg-neutral-50 flex flex-col items-center justify-center p-6 text-center">
                      <span className="text-textSecondary uppercase tracking-widest text-[10px] font-sans mb-2">Foto Referencia</span>
                      <span className="title-main text-xs text-textMain opacity-50">{item.title}</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-1/2 h-full photo-card-secondary bg-neutral-50 flex flex-col items-center justify-center p-4 text-center">
                        <span className="text-textSecondary uppercase tracking-widest text-[10px] font-sans">Foto 1</span>
                      </div>
                      <div className="w-1/2 h-full flex flex-col gap-4">
                        <div className="h-1/2 w-full photo-card-secondary bg-neutral-50 flex flex-col items-center justify-center p-4 text-center">
                          <span className="text-textSecondary uppercase tracking-widest text-[10px] font-sans">Foto 2</span>
                        </div>
                        <div className="h-1/2 w-full photo-card-secondary bg-neutral-50 flex flex-col items-center justify-center p-4 text-center">
                          <span className="text-textSecondary uppercase tracking-widest text-[10px] font-sans">Foto 3</span>
                        </div>
                      </div>
                    </>
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
                  <p className="text-textSecondary font-sans font-light leading-relaxed mb-8 text-sm md:text-base">
                    {item.desc}
                  </p>
                  
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

      </div>
    </div>
  );
};

export default Pricing;
