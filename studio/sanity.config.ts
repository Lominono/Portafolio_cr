import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemas'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'Cristian Photos Panel',

  projectId: '3vr7hd19',
  dataset: 'photospaneladmin',

  plugins: [
    structureTool({
      structure,
    }),
  ],

  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev,
      {
        id: 'siteImage-home-about',
        title: 'Retrato Inicio',
        schemaType: 'siteImage',
        value: {
          placement: 'home-about',
        },
      },
      {
        id: 'siteImage-home-portfolio',
        title: 'Portafolio Inicio',
        schemaType: 'siteImage',
        value: {
          placement: 'home-portfolio',
        },
      },
      {
        id: 'siteImage-about-main',
        title: 'Retrato Sobre Mí',
        schemaType: 'siteImage',
        value: {
          placement: 'about-main',
        },
      },
      {
        id: 'siteImage-about-details',
        title: 'Detalles Sobre Mí',
        schemaType: 'siteImage',
        value: {
          placement: 'about-details',
        },
      },
      {
        id: 'siteImage-pricing-wedding',
        title: 'Tarifas Bodas',
        schemaType: 'siteImage',
        value: {
          placement: 'pricing-wedding',
        },
      },
      {
        id: 'siteImage-pricing-portrait',
        title: 'Tarifas Retrato Moda',
        schemaType: 'siteImage',
        value: {
          placement: 'pricing-portrait',
        },
      },
      {
        id: 'siteImage-pricing-events',
        title: 'Tarifas Eventos',
        schemaType: 'siteImage',
        value: {
          placement: 'pricing-events',
        },
      },
    ],
  },
})
