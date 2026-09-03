export const schemaTypes = [
  {
    name: 'siteImage',
    title: 'Imágenes de la Web',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Título / Descripción Interna',
        description: 'Nombre para identificar esta fotografía en tu panel (ej: "Boda Laura y Marcos - Sesión Jardín"). Los visitantes de la web no verán este texto.',
        type: 'string',
        validation: (Rule: any) => Rule.required().error('Debes indicar un título para identificar la foto.'),
      },
      {
        name: 'placement',
        title: '¿En qué sección de la web se publicará?',
        description: 'Selecciona el espacio exacto donde aparecerá esta fotografía.',
        type: 'string',
        options: {
          list: [
            // Página de Inicio
            {title: '🏠 Inicio → Retrato "Sobre Mí" (1 foto | Vertical)', value: 'home-about'},
            {title: '🏠 Inicio → Galería Portafolio Principal (Múltiples fotos)', value: 'home-portfolio'},
            {title: '🏠 Inicio → Especialidad: Bodas & Enlaces (1 foto)', value: 'home-service-wedding'},
            {title: '🏠 Inicio → Especialidad: Retrato & Moda (1 foto)', value: 'home-service-portrait'},
            {title: '🏠 Inicio → Especialidad: Eventos & Celebraciones (1 foto)', value: 'home-service-events'},
            {title: '🏠 Inicio → Especialidad: Deportes (1 foto)', value: 'home-service-sports'},

            // Página Sobre Mí
            {title: '👤 Sobre Mí → Retrato Principal de Cristian (1 foto | Vertical)', value: 'about-main'},
            {title: '👤 Sobre Mí → Galería Detalles y Enfoque (2 fotos)', value: 'about-details'},

            // Página de Tarifas
            {title: '💍 Tarifas → Bodas (General / Boda Básica)', value: 'pricing-wedding'},
            {title: '💍 Tarifas → Boda Completa (Collage)', value: 'pricing-wedding-full'},
            {title: '🎭 Tarifas → Sesión Individual / Retrato / Moda', value: 'pricing-portrait'},
            {title: '🎂 Tarifas → Cumpleaños y Fiestas Infantiles (Collage)', value: 'pricing-birthday'},
            {title: '👑 Tarifas → Fiestas de 15 Años / Quinceañeras', value: 'pricing-quince'},
            {title: '🕊️ Tarifas → Bautizos y Comuniones', value: 'pricing-baptism'},
            {title: '⚽ Tarifas → Eventos Deportivos (Collage)', value: 'pricing-sports'},
            {title: '🤍 Tarifas → Sesiones Especiales (Pareja / Familia)', value: 'pricing-special'},
            {title: '🏷️ Tarifas → Eventos Generales (Comodín para eventos)', value: 'pricing-events'},
          ],
          layout: 'dropdown',
        },
        validation: (Rule: any) => Rule.required().error('Debes seleccionar en qué sección publicar la imagen.'),
      },
      {
        name: 'image',
        title: 'Archivo de Fotografía',
        description: 'Sube tu foto en alta calidad (JPG, PNG o WebP). Haz clic en el círculo sobre la foto (Hotspot) para marcar el rostro del cliente; así nunca se cortará en pantallas de teléfonos móviles.',
        type: 'image',
        options: {
          hotspot: true,
        },
        validation: (Rule: any) => Rule.required().error('Debes subir un archivo de imagen.'),
      },
    ],
    preview: {
      select: {
        title: 'title',
        placement: 'placement',
        media: 'image',
      },
      prepare(selection: any) {
        const {title, placement, media} = selection;
        const labels: Record<string, string> = {
          'home-about': '🏠 Inicio → Retrato "Sobre Mí"',
          'home-portfolio': '🏠 Inicio → Galería Portafolio',
          'home-service-wedding': '🏠 Inicio → Especialidad: Bodas',
          'home-service-portrait': '🏠 Inicio → Especialidad: Retrato',
          'home-service-events': '🏠 Inicio → Especialidad: Eventos',
          'home-service-sports': '🏠 Inicio → Especialidad: Deportes',
          'about-main': '👤 Sobre Mí → Retrato Principal',
          'about-details': '👤 Sobre Mí → Galería Detalles',
          'pricing-wedding': '💍 Tarifas → Bodas (General / Básica)',
          'pricing-wedding-full': '💍 Tarifas → Boda Completa (Collage)',
          'pricing-portrait': '🎭 Tarifas → Retrato / Moda',
          'pricing-birthday': '🎂 Tarifas → Cumpleaños (Collage)',
          'pricing-quince': '👑 Tarifas → 15 Años / Quinceañeras',
          'pricing-baptism': '🕊️ Tarifas → Bautizos y Comuniones',
          'pricing-sports': '⚽ Tarifas → Deportes (Collage)',
          'pricing-special': '🤍 Tarifas → Sesiones Especiales',
          'pricing-events': '🏷️ Tarifas → Eventos Generales',
        };
        return {
          title: title || 'Sin título',
          subtitle: labels[placement] || `Sección: ${placement || 'Sin asignar'}`,
          media,
        };
      },
    },
  },
];
