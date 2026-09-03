export interface SectionSlot {
  index: number;
  label: string;
  aspectRatio: string;
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
      { index: 0, label: 'Retrato Cristian', aspectRatio: '3:4 (Vertical)' }
    ]
  },
  {
    id: 'home-services-wedding',
    title: 'Especialidad: Bodas & Enlaces',
    page: 'Inicio',
    maxPhotos: 1,
    description: 'Foto de portada para la tarjeta de especialidad Bodas en la página de inicio.',
    slots: [
      { index: 0, label: 'Portada Bodas', aspectRatio: '4:5 (Vertical)' }
    ]
  },
  {
    id: 'home-services-portrait',
    title: 'Especialidad: Retrato & Moda',
    page: 'Inicio',
    maxPhotos: 1,
    description: 'Foto de portada para la tarjeta de especialidad Retrato en la página de inicio.',
    slots: [
      { index: 0, label: 'Portada Retrato', aspectRatio: '4:5 (Vertical)' }
    ]
  },
  {
    id: 'home-services-events',
    title: 'Especialidad: Eventos & Celebraciones',
    page: 'Inicio',
    maxPhotos: 1,
    description: 'Foto de portada para la tarjeta de especialidad Eventos en la página de inicio.',
    slots: [
      { index: 0, label: 'Portada Eventos', aspectRatio: '4:5 (Vertical)' }
    ]
  },
  {
    id: 'home-services-sports',
    title: 'Especialidad: Deportes',
    page: 'Inicio',
    maxPhotos: 1,
    description: 'Foto de portada para la tarjeta de especialidad Deportes en la página de inicio.',
    slots: [
      { index: 0, label: 'Portada Deportes', aspectRatio: '4:5 (Vertical)' }
    ]
  },
  {
    id: 'home-portfolio',
    title: 'Galería Portafolio Principal',
    page: 'Inicio',
    maxPhotos: 4,
    description: 'Cuadrícula asimétrica de 4 fotografías que muestra el trabajo destacado en la página de inicio.',
    slots: [
      { index: 0, label: 'Foto 1 (Superior Izquierda)', aspectRatio: '16:9 (Apaisada / Ancha)' },
      { index: 1, label: 'Foto 2 (Superior Derecha)', aspectRatio: '3:4 (Vertical)' },
      { index: 2, label: 'Foto 3 (Inferior Izquierda)', aspectRatio: '3:4 (Vertical)' },
      { index: 3, label: 'Foto 4 (Inferior Derecha)', aspectRatio: '16:9 (Apaisada / Ancha)' }
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
      { index: 0, label: 'Retrato de Autor', aspectRatio: '3:4 (Vertical)' }
    ]
  },
  {
    id: 'about-details',
    title: 'Galería de Detalles y Estilo',
    page: 'Sobre Mí',
    maxPhotos: 2,
    description: 'Dos fotografías apaisadas al final de la página Sobre Mí mostrando detalles, equipo o momentos de trabajo.',
    slots: [
      { index: 0, label: 'Detalle 1', aspectRatio: '4:3 (Apaisada)' },
      { index: 1, label: 'Detalle 2', aspectRatio: '4:3 (Apaisada)' }
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
      { index: 0, label: 'Foto Principal Retrato', aspectRatio: '3:4 (Vertical)' }
    ]
  },
  {
    id: 'pricing-birthday',
    title: 'Tarifas: Cumpleaños y Fiestas Infantiles (Collage)',
    page: 'Tarifas',
    maxPhotos: 3,
    description: 'Collage de 3 fotos: 1 foto vertical grande a la izquierda y 2 fotos apaisadas a la derecha.',
    slots: [
      { index: 0, label: 'Foto 1 (Principal Grande Izquierda)', aspectRatio: '3:4 (Vertical)' },
      { index: 1, label: 'Foto 2 (Detalle Superior Derecha)', aspectRatio: '4:3 (Apaisada)' },
      { index: 2, label: 'Foto 3 (Momento Inferior Derecha)', aspectRatio: '4:3 (Apaisada)' }
    ]
  },
  {
    id: 'pricing-quince',
    title: 'Tarifas: Fiestas de 15 Años / Quinceañeras',
    page: 'Tarifas',
    maxPhotos: 1,
    description: 'Foto vertical individual para el servicio de Quinceañeras.',
    slots: [
      { index: 0, label: 'Foto Principal 15 Años', aspectRatio: '3:4 (Vertical)' }
    ]
  },
  {
    id: 'pricing-baptism',
    title: 'Tarifas: Bautizos y Comuniones',
    page: 'Tarifas',
    maxPhotos: 1,
    description: 'Foto vertical individual para el servicio de Bautizos y Comuniones.',
    slots: [
      { index: 0, label: 'Foto Principal Bautizos', aspectRatio: '3:4 (Vertical)' }
    ]
  },
  {
    id: 'pricing-sports',
    title: 'Tarifas: Eventos Deportivos (Collage)',
    page: 'Tarifas',
    maxPhotos: 3,
    description: 'Collage de 3 fotos: 1 foto vertical grande a la izquierda y 2 fotos apaisadas a la derecha.',
    slots: [
      { index: 0, label: 'Foto 1 (Acción Principal Izquierda)', aspectRatio: '3:4 (Vertical)' },
      { index: 1, label: 'Foto 2 (Detalle Superior Derecha)', aspectRatio: '4:3 (Apaisada)' },
      { index: 2, label: 'Foto 3 (Competición Inferior Derecha)', aspectRatio: '4:3 (Apaisada)' }
    ]
  },
  {
    id: 'pricing-wedding-civil',
    title: 'Tarifas: Boda Básica / Civil',
    page: 'Tarifas',
    maxPhotos: 1,
    description: 'Foto vertical individual para el servicio de Boda Básica / Civil.',
    slots: [
      { index: 0, label: 'Foto Principal Boda Civil', aspectRatio: '3:4 (Vertical)' }
    ]
  },
  {
    id: 'pricing-wedding-full',
    title: 'Tarifas: Boda Completa (Collage)',
    page: 'Tarifas',
    maxPhotos: 3,
    description: 'Collage de 3 fotos: 1 foto vertical grande a la izquierda y 2 fotos apaisadas a la derecha.',
    slots: [
      { index: 0, label: 'Foto 1 (Ceremonia / Enlace Izquierda)', aspectRatio: '3:4 (Vertical)' },
      { index: 1, label: 'Foto 2 (Preparativos Superior Derecha)', aspectRatio: '4:3 (Apaisada)' },
      { index: 2, label: 'Foto 3 (Celebración Inferior Derecha)', aspectRatio: '4:3 (Apaisada)' }
    ]
  },
  {
    id: 'pricing-special',
    title: 'Tarifas: Sesiones Especiales (Parejas / Familia)',
    page: 'Tarifas',
    maxPhotos: 1,
    description: 'Foto vertical individual para el servicio de Sesiones Especiales.',
    slots: [
      { index: 0, label: 'Foto Principal Sesión Especial', aspectRatio: '3:4 (Vertical)' }
    ]
  }
];

export const TOTAL_SITE_SLOTS = SITE_SECTIONS.reduce((acc, s) => acc + s.maxPhotos, 0);
