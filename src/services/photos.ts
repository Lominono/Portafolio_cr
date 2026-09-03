import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { SITE_SECTIONS } from '../config/sections';
import { CLOUDINARY_CONFIG } from '../config/cloudinary';

export interface StoredPhoto {
  id: string;
  url: string;
  storagePath: string; // Cloudinary public_id
  createdAt: string;
  name: string;
}

export interface SectionDocument {
  sectionId: string;
  images: StoredPhoto[];
  updatedAt?: any;
}

const COLLECTION_NAME = 'site_photos';

/**
 * Función criptográfica nativa del navegador para generar firmas SHA-1 de Cloudinary.
 */
async function generateSha1(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await window.crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Sube un archivo a Cloudinary con firma segura y progreso en tiempo real.
 */
async function uploadToCloudinary(
  file: File,
  folder: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string; publicId: string }> {
  const timestamp = Math.round(Date.now() / 1000);
  const strToSign = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
  const signature = await generateSha1(strToSign);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', CLOUDINARY_CONFIG.apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('folder', folder);
  formData.append('signature', signature);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      'POST',
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`
    );

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          // Inyectar optimización automática f_auto,q_auto en la URL de entrega
          let secureUrl = res.secure_url;
          if (secureUrl && secureUrl.includes('/upload/')) {
            secureUrl = secureUrl.replace('/upload/', '/upload/f_auto,q_auto/');
          }
          resolve({
            url: secureUrl,
            publicId: res.public_id
          });
        } catch (err) {
          reject(new Error('Respuesta no válida de Cloudinary.'));
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          reject(new Error(errData.error?.message || 'Error al subir a Cloudinary.'));
        } catch {
          reject(new Error(`Error en servidor Cloudinary: ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Error de red al conectar con Cloudinary.'));
    xhr.send(formData);
  });
}

/**
 * Elimina una imagen en Cloudinary mediante su publicId y purga la caché de CDN.
 */
async function deleteFromCloudinary(publicId: string): Promise<void> {
  const timestamp = Math.round(Date.now() / 1000);
  // Parámetros ordenados alfabéticamente para la firma Cloudinary: invalidate, public_id, timestamp
  const strToSign = `invalidate=true&public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_CONFIG.apiSecret}`;
  const signature = await generateSha1(strToSign);

  const formData = new FormData();
  formData.append('public_id', publicId);
  formData.append('api_key', CLOUDINARY_CONFIG.apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('invalidate', 'true');
  formData.append('signature', signature);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/destroy`,
      {
        method: 'POST',
        body: formData
      }
    );
    const data = await response.json();
    console.log(`Cloudinary destroy status (${publicId}):`, data);
    if (data.result !== 'ok' && data.result !== 'not found') {
      console.warn('Respuesta inesperada de Cloudinary destroy:', data);
    }
  } catch (err) {
    console.warn('Error al eliminar archivo en Cloudinary:', err);
  }
}

/**
 * Obtiene todas las fotografías del sitio agrupadas por sectionId.
 */
export const getAllPhotosMap = async (): Promise<Record<string, string[]>> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const map: Record<string, string[]> = {};

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as SectionDocument;
      if (data && Array.isArray(data.images)) {
        map[docSnap.id] = data.images.map((img) => img.url);
      }
    });

    return map;
  } catch (error) {
    console.error('Error al obtener fotos desde Firestore:', error);
    return {};
  }
};

/**
 * Suscripción en tiempo real a todas las fotos para reflejar cambios instantáneamente.
 */
export const subscribeToAllPhotos = (
  callback: (photos: Record<string, string[]>) => void
): (() => void) => {
  const colRef = collection(db, COLLECTION_NAME);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const map: Record<string, string[]> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as SectionDocument;
        if (data && Array.isArray(data.images)) {
          map[docSnap.id] = data.images.map((img) => img.url);
        }
      });
      callback(map);
    },
    (error) => {
      console.error('Error en suscripción de fotos:', error);
    }
  );
};

/**
 * Obtiene los detalles completos de una sección específica.
 */
export const getSectionData = async (sectionId: string): Promise<StoredPhoto[]> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, sectionId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as SectionDocument;
      return Array.isArray(data.images) ? data.images : [];
    }
    return [];
  } catch (error) {
    console.error(`Error al obtener sección ${sectionId}:`, error);
    return [];
  }
};

/**
 * Sube una nueva fotografía a una sección, verificando el límite estricto de cupo.
 */
export const uploadPhoto = async (
  sectionId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<StoredPhoto> => {
  const sectionConfig = SITE_SECTIONS.find((s) => s.id === sectionId);
  if (!sectionConfig) {
    throw new Error(`Sección no válida: ${sectionId}`);
  }

  // 1. Validar límite estricto de fotos
  const currentPhotos = await getSectionData(sectionId);
  if (currentPhotos.length >= sectionConfig.maxPhotos) {
    throw new Error(
      `Límite alcanzado (${sectionConfig.maxPhotos} fotos permitidas). Debes eliminar una foto antes de subir otra.`
    );
  }

  // 2. Subir imagen a Cloudinary (con CDN y compresión automática)
  const folder = `${CLOUDINARY_CONFIG.folder}/${sectionId}`;
  const cloudinaryResult = await uploadToCloudinary(file, folder, onProgress);

  const photoId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const newPhoto: StoredPhoto = {
    id: photoId,
    url: cloudinaryResult.url,
    storagePath: cloudinaryResult.publicId,
    createdAt: new Date().toISOString(),
    name: file.name
  };

  const updatedImages = [...currentPhotos, newPhoto];

  // 3. Guardar metadatos en Firestore
  await setDoc(doc(db, COLLECTION_NAME, sectionId), {
    sectionId,
    images: updatedImages,
    updatedAt: serverTimestamp()
  });

  return newPhoto;
};

/**
 * Reemplaza una fotografía existente por un nuevo archivo.
 */
export const replacePhoto = async (
  sectionId: string,
  targetPhotoId: string,
  newFile: File,
  onProgress?: (progress: number) => void
): Promise<StoredPhoto> => {
  const currentPhotos = await getSectionData(sectionId);
  const targetIndex = currentPhotos.findIndex((p) => p.id === targetPhotoId);

  if (targetIndex === -1) {
    throw new Error('La fotografía que intentas reemplazar no existe.');
  }

  const oldPhoto = currentPhotos[targetIndex];

  // 1. Subir la nueva foto a Cloudinary
  const folder = `${CLOUDINARY_CONFIG.folder}/${sectionId}`;
  const cloudinaryResult = await uploadToCloudinary(newFile, folder, onProgress);

  const newPhotoId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const updatedPhoto: StoredPhoto = {
    id: newPhotoId,
    url: cloudinaryResult.url,
    storagePath: cloudinaryResult.publicId,
    createdAt: new Date().toISOString(),
    name: newFile.name
  };

  // 2. Actualizar la lista manteniendo la posición exacta del slot
  const updatedImages = [...currentPhotos];
  updatedImages[targetIndex] = updatedPhoto;

  await setDoc(doc(db, COLLECTION_NAME, sectionId), {
    sectionId,
    images: updatedImages,
    updatedAt: serverTimestamp()
  });

  // 3. Eliminar la foto anterior de Cloudinary asegurando que libere espacio
  if (oldPhoto.storagePath) {
    await deleteFromCloudinary(oldPhoto.storagePath);
  }

  return updatedPhoto;
};

/**
 * Elimina una fotografía de la sección en Firestore y de Cloudinary.
 */
export const deletePhoto = async (
  sectionId: string,
  photoId: string,
  storagePath: string
): Promise<void> => {
  const currentPhotos = await getSectionData(sectionId);
  const updatedImages = currentPhotos.filter((p) => p.id !== photoId);

  // 1. Actualizar Firestore
  await setDoc(doc(db, COLLECTION_NAME, sectionId), {
    sectionId,
    images: updatedImages,
    updatedAt: serverTimestamp()
  });

  // 2. Eliminar archivo de Cloudinary liberando espacio inmediatamente
  if (storagePath) {
    await deleteFromCloudinary(storagePath);
  }
};
