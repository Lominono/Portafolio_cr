import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import { subscribeToAllPhotos } from '../services/photos';

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

  useEffect(() => {
    // Suscripción en tiempo real a Firebase Firestore
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
    gsap.from('.hero-elem', {
      y: 30,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power2.out',
      delay: 0.1
    });

    const revealElements = gsap.utils.toArray('.scroll-reveal');
    revealElements.forEach((el: any) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play reverse play reverse',
        },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
      });
    });

    gsap.from('.service-card', {
      scrollTrigger: {
        trigger: '.services-container',
        start: 'top 80%',
        toggleActions: 'play reverse play reverse',
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
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

  return (
    <div ref={container} className="pt-20 bg-primary">
      
      {/* Hero Section */}
      <section className="pt-32 pb-24 md:pt-48 md:pb-40 px-6 md:px-16 flex flex-col items-center text-center">
        <h1 className="hero-elem title-main text-4xl md:text-6xl text-textMain mb-8 leading-tight">
          CRISTIAN ESPINOLA<br /><span className="text-2xl md:text-4xl text-accentMain mt-4 block">FOTOGRAFÍA DOCUMENTAL</span>
        </h1>
        <p className="hero-elem text-textSecondary max-w-lg mx-auto mb-12 font-sans font-light leading-relaxed">
          Un enfoque íntimo y profesional para capturar la esencia de tus momentos más importantes.
        </p>
        <div className="hero-elem flex flex-col sm:flex-row items-center gap-6">
          <Link to="/tarifas" className="btn-primary">
            VER TARIFAS Y SERVICIOS
          </Link>
          <a 
            href="https://wa.me/34640646963"
            target="_blank" 
            rel="noopener noreferrer"
            className="text-textMain uppercase tracking-widest text-xs font-sans border-b border-accentMain pb-1 hover:text-accentMain transition-colors"
          >
            CONTACTAR POR WHATSAPP
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6 md:px-16 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 border-t border-neutral-100">
        <div className="w-full md:w-1/2 aspect-[3/4] photo-card-secondary relative scroll-reveal bg-neutral-50 flex items-center justify-center overflow-hidden group">
          {aboutImg ? (
            <img 
              src={aboutImg} 
              alt="Retrato Cristian" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <span className="w-8 h-px bg-accentMain mb-3"></span>
              <span className="text-textSecondary uppercase tracking-widest text-xs font-sans">Retrato de Cristian</span>
            </div>
          )}
        </div>
        
        <div className="w-full md:w-1/2 scroll-reveal">
          <h2 className="title-main text-3xl md:text-4xl text-textMain mb-8">SOBRE MÍ</h2>
          <p className="text-textSecondary font-sans font-light leading-relaxed mb-6">
            Hola, soy <strong className="font-normal text-textMain">Cristian Espinola</strong>. Mi pasión es contar historias a través de imágenes auténticas y atemporales. Creo firmemente que cada persona, pareja o evento tiene una narrativa única que merece ser preservada con el mayor cuidado y sentido estético.
          </p>
          <p className="text-textSecondary font-sans font-light leading-relaxed mb-10">
            Mi estilo se define por ser natural, poco invasivo y altamente enfocado en los detalles. Busco esos momentos genuinos que ocurren entre posados, las sonrisas sinceras y las miradas que hablan por sí solas.
          </p>
          <Link 
            to="/sobre-mi" 
            className="text-textMain uppercase tracking-widest text-xs font-sans border-b border-accentMain pb-1 hover:text-accentMain transition-colors inline-block"
          >
            CONOCE MÁS SOBRE MI TRABAJO
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-6 md:px-16 border-t border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="title-main text-3xl md:text-4xl text-textMain mb-6">ESPECIALIDADES</h2>
            <div className="w-12 h-px bg-accentMain mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 services-container">
            {servicesCategories.map((srv, i) => {
              const srvImg = getServiceImage(srv);

              return (
                <Link key={i} to="/tarifas" className="service-card group cursor-pointer block">
                  <div className="aspect-[4/5] mb-6 photo-card-secondary bg-neutral-50 flex items-center justify-center relative overflow-hidden">
                    {srvImg ? (
                      <img 
                        src={srvImg} 
                        alt={srv.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <span className="w-6 h-px bg-accentMain mb-2"></span>
                        <span className="text-textSecondary uppercase tracking-widest text-[10px] font-sans">
                          {srv.title}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="title-main text-lg text-textMain mb-3 group-hover:text-accentMain transition-colors text-center">
                    {srv.title}
                  </h3>
                  <p className="text-sm text-textSecondary font-sans font-light leading-relaxed text-center">
                    {srv.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portfolio Highlight (4 slots fijos) */}
      <section className="py-24 px-6 md:px-16 max-w-6xl mx-auto border-t border-neutral-100 scroll-reveal">
        <div className="text-center mb-16">
          <h2 className="title-main text-3xl md:text-4xl text-textMain mb-6">PORTAFOLIO</h2>
          <div className="w-12 h-px bg-accentMain mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 portfolio-grid mb-12">
          {/* Foto 1 (Apaisada 16:9) */}
          <div className="md:col-span-2 aspect-[16/9] photo-card-secondary bg-neutral-50 flex items-center justify-center overflow-hidden group">
            {portfolioImgs[0] ? (
              <img 
                src={portfolioImgs[0]} 
                alt="Portafolio 1" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            ) : (
              <span className="text-textSecondary uppercase tracking-widest text-[10px] font-sans">Foto 1 (16:9)</span>
            )}
          </div>
          {/* Foto 2 (Vertical 3:4) */}
          <div className="aspect-[3/4] photo-card-secondary bg-neutral-50 flex items-center justify-center overflow-hidden group">
            {portfolioImgs[1] ? (
              <img 
                src={portfolioImgs[1]} 
                alt="Portafolio 2" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            ) : (
              <span className="text-textSecondary uppercase tracking-widest text-[10px] font-sans">Foto 2 (3:4)</span>
            )}
          </div>
          {/* Foto 3 (Vertical 3:4) */}
          <div className="aspect-[3/4] photo-card-secondary bg-neutral-50 flex items-center justify-center overflow-hidden group">
            {portfolioImgs[2] ? (
              <img 
                src={portfolioImgs[2]} 
                alt="Portafolio 3" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            ) : (
              <span className="text-textSecondary uppercase tracking-widest text-[10px] font-sans">Foto 3 (3:4)</span>
            )}
          </div>
          {/* Foto 4 (Apaisada 16:9) */}
          <div className="md:col-span-2 aspect-[16/9] photo-card-secondary bg-neutral-50 flex items-center justify-center overflow-hidden group">
            {portfolioImgs[3] ? (
              <img 
                src={portfolioImgs[3]} 
                alt="Portafolio 4" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            ) : (
              <span className="text-textSecondary uppercase tracking-widest text-[10px] font-sans">Foto 4 (16:9)</span>
            )}
          </div>
        </div>
        
        <div className="text-center">
          <a 
            href="https://www.instagram.com/espinolafotos/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-textMain uppercase tracking-widest text-xs font-sans border-b border-accentMain pb-1 hover:text-accentMain transition-colors"
          >
            VER MÁS EN INSTAGRAM
          </a>
        </div>
      </section>

    </div>
  );
};

export default Home;
