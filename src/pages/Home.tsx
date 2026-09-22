import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { subscribeToAllPhotos } from '../services/photos';
import SmartImage from '../components/SmartImage';
import AppleLightbox from '../components/AppleLightbox';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ServiceCategory {
  title: string;
  desc: string;
  primaryKey: string;
  fallbackKeys: string[];
}

const servicesCategories: ServiceCategory[] = [
  { 
    title: 'Bodas & Enlaces', 
    desc: 'Documentando el día más importante de tu vida con un enfoque narrativo y elegante.',
    primaryKey: 'home-services-wedding',
    fallbackKeys: ['pricing-wedding-full', 'pricing-wedding-civil']
  },
  { 
    title: 'Retrato & Moda', 
    desc: 'Sesiones individuales diseñadas para resaltar tu esencia natural y estilo.',
    primaryKey: 'home-services-portrait',
    fallbackKeys: ['pricing-portrait', 'about-main']
  },
  { 
    title: 'Eventos & Celebraciones', 
    desc: 'Desde XV años hasta eventos familiares, capturando la alegría compartida.',
    primaryKey: 'home-services-events',
    fallbackKeys: ['pricing-birthday', 'pricing-quince', 'pricing-baptism']
  },
  { 
    title: 'Deportes', 
    desc: 'Congelando la acción y la pasión del momento en alta resolución.',
    primaryKey: 'home-services-sports',
    fallbackKeys: ['pricing-sports']
  }
];

const Home = () => {
  const container = useRef<HTMLDivElement>(null);
  const [aboutImg, setAboutImg] = useState<string | null>(null);
  const [portfolioImgs, setPortfolioImgs] = useState<string[]>([]);
  const [photosMap, setPhotosMap] = useState<Record<string, string[]>>({});

  // Estado del visor Apple Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxTitles, setLightboxTitles] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (images: string[], index: number, titles?: string[]) => {
    const validImages = images.filter(Boolean);
    if (validImages.length === 0) return;
    setLightboxImages(validImages);
    setLightboxIndex(Math.min(index, validImages.length - 1));
    setLightboxTitles(titles || []);
    setLightboxOpen(true);
  };

  useEffect(() => {
    // Suscripción en tiempo real a Firebase Firestore con caché resiliente
    const unsubscribe = subscribeToAllPhotos((allPhotos) => {
      setPhotosMap(allPhotos);

      // Retrato Sobre Mí
      const about = (allPhotos['home-about'] && allPhotos['home-about'][0]) || 
                    (allPhotos['about-main'] && allPhotos['about-main'][0]) || null;
      setAboutImg(about);

      // Galería de Portafolio
      const portfolio = allPhotos['home-portfolio'] || [];
      setPortfolioImgs(portfolio);
    });

    return () => unsubscribe();
  }, []);

  useGSAP(() => {
    // 1. Entrada suave de elementos Hero
    gsap.from('.hero-elem', {
      y: 28,
      opacity: 0,
      duration: 1,
      stagger: 0.12,
      ease: 'power2.out',
      delay: 0.1,
      clearProps: 'all'
    });

    // 2. Revelado suave y estable para textos en móvil
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

    // 3. Animación elegante de líneas divisoras en bronce
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

    // 4. Tarjetas de especialidades escalonadas
    gsap.from('.service-card', {
      scrollTrigger: {
        trigger: '.services-container',
        start: 'top 85%',
        once: true,
      },
      y: 24,
      opacity: 0,
      duration: 0.75,
      stagger: 0.1,
      ease: 'power2.out',
      clearProps: 'all'
    });

    // 5. Entrada refinada para tarjetas del portafolio
    const portfolioCards = gsap.utils.toArray('.portfolio-card-anim');
    portfolioCards.forEach((card: any, idx: number) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          once: true,
        },
        y: 28,
        opacity: 0,
        scale: 0.98,
        duration: 0.8,
        delay: (idx % 2) * 0.1,
        ease: 'power2.out',
        clearProps: 'all'
      });
    });
  }, { scope: container });

  const getServiceImage = (srv: ServiceCategory): string | null => {
    if (photosMap[srv.primaryKey]?.length) {
      return photosMap[srv.primaryKey][0];
    }
    for (const fb of srv.fallbackKeys) {
      if (photosMap[fb]?.length) {
        return photosMap[fb][0];
      }
    }
    return null;
  };

  const portfolioTitles = [
    'Fotografía documental y narrativa',
    'Retrato y luz natural',
    'Momentos espontáneos',
    'Detalles de autor'
  ];

  return (
    <div ref={container} className="pt-20 bg-primary">
      
      {/* Hero Section Editorial con Fotografía Protagonista */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-28 px-6 md:px-16 flex flex-col items-center text-center max-w-5xl mx-auto">
        <span className="hero-elem font-serif italic text-accentMain text-base md:text-lg mb-3 block">
          Fotografía documental de autor
        </span>
        <h1 className="hero-elem font-serif text-4xl sm:text-6xl md:text-7xl text-textMain mb-6 font-normal tracking-[-0.02em]">
          Cristian Espinola
        </h1>
        
        <p className="hero-elem text-textSecondary max-w-xl mx-auto mb-10 font-sans font-light leading-relaxed text-sm md:text-base">
          Capturando la belleza espontánea de tus momentos más valiosos con luz natural, discreción y una mirada sobria que resiste el paso del tiempo.
        </p>

        <div className="hero-elem flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Link to="/tarifas" className="btn-primary">
            Ver tarifas y colecciones
          </Link>
          <a 
            href="https://wa.me/34640646963"
            target="_blank" 
            rel="noopener noreferrer"
            className="min-h-[44px] px-6 rounded-apple-btn border border-black/[0.12] text-textMain text-xs font-sans inline-flex items-center justify-center gap-2 hover:bg-black/[0.03] hover:border-accentMain/40 transition-all duration-300 active:scale-95 shadow-sm"
          >
            <MessageCircle size={15} className="text-accentMain" />
            <span>Escribir por WhatsApp</span>
          </a>
        </div>

        {/* Portada Cinemática Hero (Fotografía Central) */}
        <div className="hero-elem w-full aspect-[16/9] md:aspect-[21/9] rounded-apple-card overflow-hidden shadow-apple-card border border-black/[0.06] bg-neutral-50 relative group">
          <SmartImage
            src={portfolioImgs[0] || aboutImg}
            alt="Fotografía documental Cristian Espinola"
            fallbackLabel="Fotografía documental de autor"
            onClick={(portfolioImgs[0] || aboutImg) ? () => openLightbox([portfolioImgs[0] || aboutImg || ''], 0, ['Fotografía documental de autor']) : undefined}
            className="group-hover:scale-105"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6 md:px-16 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 border-t border-black/[0.06]">
        <div className="w-full md:w-1/2 aspect-[3/4] photo-card-secondary relative scroll-reveal bg-neutral-50 overflow-hidden group shadow-apple-card">
          <SmartImage
            src={aboutImg}
            alt="Retrato de Cristian Espinola"
            fallbackLabel="Retrato de Cristian"
            onClick={aboutImg ? () => openLightbox([aboutImg], 0, ['Retrato de Cristian Espinola']) : undefined}
            className="group-hover:scale-105"
          />
        </div>
        
        <div className="w-full md:w-1/2 scroll-reveal">
          <h2 className="title-main text-3xl md:text-4xl text-textMain mb-6">Sobre mí</h2>
          <p className="text-textSecondary font-sans font-light leading-relaxed mb-6 text-sm md:text-base">
            Hola, soy <strong className="font-normal text-textMain">Cristian Espinola</strong>. Mi pasión es contar historias a través de imágenes auténticas y atemporales. Creo firmemente que cada persona, pareja o evento tiene una narrativa única que merece ser preservada con el mayor cuidado y sentido estético.
          </p>
          <p className="text-textSecondary font-sans font-light leading-relaxed mb-8 text-sm md:text-base">
            Mi estilo se define por ser natural, poco invasivo y altamente enfocado en los detalles. Busco esos momentos genuinos que ocurren entre posados, las sonrisas sinceras y las miradas que hablan por sí solas.
          </p>
          <Link 
            to="/sobre-mi" 
            className="min-h-[44px] px-6 rounded-apple-btn border border-accentMain/30 text-accentMain text-xs font-sans inline-flex items-center justify-center gap-2 hover:bg-accentMain hover:text-white transition-all duration-300 active:scale-95 shadow-sm"
          >
            <span>Conocer más sobre mi trabajo</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Services / Disciplinas Fotográficas */}
      <section className="py-24 px-6 md:px-16 border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="title-main text-3xl md:text-4xl text-textMain mb-3">Disciplinas fotográficas</h2>
            <p className="text-sm text-textSecondary font-sans font-light max-w-md mx-auto">
              Cada sesión está diseñada con un ritmo natural, respetando la atmósfera del lugar.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 services-container">
            {servicesCategories.map((srv, i) => {
              const srvImg = getServiceImage(srv);

              return (
                <Link 
                  key={i} 
                  to="/tarifas" 
                  className="service-card group cursor-pointer block transition-all duration-300"
                >
                  <div className="aspect-[4/5] mb-5 rounded-apple-card overflow-hidden relative bg-neutral-50 border border-black/[0.06] shadow-apple-subtle">
                    <SmartImage
                      src={srvImg}
                      alt={srv.title}
                      fallbackLabel={srv.title}
                      expandable={false}
                      className="group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  <h3 className="title-main text-lg text-textMain mb-2 group-hover:text-accentMain transition-colors text-center">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-textSecondary font-sans font-light leading-relaxed text-center px-2">
                    {srv.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portfolio Highlight */}
      <section className="py-24 px-6 md:px-16 max-w-6xl mx-auto border-t border-black/[0.06] scroll-reveal">
        <div className="text-center mb-16">
          <h2 className="title-main text-3xl md:text-4xl text-textMain mb-3">Colección destacada</h2>
          <p className="text-sm text-textSecondary font-sans font-light">
            Haz clic en cualquier imagen para abrirla en alta resolución
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 portfolio-grid mb-12">
          {/* Foto 1 (Apaisada 16:9) */}
          <div className="md:col-span-2 aspect-[16/9] photo-card-secondary bg-neutral-50 overflow-hidden group portfolio-card-anim shadow-apple-card">
            <SmartImage
              src={portfolioImgs[0]}
              alt={portfolioTitles[0]}
              fallbackLabel="Portafolio Documental"
              onClick={portfolioImgs[0] ? () => openLightbox(portfolioImgs, 0, portfolioTitles) : undefined}
              className="group-hover:scale-105"
            />
          </div>
          
          {/* Foto 2 (Vertical 3:4) */}
          <div className="aspect-[3/4] photo-card-secondary bg-neutral-50 overflow-hidden group portfolio-card-anim shadow-apple-card">
            <SmartImage
              src={portfolioImgs[1]}
              alt={portfolioTitles[1]}
              fallbackLabel="Retrato y luz natural"
              onClick={portfolioImgs[1] ? () => openLightbox(portfolioImgs, 1, portfolioTitles) : undefined}
              className="group-hover:scale-105"
            />
          </div>
          
          {/* Foto 3 (Vertical 3:4) */}
          <div className="aspect-[3/4] photo-card-secondary bg-neutral-50 overflow-hidden group portfolio-card-anim shadow-apple-card">
            <SmartImage
              src={portfolioImgs[2]}
              alt={portfolioTitles[2]}
              fallbackLabel="Momentos espontáneos"
              onClick={portfolioImgs[2] ? () => openLightbox(portfolioImgs, 2, portfolioTitles) : undefined}
              className="group-hover:scale-105"
            />
          </div>
          
          {/* Foto 4 (Apaisada 16:9) */}
          <div className="md:col-span-2 aspect-[16/9] photo-card-secondary bg-neutral-50 overflow-hidden group portfolio-card-anim shadow-apple-card">
            <SmartImage
              src={portfolioImgs[3]}
              alt={portfolioTitles[3]}
              fallbackLabel="Detalles de autor"
              onClick={portfolioImgs[3] ? () => openLightbox(portfolioImgs, 3, portfolioTitles) : undefined}
              className="group-hover:scale-105"
            />
          </div>
        </div>
        
        <div className="text-center">
          <a 
            href="https://www.instagram.com/espinolafotos/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="min-h-[44px] px-8 rounded-apple-btn border border-black/[0.12] text-textMain text-xs font-sans inline-flex items-center justify-center hover:bg-black/[0.03] hover:border-accentMain/40 transition-all duration-300 active:scale-95 shadow-sm"
          >
            Explorar más en Instagram
          </a>
        </div>
      </section>

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

export default Home;
