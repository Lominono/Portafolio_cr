/* Apple UI Design System – Verified: 8pt Grid, SF Pro Typography, Material-Depth, Natural Spring Motion */
import React, { useState, useEffect, useRef } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  Lock, 
  LogOut, 
  Upload, 
  Trash2, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle,
  Image as ImageIcon,
  Crop,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  SlidersHorizontal
} from 'lucide-react';
import { auth, db } from '../firebase';
import { SITE_SECTIONS, SectionConfig, TOTAL_SITE_SLOTS } from '../config/sections';
import { 
  getAllSectionsData,
  uploadPhoto, 
  replacePhoto, 
  deletePhoto, 
  StoredPhoto 
} from '../services/photos';
import { 
  subscribeToPricingFeatures, 
  updatePricingFeatures, 
  PricingFeaturesConfig, 
  DEFAULT_PRICING_FEATURES 
} from '../services/settings';
import ImageCropModal from '../components/ImageCropModal';

const MASTER_SECURITY_PASSCODE = 'f32ZSJNr';
const AUTHORIZED_PRIMARY_EMAIL = 'Christianespinolas2317@gmail.com';

export const AdminPanel: React.FC = () => {
  // Estado de autenticación y verificación de seguridad
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Estados para la verificación de seguridad por contraseña
  const [securityCodeInput, setSecurityCodeInput] = useState('');
  const [showSecurityCode, setShowSecurityCode] = useState(false);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  // Estado de características visibles en tarifas (en tiempo real)
  const [pricingFeatures, setPricingFeatures] = useState<PricingFeaturesConfig>(DEFAULT_PRICING_FEATURES);
  const [isUpdatingFeature, setIsUpdatingFeature] = useState(false);

  // Estado de secciones y fotos
  const [selectedPage, setSelectedPage] = useState<'Todas' | 'Inicio' | 'Sobre Mí' | 'Tarifas'>('Todas');
  const [photosData, setPhotosData] = useState<Record<string, StoredPhoto[]>>({});
  const [loadingSections, setLoadingSections] = useState(true);

  // Estados de subida y acciones
  const [uploadingSection, setUploadingSection] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Estado del Modal de Recorte y Editor
  const [cropModalState, setCropModalState] = useState<{
    isOpen: boolean;
    file: File | null;
    section: SectionConfig;
    targetAspectRatio: string;
    slotLabel?: string;
    recommendationTip?: string;
    replacePhotoId?: string;
  } | null>(null);

  // Estado de Drag and Drop en secciones
  const [dragOverSectionId, setDragOverSectionId] = useState<string | null>(null);

  // Modal de confirmación de eliminación
  const [photoToDelete, setPhotoToDelete] = useState<{
    sectionId: string;
    photo: StoredPhoto;
    sectionTitle: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Input oculto para reemplazo directo
  const [photoToReplace, setPhotoToReplace] = useState<{
    section: SectionConfig;
    photoId: string;
    slotIndex: number;
  } | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // 1. Meta noindex para buscadores y título
  useEffect(() => {
    document.title = 'Panel de Control Privado | Cristian Espinola';
    
    let metaTag = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'robots';
      document.head.appendChild(metaTag);
    }
    const originalContent = metaTag.content;
    metaTag.content = 'noindex, nofollow';

    return () => {
      metaTag.content = originalContent || '';
    };
  }, []);

  // 2. Listener de autenticación y verificación de seguridad
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Si es el correo maestro original, está verificado automáticamente
        if (currentUser.email?.toLowerCase() === AUTHORIZED_PRIMARY_EMAIL.toLowerCase()) {
          setIsVerified(true);
          setAuthLoading(false);
          loadAllSectionsData();
          return;
        }

        // Para nuevos usuarios, verificar si ya validaron con la clave de seguridad previamente
        const localCheck = localStorage.getItem(`cr_admin_verified_${currentUser.uid}`);
        if (localCheck === 'true') {
          setIsVerified(true);
          setAuthLoading(false);
          loadAllSectionsData();
          return;
        }

        // Comprobar en Firestore si está en la colección authorized_admins
        try {
          const adminDoc = await getDoc(doc(db, 'authorized_admins', currentUser.uid));
          if (adminDoc.exists() && adminDoc.data()?.verified === true) {
            localStorage.setItem(`cr_admin_verified_${currentUser.uid}`, 'true');
            setIsVerified(true);
            setAuthLoading(false);
            loadAllSectionsData();
            return;
          }
        } catch (err) {
          console.warn('Comprobación de autorización remota no disponible en este momento:', err);
        }

        // Si no está verificado aún, requerir la contraseña de seguridad
        setIsVerified(false);
        setAuthLoading(false);
      } else {
        setUser(null);
        setIsVerified(false);
        setAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Cargar datos de todas las secciones en una sola petición optimizada
  const loadAllSectionsData = async () => {
    setLoadingSections(true);
    try {
      const data = await getAllSectionsData();
      setPhotosData(data);
    } catch (err) {
      console.error('Error al cargar fotos:', err);
      showActionError('Error al sincronizar las fotografías desde Firebase.');
    } finally {
      setLoadingSections(false);
    }
  };

  // Manejo de mensajes temporales
  const showActionSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const showActionError = (msg: string) => {
    setActionError(msg);
    setTimeout(() => setActionError(null), 5000);
  };

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
    } catch (err: any) {
      console.error('Error de login:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setAuthError('Correo o contraseña incorrectos. Verifica tus datos de acceso.');
      } else if (err.code === 'auth/too-many-requests') {
        setAuthError('Demasiados intentos fallidos. Espera unos minutos e inténtalo de nuevo.');
      } else {
        setAuthError('Error al iniciar sesión: ' + (err.message || 'Verifica tu conexión.'));
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsVerified(false);
      setSecurityCodeInput('');
      setSecurityError(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  // Verificación de la contraseña de seguridad para primer acceso
  const handleVerifySecurityCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError(null);

    if (securityCodeInput.trim() !== MASTER_SECURITY_PASSCODE) {
      setSecurityError('Contraseña de seguridad incorrecta. Solicita la clave de verificación al administrador.');
      return;
    }

    setIsVerifyingCode(true);
    try {
      if (user) {
        // Registrar en Firestore para persistencia multi-dispositivo
        try {
          await setDoc(doc(db, 'authorized_admins', user.uid), {
            uid: user.uid,
            email: user.email,
            verified: true,
            verifiedAt: new Date().toISOString()
          });
        } catch (firestoreErr) {
          console.warn('Aviso: no se pudo sincronizar en Firestore directamente, activando autorización local:', firestoreErr);
        }

        // Guardar en almacenamiento local
        localStorage.setItem(`cr_admin_verified_${user.uid}`, 'true');
        setIsVerified(true);
        showActionSuccess('¡Acceso verificado y activado con éxito! Bienvenido al panel.');
        loadAllSectionsData();
      }
    } catch (err) {
      console.error('Error al procesar verificación:', err);
      setSecurityError('Hubo un problema al activar tu acceso. Inténtalo nuevamente.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // Suscripción reactiva a las características de tarifas cuando el administrador esté autenticado
  useEffect(() => {
    if (!isVerified) return;
    const unsub = subscribeToPricingFeatures((features) => {
      setPricingFeatures(features);
    });
    return () => unsub();
  }, [isVerified]);

  // Manejo de activación / desactivación en tiempo real de características de tarifas
  type FeatureKey = 'showImageEditing' | 'showPrivateGallery' | 'showHighRes';

  const handleTogglePricingFeature = async (key: FeatureKey) => {
    const newValue = !pricingFeatures[key];
    // Actualización optimista inmediata en la UI
    setPricingFeatures((prev) => ({ ...prev, [key]: newValue }));
    setIsUpdatingFeature(true);
    try {
      await updatePricingFeatures({ [key]: newValue });
      const labelMap: Record<FeatureKey, string> = {
        showImageEditing: 'Edición de imagen',
        showPrivateGallery: 'Galería privada',
        showHighRes: 'Entrega en alta resolución',
      };
      showActionSuccess(`Opción "${labelMap[key]}" ${newValue ? 'activada' : 'desactivada'} en tiempo real.`);
    } catch (err) {
      console.error('Error al actualizar característica de tarifas:', err);
      showActionError('No se pudo sincronizar el cambio con Firestore.');
      // Revertir en caso de error
      setPricingFeatures((prev) => ({ ...prev, [key]: !newValue }));
    } finally {
      setIsUpdatingFeature(false);
    }
  };

  // -------------------------------------------------------------
  // FLUJO DE SUBIDA CON RECORTE Y EDITOR INTERACTIVO
  // -------------------------------------------------------------

  // 1. Cuando el usuario selecciona un archivo (por clic o drop)
  const handleInitiateUpload = (section: SectionConfig, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];

    if (!file.type.startsWith('image/')) {
      showActionError('Por favor selecciona un archivo de imagen válido (JPG, PNG o WebP).');
      return;
    }

    const currentPhotos = photosData[section.id] || [];
    if (currentPhotos.length >= section.maxPhotos) {
      showActionError(`Límite alcanzado (${section.maxPhotos} fotos). Debes eliminar o reemplazar una foto.`);
      return;
    }

    const nextIndex = currentPhotos.length;
    const targetSlot = section.slots[nextIndex] || section.slots[0];

    // Abrir el editor de recorte antes de subir
    setCropModalState({
      isOpen: true,
      file,
      section,
      slotLabel: targetSlot?.label || `Foto ${nextIndex + 1}`,
      targetAspectRatio: targetSlot?.aspectRatio || '3:4',
      recommendationTip: targetSlot?.recommendation,
    });
  };

  // 2. Cuando el usuario pulsa "Reemplazar"
  const triggerReplacePhoto = (section: SectionConfig, photoId: string, slotIndex: number) => {
    setPhotoToReplace({ section, photoId, slotIndex });
    if (replaceFileInputRef.current) {
      replaceFileInputRef.current.value = '';
      replaceFileInputRef.current.click();
    }
  };

  const handleInitiateReplace = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || !photoToReplace) return;
    const file = fileList[0];

    if (!file.type.startsWith('image/')) {
      showActionError('Selecciona un archivo de imagen válido.');
      return;
    }

    const { section, photoId, slotIndex } = photoToReplace;
    const targetSlot = section.slots[slotIndex] || section.slots[0];

    // Abrir el editor de recorte para el reemplazo
    setCropModalState({
      isOpen: true,
      file,
      section,
      replacePhotoId: photoId,
      slotLabel: targetSlot?.label || `Foto ${slotIndex + 1}`,
      targetAspectRatio: targetSlot?.aspectRatio || '3:4',
      recommendationTip: targetSlot?.recommendation,
    });
  };

  // 3. Confirmación desde el Editor de Recorte
  const handleConfirmCropAndUpload = async (croppedFile: File) => {
    if (!cropModalState) return;
    const { section, replacePhotoId } = cropModalState;

    setCropModalState(null);
    setUploadingSection(section.id);
    setUploadProgress(0);

    try {
      if (replacePhotoId) {
        // Reemplazo en Cloudinary y Firestore
        const updatedPhoto = await replacePhoto(section.id, replacePhotoId, croppedFile, (progress) => {
          setUploadProgress(progress);
        });

        setPhotosData((prev) => {
          const current = prev[section.id] || [];
          const index = current.findIndex((p) => p.id === replacePhotoId);
          if (index === -1) return prev;
          const copy = [...current];
          copy[index] = updatedPhoto;
          return { ...prev, [section.id]: copy };
        });

        showActionSuccess(`Fotografía recortada y reemplazada con éxito en "${section.title}".`);
      } else {
        // Subida nueva a Cloudinary y Firestore
        const newPhoto = await uploadPhoto(section.id, croppedFile, (progress) => {
          setUploadProgress(progress);
        });

        setPhotosData((prev) => ({
          ...prev,
          [section.id]: [...(prev[section.id] || []), newPhoto]
        }));

        showActionSuccess(`Fotografía recortada y publicada en "${section.title}".`);
      }
    } catch (err: any) {
      console.error('Error al procesar subida:', err);
      showActionError(err.message || 'Ocurrió un error al subir la fotografía.');
    } finally {
      setUploadingSection(null);
      setUploadProgress(0);
      setPhotoToReplace(null);
    }
  };

  // -------------------------------------------------------------
  // MANEJO DE DRAG AND DROP
  // -------------------------------------------------------------
  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverSectionId !== sectionId) {
      setDragOverSectionId(sectionId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSectionId(null);
  };

  const handleDrop = (e: React.DragEvent, section: SectionConfig) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSectionId(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleInitiateUpload(section, e.dataTransfer.files);
    }
  };

  // Confirmar y ejecutar eliminación garantizada
  const handleExecuteDelete = async () => {
    if (!photoToDelete) return;
    setIsDeleting(true);

    try {
      await deletePhoto(
        photoToDelete.sectionId,
        photoToDelete.photo.id,
        photoToDelete.photo.storagePath
      );

      setPhotosData((prev) => ({
        ...prev,
        [photoToDelete.sectionId]: (prev[photoToDelete.sectionId] || []).filter(
          (p) => p.id !== photoToDelete.photo.id
        )
      }));

      showActionSuccess('Fotografía eliminada permanentemente de la web y de la nube.');
      setPhotoToDelete(null);
    } catch (err: any) {
      console.error('Error al eliminar:', err);
      showActionError('Error al eliminar la fotografía: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Conteo global de fotos subidas
  const totalUploadedPhotos = Object.values(photosData).reduce(
    (acc, list) => acc + (list?.length || 0),
    0
  );

  // Filtrado de secciones según la pestaña seleccionada
  const filteredSections = SITE_SECTIONS.filter((section) => {
    if (selectedPage === 'Todas') return true;
    return section.page === selectedPage;
  });

  // -------------------------------------------------------------
  // RENDER: PANTALLA DE CARGA INICIAL
  // -------------------------------------------------------------
  if (authLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-accentMain border-t-transparent rounded-full animate-spin"></div>
          <p className="title-main text-xs text-textSecondary tracking-widest">
            Verificando Credenciales...
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: PANTALLA DE LOGIN PRIVADO
  // -------------------------------------------------------------
  if (!user) {
    return (
      <div className="min-h-screen bg-primary flex flex-col justify-center items-center px-6 py-20">
        <div className="w-full max-w-md bg-neutral-50 p-8 sm:p-12 photo-card-secondary border border-neutral-200">
          
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-primary photo-card-secondary flex items-center justify-center mx-auto mb-6 text-accentMain">
              <Lock size={20} />
            </div>
            <h1 className="title-main text-2xl text-textMain mb-2">
              PANEL PRIVADO
            </h1>
            <p className="text-textSecondary font-sans font-light text-xs tracking-wider uppercase">
              Cristian Espinola Fotografía
            </p>
            <div className="w-8 h-px bg-accentMain mx-auto mt-6"></div>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-sans rounded-none flex items-start gap-3">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div>
              <label 
                htmlFor="admin-email" 
                className="block text-[10px] uppercase tracking-widest text-textSecondary font-sans mb-2"
              >
                Correo Electrónico
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="tu-correo@gmail.com"
                className="w-full bg-primary border border-neutral-200 p-3 font-sans text-sm text-textMain focus:outline-none focus:border-accentMain transition-colors"
              />
            </div>

            <div>
              <label 
                htmlFor="admin-password" 
                className="block text-[10px] uppercase tracking-widest text-textSecondary font-sans mb-2"
              >
                Contraseña
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-primary border border-neutral-200 p-3 font-sans text-sm text-textMain focus:outline-none focus:border-accentMain transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn-primary w-full text-xs font-sans tracking-widest uppercase mt-2 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Accediendo...</span>
                </>
              ) : (
                <span>Ingresar al Panel</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
            <span className="text-[10px] text-textSecondary uppercase tracking-widest font-sans">
              Acceso restringido al personal autorizado
            </span>
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: PANTALLA DE VERIFICACIÓN DE SEGURIDAD (PRIMER ACCESO)
  // -------------------------------------------------------------
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-primary flex flex-col justify-center items-center px-6 py-20">
        <div className="w-full max-w-md bg-neutral-50 p-8 sm:p-12 photo-card-secondary border border-neutral-200 shadow-apple-card">
          
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-white rounded-apple-card shadow-apple-subtle border border-black/[0.06] flex items-center justify-center mx-auto mb-6 text-accentMain">
              <ShieldCheck size={28} strokeWidth={1.5} />
            </div>
            <h1 className="title-main text-2xl text-textMain mb-2 tracking-tight">
              VERIFICACIÓN DE SEGURIDAD
            </h1>
            <p className="text-textSecondary font-sans font-light text-xs tracking-wider uppercase">
              Autorización de Primer Acceso
            </p>
            <div className="w-8 h-px bg-accentMain mx-auto mt-5"></div>
          </div>

          <div className="mb-6 p-4 bg-white rounded-apple-card border border-black/[0.06] text-textSecondary text-xs font-sans leading-relaxed">
            <p className="mb-1 text-textMain font-medium">
              Usuario autenticado: <span className="text-accentMain">{user.email}</span>
            </p>
            <p className="text-[11px] text-textSecondary/90 mt-1">
              Para validar este usuario y concederle acceso permanente a la gestión fotográfica del portafolio, introduce la contraseña de seguridad.
            </p>
          </div>

          {securityError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-sans rounded-apple-btn flex items-start gap-3">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>{securityError}</span>
            </div>
          )}

          <form onSubmit={handleVerifySecurityCode} className="flex flex-col gap-5">
            <div>
              <label 
                htmlFor="security-code-input" 
                className="block text-[10px] uppercase tracking-widest text-textSecondary font-sans mb-2"
              >
                Contraseña de Seguridad
              </label>
              <div className="relative">
                <input
                  id="security-code-input"
                  type={showSecurityCode ? 'text' : 'password'}
                  required
                  value={securityCodeInput}
                  onChange={(e) => {
                    setSecurityCodeInput(e.target.value);
                    if (securityError) setSecurityError(null);
                  }}
                  placeholder="Introduce la contraseña del sistema"
                  className="w-full bg-primary border border-neutral-200 p-3 pr-11 font-sans text-sm text-textMain focus:outline-none focus:border-accentMain rounded-apple-btn transition-colors"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowSecurityCode(!showSecurityCode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-textMain transition-colors p-1"
                  aria-label={showSecurityCode ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showSecurityCode ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifyingCode || !securityCodeInput.trim()}
              className="btn-primary w-full text-xs font-sans tracking-widest uppercase mt-2 flex items-center justify-center gap-2"
            >
              {isVerifyingCode ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <KeyRound size={15} />
                  <span>Verificar y Desbloquear Acceso</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-textSecondary hover:text-red-600 font-sans tracking-wide transition-colors py-2 flex items-center justify-center gap-1.5"
            >
              <LogOut size={13} />
              <span>Cerrar sesión o cambiar de cuenta</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
            <span className="text-[10px] text-textSecondary uppercase tracking-widest font-sans">
              Se registrará la autorización permanente para este usuario
            </span>
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: PANEL DE ADMINISTRACIÓN AUTENTICADO
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-primary pb-24 text-textMain">
      
      {/* Modal Interactivo de Recorte y Editor de Imagen */}
      {cropModalState && (
        <ImageCropModal
          isOpen={cropModalState.isOpen}
          file={cropModalState.file}
          sectionTitle={cropModalState.section.title}
          slotLabel={cropModalState.slotLabel}
          targetAspectRatio={cropModalState.targetAspectRatio}
          recommendationTip={cropModalState.recommendationTip}
          onConfirm={handleConfirmCropAndUpload}
          onCancel={() => setCropModalState(null)}
        />
      )}

      {/* Input oculto para el flujo de Reemplazo */}
      <input
        type="file"
        ref={replaceFileInputRef}
        onChange={(e) => handleInitiateReplace(e.target.files)}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      {/* Barra Superior de Navegación del Panel */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-neutral-200 px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          
          <div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <h1 className="title-main text-lg sm:text-xl text-textMain tracking-widest">
                PANEL DE GESTIÓN FOTOGRÁFICA
              </h1>
            </div>
            <p className="text-[11px] text-textSecondary font-sans font-light mt-0.5">
              Administrador: <strong className="font-normal text-textMain">{user.email}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-textSecondary hover:text-textMain font-sans border-b border-neutral-300 pb-0.5 transition-colors"
            >
              <span>Ver Web</span>
              <ExternalLink size={12} />
            </a>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-xs text-red-700 hover:text-red-900 font-sans border border-red-200 px-3 py-1.5 transition-colors"
            >
              <LogOut size={13} />
              <span>Cerrar Sesión</span>
            </button>
          </div>

        </div>
      </header>

      {/* Alertas Globales de Éxito / Error */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-6">
        {actionSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 text-sm font-sans flex items-center gap-3">
            <CheckCircle size={18} className="text-green-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {actionError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-sm font-sans flex items-center gap-3">
            <AlertTriangle size={18} className="text-red-600 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}
      </div>

      {/* Resumen Global de Cupos y Filtros */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 mt-4 mb-10">
        
        {/* Banner de Estado */}
        <div className="bg-neutral-50 p-6 photo-card-secondary border border-neutral-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h2 className="title-main text-sm text-textMain mb-1">
              ESTADO DEL PORTAFOLIO EN VIVO
            </h2>
            <p className="text-xs text-textSecondary font-sans font-light">
              Las fotos se procesan en Cloudinary con entrega WebP/AVIF y se sincronizan en Firestore. Puedes arrastrar fotos directamente sobre cualquier sección.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="block text-2xl font-serif text-accentMain">
                {totalUploadedPhotos} / {TOTAL_SITE_SLOTS}
              </span>
              <span className="text-[10px] text-textSecondary uppercase tracking-widest font-sans">
                Slots Globales Ocupados
              </span>
            </div>
            <button
              onClick={loadAllSectionsData}
              disabled={loadingSections}
              className="p-3 bg-white photo-card-secondary border border-neutral-200 hover:border-accentMain text-textSecondary hover:text-accentMain transition-colors"
              title="Recargar datos"
            >
              <RefreshCw size={16} className={loadingSections ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Pestañas de Filtro por Página */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-200 no-scrollbar">
          {(['Todas', 'Inicio', 'Sobre Mí', 'Tarifas'] as const).map((tab) => {
            const isActive = selectedPage === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedPage(tab)}
                className={`text-xs uppercase tracking-widest font-sans px-5 py-2.5 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-accentMain text-white font-normal'
                    : 'bg-neutral-100 text-textSecondary hover:bg-neutral-200'
                }`}
              >
                {tab === 'Todas' ? 'Todas las Secciones' : `Página ${tab}`}
              </button>
            );
          })}
        </div>

      </section>

      {/* Grid de Secciones */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8">
        {loadingSections ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-accentMain border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xs uppercase tracking-widest text-textSecondary font-sans">
              Cargando catálogo de secciones...
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {/* Panel de Control de Características en Tarifas (Tiempo Real) */}
            {(selectedPage === 'Todas' || selectedPage === 'Tarifas') && (
              <div className="bg-white rounded-apple-card p-6 sm:p-8 border border-neutral-200 shadow-apple-card photo-card-secondary transition-all">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-apple-btn bg-accentMain/10 text-accentMain flex items-center justify-center shrink-0">
                      <SlidersHorizontal size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="title-main text-base sm:text-lg text-textMain tracking-tight">
                        CARACTERÍSTICAS VISIBLES EN TARIFAS
                      </h2>
                      <p className="text-xs text-textSecondary font-sans font-light mt-0.5">
                        Activa o desactiva qué inclusiones se muestran a los visitantes en los paquetes de servicios.
                      </p>
                    </div>
                  </div>

                  <div className="apple-badge text-green-700 bg-green-50 border-green-200/60 shrink-0 self-start sm:self-auto">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="font-sans text-[11px] font-medium">Sincronización en Vivo</span>
                  </div>
                </div>

                {/* Lista de Interruptores Apple iOS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                  
                  {/* Opción 1: Edición de Imagen */}
                  <div className="p-4 rounded-apple-card bg-neutral-50/70 border border-black/[0.04] flex items-center justify-between gap-4 transition-all hover:bg-neutral-100/50">
                    <div className="pr-2">
                      <span className="text-xs font-medium text-textMain font-sans block mb-0.5">
                        Edición de imagen
                      </span>
                      <span className="text-[11px] text-textSecondary font-sans font-light leading-snug block">
                        Muestra «✓ Edición de imagen» en cada paquete.
                      </span>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={pricingFeatures.showImageEditing}
                      disabled={isUpdatingFeature}
                      onClick={() => handleTogglePricingFeature('showImageEditing')}
                      className={`w-[51px] h-[31px] rounded-full p-[2px] transition-colors duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] relative shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accentMain ${
                        pricingFeatures.showImageEditing ? 'bg-accentMain' : 'bg-neutral-300'
                      }`}
                      aria-label="Alternar visibilidad de Edición de imagen"
                    >
                      <span 
                        className={`block w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                          pricingFeatures.showImageEditing ? 'translate-x-[20px]' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Opción 2: Galería Privada */}
                  <div className="p-4 rounded-apple-card bg-neutral-50/70 border border-black/[0.04] flex items-center justify-between gap-4 transition-all hover:bg-neutral-100/50">
                    <div className="pr-2">
                      <span className="text-xs font-medium text-textMain font-sans block mb-0.5">
                        Galería privada
                      </span>
                      <span className="text-[11px] text-textSecondary font-sans font-light leading-snug block">
                        Muestra «✓ Galería privada» protegida digitalmente.
                      </span>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={pricingFeatures.showPrivateGallery}
                      disabled={isUpdatingFeature}
                      onClick={() => handleTogglePricingFeature('showPrivateGallery')}
                      className={`w-[51px] h-[31px] rounded-full p-[2px] transition-colors duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] relative shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accentMain ${
                        pricingFeatures.showPrivateGallery ? 'bg-accentMain' : 'bg-neutral-300'
                      }`}
                      aria-label="Alternar visibilidad de Galería privada"
                    >
                      <span 
                        className={`block w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                          pricingFeatures.showPrivateGallery ? 'translate-x-[20px]' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Opción 3: Entrega en Alta Resolución */}
                  <div className="p-4 rounded-apple-card bg-neutral-50/70 border border-black/[0.04] flex items-center justify-between gap-4 transition-all hover:bg-neutral-100/50">
                    <div className="pr-2">
                      <span className="text-xs font-medium text-textMain font-sans block mb-0.5">
                        Entrega en alta resolución
                      </span>
                      <span className="text-[11px] text-textSecondary font-sans font-light leading-snug block">
                        Muestra «✓ Entrega en alta resolución».
                      </span>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={pricingFeatures.showHighRes}
                      disabled={isUpdatingFeature}
                      onClick={() => handleTogglePricingFeature('showHighRes')}
                      className={`w-[51px] h-[31px] rounded-full p-[2px] transition-colors duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] relative shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accentMain ${
                        pricingFeatures.showHighRes ? 'bg-accentMain' : 'bg-neutral-300'
                      }`}
                      aria-label="Alternar visibilidad de Entrega en alta resolución"
                    >
                      <span 
                        className={`block w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                          pricingFeatures.showHighRes ? 'translate-x-[20px]' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                </div>
              </div>
            )}

            {filteredSections.map((section) => {
              const currentPhotos = photosData[section.id] || [];
              const isLimitReached = currentPhotos.length >= section.maxPhotos;
              const isUploadingThisSection = uploadingSection === section.id;
              const isDraggingOverThisSection = dragOverSectionId === section.id;

              return (
                <div 
                  key={section.id} 
                  onDragOver={(e) => handleDragOver(e, section.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, section)}
                  className={`relative bg-white border photo-card-secondary transition-all duration-300 overflow-hidden ${
                    isDraggingOverThisSection 
                      ? 'border-accentMain ring-4 ring-accentMain/20 bg-amber-50/30' 
                      : 'border-neutral-200'
                  }`}
                >
                  {/* Overlay visual cuando se arrastra un archivo */}
                  {isDraggingOverThisSection && (
                    <div className="absolute inset-0 z-30 bg-accentMain/10 backdrop-blur-[2px] border-2 border-dashed border-accentMain flex flex-col items-center justify-center p-6 text-center animate-pulse pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-accentMain text-white flex items-center justify-center mb-3 shadow-lg">
                        <Upload size={28} />
                      </div>
                      <h4 className="title-main text-base text-textMain mb-1">
                        ¡SUELTA TU FOTOGRAFÍA AQUÍ!
                      </h4>
                      <p className="text-xs text-textSecondary font-sans">
                        Se abrirá el editor para ajustar el encuadre ({section.slots[0]?.aspectRatio || '3:4'})
                      </p>
                    </div>
                  )}

                  {/* Encabezado de la Tarjeta de Sección */}
                  <div className="bg-neutral-50 px-6 py-5 border-b border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase font-sans tracking-widest text-accentMain border border-accentMain/30 px-2 py-0.5 bg-white">
                          {section.page}
                        </span>
                        <h3 className="title-main text-base sm:text-lg text-textMain">
                          {section.title}
                        </h3>
                      </div>
                      <p className="text-xs text-textSecondary font-sans font-light mt-1 max-w-2xl">
                        {section.description}
                      </p>
                    </div>

                    {/* Contador de Cupo de Fotos */}
                    <div className="shrink-0 flex items-center gap-2">
                      <span
                        className={`text-xs uppercase tracking-widest font-sans px-3 py-1 font-medium ${
                          isLimitReached
                            ? 'bg-accentMain text-white'
                            : 'bg-white border border-neutral-300 text-textSecondary'
                        }`}
                      >
                        {currentPhotos.length} / {section.maxPhotos} Fotos
                        {isLimitReached ? ' (Límite Alcanzado)' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Cuerpo de la Sección: Fotos Actuales y Zona de Carga */}
                  <div className="p-6">
                    
                    {/* Lista de Fotos Actuales */}
                    {currentPhotos.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {currentPhotos.map((photo, idx) => {
                          const slotInfo = section.slots[idx] || {
                            label: `Foto ${idx + 1}`,
                            aspectRatio: 'Estándar'
                          };

                          return (
                            <div 
                              key={photo.id} 
                              className="group relative bg-neutral-100 border border-neutral-200 flex flex-col overflow-hidden photo-card-secondary"
                            >
                              {/* Contenedor de la Imagen */}
                              <div className="aspect-[3/4] relative overflow-hidden bg-neutral-200">
                                <img
                                  src={photo.url}
                                  alt={photo.name || slotInfo.label}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                
                                {/* Slot Overlay Tag */}
                                <div className="absolute top-2 left-2 bg-black/75 text-white text-[10px] font-sans px-2 py-0.5 uppercase tracking-widest backdrop-blur-sm">
                                  Slot #{idx + 1}
                                </div>
                              </div>

                              {/* Información del Slot */}
                              <div className="p-3 bg-white border-t border-neutral-200">
                                <span className="block text-xs font-serif uppercase tracking-wider text-textMain truncate">
                                  {slotInfo.label}
                                </span>
                                <span className="block text-[10px] text-textSecondary font-sans font-light">
                                  Proporción: {slotInfo.aspectRatio}
                                </span>

                                {/* Botones de Acción (Reemplazar y Eliminar) */}
                                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100">
                                  <button
                                    onClick={() => triggerReplacePhoto(section, photo.id, idx)}
                                    disabled={isUploadingThisSection}
                                    className="w-1/2 inline-flex items-center justify-center gap-1.5 text-[11px] font-sans text-accentMain border border-accentMain/40 hover:bg-accentMain hover:text-white py-1.5 transition-colors"
                                    title="Elegir nueva foto y ajustar encuadre"
                                  >
                                    <Crop size={11} />
                                    <span>Reemplazar</span>
                                  </button>

                                  <button
                                    onClick={() => setPhotoToDelete({
                                      sectionId: section.id,
                                      photo,
                                      sectionTitle: section.title
                                    })}
                                    disabled={isUploadingThisSection}
                                    className="w-1/2 inline-flex items-center justify-center gap-1 text-[11px] font-sans text-red-700 border border-red-200 hover:bg-red-700 hover:text-white py-1.5 transition-colors"
                                    title="Eliminar permanentemente de la nube"
                                  >
                                    <Trash2 size={11} />
                                    <span>Eliminar</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-10 border border-dashed border-neutral-300 bg-neutral-50/50 text-center mb-6 flex flex-col items-center justify-center p-6">
                        <ImageIcon size={32} className="text-neutral-400 mb-2" />
                        <span className="text-xs uppercase tracking-widest text-textMain font-sans">
                          No hay fotografías subidas en esta sección
                        </span>
                        <span className="text-[11px] text-neutral-400 font-sans font-light mt-1">
                          Arrastra un archivo aquí o pulsa el botón de abajo para enmarcar y publicar.
                        </span>
                      </div>
                    )}

                    {/* Zona de Subida o Bloqueo por Límite */}
                    {isLimitReached ? (
                      <div className="p-4 bg-amber-50/60 border border-amber-200 text-amber-900 text-xs font-sans flex items-start gap-3">
                        <Lock size={16} className="text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-medium block mb-0.5">
                            Cupo completo ({section.maxPhotos} de {section.maxPhotos} fotos)
                          </strong>
                          <span>
                            Has alcanzado el límite de fotografías para el diseño de esta sección. Para subir una nueva imagen, primero debes <strong>eliminar</strong> o <strong>reemplazar</strong> una existente.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <label 
                          htmlFor={`file-input-${section.id}`}
                          className={`border-2 border-dashed border-neutral-300 hover:border-accentMain p-6 text-center cursor-pointer transition-colors bg-white hover:bg-neutral-50 flex flex-col items-center justify-center ${
                            isUploadingThisSection ? 'pointer-events-none opacity-50' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2 text-accentMain">
                            <Upload size={20} />
                            <Crop size={16} />
                          </div>
                          <span className="text-xs uppercase tracking-widest text-textMain font-sans font-medium">
                            + Subir Fotografía (Espacio disponible: {section.maxPhotos - currentPhotos.length} de {section.maxPhotos})
                          </span>
                          <span className="text-[11px] text-textSecondary font-sans font-light mt-1">
                            Haz clic o arrastra tu foto aquí para abrir el <strong>Editor de Recorte</strong>
                          </span>
                        </label>
                        
                        <input
                          id={`file-input-${section.id}`}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          disabled={isUploadingThisSection}
                          onChange={(e) => handleInitiateUpload(section, e.target.files)}
                          className="hidden"
                        />

                        {/* Barra de progreso si está subiendo */}
                        {isUploadingThisSection && (
                          <div className="p-4 bg-neutral-50 border border-neutral-200">
                            <div className="flex justify-between text-xs font-sans text-textSecondary mb-2">
                              <span>Subiendo fotografía a la nube (Cloudinary CDN)...</span>
                              <span className="font-medium text-accentMain">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-neutral-200 h-1.5 overflow-hidden">
                              <div 
                                className="bg-accentMain h-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal de Confirmación de Eliminación */}
      {photoToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 max-w-md w-full photo-card-secondary border border-neutral-300 shadow-2xl">
            <div className="w-10 h-10 bg-red-50 text-red-700 flex items-center justify-center mb-4">
              <Trash2 size={20} />
            </div>

            <h3 className="title-main text-lg text-textMain mb-2">
              ¿Eliminar Fotografía?
            </h3>
            
            <p className="text-xs text-textSecondary font-sans font-light leading-relaxed mb-6">
              Esta fotografía se eliminará de la sección <strong className="text-textMain font-normal">"{photoToDelete.sectionTitle}"</strong> y se purgará de forma permanente de Cloudinary para liberar espacio de almacenamiento.
            </p>

            {/* Miniatura de la foto a borrar */}
            <div className="aspect-[16/9] w-full bg-neutral-100 overflow-hidden mb-6 border border-neutral-200">
              <img 
                src={photoToDelete.photo.url} 
                alt="Foto a eliminar" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPhotoToDelete(null)}
                disabled={isDeleting}
                className="text-xs uppercase tracking-widest font-sans px-4 py-2.5 text-textSecondary hover:text-textMain border border-neutral-300 transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleExecuteDelete}
                disabled={isDeleting}
                className="btn-primary text-xs tracking-widest uppercase bg-red-700 hover:bg-red-800 text-white flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <span>Sí, Eliminar de la Nube</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
