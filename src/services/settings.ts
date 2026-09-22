import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export interface PricingFeaturesConfig {
  showImageEditing: boolean;   // "Edición de imagen"
  showPrivateGallery: boolean; // "Galería privada"
  showHighRes: boolean;        // "Entrega en alta resolución"
  updatedAt?: any;
}

export const DEFAULT_PRICING_FEATURES: PricingFeaturesConfig = {
  showImageEditing: true,
  showPrivateGallery: true,
  showHighRes: true,
};

// Usamos 'site_photos' como colección primaria porque ya tiene 'allow read: if true;'
// y permisos de escritura activos en Firebase Cloud para el administrador original.
// También sincronizamos con 'site_settings' para compatibilidad total con las nuevas reglas.
const PRIMARY_COLLECTION = 'site_photos';
const PRIMARY_DOC_ID = 'pricing_features';
const SECONDARY_COLLECTION = 'site_settings';
const SECONDARY_DOC_ID = 'pricing_features';
const LOCAL_CACHE_KEY_PRICING = 'cr_pricing_features_cache';

function getLocalCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setLocalCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn('No se pudo guardar la caché local de configuración:', err);
  }
}

/**
 * Obtiene la configuración actual de características de tarifas con soporte offline/caché.
 */
export const getPricingFeatures = async (): Promise<PricingFeaturesConfig> => {
  const cached = getLocalCache<PricingFeaturesConfig>(LOCAL_CACHE_KEY_PRICING);
  try {
    // 1. Intentar desde site_photos (colección primaria con permisos de lectura universales)
    const primaryRef = doc(db, PRIMARY_COLLECTION, PRIMARY_DOC_ID);
    const docSnap = await getDoc(primaryRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as PricingFeaturesConfig;
      const merged = { ...DEFAULT_PRICING_FEATURES, ...data };
      setLocalCache(LOCAL_CACHE_KEY_PRICING, merged);
      return merged;
    }

    // 2. Intentar desde site_settings como alternativa
    const secondaryRef = doc(db, SECONDARY_COLLECTION, SECONDARY_DOC_ID);
    const secSnap = await getDoc(secondaryRef);
    if (secSnap.exists()) {
      const data = secSnap.data() as PricingFeaturesConfig;
      const merged = { ...DEFAULT_PRICING_FEATURES, ...data };
      setLocalCache(LOCAL_CACHE_KEY_PRICING, merged);
      return merged;
    }
  } catch (error) {
    console.warn('Error al obtener configuración de Firestore, usando caché:', error);
  }
  return cached || DEFAULT_PRICING_FEATURES;
};

/**
 * Suscripción en tiempo real a las características de tarifas (Stale-While-Revalidate).
 * Emite inmediatamente la caché local para 0ms de espera visual y actualiza en tiempo real.
 */
export const subscribeToPricingFeatures = (
  callback: (features: PricingFeaturesConfig) => void
): (() => void) => {
  // 1. Emitir de inmediato la caché local si existe, o el valor por defecto
  const cached = getLocalCache<PricingFeaturesConfig>(LOCAL_CACHE_KEY_PRICING);
  callback(cached || DEFAULT_PRICING_FEATURES);

  // 2. Suscribirse a la colección primaria site_photos
  const primaryRef = doc(db, PRIMARY_COLLECTION, PRIMARY_DOC_ID);
  const unsubPrimary = onSnapshot(
    primaryRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as PricingFeaturesConfig;
        const merged: PricingFeaturesConfig = {
          showImageEditing: data.showImageEditing !== undefined ? data.showImageEditing : true,
          showPrivateGallery: data.showPrivateGallery !== undefined ? data.showPrivateGallery : true,
          showHighRes: data.showHighRes !== undefined ? data.showHighRes : true,
        };
        setLocalCache(LOCAL_CACHE_KEY_PRICING, merged);
        callback(merged);
      }
    },
    (error) => {
      console.warn('Aviso en suscripción primaria (usando caché):', error);
      if (cached) {
        callback(cached);
      }
    }
  );

  // 3. Suscribirse también a site_settings por si el documento reside allí
  const secondaryRef = doc(db, SECONDARY_COLLECTION, SECONDARY_DOC_ID);
  const unsubSecondary = onSnapshot(
    secondaryRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as PricingFeaturesConfig;
        const merged: PricingFeaturesConfig = {
          showImageEditing: data.showImageEditing !== undefined ? data.showImageEditing : true,
          showPrivateGallery: data.showPrivateGallery !== undefined ? data.showPrivateGallery : true,
          showHighRes: data.showHighRes !== undefined ? data.showHighRes : true,
        };
        setLocalCache(LOCAL_CACHE_KEY_PRICING, merged);
        callback(merged);
      }
    },
    () => {
      // Si site_settings no tiene reglas de lectura habilitadas aún en Firebase, ignorar silenciosamente
    }
  );

  return () => {
    unsubPrimary();
    unsubSecondary();
  };
};

/**
 * Actualiza las opciones de características visibles en tarifas con actualización optimista
 * y sincronización con Firestore (intentando en site_photos y en site_settings).
 */
export const updatePricingFeatures = async (
  features: Partial<PricingFeaturesConfig>
): Promise<void> => {
  const current = getLocalCache<PricingFeaturesConfig>(LOCAL_CACHE_KEY_PRICING) || DEFAULT_PRICING_FEATURES;
  const updated: PricingFeaturesConfig = {
    ...current,
    ...features,
  };

  // Actualizar caché local de inmediato (optimistic update)
  setLocalCache(LOCAL_CACHE_KEY_PRICING, updated);

  let atLeastOneSuccess = false;
  let lastError: any = null;

  // Intento 1: Guardar en site_photos (cuenta con permisos de lectura y escritura ya desplegados en cloud)
  try {
    const primaryRef = doc(db, PRIMARY_COLLECTION, PRIMARY_DOC_ID);
    await setDoc(primaryRef, {
      ...updated,
      type: 'pricing_features_setting',
      updatedAt: serverTimestamp()
    }, { merge: true });
    atLeastOneSuccess = true;
  } catch (err) {
    lastError = err;
    console.warn('No se pudo guardar en site_photos:', err);
  }

  // Intento 2: Guardar en site_settings
  try {
    const secondaryRef = doc(db, SECONDARY_COLLECTION, SECONDARY_DOC_ID);
    await setDoc(secondaryRef, {
      ...updated,
      updatedAt: serverTimestamp()
    }, { merge: true });
    atLeastOneSuccess = true;
  } catch (err) {
    if (!atLeastOneSuccess) lastError = err;
    console.warn('No se pudo guardar en site_settings:', err);
  }

  // Si ninguno de los dos métodos pudo escribir en Firestore (por reglas de seguridad no publicadas en Firebase Console)
  if (!atLeastOneSuccess && lastError) {
    throw lastError;
  }
};
