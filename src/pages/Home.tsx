import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const servicesCategories = [
  { title: 'Bodas & Enlaces', desc: 'Documentando el día más importante de tu vida con un enfoque narrativo y elegante.' },
  { title: 'Retrato & Moda', desc: 'Sesiones individuales diseñadas para resaltar tu esencia natural y estilo.' },
  { title: 'Eventos & Celebraciones', desc: 'Desde XV años hasta eventos familiares, capturando la alegría compartida.' },
  { title: 'Deportes', desc: 'Congelando la acción y la pasión del momento en alta resolución.' }
];

const Home = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animación de entrada Hero
    gsap.from('.hero-elem', {
      y: 50,
      opacity: 0,
      duration: 1.5,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.1
    });

    // Revelado de textos y bloques generales (muy fluido en móvil)
    const revealElements = gsap.utils.toArray('.scroll-reveal');
    revealElements.forEach((el: any) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%', // Se activa cuando el elemento está al 85% de la pantalla
          toggleActions: 'play none none reverse', // Si subes, se oculta para volver a animar al bajar
        },
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      });
    });

    // Animación escalonada para las tarjetas de servicios
    gsap.from('.service-card', {
      scrollTrigger: {
        trigger: '.services-container',
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // Parallax muy sutil para las fotos (le da un toque premium brutal en móvil)
    const parallaxImages = gsap.utils.toArray('.img-parallax');
    parallaxImages.forEach((img: any) => {
      gsap.fromTo(img, 
        { y: -20, scale: 1.05 },
        {
          y: 20,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true // La animación sigue exactamente el movimiento del dedo/scroll
          }
        }
      );
    });

  }, { scope: container });

  return (
    <div ref={container} className="pt-20">
      {/* Hero Section */}
      <section className="pt-24 pb-20 md:pt-32 md:pb-32 px-6 md:px-16 flex flex-col items-center text-center overflow-hidden">
        <span className="hero-elem text-accentSecondary uppercase tracking-widest text-xs mb-6 font-medium">Fotografía Artística & Documental</span>
        <h1 className="hero-elem title-main text-5xl md:text-7xl lg:text-8xl text-textMain mb-8 leading-tight">
          Crea Recuerdos<br /><span className="italic font-serif text-accentMain normal-case font-light">que perduran</span>
        </h1>
        <p className="hero-elem text-textSecondary max-w-lg mx-auto mb-12 font-light leading-relaxed">
          Un enfoque íntimo y profesional para capturar la esencia de tus momentos más importantes.
        </p>
        <div className="hero-elem">
          <Link to="/tarifas" className="btn-primary inline-flex items-center gap-2">
            Ver Tarifas y Servicios <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16 overflow-hidden">
        <div className="w-full md:w-1/2 aspect-[3/4] photo-card-secondary relative overflow-hidden scroll-reveal">
          {/* Contenedor de la foto con efecto parallax interno */}
          <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center text-textSecondary text-sm uppercase tracking-widest img-parallax w-full h-[120%] -top-[10%]">
            Foto de Cristian
          </div>
          <div className="absolute bottom-4 left-4 right-4 bg-primary/80 backdrop-blur-md p-4 text-center border border-accentSecondary/50">
            <span className="title-main text-sm text-textMain">Cristian Espinola</span>
          </div>
        </div>
        <div className="w-full md:w-1/2 scroll-reveal">
          <h2 className="title-main text-3xl md:text-5xl text-textMain mb-8">La luz detrás<br/>de la cámara</h2>
          <p className="text-textSecondary font-light leading-relaxed mb-6">
            Hola, soy <strong className="font-medium text-textMain">Cristian Espinola</strong>. Mi pasión es contar historias a través de imágenes auténticas y atemporales. Creo firmemente que cada persona, pareja o evento tiene una narrativa única que merece ser preservada con el mayor cuidado y sentido estético.
          </p>
          <p className="text-textSecondary font-light leading-relaxed mb-10">
            Mi estilo se define por ser natural, poco invasivo y altamente enfocado en los detalles. Busco esos momentos genuinos que ocurren entre posados, las sonrisas sinceras y las miradas que hablan por sí solas.
          </p>
          <a href="https://wa.me/34640646963" target="_blank" rel="noopener noreferrer" className="inline-block border-b border-accentMain text-textMain uppercase tracking-widest text-sm pb-1 hover:text-accentMain transition-colors">
            Trabajemos juntos
          </a>
        </div>
      </section>

      {/* Services / Tipos de Trabajo */}
      <section className="bg-neutral-50 py-24 px-6 md:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <span className="text-accentSecondary uppercase tracking-widest text-xs mb-4 block">Especialidades</span>
            <h2 className="title-main text-3xl md:text-4xl text-textMain">Tipos de Trabajo</h2>
            <div className="w-12 h-px bg-accentMain mx-auto mt-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 services-container">
            {servicesCategories.map((srv, i) => (
              <div key={i} className="group cursor-pointer service-card">
                <div className="aspect-square bg-neutral-200 mb-6 relative overflow-hidden flex items-center justify-center text-textSecondary text-xs tracking-widest uppercase">
                  <div className="absolute inset-0 bg-neutral-300 w-full h-[120%] -top-[10%] img-parallax transition-transform duration-700 group-hover:scale-110" />
                  <span className="z-10 relative">Foto Ref</span>
                </div>
                <h3 className="title-main text-lg text-textMain mb-3 group-hover:text-accentMain transition-colors">{srv.title}</h3>
                <p className="text-sm text-textSecondary font-light leading-relaxed">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Highlight */}
      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 scroll-reveal gap-4">
          <div>
            <h2 className="title-main text-3xl md:text-4xl text-textMain mb-2">Selección Exclusiva</h2>
            <p className="text-textSecondary font-light">Una muestra de mis momentos favoritos.</p>
          </div>
          <a href="https://www.instagram.com/espinolafotos/" target="_blank" rel="noopener noreferrer" className="border-b border-accentMain text-textMain uppercase tracking-widest text-sm pb-1 hover:text-accentMain transition-colors self-start md:self-auto">
            Ver más en Instagram
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 portfolio-grid">
          <div className="md:col-span-2 aspect-[16/9] md:aspect-auto min-h-[300px] bg-neutral-200 photo-card-secondary scroll-reveal overflow-hidden relative">
            <div className="absolute inset-0 bg-neutral-300 w-full h-[120%] -top-[10%] img-parallax" />
          </div>
          <div className="aspect-[4/5] md:aspect-[3/4] bg-neutral-300 photo-card-secondary scroll-reveal overflow-hidden relative">
             <div className="absolute inset-0 bg-neutral-400 w-full h-[120%] -top-[10%] img-parallax" />
          </div>
          <div className="aspect-[4/5] md:aspect-[3/4] bg-neutral-200 photo-card-secondary scroll-reveal overflow-hidden relative">
             <div className="absolute inset-0 bg-neutral-300 w-full h-[120%] -top-[10%] img-parallax" />
          </div>
          <div className="md:col-span-2 aspect-[16/9] md:aspect-auto min-h-[300px] bg-neutral-300 photo-card-secondary scroll-reveal overflow-hidden relative">
             <div className="absolute inset-0 bg-neutral-400 w-full h-[120%] -top-[10%] img-parallax" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
