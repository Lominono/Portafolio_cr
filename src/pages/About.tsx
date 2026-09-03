import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Camera, Heart } from 'lucide-react';
import { subscribeToAllPhotos } from '../services/photos';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const About = () => {
  const container = useRef<HTMLDivElement>(null);
  const [mainImg, setMainImg] = useState<string | null>(null);
  const [detailImgs, setDetailImgs] = useState<string[]>([]);

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
            {mainImg ? (
              <img src={mainImg} alt="Retrato Principal" className="w-full h-full object-cover img-parallax absolute h-[120%] -top-[10%]" />
            ) : (
              <>
                <div className="absolute inset-0 bg-neutral-100 opacity-50 img-parallax h-[120%] -top-[10%] w-full"></div>
                <span className="text-textSecondary uppercase tracking-widest text-xs font-sans relative z-10 text-center px-4">
                  Foto de Cristian<br/>(Retrato Principal)
                </span>
              </>
            )}
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
        {/* Sección de Historia, Enfoque y Manifiesto Editorial */}
        <div className="mb-32">
          <div className="text-center mb-16 scroll-reveal">
            <span className="text-[10px] uppercase font-sans tracking-widest text-accentMain block mb-2 font-medium">
              Detrás de la Mirada
            </span>
            <h2 className="title-main text-2xl md:text-3xl text-textMain mb-4">MI HISTORIA Y ENFOQUE</h2>
            <div className="w-8 h-px bg-accentMain mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 scroll-reveal mb-12">
            <div className="bg-white p-8 photo-card-secondary border border-neutral-200 card-luxury">
              <div className="flex items-center gap-2 mb-4">
                <Heart size={14} className="text-accentMain" />
                <h4 className="title-main text-xs sm:text-sm text-textMain tracking-widest">EL ORIGEN DE LA PASIÓN</h4>
              </div>
              <p className="drop-cap text-textSecondary font-sans font-light text-sm leading-relaxed mb-4">
                Mi fascinación por la fotografía nació de una certeza temprana: el tiempo avanza sin tregua, pero una sola imagen tiene el poder sagrado de congelar una emoción para siempre. No comencé buscando la técnica perfecta, sino la verdad que habita en los gestos desapercibidos: la mano que busca apoyo antes del "sí, quiero", la risa desprevenida que descoloca la compostura o la calma cómplice de una mirada honesta.
              </p>
              <p className="text-textSecondary font-sans font-light text-sm leading-relaxed">
                Con los años, esa curiosidad inicial se transformó en una vocación vital. Fotografiar para mí no es solo disparar una cámara; es aprender a observar con paciencia, respetar la intimidad de cada historia y construir un refugio visual donde los momentos más puros de tu vida queden a salvo del olvido.
              </p>
            </div>

            <div className="bg-white p-8 photo-card-secondary border border-neutral-200 card-luxury">
              <div className="flex items-center gap-2 mb-4">
                <Camera size={14} className="text-accentMain" />
                <h4 className="title-main text-xs sm:text-sm text-textMain tracking-widest">LA TÉCNICA Y EL ARTE</h4>
              </div>
              <p className="drop-cap text-textSecondary font-sans font-light text-sm leading-relaxed mb-4">
                Concibo la técnica no como una demostración de artificio, sino como el lenguaje silencioso que permite a la emoción expresarse sin distracciones. El dominio riguroso de la luz natural, la composición equilibrada y una paleta cromática sobria son las herramientas con las que convierto instantes efímeros en estampas con peso narrativo y cinematográfico.
              </p>
              <p className="text-textSecondary font-sans font-light text-sm leading-relaxed">
                Cada reportaje es un equilibrio entre intuición y oficio. Me alejo deliberadamente de las modas de edición pasajeras y los filtros saturados; mi compromiso es entregarte una obra con estética atemporal, donde la belleza, el contraste y la textura sigan conmoviéndote con la misma fuerza dentro de veinte años.
              </p>
            </div>
          </div>

          {/* Cita Editorial Cinematográfica Flotante */}
          <div className="py-10 px-6 my-10 bg-neutral-50 photo-card-secondary border border-neutral-200 text-center relative scroll-reveal">
            <span className="text-[10px] uppercase font-sans tracking-widest text-accentMain block mb-3 font-medium">
              Manifiesto de Autor
            </span>
            <blockquote className="font-serif italic text-base sm:text-xl text-textMain max-w-2xl mx-auto leading-relaxed">
              "La técnica es el lenguaje invisible; la emoción es la verdadera protagonista de cada encuadre."
            </blockquote>
          </div>

          {/* Métricas y Sellos de Calidad con Micro-Animaciones */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 scroll-reveal">
            <div className="bg-white p-5 text-center border border-neutral-200 photo-card-secondary card-luxury">
              <span className="block text-2xl font-serif text-accentMain mb-1">+8</span>
              <span className="block text-[10px] uppercase tracking-widest text-textSecondary font-sans">Años de Oficio</span>
            </div>
            <div className="bg-white p-5 text-center border border-neutral-200 photo-card-secondary card-luxury">
              <span className="block text-2xl font-serif text-accentMain mb-1">100%</span>
              <span className="block text-[10px] uppercase tracking-widest text-textSecondary font-sans">Colorimetría de Autor</span>
            </div>
            <div className="bg-white p-5 text-center border border-neutral-200 photo-card-secondary card-luxury">
              <span className="block text-2xl font-serif text-accentMain mb-1">1 Evento</span>
              <span className="block text-[10px] uppercase tracking-widest text-textSecondary font-sans">Exclusivo por Día</span>
            </div>
            <div className="bg-white p-5 text-center border border-neutral-200 photo-card-secondary card-luxury">
              <span className="block text-2xl font-serif text-accentMain mb-1">RAW</span>
              <span className="block text-[10px] uppercase tracking-widest text-textSecondary font-sans">Máxima Calidad</span>
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
            {detailImgs[0] ? (
              <img src={detailImgs[0]} alt="Detalle 1" className="w-full h-full object-cover img-parallax absolute h-[120%] -top-[10%]" />
            ) : (
              <>
                <div className="absolute inset-0 bg-neutral-100 opacity-50 img-parallax h-[120%] -top-[10%] w-full"></div>
                <span className="text-textSecondary uppercase tracking-widest text-[10px] font-sans relative z-10 text-center px-4">
                  Foto Estilo / Detalle 1<br/>(Apaisada)
                </span>
              </>
            )}
          </div>
          <div className="aspect-[4/3] photo-card-secondary bg-neutral-50 overflow-hidden relative flex items-center justify-center">
            {detailImgs[1] ? (
              <img src={detailImgs[1]} alt="Detalle 2" className="w-full h-full object-cover img-parallax absolute h-[120%] -top-[10%]" />
            ) : (
              <>
                <div className="absolute inset-0 bg-neutral-100 opacity-50 img-parallax h-[120%] -top-[10%] w-full"></div>
                <span className="text-textSecondary uppercase tracking-widest text-[10px] font-sans relative z-10 text-center px-4">
                  Foto Estilo / Detalle 2<br/>(Apaisada)
                </span>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
