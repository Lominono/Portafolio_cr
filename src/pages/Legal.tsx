import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Legal = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.header-elem', {
      y: 30,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power2.out',
    });

    const revealElements = gsap.utils.toArray('.scroll-reveal');
    revealElements.forEach((el: any) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    });
  }, { scope: container });

  return (
    <div ref={container} className="pt-32 pb-24 px-6 md:px-16 min-h-screen bg-primary">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabecera */}
        <div className="text-center mb-20">
          <h1 className="header-elem title-main text-3xl md:text-5xl mb-6 text-textMain">
            INFORMACIÓN LEGAL
          </h1>
          <div className="header-elem w-12 h-px bg-accentMain mx-auto mt-8"></div>
        </div>

        <div className="bg-neutral-50 p-8 md:p-16 border border-neutral-100 scroll-reveal">
          
          <section className="mb-12">
            <h2 className="title-main text-xl text-textMain mb-6">1. AVISO LEGAL Y DATOS DEL TITULAR</h2>
            <p className="text-textSecondary font-sans font-light leading-relaxed text-sm mb-4">
              En cumplimiento con el deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), a continuación se reflejan los siguientes datos:
            </p>
            <ul className="list-disc list-inside text-textSecondary font-sans font-light text-sm space-y-2">
              <li><strong>Titular:</strong> Cristian Espinola</li>
              <li><strong>Contacto:</strong> Christianespinolas2317@gmail.com</li>
              <li><strong>Teléfono:</strong> +34 640 64 69 63</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="title-main text-xl text-textMain mb-6">2. POLÍTICA DE PRIVACIDAD Y PROTECCIÓN DE DATOS (RGPD)</h2>
            <p className="text-textSecondary font-sans font-light leading-relaxed text-sm mb-4">
              De conformidad con lo dispuesto en el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo (Reglamento General de Protección de Datos o RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales, se informa al usuario de lo siguiente:
            </p>
            <p className="text-textSecondary font-sans font-light leading-relaxed text-sm mb-4">
              <strong>Finalidad del tratamiento:</strong> Los datos personales recogidos a través de los formularios de contacto (correo electrónico, WhatsApp) se utilizarán exclusivamente para atender su consulta, presupuestar servicios fotográficos y mantener la comunicación comercial solicitada.
            </p>
            <p className="text-textSecondary font-sans font-light leading-relaxed text-sm mb-4">
              <strong>Conservación:</strong> Los datos se conservarán mientras se mantenga la relación comercial o durante los años necesarios para cumplir con las obligaciones legales.
            </p>
            <p className="text-textSecondary font-sans font-light leading-relaxed text-sm">
              <strong>Derechos del usuario:</strong> Puede ejercer sus derechos de acceso, rectificación, supresión, limitación, portabilidad y oposición dirigiéndose al correo electrónico proporcionado, adjuntando prueba de identidad.
            </p>
          </section>

          <section>
            <h2 className="title-main text-xl text-textMain mb-6">3. PROPIEDAD INTELECTUAL E INDUSTRIAL</h2>
            <p className="text-textSecondary font-sans font-light leading-relaxed text-sm mb-4">
              El diseño del portal y sus códigos fuente, así como los logos, marcas, fotografías, imágenes y demás signos distintivos que aparecen en el mismo, pertenecen a Cristian Espinola y están protegidos por los correspondientes derechos de propiedad intelectual e industrial.
            </p>
            <p className="text-textSecondary font-sans font-light leading-relaxed text-sm">
              Queda estrictamente prohibida la reproducción, distribución, comunicación pública y transformación, total o parcial, sin la autorización expresa del titular. Las fotografías expuestas en el portafolio son obras protegidas y su uso indebido será perseguido legalmente.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Legal;
