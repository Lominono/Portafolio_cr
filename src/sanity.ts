import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const client = createClient({
  projectId: '3vr7hd19', // ID de tu proyecto
  dataset: 'photospaneladmin', // Tu dataset
  useCdn: false, // En false para reflejar los cambios y fotos nuevas inmediatamente
  apiVersion: '2024-01-01', // Fecha de la API
});

// Utilidad para extraer URLs de imágenes hiper-optimizadas
const builder = createImageUrlBuilder(client);

export const urlFor = (source: any) => {
  return builder.image(source);
};

export const safeUrlFor = (source: any): string | null => {
  if (!source || !source.asset) return null;
  try {
    return builder.image(source).auto('format').url();
  } catch (error) {
    console.error('Error procesando imagen de Sanity:', error);
    return null;
  }
};
