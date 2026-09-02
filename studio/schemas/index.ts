export const schemaTypes = [
  {
    name: 'siteImage',
    title: 'Imágenes de la Web',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Título / Descripción (Interno)',
        description: 'Nombre para que identifiques esta foto en el panel.',
        type: 'string',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'placement',
        title: '¿Dónde se mostrará esta foto?',
        description: 'Elige en qué sección de tu página web aparecerá esta imagen.',
        type: 'string',
        options: {
          list: [
            {title: 'Inicio - Retrato Sobre Mí (1 foto)', value: 'home-about'},
            {title: 'Inicio - Galería Portafolio (4 fotos)', value: 'home-portfolio'},
            {title: 'Sobre Mí - Retrato Principal (1 foto)', value: 'about-main'},
            {title: 'Sobre Mí - Galería Detalles (2 fotos)', value: 'about-details'},
            {title: 'Tarifas - Retrato / Moda', value: 'pricing-portrait'},
            {title: 'Tarifas - Cumpleaños / 15 Años / Bautizos', value: 'pricing-events'},
            {title: 'Tarifas - Bodas', value: 'pricing-wedding'},
          ],
        },
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'image',
        title: 'Fotografía',
        type: 'image',
        options: {
          hotspot: true, // Permite recortar el punto focal de la imagen desde el panel
        },
        validation: (Rule: any) => Rule.required(),
      },
    ],
    preview: {
      select: {
        title: 'title',
        subtitle: 'placement',
        media: 'image',
      },
    },
  }
];
