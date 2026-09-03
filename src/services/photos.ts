import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../firebase';
import { SITE_SECTIONS } from '../config/sections';

export interface StoredPhoto {
  id: string;
  url: string;
  storagePath: string;
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
 * Obtiene todas las fotografías del sitio agrupadas por sectionId.
 * Retorna un mapa: { [sectionId]: [url1, url2, ...] }
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
 * Obtiene los detalles completos (con storagePath e IDs) de una sección específica.
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
 * Sube una nueva fotografía a una sección, verificando el límite estricto.
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

  // 1. Obtener fotos actuales para validar cupo
  const currentPhotos = await getSectionData(sectionId);
  if (currentPhotos.length >= sectionConfig.maxPhotos) {
    throw new Error(
      `Límite alcanzado (${sectionConfig.maxPhotos} fotos permitidas). Debes eliminar una foto antes de subir otra.`
    );
  }

  // 2. Subir archivo a Firebase Storage
  const photoId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `site_photos/${sectionId}/${photoId}_${cleanFileName}`;
  const storageRef = ref(storage, storagePath);

  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
    cacheControl: 'public, max-age=31536000'
  });

  return new Promise<StoredPhoto>((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error('Error al subir a Storage:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

          const newPhoto: StoredPhoto = {
            id: photoId,
            url: downloadUrl,
            storagePath,
            createdAt: new Date().toISOString(),
            name: file.name
          };

          const updatedImages = [...currentPhotos, newPhoto];

          // 3. Guardar en Firestore
          await setDoc(doc(db, COLLECTION_NAME, sectionId), {
            sectionId,
            images: updatedImages,
            updatedAt: serverTimestamp()
          });

          resolve(newPhoto);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
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

  // 1. Subir la nueva foto
  const newPhotoId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const cleanFileName = newFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `site_photos/${sectionId}/${newPhotoId}_${cleanFileName}`;
  const storageRef = ref(storage, storagePath);

  const uploadTask = uploadBytesResumable(storageRef, newFile, {
    contentType: newFile.type,
    cacheControl: 'public, max-age=31536000'
  });

  return new Promise<StoredPhoto>((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (onProgress) onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

          const updatedPhoto: StoredPhoto = {
            id: newPhotoId,
            url: downloadUrl,
            storagePath,
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

          // 3. Eliminar la foto antigua de Storage de forma asíncrona
          if (oldPhoto.storagePath) {
            try {
              const oldStorageRef = ref(storage, oldPhoto.storagePath);
              await deleteObject(oldStorageRef);
            } catch (delErr) {
              console.warn('No se pudo borrar el archivo antiguo de Storage:', delErr);
            }
          }

          resolve(updatedPhoto);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};

/**
 * Elimina una fotografía de la sección y de Firebase Storage.
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

  // 2. Eliminar archivo de Storage
  if (storagePath) {
    try {
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
    } catch (err) {
      console.warn('Advertencia al eliminar archivo de Storage:', err);
    }
  }
};
