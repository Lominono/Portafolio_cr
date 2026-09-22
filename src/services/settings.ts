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

const SETTINGS_COLLECTION = 'site_settings';
const PRICING_DOC_ID = 'pricing_features';
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
    const docRef = doc(db, SETTINGS_COLLECTION, PRICING_DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as PricingFeaturesConfig;
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

  const docRef = doc(db, SETTINGS_COLLECTION, PRICING_DOC_ID);
  return onSnapshot(
    docRef,
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
      } else {
        callback(DEFAULT_PRICING_FEATURES);
      }
    },
    (error) => {
      console.warn('Aviso en suscripción a configuración de tarifas (usando caché):', error);
      if (cached) {
        callback(cached);
      }
    }
  );
};

/**
 * Actualiza las opciones de características visibles en tarifas con actualización optimista.
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

  const docRef = doc(db, SETTINGS_COLLECTION, PRICING_DOC_ID);
  await setDoc(docRef, {
    ...updated,
    updatedAt: serverTimestamp()
  }, { merge: true });
};
