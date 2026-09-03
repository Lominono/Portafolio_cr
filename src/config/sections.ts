export interface SectionSlot {
  index: number;
  label: string;
  aspectRatio: string;
  recommendation: string;
}

export interface SectionConfig {
  id: string;
  title: string;
  page: 'Inicio' | 'Sobre Mí' | 'Tarifas';
  maxPhotos: number;
  description: string;
  slots: SectionSlot[];
}

export const SITE_SECTIONS: SectionConfig[] = [
  // -------------------------------------------------------------
  // 1. PÁGINA DE INICIO (9 fotos en total)
  // -------------------------------------------------------------
  {
    id: 'home-about',
    title: 'Retrato "Sobre Mí"',
    page: 'Inicio',
    maxPhotos: 1,
    description: 'Fotografía vertical de Cristian Espinola ubicada en la sección Sobre Mí de la página de inicio.',
    slots: [
      { 
        index: 0, 
        label: 'Retrato Cristian', 
        aspectRatio: '3:4 (Vertical)',
        recommendation: 'Formato vertical 3:4. En la web aparece junto a tu biografía con un borde sutil de bronce. Centra tu rostro o torso en la mitad superior y deja un margen de aire arriba para que el encuadre respire con elegancia.'
      }
    ]
  },
  {
    id: 'home-services-wedding',
    title: 'Especialidad: Bodas & Enlaces',
    page: 'Inicio',
    maxPhotos: 1,
    description: 'Foto de portada para la tarjeta de especialidad Bodas en la página de inicio.',
    slots: [
      { 
        index: 0, 
        label: 'Portada Bodas', 
        aspectRatio: '4:5 (Vertical)',
        recommendation: 'Formato vertical 4:5. Es la tarjeta de presentación de Bodas en Inicio. Al pasar el cursor hace un suave efecto zoom: mantén a la pareja en el centro para que no se corten los bordes al ampliar.'
      }
    ]
  },
  {
    id: 'home-services-portrait',
    title: 'Especialidad: Retrato & Moda',
    page: 'Inicio',
    maxPhotos: 1,
    description: 'Foto de portada para la tarjeta de especialidad Retrato en la página de inicio.',
    slots: [
      { 
        index: 0, 
        label: 'Portada Retrato', 
        aspectRatio: '4:5 (Vertical)',
        recommendation: 'Formato vertical 4:5. Elige un retrato con fuerza visual y buena luz natural. Sitúa los ojos del modelo en la línea superior de tercios.'
      }
    ]
  },
  {
    id: 'home-services-events',
    title: 'Especialidad: Eventos & Celebraciones',
    page: 'Inicio',
    maxPhotos: 1,
    description: 'Foto de portada para la tarjeta de especialidad Eventos en la página de inicio.',
    slots: [
      { 
        index: 0, 
        label: 'Portada Eventos', 
        aspectRatio: '4:5 (Vertical)',
        recommendation: 'Formato vertical 4:5. Selecciona una toma con alegría y energía espontánea (XV años, cumpleaños o fiesta) bien iluminada y centrada.'
      }
    ]
  },
  {
    id: 'home-services-sports',
    title: 'Especialidad: Deportes',
    page: 'Inicio',
    maxPhotos: 1,
    description: 'Foto de portada para la tarjeta de especialidad Deportes en la página de inicio.',
    slots: [
      { 
        index: 0, 
        label: 'Portada Deportes', 
        aspectRatio: '4:5 (Vertical)',
        recommendation: 'Formato vertical 4:5. Captura de acción deportiva de alto impacto. Asegúrate de congelar el movimiento manteniendo al atleta en el encuadre.'
      }
    ]
  },
  {
    id: 'home-portfolio',
    title: 'Galería Portafolio Principal',
    page: 'Inicio',
    maxPhotos: 4,
    description: 'Cuadrícula asimétrica de 4 fotografías que muestra el trabajo destacado en la página de inicio.',
    slots: [
      { 
        index: 0, 
        label: 'Foto 1 (Superior Izquierda)', 
        aspectRatio: '16:9 (Apaisada)',
        recommendation: 'Panorámica 16:9 de gran impacto visual. En ordenador ocupa 2 columnas de ancho: escoge una fotografía horizontal amplia, paisaje o ceremonia completa.'
      },
      { 
        index: 1, 
        label: 'Foto 2 (Superior Derecha)', 
        aspectRatio: '3:4 (Vertical)',
        recommendation: 'Vertical 3:4. Equilibra la toma panorámica de la izquierda. Ideal para un retrato vertical de novios o modelo.'
      },
      { 
        index: 2, 
        label: 'Foto 3 (Inferior Izquierda)', 
        aspectRatio: '3:4 (Vertical)',
        recommendation: 'Vertical 3:4. Excelente para tomas espontáneas de cuerpo entero o medio plano vertical.'
      },
      { 
        index: 3, 
        label: 'Foto 4 (Inferior Derecha)', 
        aspectRatio: '16:9 (Apaisada)',
        recommendation: 'Panorámica 16:9 de cierre de cuadrícula. Ocupa 2 columnas de ancho en escritorio: perfecta para una toma horizontal cinematográfica o fiesta.'
      }
    ]
  },

  // -------------------------------------------------------------
  // 2. PÁGINA SOBRE MÍ (3 fotos en total)
  // -------------------------------------------------------------
  {
    id: 'about-main',
    title: 'Retrato Principal de Autor',
    page: 'Sobre Mí',
    maxPhotos: 1,
    description: 'Fotografía principal de Cristian con efecto Parallax en la cabecera de la página Sobre Mí.',
    slots: [
      { 
        index: 0, 
        label: 'Retrato de Autor', 
        aspectRatio: '3:4 (Vertical)',
        recommendation: 'Vertical 3:4. En la web tiene un efecto Parallax suave al hacer scroll. IMPORTANTE: deja un 10% de margen libre arriba y abajo para que el movimiento del scroll nunca corte tu coronilla.'
      }
    ]
  },
  {
    id: 'about-details',
    title: 'Galería de Detalles y Estilo',
    page: 'Sobre Mí',
    maxPhotos: 2,
    description: 'Dos fotografías apaisadas al final de la página Sobre Mí mostrando detalles, equipo o momentos de trabajo.',
    slots: [
      { 
        index: 0, 
        label: 'Detalle 1', 
        aspectRatio: '4:3 (Apaisada)',
        recommendation: 'Formato horizontal 4:3. Primeros planos de cámaras, lentes, edición o momentos espontáneos trabajando en sesión.'
      },
      { 
        index: 1, 
        label: 'Detalle 2', 
        aspectRatio: '4:3 (Apaisada)',
        recommendation: 'Formato horizontal 4:3. Una fotografía de atmósfera o textura que complemente el detalle anterior.'
      }
    ]
  },

  // -------------------------------------------------------------
  // 3. PÁGINA DE TARIFAS Y SERVICIOS (14 fotos en total)
  // -------------------------------------------------------------
  {
    id: 'pricing-portrait',
    title: 'Tarifas: Sesión Individual / Retrato / Moda',
    page: 'Tarifas',
    maxPhotos: 1,
    description: 'Foto vertical individual para el servicio de Retrato y Moda.',
    slots: [
      { 
        index: 0, 
        label: 'Foto Principal Retrato', 
        aspectRatio: '3:4 (Vertical)',
        recommendation: 'Vertical 3:4. Muestra un retrato de moda o editorial nítido, con mirada directa y fondo limpio.'
      }
    ]
  },
  {
    id: 'pricing-birthday',
    title: 'Tarifas: Cumpleaños y Fiestas Infantiles (Collage)',
    page: 'Tarifas',
    maxPhotos: 3,
    description: 'Collage de 3 fotos: 1 foto vertical grande a la izquierda y 2 fotos apaisadas a la derecha.',
    slots: [
      { 
        index: 0, 
        label: 'Foto 1 (Principal Grande Izquierda)', 
        aspectRatio: '3:4 (Vertical)',
        recommendation: 'Vertical 3:4 grande. Es la imagen dominante del collage: el protagonista del cumpleaños soplando velas o en pleno festejo.'
      },
      { 
        index: 1, 
        label: 'Foto 2 (Detalle Superior Derecha)', 
        aspectRatio: '4:3 (Apaisada)',
        recommendation: 'Horizontal 4:3. Detalle de tarta, decoración, dulces o risas de los invitados.'
      },
      { 
        index: 2, 
        label: 'Foto 3 (Momento Inferior Derecha)', 
        aspectRatio: '4:3 (Apaisada)',
        recommendation: 'Horizontal 4:3. Foto de acción, piñata o juego con amigos.'
      }
    ]
  },
  {
    id: 'pricing-quince',
    title: 'Tarifas: Fiestas de 15 Años / Quinceañeras',
    page: 'Tarifas',
    maxPhotos: 1,
    description: 'Foto vertical individual para el servicio de Quinceañeras.',
    slots: [
      { 
        index: 0, 
        label: 'Foto Principal 15 Años', 
        aspectRatio: '3:4 (Vertical)',
        recommendation: 'Vertical 3:4. La quinceañera con su vestido de gala, en el vals o en la sesión previa de exteriores.'
      }
    ]
  },
  {
    id: 'pricing-baptism',
    title: 'Tarifas: Bautizos y Comuniones',
    page: 'Tarifas',
    maxPhotos: 1,
    description: 'Foto vertical individual para el servicio de Bautizos y Comuniones.',
    slots: [
      { 
        index: 0, 
        label: 'Foto Principal Bautizos', 
        aspectRatio: '3:4 (Vertical)',
        recommendation: 'Vertical 3:4. Foto emotiva de la ceremonia en la pila bautismal o retrato familiar suave con luz natural.'
      }
    ]
  },
  {
    id: 'pricing-sports',
    title: 'Tarifas: Eventos Deportivos (Collage)',
    page: 'Tarifas',
    maxPhotos: 3,
    description: 'Collage de 3 fotos: 1 foto vertical grande a la izquierda y 2 fotos apaisadas a la derecha.',
    slots: [
      { 
        index: 0, 
        label: 'Foto 1 (Acción Principal Izquierda)', 
        aspectRatio: '3:4 (Vertical)',
        recommendation: 'Vertical 3:4 grande. Momento cumbre de la competición: gol, canasta, salto o meta.'
      },
      { 
        index: 1, 
        label: 'Foto 2 (Detalle Superior Derecha)', 
        aspectRatio: '4:3 (Apaisada)',
        recommendation: 'Horizontal 4:3. Concentración, equipamiento o banquillo.'
      },
      { 
        index: 2, 
        label: 'Foto 3 (Celebración Inferior Derecha)', 
        aspectRatio: '4:3 (Apaisada)',
        recommendation: 'Horizontal 4:3. Festejo de equipo, entrega de medallas o euforia final.'
      }
    ]
  },
  {
    id: 'pricing-wedding-civil',
    title: 'Tarifas: Boda Básica / Civil',
    page: 'Tarifas',
    maxPhotos: 1,
    description: 'Foto vertical individual para el servicio de Boda Básica / Civil.',
    slots: [
      { 
        index: 0, 
        label: 'Foto Principal Boda Civil', 
        aspectRatio: '3:4 (Vertical)',
        recommendation: 'Vertical 3:4. Salida del juzgado/ayuntamiento bajo el arroz o retrato íntimo de pareja en exterior.'
      }
    ]
  },
  {
    id: 'pricing-wedding-full',
    title: 'Tarifas: Boda Completa (Collage)',
    page: 'Tarifas',
    maxPhotos: 3,
    description: 'Collage de 3 fotos: 1 foto vertical grande a la izquierda y 2 fotos apaisadas a la derecha.',
    slots: [
      { 
        index: 0, 
        label: 'Foto 1 (Ceremonia / Enlace Izquierda)', 
        aspectRatio: '3:4 (Vertical)',
        recommendation: 'Vertical 3:4 grande. El instante estelar: el intercambio de anillos, el primer beso o el abrazo tras el sí.'
      },
      { 
        index: 1, 
        label: 'Foto 2 (Preparativos Superior Derecha)', 
        aspectRatio: '4:3 (Apaisada)',
        recommendation: 'Horizontal 4:3. Vestido de novia, gemelos, maquillaje o miradas antes del enlace.'
      },
      { 
        index: 2, 
        label: 'Foto 3 (Celebración Inferior Derecha)', 
        aspectRatio: '4:3 (Apaisada)',
        recommendation: 'Horizontal 4:3. Cóctel, primer baile nupcial o fiesta con los invitados.'
      }
    ]
  },
  {
    id: 'pricing-special',
    title: 'Tarifas: Sesiones Especiales (Parejas / Familia)',
    page: 'Tarifas',
    maxPhotos: 1,
    description: 'Foto vertical individual para el servicio de Sesiones Especiales.',
    slots: [
      { 
        index: 0, 
        label: 'Foto Principal Sesión Especial', 
        aspectRatio: '3:4 (Vertical)',
        recommendation: 'Vertical 3:4. Pareja al atardecer, sesión premamá o abrazo familiar con luz dorada.'
      }
    ]
  }
];

export const TOTAL_SITE_SLOTS = SITE_SECTIONS.reduce((acc, s) => acc + s.maxPhotos, 0);
