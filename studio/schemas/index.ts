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
        description: 'Selecciona el espacio exacto donde aparecerá esta fotografía. Consulta la guía de fotos recomendadas.',
        type: 'string',
        options: {
          list: [
            {title: '🏠 Inicio → Retrato "Sobre Mí" (1 foto | Vertical)', value: 'home-about'},
            {title: '🏠 Inicio → Galería Portafolio Principal (4 fotos | Vertical 3:4)', value: 'home-portfolio'},
            {title: '👤 Sobre Mí → Retrato Principal de Cristian (1 foto | Vertical)', value: 'about-main'},
            {title: '👤 Sobre Mí → Galería Detalles y Enfoque (2 fotos | Cuadrada o Vertical)', value: 'about-details'},
            {title: '🏷️ Tarifas → Servicio Bodas (1 foto de portada | Vertical)', value: 'pricing-wedding'},
            {title: '🏷️ Tarifas → Servicio Retrato / Moda (1 foto de portada | Vertical)', value: 'pricing-portrait'},
            {title: '🏷️ Tarifas → Servicio Eventos / 15 Años (1 foto de portada | Vertical)', value: 'pricing-events'},
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
          'home-about': '🏠 Inicio → Retrato "Sobre Mí" (1 foto)',
          'home-portfolio': '🏠 Inicio → Galería Portafolio (4 fotos)',
          'about-main': '👤 Sobre Mí → Retrato Principal (1 foto)',
          'about-details': '👤 Sobre Mí → Galería Detalles (2 fotos)',
          'pricing-wedding': '🏷️ Tarifas → Bodas (1 foto)',
          'pricing-portrait': '🏷️ Tarifas → Retrato / Moda (1 foto)',
          'pricing-events': '🏷️ Tarifas → Eventos / 15 Años (1 foto)',
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
