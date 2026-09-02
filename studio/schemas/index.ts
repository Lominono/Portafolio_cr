export const schemaTypes = [
  {
    name: 'portfolioImage',
    title: 'Foto de Portafolio',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Título de la Foto',
        type: 'string',
      },
      {
        name: 'category',
        title: 'Categoría',
        type: 'string',
        options: {
          list: [
            {title: 'Bodas', value: 'bodas'},
            {title: 'Retratos', value: 'retratos'},
            {title: 'Eventos', value: 'eventos'},
          ],
        },
      },
      {
        name: 'image',
        title: 'Imagen',
        type: 'image',
        options: {
          hotspot: true,
        },
      },
    ],
  }
]
