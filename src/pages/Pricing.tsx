import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const pricingData = [
  { title: 'Sesión Individual / Retrato / Moda', price: '80 € – 150 €', desc: '1 hora de sesión (exterior o localización), 10 a 15 fotos editadas en alta resolución y galería digital privada.' },
  { title: 'Cumpleaños y Fiestas Infantiles', price: '100 € – 200 €', desc: 'Cobertura del evento (2-3 horas), momentos clave (pastel, animación) y entrega de galería digital completa.' },
  { title: 'Fiestas de 15 Años / Quinceañeras', price: '200 € – 500 €', desc: 'Cobertura de la celebración, vals, protocolo y sesión previa o de recepción con galería digital.' },
  { title: 'Bautizos y Comuniones', price: '120 € – 220 €', desc: 'Cobertura de la ceremonia y/o reportaje exterior, con entrega de galería digital (25-40 fotos).' },
  { title: 'Eventos Deportivos', price: '150 € – 350 €', desc: 'Cobertura de la competición, fotos de acción y entrega de galería completa.' },
  { title: 'Boda Básica / Civil', price: '250 € – 450 €', desc: 'Cobertura de ceremonia, fotos de pareja tras el enlace y fotos de grupo/familiares.' },
  { title: 'Boda Completa', price: 'Desde 650 €', desc: 'Cobertura integral: preparativos, ceremonia, banquete y fiesta, más entrega completa en alta resolución.' },
  { title: 'Sesiones Especiales (Pareja, Pre-mamá, Familia)', price: '100 € – 180 €', desc: '1 a 1,5 horas en exterior o domicilio con entrega digital de 20 a 30 imágenes.' }
];

const extrasData = [
  { title: 'Sesión Preboda / Postboda independiente', price: '120 € – 180 €' },
  { title: 'Álbum Impreso Profesional', price: 'Desde 150 €', note: '* El precio del álbum varía según el formato, número de páginas y acabados seleccionados.' }
];

const Pricing = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header anim
    gsap.from('.header-elem', {
      y: 40,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power3.out',
    });

    // Animar las tarjetas de precio al hacer scroll
    const pricingCards = gsap.utils.toArray('.pricing-card');
    pricingCards.forEach((card: any) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      });
      
      // Efecto parallax en la imagen dentro de la tarjeta
      const img = card.querySelector('.img-parallax');
      if (img) {
        gsap.fromTo(img,
          { y: -30, scale: 1.1 },
          {
            y: 30,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1 // Suavizado brutal
            }
          }
        );
      }
    });

    // Revelado de la sección de Extras
    gsap.from('.extras-reveal', {
      scrollTrigger: {
        trigger: '.extras-reveal',
        start: 'top 85%'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

  }, { scope: container });

  return (
    <div ref={container} className="pt-32 pb-24 px-6 md:px-16 min-h-screen bg-primary overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-20">
          <h1 className="header-elem title-main text-4xl md:text-5xl mb-6 text-textMain">Inversión y Servicios</h1>
          <p className="header-elem text-textSecondary uppercase tracking-widest text-xs max-w-2xl mx-auto leading-relaxed">
            Cada evento y sesión fotográfica es una historia única. Aquí encontrarás un dossier con precios orientativos para cada tipo de cobertura.
          </p>
          <div className="header-elem w-12 h-px bg-accentSecondary mx-auto mt-8"></div>
        </div>

        <div className="mb-24">
          <h2 className="header-elem title-main text-2xl text-textMain mb-12 flex items-center gap-4 border-b border-neutral-100 pb-4">
            <span className="w-8 h-[2px] bg-accentMain"></span>
            Dossier de Tarifas
          </h2>
          
          <div className="grid grid-cols-1 gap-12 md:gap-16">
            {pricingData.map((item, index) => (
              <div key={index} className="pricing-card group flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center p-4 md:p-0 rounded-lg hover:bg-neutral-50 md:hover:bg-transparent transition-colors duration-500">
                
                {/* Espacio para la foto con Parallax Mobile/Desktop */}
                <div className="w-full md:w-5/12 aspect-[4/3] bg-neutral-200 overflow-hidden relative flex-shrink-0 rounded-sm">
                  <div className="absolute inset-0 bg-neutral-300 w-full h-[120%] -top-[10%] img-parallax flex items-center justify-center text-textSecondary text-xs tracking-widest uppercase shadow-inner">
                    Foto de Referencia
                  </div>
                </div>
                
                <div className="w-full md:w-7/12 flex flex-col justify-center pt-2 md:pt-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-4 border-b border-neutral-200 pb-3">
                    <h3 className="font-serif text-2xl md:text-3xl text-textMain group-hover:text-accentMain transition-colors pr-4 leading-tight">{item.title}</h3>
                    <span className="text-accentMain font-medium text-xl md:text-2xl whitespace-nowrap mt-3 sm:mt-0">{item.price}</span>
                  </div>
                  <p className="text-sm md:text-base text-textSecondary font-light leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="extras-reveal">
          <h2 className="title-main text-2xl text-textMain mb-10 flex items-center gap-4">
            <span className="w-8 h-[2px] bg-accentMain"></span>
            Extras y Complementos
          </h2>
          <div className="bg-neutral-50 p-6 md:p-12 border border-accentSecondary/30 rounded-sm">
            {extrasData.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row justify-between md:items-center py-6 border-b border-neutral-200 last:border-0 last:pb-0 first:pt-0">
                <div>
                  <h4 className="font-serif text-xl text-textMain">{item.title}</h4>
                  {item.note && <p className="text-xs text-textSecondary mt-2 italic">{item.note}</p>}
                </div>
                <span className="text-accentMain font-medium text-lg mt-4 md:mt-0 whitespace-nowrap">{item.price}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Pricing;
