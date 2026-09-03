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
        value: { placement: 'home-about' },
      },
      {
        id: 'siteImage-home-portfolio',
        title: 'Portafolio Inicio',
        schemaType: 'siteImage',
        value: { placement: 'home-portfolio' },
      },
      {
        id: 'siteImage-home-service-wedding',
        title: 'Especialidad Bodas',
        schemaType: 'siteImage',
        value: { placement: 'home-service-wedding' },
      },
      {
        id: 'siteImage-home-service-portrait',
        title: 'Especialidad Retrato',
        schemaType: 'siteImage',
        value: { placement: 'home-service-portrait' },
      },
      {
        id: 'siteImage-home-service-events',
        title: 'Especialidad Eventos',
        schemaType: 'siteImage',
        value: { placement: 'home-service-events' },
      },
      {
        id: 'siteImage-home-service-sports',
        title: 'Especialidad Deportes',
        schemaType: 'siteImage',
        value: { placement: 'home-service-sports' },
      },
      {
        id: 'siteImage-about-main',
        title: 'Retrato Sobre Mí',
        schemaType: 'siteImage',
        value: { placement: 'about-main' },
      },
      {
        id: 'siteImage-about-details',
        title: 'Detalles Sobre Mí',
        schemaType: 'siteImage',
        value: { placement: 'about-details' },
      },
      {
        id: 'siteImage-pricing-wedding',
        title: 'Tarifas Bodas',
        schemaType: 'siteImage',
        value: { placement: 'pricing-wedding' },
      },
      {
        id: 'siteImage-pricing-wedding-full',
        title: 'Tarifas Boda Completa',
        schemaType: 'siteImage',
        value: { placement: 'pricing-wedding-full' },
      },
      {
        id: 'siteImage-pricing-portrait',
        title: 'Tarifas Retrato Moda',
        schemaType: 'siteImage',
        value: { placement: 'pricing-portrait' },
      },
      {
        id: 'siteImage-pricing-birthday',
        title: 'Tarifas Cumpleaños',
        schemaType: 'siteImage',
        value: { placement: 'pricing-birthday' },
      },
      {
        id: 'siteImage-pricing-quince',
        title: 'Tarifas 15 Años',
        schemaType: 'siteImage',
        value: { placement: 'pricing-quince' },
      },
      {
        id: 'siteImage-pricing-baptism',
        title: 'Tarifas Bautizos y Comuniones',
        schemaType: 'siteImage',
        value: { placement: 'pricing-baptism' },
      },
      {
        id: 'siteImage-pricing-sports',
        title: 'Tarifas Deportes',
        schemaType: 'siteImage',
        value: { placement: 'pricing-sports' },
      },
      {
        id: 'siteImage-pricing-special',
        title: 'Tarifas Sesiones Especiales',
        schemaType: 'siteImage',
        value: { placement: 'pricing-special' },
      },
      {
        id: 'siteImage-pricing-events',
        title: 'Tarifas Eventos Generales',
        schemaType: 'siteImage',
        value: { placement: 'pricing-events' },
      },
    ],
  },
})
