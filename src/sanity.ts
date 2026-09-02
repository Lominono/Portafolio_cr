import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: '3vr7hd19', // ID de tu proyecto
  dataset: 'photospaneladmin', // Tu dataset
  useCdn: true, // Usa la CDN súper rápida de Sanity
  apiVersion: '2024-01-01', // Fecha de la API
});

// Utilidad para extraer URLs de imágenes hiper-optimizadas
const builder = imageUrlBuilder(client);

export const urlFor = (source: any) => {
  return builder.image(source);
};
