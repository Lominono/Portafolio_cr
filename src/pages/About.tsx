import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const About = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animación de entrada inicial
    gsap.from('.header-elem', {
      y: 40,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power2.out',
    });

    // Animaciones reversibles (hacia abajo y hacia arriba)
    const revealElements = gsap.utils.toArray('.scroll-reveal');
    revealElements.forEach((el: any) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play reverse play reverse',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
      });
    });

    // Efecto Parallax en las fotos
    const parallaxImages = gsap.utils.toArray('.img-parallax');
    parallaxImages.forEach((img: any) => {
      gsap.fromTo(img, 
        { y: -30 },
        {
          y: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true 
          }
        }
      );
    });
  }, { scope: container });

  return (
    <div ref={container} className="pt-32 pb-24 px-6 md:px-16 min-h-screen bg-primary">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabecera */}
        <div className="text-center mb-20 md:mb-32">
          <h1 className="header-elem title-main text-4xl md:text-5xl mb-6 text-textMain">
            SOBRE MÍ
          </h1>
          <p className="header-elem text-textSecondary uppercase tracking-widest text-xs font-sans">
            La mirada detrás de la lente
          </p>
          <div className="header-elem w-12 h-px bg-accentMain mx-auto mt-8"></div>
        </div>

        {/* Sección Principal: Retrato e Introducción */}
        <div className="flex flex-col md:flex-row gap-16 items-center mb-32">
          <div className="w-full md:w-1/2 aspect-[3/4] photo-card-secondary bg-neutral-50 overflow-hidden relative header-elem flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-100 opacity-50 img-parallax h-[120%] -top-[10%] w-full"></div>
            <span className="text-textSecondary uppercase tracking-widest text-xs font-sans relative z-10 text-center px-4">
              Foto de Cristian<br/>(Retrato Principal)
            </span>
          </div>
          
          <div className="w-full md:w-1/2">
            <h2 className="title-main text-2xl text-textMain mb-8 scroll-reveal">
              HOLA, SOY CRISTIAN ESPINOLA
            </h2>
            <div className="flex flex-col gap-6">
              <p className="text-textSecondary font-sans font-light leading-relaxed scroll-reveal text-sm md:text-base">
                Mi acercamiento a la fotografía nació de una necesidad profunda de detener el tiempo. Creo que cada persona tiene una luz única y mi propósito es capturarla de la forma más honesta posible. No busco la perfección artificial, sino la belleza real de los instantes que compartimos.
              </p>
              <p className="text-textSecondary font-sans font-light leading-relaxed scroll-reveal text-sm md:text-base">
                Me especializo en fotografía documental de bodas y retratos porque encuentro en las conexiones humanas la fuente de inspiración más inagotable. Huyo de las poses forzadas; prefiero ser un observador discreto que documenta la autenticidad del momento: una lágrima de emoción, una carcajada compartida o esa mirada de complicidad que lo dice absolutamente todo.
              </p>
              <p className="text-textSecondary font-sans font-light leading-relaxed scroll-reveal text-sm md:text-base">
                El trabajo de un fotógrafo no termina al pulsar el disparador. Dedico horas a la selección y edición meticulosa de cada imagen, asegurándome de que los colores, la luz y el contraste reflejen la atmósfera exacta de ese día. Mi objetivo final es entregarte un legado visual que gane valor con el paso de los años.
              </p>
            </div>
          </div>
        </div>

        {/* Gran Cita Tipográfica */}
        <div className="py-20 mb-32 border-y border-neutral-100 text-center px-4 scroll-reveal">
          <h3 className="title-main text-2xl md:text-4xl text-textMain leading-tight mx-auto max-w-3xl">
            "NO FOTOGRAFÍO LO QUE VEO, <span className="text-accentMain italic">FOTOGRAFÍO LO QUE SIENTO</span> CUANDO ESTOY ALLÍ."
          </h3>
        </div>

        {/* Sección de Texto de Prueba Ampliado (Biografía o Enfoque) */}
        <div className="mb-32">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="title-main text-2xl text-textMain mb-4">MI HISTORIA Y ENFOQUE</h2>
            <div className="w-8 h-px bg-accentMain mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 scroll-reveal">
            <div>
              <h4 className="title-main text-sm text-textMain mb-4">EL ORIGEN DE LA PASIÓN</h4>
              <p className="text-textSecondary font-sans font-light text-sm leading-relaxed mb-6">
                (Texto de prueba para diseño) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
              <p className="text-textSecondary font-sans font-light text-sm leading-relaxed">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
              </p>
            </div>
            <div>
              <h4 className="title-main text-sm text-textMain mb-4">LA TÉCNICA Y EL ARTE</h4>
              <p className="text-textSecondary font-sans font-light text-sm leading-relaxed mb-6">
                (Texto de prueba para diseño) Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
              </p>
              <p className="text-textSecondary font-sans font-light text-sm leading-relaxed">
                Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.
              </p>
            </div>
          </div>
        </div>

        {/* Filosofía / Estilo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center py-20 mb-32 bg-neutral-50 px-8 photo-card-secondary scroll-reveal">
          <div className="flex flex-col items-center">
            <span className="text-accentMain text-3xl mb-4 block font-serif">01.</span>
            <h3 className="title-main text-lg text-textMain mb-4">NATURALIDAD</h3>
            <p className="text-textSecondary font-sans font-light text-sm leading-relaxed">
              Dirección sutil para que te sientas libre. El mejor retrato es aquel en el que simplemente eres tú mismo.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-accentMain text-3xl mb-4 block font-serif">02.</span>
            <h3 className="title-main text-lg text-textMain mb-4">ATEMPORALIDAD</h3>
            <p className="text-textSecondary font-sans font-light text-sm leading-relaxed">
              Edición cuidada y colores puros que resistirán el paso de los años, alejados de las modas efímeras.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-accentMain text-3xl mb-4 block font-serif">03.</span>
            <h3 className="title-main text-lg text-textMain mb-4">COMPROMISO</h3>
            <p className="text-textSecondary font-sans font-light text-sm leading-relaxed">
              Trato personalizado desde el primer contacto hasta la entrega de la galería final. Tu tranquilidad es clave.
            </p>
          </div>
        </div>

        {/* Galería Adicional (Detalles) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-reveal">
          <div className="aspect-[4/3] photo-card-secondary bg-neutral-50 overflow-hidden relative flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-100 opacity-50 img-parallax h-[120%] -top-[10%] w-full"></div>
            <span className="text-textSecondary uppercase tracking-widest text-[10px] font-sans relative z-10 text-center px-4">
              Foto Estilo / Detalle 1<br/>(Apaisada)
            </span>
          </div>
          <div className="aspect-[4/3] photo-card-secondary bg-neutral-50 overflow-hidden relative flex items-center justify-center">
            <div className="absolute inset-0 bg-neutral-100 opacity-50 img-parallax h-[120%] -top-[10%] w-full"></div>
            <span className="text-textSecondary uppercase tracking-widest text-[10px] font-sans relative z-10 text-center px-4">
              Foto Estilo / Detalle 2<br/>(Apaisada)
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
