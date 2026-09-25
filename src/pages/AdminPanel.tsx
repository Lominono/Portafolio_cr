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
        showActionSuccess('Acceso verificado correctamente.');
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
      showActionSuccess(`Opción «${labelMap[key]}» ${newValue ? 'activada' : 'desactivada'}.`);
    } catch (err: any) {
      console.error('Error al actualizar característica de tarifas:', err);
      const isPermissionDenied = 
        err?.code === 'permission-denied' || 
        err?.message?.toLowerCase().includes('permission') ||
        err?.message?.toLowerCase().includes('insufficient');

      if (isPermissionDenied) {
        showActionError('Permisos de Firebase: Publica las reglas actualizadas en Firebase Console para permitir cambios con este usuario.');
      } else {
        showActionError('No se pudo sincronizar el cambio con Firestore.');
      }
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

        showActionSuccess(`Imagen actualizada en «${section.title}».`);
      } else {
        // Subida nueva a Cloudinary y Firestore
        const newPhoto = await uploadPhoto(section.id, croppedFile, (progress) => {
          setUploadProgress(progress);
        });

        setPhotosData((prev) => ({
          ...prev,
          [section.id]: [...(prev[section.id] || []), newPhoto]
        }));

        showActionSuccess(`Imagen publicada en «${section.title}».`);
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

      showActionSuccess('Imagen eliminada.');
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
      <div className="min-h-screen bg-[#FBFBFC] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-accentMain border-t-transparent rounded-full animate-spin"></div>
          <p className="font-sans text-xs text-textSecondary font-light">
            Verificando sesión...
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
      <div className="min-h-screen bg-[#FBFBFC] flex flex-col justify-center items-center px-6 py-16">
        <div className="w-full max-w-sm bg-white p-8 sm:p-10 rounded-[20px] border border-black/[0.06] shadow-apple-card">
          
          <div className="text-center mb-8">
            <div className="w-10 h-10 bg-accentMain/[0.08] text-accentMain rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock size={18} strokeWidth={1.8} />
            </div>
            <h1 className="font-serif text-2xl text-textMain tracking-tight mb-1">
              Cristian Espinola
            </h1>
            <p className="text-textSecondary font-sans text-xs font-light">
              Gestión de portafolio
            </p>
          </div>

          {authError && (
            <div className="mb-5 p-3.5 bg-red-50/80 border border-red-200/80 text-red-700 text-xs font-sans rounded-xl flex items-start gap-2.5">
              <AlertTriangle size={15} className="shrink-0 mt-0.5 text-red-600" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label 
                htmlFor="admin-email" 
                className="block text-xs font-medium text-textMain font-sans mb-1.5"
              >
                Correo electrónico
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="nombre@ejemplo.com"
                className="apple-input w-full"
              />
            </div>

            <div>
              <label 
                htmlFor="admin-password" 
                className="block text-xs font-medium text-textMain font-sans mb-1.5"
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
                className="apple-input w-full"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn-primary w-full mt-2"
            >
              {isLoggingIn ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Accediendo...</span>
                </div>
              ) : (
                <span>Iniciar sesión</span>
              )}
            </button>
          </form>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: PANTALLA DE VERIFICACIÓN DE SEGURIDAD (PRIMER ACCESO)
  // -------------------------------------------------------------
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-[#FBFBFC] flex flex-col justify-center items-center px-6 py-16">
        <div className="w-full max-w-sm bg-white p-8 sm:p-10 rounded-[20px] border border-black/[0.06] shadow-apple-card">
          
          <div className="text-center mb-6">
            <div className="w-10 h-10 bg-accentMain/[0.08] text-accentMain rounded-xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={20} strokeWidth={1.8} />
            </div>
            <h1 className="font-serif text-xl text-textMain tracking-tight mb-1">
              Verificación de acceso
            </h1>
            <p className="text-textSecondary font-sans text-xs font-light">
              Dispositivo no autorizado
            </p>
          </div>

          <div className="mb-5 p-3.5 bg-neutral-50 rounded-xl border border-black/[0.04] text-xs font-sans text-textSecondary">
            <span className="text-textMain font-medium block truncate">{user.email}</span>
            <span className="text-[11px] text-textSecondary mt-0.5 block font-light">
              Introduce la clave para autorizar este navegador.
            </span>
          </div>

          {securityError && (
            <div className="mb-5 p-3.5 bg-red-50/80 border border-red-200/80 text-red-700 text-xs font-sans rounded-xl flex items-start gap-2.5">
              <AlertTriangle size={15} className="shrink-0 mt-0.5 text-red-600" />
              <span>{securityError}</span>
            </div>
          )}

          <form onSubmit={handleVerifySecurityCode} className="flex flex-col gap-4">
            <div>
              <label 
                htmlFor="security-code-input" 
                className="block text-xs font-medium text-textMain font-sans mb-1.5"
              >
                Código de seguridad
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
                  placeholder="Código de autorización"
                  className="apple-input w-full pr-11"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowSecurityCode(!showSecurityCode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-textMain transition-colors p-1"
                  aria-label={showSecurityCode ? 'Ocultar código' : 'Ver código'}
                >
                  {showSecurityCode ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifyingCode || !securityCodeInput.trim()}
              className="btn-primary w-full mt-2"
            >
              {isVerifyingCode ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <KeyRound size={15} />
                  <span>Autorizar dispositivo</span>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-textSecondary hover:text-textMain font-sans transition-colors pt-2 flex items-center justify-center gap-1.5"
            >
              <LogOut size={13} />
              <span>Cerrar sesión</span>
            </button>
          </form>

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
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-lg text-textMain tracking-tight">
              Cristian Espinola
            </h1>
            <span className="w-px h-3.5 bg-neutral-300"></span>
            <span className="text-xs text-textSecondary font-sans">
              Catálogo
            </span>
            <div className="inline-flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[11px] font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>En línea</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-textSecondary font-sans hidden md:inline truncate max-w-[220px]">
              {user.email}
            </span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 px-3 rounded-lg border border-black/[0.08] hover:bg-black/[0.03] text-xs font-sans text-textMain inline-flex items-center gap-1.5 transition-all active:scale-95"
            >
              <span>Ver web</span>
              <ExternalLink size={12} className="text-textSecondary" />
            </a>

            <button
              onClick={handleLogout}
              className="h-8 px-3 rounded-lg text-xs font-sans text-neutral-600 hover:text-red-600 hover:bg-red-50/50 transition-all inline-flex items-center gap-1.5 active:scale-95"
            >
              <LogOut size={13} />
              <span>Salir</span>
            </button>
          </div>

        </div>
      </header>

      {/* Alertas Globales de Éxito / Error */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-5">
        {actionSuccess && (
          <div className="mb-5 p-3.5 bg-emerald-50/90 border border-emerald-200/80 text-emerald-800 text-xs font-sans rounded-xl flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle size={16} className="text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {actionError && (
          <div className="mb-5 p-3.5 bg-red-50/90 border border-red-200/80 text-red-800 text-xs font-sans rounded-xl flex items-center gap-2.5 animate-fadeIn">
            <AlertTriangle size={16} className="text-red-600 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}
      </div>

      {/* Resumen y Filtros */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pt-2 pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          
          {/* Pestañas de Filtro (Apple Segmented Control) */}
          <div className="p-1 bg-black/[0.04] rounded-xl flex items-center gap-1 border border-black/[0.03] overflow-x-auto max-w-full no-scrollbar">
            {(['Todas', 'Inicio', 'Sobre Mí', 'Tarifas'] as const).map((tab) => {
              const isActive = selectedPage === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setSelectedPage(tab)}
                  className={`text-xs font-sans px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-textMain shadow-[0_1px_3px_rgba(0,0,0,0.08)] font-medium'
                      : 'text-textSecondary hover:text-textMain'
                  }`}
                >
                  {tab === 'Todas' ? 'Todas' : tab}
                </button>
              );
            })}
          </div>

          {/* Contador de Cupo y Botón de Recarga */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <div className="h-8 px-3 rounded-lg bg-black/[0.03] border border-black/[0.04] flex items-center gap-2 text-xs font-sans">
              <span className="text-textSecondary">Espacios:</span>
              <span className="font-medium text-textMain">
                {totalUploadedPhotos} / {TOTAL_SITE_SLOTS}
              </span>
            </div>
            <button
              onClick={loadAllSectionsData}
              disabled={loadingSections}
              className="w-8 h-8 rounded-lg border border-black/[0.08] hover:bg-black/[0.03] text-textSecondary hover:text-textMain flex items-center justify-center transition-all active:scale-95"
              title="Actualizar datos"
              aria-label="Actualizar datos"
            >
              <RefreshCw size={13} className={loadingSections ? 'animate-spin' : ''} />
            </button>
          </div>

        </div>
      </section>

      {/* Grid de Secciones */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8">
        {loadingSections ? (
          <div className="py-20 text-center">
            <div className="w-7 h-7 border-2 border-accentMain border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-textSecondary font-sans font-light">
              Cargando secciones...
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Panel de Control de Características en Tarifas (Tiempo Real) */}
            {(selectedPage === 'Todas' || selectedPage === 'Tarifas') && (
              <div className="bg-white rounded-[20px] p-6 border border-black/[0.06] shadow-apple-subtle transition-all">
                <div className="flex items-center justify-between pb-4 border-b border-black/[0.04]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-accentMain/[0.08] text-accentMain flex items-center justify-center shrink-0">
                      <SlidersHorizontal size={16} strokeWidth={1.8} />
                    </div>
                    <div>
                      <h2 className="font-serif text-base text-textMain">
                        Inclusiones en tarifas
                      </h2>
                      <p className="text-xs text-textSecondary font-sans font-light">
                        Elementos visibles en los paquetes de servicios
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[11px] font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="font-medium">En vivo</span>
                  </div>
                </div>

                {/* Lista de Interruptores Apple iOS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4">
                  
                  {/* Opción 1: Edición de Imagen */}
                  <div className="p-3.5 rounded-xl bg-neutral-50/80 border border-black/[0.03] flex items-center justify-between gap-3">
                    <div className="pr-1">
                      <span className="text-xs font-medium text-textMain font-sans block">
                        Edición de imagen
                      </span>
                      <span className="text-[11px] text-textSecondary font-sans font-light">
                        Ajustes de revelado y color
                      </span>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={pricingFeatures.showImageEditing}
                      disabled={isUpdatingFeature}
                      onClick={() => handleTogglePricingFeature('showImageEditing')}
                      className={`w-[51px] h-[31px] rounded-full p-[2px] transition-colors duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] relative shrink-0 focus:outline-none ${
                        pricingFeatures.showImageEditing ? 'bg-accentMain' : 'bg-neutral-300'
                      }`}
                      aria-label="Alternar Edición de imagen"
                    >
                      <span 
                        className={`block w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                          pricingFeatures.showImageEditing ? 'translate-x-[20px]' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Opción 2: Galería Privada */}
                  <div className="p-3.5 rounded-xl bg-neutral-50/80 border border-black/[0.03] flex items-center justify-between gap-3">
                    <div className="pr-1">
                      <span className="text-xs font-medium text-textMain font-sans block">
                        Galería privada
                      </span>
                      <span className="text-[11px] text-textSecondary font-sans font-light">
                        Entrega digital con contraseña
                      </span>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={pricingFeatures.showPrivateGallery}
                      disabled={isUpdatingFeature}
                      onClick={() => handleTogglePricingFeature('showPrivateGallery')}
                      className={`w-[51px] h-[31px] rounded-full p-[2px] transition-colors duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] relative shrink-0 focus:outline-none ${
                        pricingFeatures.showPrivateGallery ? 'bg-accentMain' : 'bg-neutral-300'
                      }`}
                      aria-label="Alternar Galería privada"
                    >
                      <span 
                        className={`block w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                          pricingFeatures.showPrivateGallery ? 'translate-x-[20px]' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Opción 3: Entrega en Alta Resolución */}
                  <div className="p-3.5 rounded-xl bg-neutral-50/80 border border-black/[0.03] flex items-center justify-between gap-3">
                    <div className="pr-1">
                      <span className="text-xs font-medium text-textMain font-sans block">
                        Alta resolución
                      </span>
                      <span className="text-[11px] text-textSecondary font-sans font-light">
                        Archivos para impresión
                      </span>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={pricingFeatures.showHighRes}
                      disabled={isUpdatingFeature}
                      onClick={() => handleTogglePricingFeature('showHighRes')}
                      className={`w-[51px] h-[31px] rounded-full p-[2px] transition-colors duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] relative shrink-0 focus:outline-none ${
                        pricingFeatures.showHighRes ? 'bg-accentMain' : 'bg-neutral-300'
                      }`}
                      aria-label="Alternar Alta resolución"
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
                  className={`relative bg-white rounded-[20px] border transition-all duration-300 overflow-hidden ${
                    isDraggingOverThisSection 
                      ? 'border-accentMain ring-4 ring-accentMain/20 bg-amber-50/20' 
                      : 'border-black/[0.06] shadow-apple-subtle'
                  }`}
                >
                  {/* Overlay visual cuando se arrastra un archivo */}
                  {isDraggingOverThisSection && (
                    <div className="absolute inset-0 z-30 bg-accentMain/[0.08] backdrop-blur-[2px] border-2 border-dashed border-accentMain flex flex-col items-center justify-center p-6 text-center animate-fadeIn pointer-events-none rounded-[20px]">
                      <div className="w-12 h-12 rounded-full bg-accentMain text-white flex items-center justify-center mb-2 shadow-md">
                        <Upload size={22} />
                      </div>
                      <h4 className="font-serif text-base text-textMain">
                        Soltar imagen para encuadrar
                      </h4>
                    </div>
                  )}

                  {/* Encabezado de la Tarjeta de Sección */}
                  <div className="px-6 py-4 border-b border-black/[0.04] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-[11px] font-medium font-sans text-accentMain bg-accentMain/[0.08] px-2.5 py-0.5 rounded-full">
                          {section.page}
                        </span>
                        <h3 className="font-serif text-base text-textMain">
                          {section.title}
                        </h3>
                      </div>
                      <p className="text-xs text-textSecondary font-sans font-light mt-1 max-w-2xl">
                        {section.description}
                      </p>
                    </div>

                    {/* Contador de Cupo de Fotos */}
                    <div className="shrink-0">
                      <span
                        className={`text-[11px] font-sans px-2.5 py-0.5 rounded-full ${
                          isLimitReached
                            ? 'bg-neutral-100 text-textSecondary border border-black/[0.04]'
                            : 'bg-accentMain/[0.08] text-accentMain border border-accentMain/20 font-medium'
                        }`}
                      >
                        {currentPhotos.length} / {section.maxPhotos} {section.maxPhotos === 1 ? 'espacio' : 'espacios'}
                      </span>
                    </div>
                  </div>

                  {/* Cuerpo de la Sección: Fotos Actuales y Zona de Carga */}
                  <div className="p-6">
                    
                    {/* Lista de Fotos Actuales */}
                    {currentPhotos.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {currentPhotos.map((photo, idx) => {
                          const slotInfo = section.slots[idx] || {
                            label: `Foto ${idx + 1}`,
                            aspectRatio: 'Estándar'
                          };

                          return (
                            <div 
                              key={photo.id} 
                              className="group relative bg-neutral-100 rounded-xl border border-black/[0.06] flex flex-col overflow-hidden transition-all hover:border-black/[0.12]"
                            >
                              {/* Contenedor de la Imagen */}
                              <div className="aspect-[3/4] relative overflow-hidden bg-neutral-200">
                                <img
                                  src={photo.url}
                                  alt={photo.name || slotInfo.label}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                
                                {/* Slot Overlay Tag */}
                                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white text-[11px] font-sans px-2 py-0.5 rounded-md font-medium">
                                  #{idx + 1}
                                </div>
                              </div>

                              {/* Información del Slot */}
                              <div className="p-3 bg-white border-t border-black/[0.04]">
                                <span className="block text-xs font-serif text-textMain truncate">
                                  {slotInfo.label}
                                </span>
                                <span className="block text-[11px] text-textSecondary font-sans font-light mt-0.5">
                                  {slotInfo.aspectRatio}
                                </span>

                                {/* Botones de Acción (Reemplazar y Eliminar) */}
                                <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-black/[0.04]">
                                  <button
                                    onClick={() => triggerReplacePhoto(section, photo.id, idx)}
                                    disabled={isUploadingThisSection}
                                    className="w-1/2 h-8 rounded-lg border border-black/[0.08] hover:border-accentMain text-xs font-sans text-textMain hover:text-accentMain flex items-center justify-center gap-1.5 transition-all active:scale-95"
                                    title="Ajustar encuadre con una nueva foto"
                                  >
                                    <Crop size={12} />
                                    <span>Cambiar</span>
                                  </button>

                                  <button
                                    onClick={() => setPhotoToDelete({
                                      sectionId: section.id,
                                      photo,
                                      sectionTitle: section.title
                                    })}
                                    disabled={isUploadingThisSection}
                                    className="w-1/2 h-8 rounded-lg border border-black/[0.06] hover:border-red-200 text-xs font-sans text-neutral-500 hover:text-red-600 hover:bg-red-50/50 flex items-center justify-center gap-1.5 transition-all active:scale-95"
                                    title="Eliminar fotografía"
                                  >
                                    <Trash2 size={12} />
                                    <span>Eliminar</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-8 border border-dashed border-neutral-200 rounded-xl bg-neutral-50/50 text-center mb-5 flex flex-col items-center justify-center p-4">
                        <ImageIcon size={24} className="text-neutral-300 mb-1.5" />
                        <span className="text-xs text-textSecondary font-sans font-light">
                          Sin fotografías asignadas
                        </span>
                      </div>
                    )}

                    {/* Zona de Subida o Estado de Cupo Completo */}
                    {isLimitReached ? (
                      <div className="py-2.5 px-3.5 bg-neutral-50 rounded-xl border border-black/[0.04] text-xs font-sans text-textSecondary flex items-center justify-between gap-2">
                        <span>Sección completa ({section.maxPhotos} de {section.maxPhotos})</span>
                        <span className="text-[11px] text-textSecondary/80 font-light">Reemplaza una imagen para actualizar</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <label 
                          htmlFor={`file-input-${section.id}`}
                          className={`border border-dashed border-neutral-300 hover:border-accentMain p-4 rounded-xl text-center cursor-pointer transition-all bg-white hover:bg-neutral-50/80 flex items-center justify-center gap-2 text-xs font-sans text-textMain active:scale-[0.99] ${
                            isUploadingThisSection ? 'pointer-events-none opacity-50' : ''
                          }`}
                        >
                          <Upload size={15} className="text-accentMain" />
                          <span className="font-medium">Añadir fotografía</span>
                          <span className="text-textSecondary text-[11px]">({section.maxPhotos - currentPhotos.length} disponible{section.maxPhotos - currentPhotos.length > 1 ? 's' : ''})</span>
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
                          <div className="p-3 bg-neutral-50 rounded-xl border border-black/[0.04] mt-1">
                            <div className="flex justify-between text-xs font-sans text-textSecondary mb-1.5">
                              <span>Subiendo imagen...</span>
                              <span className="font-medium text-accentMain">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-neutral-200 h-1 rounded-full overflow-hidden">
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white p-6 sm:p-7 max-w-sm w-full rounded-[20px] border border-black/[0.08] shadow-2xl">
            <h3 className="font-serif text-lg text-textMain mb-1.5">
              ¿Eliminar fotografía?
            </h3>
            
            <p className="text-xs text-textSecondary font-sans leading-relaxed mb-4">
              La imagen se retirará de la sección «{photoToDelete.sectionTitle}».
            </p>

            {/* Miniatura de la foto a borrar */}
            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden mb-5 border border-black/[0.06] bg-neutral-100">
              <img 
                src={photoToDelete.photo.url} 
                alt="Foto a eliminar" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setPhotoToDelete(null)}
                disabled={isDeleting}
                className="h-9 px-4 rounded-lg text-xs font-sans font-medium text-textSecondary hover:text-textMain border border-black/[0.08] hover:bg-black/[0.02] transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleExecuteDelete}
                disabled={isDeleting}
                className="h-9 px-4 rounded-lg text-xs font-sans font-medium bg-red-600 hover:bg-red-700 text-white transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
              >
                {isDeleting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Eliminar</span>
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
