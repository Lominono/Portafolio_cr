import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MessageCircle, ShieldCheck, FileText, Clock, ArrowRight } from 'lucide-react';
import { subscribeToAllPhotos } from '../services/photos';
import { 
  subscribeToPricingFeatures, 
  PricingFeaturesConfig, 
  DEFAULT_PRICING_FEATURES 
} from '../services/settings';
import SmartImage from '../components/SmartImage';
import AppleLightbox from '../components/AppleLightbox';

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
    title: 'Sesión individual, retrato y moda', 
    price: '80 € – 150 €', 
    desc: '1 hora de sesión en exterior o localización acordada. Incluye de 10 a 15 fotografías seleccionadas y editadas en alta resolución, entregadas en galería digital privada.',
    layout: 'single',
    sectionId: 'pricing-portrait',
    fallbackId: 'pricing-portrait',
    label: 'Retrato y moda'
  },
  { 
    title: 'Cumpleaños y celebraciones infantiles', 
    price: '100 € – 200 €', 
    desc: 'Cobertura de 2 a 3 horas de fiesta: momentos espontáneos, tarta, juegos y fotos grupales con entrega de galería digital completa en alta definición.',
    layout: 'collage',
    sectionId: 'pricing-birthday',
    fallbackId: 'pricing-events',
    label: 'Cumpleaños'
  },
  { 
    title: 'Fiestas de 15 años y quinceañeras', 
    price: '200 € – 500 €', 
    desc: 'Cobertura completa de la celebración, vals, protocolo familiar y sesión previa o recepción con galería digital privada para compartir con los invitados.',
    layout: 'single',
    sectionId: 'pricing-quince',
    fallbackId: 'pricing-events',
    label: '15 Años'
  },
  { 
    title: 'Bautizos y primeras comuniones', 
    price: '120 € – 220 €', 
    desc: 'Reportaje emotivo de la ceremonia religiosa y sesión exterior posterior de familia, con entrega cuidada de 25 a 40 imágenes en máxima resolución.',
    layout: 'single',
    sectionId: 'pricing-baptism',
    fallbackId: 'pricing-events',
    label: 'Bautizos'
  },
  { 
    title: 'Eventos deportivos y competiciones', 
    price: '150 € – 350 €', 
    desc: 'Cobertura fotográfica de acción a alta velocidad, congelando la intensidad de la competición, la emoción del podio y entrega rápida de galería completa.',
    layout: 'collage',
    sectionId: 'pricing-sports',
    fallbackId: 'pricing-events',
    label: 'Deportes'
  },
  { 
    title: 'Boda civil o ceremonia íntima', 
    price: '250 € – 450 €', 
    desc: 'Cobertura de la ceremonia civil, sesión de pareja en exterior tras el enlace y fotos con familiares y testigos con edición documental.',
    layout: 'single',
    sectionId: 'pricing-wedding-civil',
    fallbackId: 'pricing-wedding',
    label: 'Boda civil'
  },
  { 
    title: 'Boda completa de autor', 
    price: 'Desde 650 €', 
    desc: 'Acompañamiento integral durante toda la jornada: preparativos, ceremonia, banquete, momentos espontáneos y fiesta, con entrega exhaustiva en alta resolución.',
    layout: 'collage',
    sectionId: 'pricing-wedding-full',
    fallbackId: 'pricing-wedding',
    label: 'Boda completa'
  },
  { 
    title: 'Sesiones especiales (pareja, premamá, familia)', 
    price: '100 € – 180 €', 
    desc: 'Sesión íntima de 1 a 1,5 horas en luz dorada exterior o en domicilio, con entrega de 20 a 30 imágenes editadas en detalle.',
    layout: 'single',
    sectionId: 'pricing-special',
    fallbackId: 'pricing-portrait',
    label: 'Sesiones especiales'
  }
];

const extrasData = [
  { title: 'Sesión preboda o postboda independiente', price: '120 € – 180 €' },
  { title: 'Álbum impreso profesional de encuadernación artesanal', price: 'Desde 150 €', note: '* El precio del álbum varía según el formato, número de pliegos y acabados seleccionados.' }
];

const Pricing = () => {
  const container = useRef<HTMLDivElement>(null);
  const [pricingImgs, setPricingImgs] = useState<Record<string, string[]>>({});
  const [features, setFeatures] = useState<PricingFeaturesConfig>(DEFAULT_PRICING_FEATURES);

  // Estado del visor Apple Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxTitles, setLightboxTitles] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (images: string[], index: number, titles?: string[]) => {
    const valid = images.filter(Boolean);
    if (valid.length === 0) return;
    setLightboxImages(valid);
    setLightboxIndex(Math.min(index, valid.length - 1));
    setLightboxTitles(titles || []);
    setLightboxOpen(true);
  };

  useEffect(() => {
    const unsubPhotos = subscribeToAllPhotos((allPhotos) => {
      setPricingImgs(allPhotos);
    });

    const unsubFeatures = subscribeToPricingFeatures((newFeatures) => {
      setFeatures(newFeatures);
    });

    return () => {
      unsubPhotos();
      unsubFeatures();
    };
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
          <span className="header-elem font-serif italic text-accentMain text-base md:text-lg mb-2 block">
            Inversión y colecciones
          </span>
          <h1 className="header-elem font-serif text-4xl sm:text-5xl md:text-6xl mb-4 text-textMain font-normal tracking-[-0.02em]">
            Tarifas de autor
          </h1>
          <p className="header-elem text-textSecondary text-sm md:text-base max-w-lg mx-auto font-sans font-light">
            Propuestas honestas y transparentes para documentar tus instantes más preciados.
          </p>
        </div>

        {/* Listado de Tarifas con Espacios para Fotos */}
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
                    <div className="w-full max-w-[380px] aspect-[3/4] photo-card-secondary relative overflow-hidden group bg-neutral-50 shadow-apple-card">
                      <SmartImage
                        src={imgs[0]}
                        alt={item.title}
                        fallbackLabel={`${item.label} (3:4 Vertical)`}
                        onClick={imgs[0] ? () => openLightbox(imgs, 0, [item.title]) : undefined}
                        className="group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    /* Layout Collage Calibrado al Milímetro: Izquierda 3:4, Derecha dos de 4:3 */
                    <div className="w-full max-w-[560px] flex gap-4 aspect-[10/7]">
                      <div className="w-[54%] h-full photo-card-secondary relative overflow-hidden group bg-neutral-50 shadow-apple-card">
                        <SmartImage
                          src={imgs[0]}
                          alt={`${item.title} 1`}
                          fallbackLabel={`${item.label} (3:4)`}
                          onClick={imgs[0] ? () => openLightbox(imgs, 0, imgs.map((_, i) => `${item.title} - ${i + 1}`)) : undefined}
                          className="group-hover:scale-105"
                        />
                      </div>
                      <div className="w-[46%] h-full flex flex-col gap-4">
                        <div className="h-[calc(50%-8px)] w-full photo-card-secondary relative overflow-hidden group bg-neutral-50 shadow-apple-card">
                          <SmartImage
                            src={imgs[1]}
                            alt={`${item.title} 2`}
                            fallbackLabel="Detalle (4:3)"
                            onClick={imgs[1] ? () => openLightbox(imgs, 1, imgs.map((_, i) => `${item.title} - ${i + 1}`)) : undefined}
                            className="group-hover:scale-105"
                          />
                        </div>
                        <div className="h-[calc(50%-8px)] w-full photo-card-secondary relative overflow-hidden group bg-neutral-50 shadow-apple-card">
                          <SmartImage
                            src={imgs[2]}
                            alt={`${item.title} 3`}
                            fallbackLabel="Momento (4:3)"
                            onClick={imgs[2] ? () => openLightbox(imgs, 2, imgs.map((_, i) => `${item.title} - ${i + 1}`)) : undefined}
                            className="group-hover:scale-105"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lado de Texto Editorial */}
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <h2 className="title-main text-2xl md:text-3xl text-textMain mb-2 leading-tight">
                    {item.title}
                  </h2>
                  <div className="text-accentMain font-serif text-xl md:text-2xl mb-4 font-normal">
                    {item.price}
                  </div>
                  <p className="text-textSecondary font-sans font-light leading-relaxed mb-6 text-sm md:text-base">
                    {item.desc}
                  </p>

                  {/* Características de servicio dinámicas según configuración en tiempo real */}
                  {(features.showImageEditing || features.showPrivateGallery || features.showHighRes) && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-textSecondary font-sans font-light mb-8 animate-fade-in">
                      {features.showImageEditing && <span>✓ Edición de imagen</span>}
                      {features.showPrivateGallery && <span>✓ Galería privada</span>}
                      {features.showHighRes && <span>✓ Entrega en alta resolución</span>}
                    </div>
                  )}

                  <div>
                    <a 
                      href={createWhatsAppLink(item.title, item.price)}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="min-h-[44px] px-6 rounded-apple-btn bg-accentMain text-white text-xs font-sans inline-flex items-center justify-center gap-2 shadow-apple-subtle hover:bg-[#9C7A63] transition-all duration-300 active:scale-95"
                    >
                      <MessageCircle size={15} />
                      <span>Consultar disponibilidad</span>
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
            <h2 className="title-main text-2xl md:text-3xl text-textMain mb-3">Servicios y acabados adicionales</h2>
            <p className="text-sm text-textSecondary font-sans font-light">Opciones para enriquecer tu reportaje o preservar tus recuerdos en soporte físico.</p>
          </div>
          
          <div className="apple-card p-8 md:p-12 rounded-apple-card border border-black/[0.06] shadow-apple-card">
            {extrasData.map((extra, index) => (
              <div key={index} className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b border-black/[0.06] last:border-0 border-dashed first:pt-0 last:pb-0">
                <div className="mb-3 md:mb-0">
                  <h3 className="title-main text-base text-textMain">{extra.title}</h3>
                </div>
                <span className="font-serif text-base text-accentMain md:ml-4 whitespace-nowrap">
                  {extra.price}
                </span>
              </div>
            ))}
            <div className="mt-8 text-center md:text-left">
              <p className="text-xs text-textSecondary font-sans italic">
                 * El precio del álbum varía según el formato, número de pliegos y acabados seleccionados.
              </p>
            </div>
          </div>
        </div>

        {/* Condiciones y Políticas de Reserva */}
        <div className="policies-reveal max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="title-main text-2xl md:text-3xl text-textMain mb-3">
              Condiciones de contratación y reserva
            </h2>
            <p className="text-sm text-textSecondary font-sans font-light max-w-lg mx-auto leading-relaxed">
              Un marco claro y transparente para garantizar exclusividad y tranquilidad absoluta en tu fecha.
            </p>
          </div>

          {/* Cuadrícula de Condiciones Limpias (Sin números 01/02/03 falsos ni etiquetas repetitivas) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tarjeta 1: Reserva y Adelanto */}
            <div className="apple-card p-6 rounded-apple-card border border-black/[0.06] shadow-apple-card flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-apple-btn bg-accentMain/10 text-accentMain flex items-center justify-center shadow-sm mb-4">
                  <ShieldCheck size={20} />
                </div>

                <h3 className="title-main text-base text-textMain mb-1">
                  75% de adelanto
                </h3>
                <span className="text-xs text-accentMain font-serif italic block mb-3">
                  Bloqueo exclusivo de agenda
                </span>

                <p className="text-xs text-textSecondary font-sans font-light leading-relaxed">
                  Asegura tu fecha en exclusividad sin solapamientos. Tu reserva formaliza el compromiso y la preparación técnica previa del reportaje.
                </p>
              </div>
            </div>

            {/* Tarjeta 2: Cancelaciones */}
            <div className="apple-card p-6 rounded-apple-card border border-black/[0.06] shadow-apple-card flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-apple-btn bg-accentMain/10 text-accentMain flex items-center justify-center shadow-sm mb-4">
                  <FileText size={20} />
                </div>

                <h3 className="title-main text-base text-textMain mb-1">
                  Reserva de agenda
                </h3>
                <span className="text-xs text-accentMain font-serif italic block mb-3">
                  Exclusividad garantizada
                </span>

                <p className="text-xs text-textSecondary font-sans font-light leading-relaxed">
                  El anticipo compensa la renuncia a otros encargos en la misma fecha. Si surge una causa de fuerza mayor debidamente justificada, evaluamos conjuntamente una alternativa.
                </p>
              </div>
            </div>

            {/* Tarjeta 3: Flexibilidad 5 días */}
            <div className="apple-card p-6 rounded-apple-card border border-black/[0.06] shadow-apple-card flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-apple-btn bg-accentMain/10 text-accentMain flex items-center justify-center shadow-sm mb-4">
                  <Clock size={20} />
                </div>

                <h3 className="title-main text-base text-textMain mb-1">
                  5 días de preaviso
                </h3>
                <span className="text-xs text-accentMain font-serif italic block mb-3">
                  Reprogramación flexible
                </span>

                <p className="text-xs text-textSecondary font-sans font-light leading-relaxed">
                  Puedes solicitar cambio de fecha con al menos 5 días de margen, quedando sujeto a la disponibilidad del calendario sin penalizaciones adicionales.
                </p>
              </div>
            </div>

          </div>

          {/* Sello de Confianza y Calidad */}
          <div className="mt-8 apple-glass p-6 rounded-apple-card border border-black/[0.08] shadow-apple-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-textSecondary font-sans font-light text-center sm:text-left">
              <strong className="text-textMain font-normal">Compromiso Cristian Espinola:</strong> Presupuestos cerrados y transparentes, sin costes ocultos ni sorpresas de última hora.
            </p>

            <Link
              to="/contacto"
              className="inline-flex items-center gap-1.5 text-xs text-textMain font-sans hover:text-accentMain transition-colors shrink-0 border-b border-accentMain pb-0.5"
            >
              <span>Consultar disponibilidad</span>
              <ArrowRight size={13} />
            </Link>
          </div>

        </div>

      </div>

      {/* Visor Lightbox Nativo de Fotografía */}
      <AppleLightbox
        isOpen={lightboxOpen}
        images={lightboxImages}
        currentIndex={lightboxIndex}
        titles={lightboxTitles}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />

    </div>
  );
};

export default Pricing;
