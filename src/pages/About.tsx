import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { subscribeToAllPhotos } from '../services/photos';
import SmartImage from '../components/SmartImage';
import AppleLightbox from '../components/AppleLightbox';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const About = () => {
  const container = useRef<HTMLDivElement>(null);
  const [mainImg, setMainImg] = useState<string | null>(null);
  const [detailImgs, setDetailImgs] = useState<string[]>([]);

  // Estado de Lightbox
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
    const unsubscribe = subscribeToAllPhotos((allPhotos) => {
      // Retrato principal de Cristian (prioriza about-main, fallback home-about)
      const main = (allPhotos['about-main'] && allPhotos['about-main'][0]) || 
                    (allPhotos['home-about'] && allPhotos['home-about'][0]) || null;
      setMainImg(main);

      // Galería de 2 detalles
      const details = allPhotos['about-details'] || [];
      setDetailImgs(details);
    });

    return () => unsubscribe();
  }, []);

  useGSAP(() => {
    // 1. Animación de entrada de cabecera
    gsap.from('.header-elem', {
      y: 28,
      opacity: 0,
      duration: 1,
      stagger: 0.12,
      ease: 'power2.out',
      clearProps: 'all'
    });

    // 2. Animaciones de scroll estables para móvil
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

    // 3. Revelado de divisores en bronce
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

    // 4. Efecto Parallax táctil amortiguado
    const parallaxImages = gsap.utils.toArray('.img-parallax');
    parallaxImages.forEach((img: any) => {
      gsap.fromTo(img, 
        { yPercent: -2 },
        {
          yPercent: 2,
          ease: 'none',
          scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8
          }
        }
      );
    });
  }, { scope: container });

  return (
    <div ref={container} className="pt-32 pb-24 px-6 md:px-16 min-h-screen bg-primary">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabecera Editorial */}
        <div className="text-center mb-20 md:mb-24">
          <span className="header-elem font-serif italic text-accentMain text-base md:text-lg mb-2 block">
            Semblanza y mirada
          </span>
          <h1 className="header-elem font-serif text-4xl sm:text-5xl md:text-6xl text-textMain mb-4 font-normal tracking-[-0.02em]">
            Cristian Espinola
          </h1>
          <p className="header-elem text-textSecondary text-sm md:text-base font-sans font-light max-w-lg mx-auto">
            Fotógrafo documental especializado en bodas y retratos con luz natural.
          </p>
        </div>

        {/* Sección Principal: Retrato y Manifiesto de Autor */}
        <div className="flex flex-col md:flex-row gap-16 items-center mb-32">
          <div className="w-full md:w-1/2 aspect-[3/4] photo-card-secondary bg-neutral-50 overflow-hidden relative header-elem shadow-apple-card">
            <SmartImage
              src={mainImg}
              alt="Retrato de Cristian Espinola"
              fallbackLabel="Retrato de Cristian"
              onClick={mainImg ? () => openLightbox([mainImg], 0, ['Retrato de Cristian Espinola']) : undefined}
              className="group-hover:scale-105"
            />
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="flex flex-col gap-5">
              <p className="text-textSecondary font-sans font-light leading-relaxed scroll-reveal text-sm md:text-base">
                Mi acercamiento a la fotografía nació de una necesidad profunda de detener el tiempo. Creo que cada persona tiene una luz única y mi propósito es capturarla de la forma más honesta posible. No busco la perfección artificial, sino la belleza real de los instantes que compartimos.
              </p>
              <p className="text-textSecondary font-sans font-light leading-relaxed scroll-reveal text-sm md:text-base">
                Me especializo en fotografía documental de bodas y retratos porque encuentro en las conexiones humanas la fuente de inspiración más inagotable. Huyo de las poses forzadas; prefiero ser un observador discreto que documenta la autenticidad del momento: una lágrima de emoción, una carcajada compartida o esa mirada de complicidad que lo dice absolutamente todo.
              </p>
              <p className="text-textSecondary font-sans font-light leading-relaxed scroll-reveal text-sm md:text-base">
                El trabajo de un fotógrafo no termina al pulsar el disparador. Dedico horas a la selección y edición meticulosa de cada imagen, asegurándome de que los colores, la luz y el contraste reflejen la atmósfera exacta de ese día. Mi objetivo final es entregarte un legado visual que gane valor con el paso de los años.
              </p>
              
              <div className="pt-2 scroll-reveal">
                <span className="font-serif italic text-lg text-accentMain">
                  Cristian Espinola
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cita de Autor */}
        <div className="py-14 mb-28 border-y border-black/[0.06] text-center px-4 scroll-reveal">
          <blockquote className="font-serif italic text-xl md:text-3xl text-textMain leading-snug mx-auto max-w-2xl font-normal">
            «No fotografío lo que veo, fotografío lo que siento cuando estoy allí.»
          </blockquote>
        </div>

        {/* Filosofía y Enfoque Editorial */}
        <div className="mb-28">
          <div className="text-center mb-14 scroll-reveal">
            <h2 className="title-main text-2xl md:text-3xl text-textMain mb-3">Filosofía de trabajo</h2>
            <p className="text-sm text-textSecondary font-sans font-light max-w-md mx-auto">
              Un compromiso ético y estético con cada historia que confía en mi lente.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 scroll-reveal mb-12">
            <div className="border-l border-accentMain/40 pl-6">
              <h3 className="title-main text-xl text-textMain mb-3">La verdad en los gestos desapercibidos</h3>
              <p className="text-textSecondary font-sans font-light text-sm leading-relaxed mb-4">
                Mi fascinación por la fotografía nació de una certeza temprana: el tiempo avanza sin tregua, pero una sola imagen tiene el poder sagrado de congelar una emoción para siempre. No comencé buscando la técnica perfecta, sino la verdad que habita en los gestos desapercibidos: la mano que busca apoyo antes del enlace, la risa desprevenida o la calma cómplice de una mirada honesta.
              </p>
              <p className="text-textSecondary font-sans font-light text-sm leading-relaxed">
                Fotografiar para mí es aprender a observar con paciencia, respetar la intimidad de cada historia y construir un refugio visual donde los momentos más puros de tu vida queden a salvo del olvido.
              </p>
            </div>

            <div className="border-l border-accentMain/40 pl-6">
              <h3 className="title-main text-xl text-textMain mb-3">La luz natural y la sobriedad</h3>
              <p className="text-textSecondary font-sans font-light text-sm leading-relaxed mb-4">
                Concibo la técnica no como una demostración de artificio, sino como el lenguaje silencioso que permite a la emoción expresarse sin distracciones. El dominio riguroso de la luz natural, la composición equilibrada y una paleta cromática sobria son las herramientas con las que convierto instantes efímeros en estampas con peso narrativo.
              </p>
              <p className="text-textSecondary font-sans font-light text-sm leading-relaxed">
                Me alejo deliberadamente de las modas de edición pasajeras y los filtros saturados; mi compromiso es entregarte una obra con estética atemporal, donde la belleza, el contraste y la textura sigan conmoviéndote con la misma fuerza dentro de veinte años.
              </p>
            </div>
          </div>
        </div>

        {/* Principios de Trabajo (Sin tarjetas SaaS ni números falsos) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center py-12 mb-28 border-y border-black/[0.06] px-4 scroll-reveal">
          <div className="flex flex-col items-center">
            <h3 className="title-main text-lg text-textMain mb-2">Naturalidad</h3>
            <p className="text-textSecondary font-sans font-light text-xs leading-relaxed max-w-xs">
              Dirección sutil e invisible para que te sientas libre. El mejor retrato es aquel en el que simplemente eres tú mismo.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="title-main text-lg text-textMain mb-2">Atemporalidad</h3>
            <p className="text-textSecondary font-sans font-light text-xs leading-relaxed max-w-xs">
              Edición cuidada y colores orgánicos que resistirán el paso de los años, alejados de modas pasajeras.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="title-main text-lg text-textMain mb-2">Cercanía</h3>
            <p className="text-textSecondary font-sans font-light text-xs leading-relaxed max-w-xs">
              Trato personalizado desde el primer contacto hasta la entrega de la galería final. Tu tranquilidad es prioritaria.
            </p>
          </div>
        </div>

        {/* Galería de Detalles con Lightbox */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-reveal">
          <div className="aspect-[4/3] photo-card-secondary bg-neutral-50 overflow-hidden relative shadow-apple-card">
            <SmartImage
              src={detailImgs[0]}
              alt="Detalle y atmósfera 1"
              fallbackLabel="Detalle y atmósfera 1"
              onClick={detailImgs[0] ? () => openLightbox(detailImgs, 0, ['Detalle y atmósfera 1', 'Detalle y atmósfera 2']) : undefined}
              className="group-hover:scale-105"
            />
          </div>
          <div className="aspect-[4/3] photo-card-secondary bg-neutral-50 overflow-hidden relative shadow-apple-card">
            <SmartImage
              src={detailImgs[1]}
              alt="Detalle y atmósfera 2"
              fallbackLabel="Detalle y atmósfera 2"
              onClick={detailImgs[1] ? () => openLightbox(detailImgs, 1, ['Detalle y atmósfera 1', 'Detalle y atmósfera 2']) : undefined}
              className="group-hover:scale-105"
            />
          </div>
        </div>

      </div>

      {/* Visor Lightbox Nativo */}
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

export default About;
