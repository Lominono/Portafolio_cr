import React, { useState, useEffect, useRef } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  Lock, 
  LogOut, 
  Upload, 
  Trash2, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';
import { auth } from '../firebase';
import { SITE_SECTIONS, SectionConfig, TOTAL_SITE_SLOTS } from '../config/sections';
import { 
  getSectionData, 
  uploadPhoto, 
  replacePhoto, 
  deletePhoto, 
  StoredPhoto 
} from '../services/photos';

export const AdminPanel: React.FC = () => {
  // Estado de autenticación
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Estado de secciones y fotos
  const [selectedPage, setSelectedPage] = useState<'Todas' | 'Inicio' | 'Sobre Mí' | 'Tarifas'>('Todas');
  const [photosData, setPhotosData] = useState<Record<string, StoredPhoto[]>>({});
  const [loadingSections, setLoadingSections] = useState(true);

  // Estados de subida y acciones
  const [uploadingSection, setUploadingSection] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Modal de confirmación de eliminación
  const [photoToDelete, setPhotoToDelete] = useState<{
    sectionId: string;
    photo: StoredPhoto;
    sectionTitle: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Input oculto para reemplazo
  const [photoToReplace, setPhotoToReplace] = useState<{
    sectionId: string;
    photoId: string;
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

  // 2. Listener de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        loadAllSectionsData();
      }
    });
    return () => unsubscribe();
  }, []);

  // Cargar datos de todas las secciones
  const loadAllSectionsData = async () => {
    setLoadingSections(true);
    try {
      const data: Record<string, StoredPhoto[]> = {};
      for (const section of SITE_SECTIONS) {
        const photos = await getSectionData(section.id);
        data[section.id] = photos;
      }
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
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  // Subir foto
  const handleFileUpload = async (section: SectionConfig, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      showActionError('Por favor selecciona un archivo de imagen válido (JPG, PNG o WebP).');
      return;
    }

    setUploadingSection(section.id);
    setUploadProgress(0);

    try {
      const newPhoto = await uploadPhoto(section.id, file, (progress) => {
        setUploadProgress(progress);
      });

      setPhotosData((prev) => ({
        ...prev,
        [section.id]: [...(prev[section.id] || []), newPhoto]
      }));

      showActionSuccess(`Fotografía subida con éxito en "${section.title}".`);
    } catch (err: any) {
      console.error('Error en subida:', err);
      showActionError(err.message || 'Ocurrió un error al subir la fotografía.');
    } finally {
      setUploadingSection(null);
      setUploadProgress(0);
    }
  };

  // Reemplazar foto
  const triggerReplacePhoto = (sectionId: string, photoId: string) => {
    setPhotoToReplace({ sectionId, photoId });
    if (replaceFileInputRef.current) {
      replaceFileInputRef.current.value = '';
      replaceFileInputRef.current.click();
    }
  };

  const handleExecuteReplace = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || !photoToReplace) return;
    const file = fileList[0];

    if (!file.type.startsWith('image/')) {
      showActionError('Selecciona un archivo de imagen válido.');
      return;
    }

    const { sectionId, photoId } = photoToReplace;
    setUploadingSection(sectionId);
    setUploadProgress(0);

    try {
      const updatedPhoto = await replacePhoto(sectionId, photoId, file, (progress) => {
        setUploadProgress(progress);
      });

      setPhotosData((prev) => {
        const current = prev[sectionId] || [];
        const index = current.findIndex((p) => p.id === photoId);
        if (index === -1) return prev;
        const copy = [...current];
        copy[index] = updatedPhoto;
        return { ...prev, [sectionId]: copy };
      });

      showActionSuccess('Fotografía reemplazada exitosamente.');
    } catch (err: any) {
      console.error('Error al reemplazar:', err);
      showActionError(err.message || 'Error al reemplazar la fotografía.');
    } finally {
      setUploadingSection(null);
      setUploadProgress(0);
      setPhotoToReplace(null);
    }
  };

  // Confirmar y ejecutar eliminación
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

      showActionSuccess('Fotografía eliminada correctamente.');
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
              Acceso restringido únicamente al propietario
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
      
      {/* Input oculto para el flujo de Reemplazo */}
      <input
        type="file"
        ref={replaceFileInputRef}
        onChange={(e) => handleExecuteReplace(e.target.files)}
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
              Las fotos subidas aquí se guardan de forma instantánea en Firebase y se reflejan al segundo en la web.
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
            {filteredSections.map((section) => {
              const currentPhotos = photosData[section.id] || [];
              const isLimitReached = currentPhotos.length >= section.maxPhotos;
              const isUploadingThisSection = uploadingSection === section.id;

              return (
                <div 
                  key={section.id} 
                  className="bg-white border border-neutral-200 photo-card-secondary overflow-hidden"
                >
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
                              className="group relative bg-neutral-100 border border-neutral-200 flex flex-col overflow-hidden"
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
                                    onClick={() => triggerReplacePhoto(section.id, photo.id)}
                                    disabled={isUploadingThisSection}
                                    className="w-1/2 inline-flex items-center justify-center gap-1 text-[11px] font-sans text-accentMain border border-accentMain/40 hover:bg-accentMain hover:text-white py-1.5 transition-colors"
                                  >
                                    <RefreshCw size={11} />
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
                        <span className="text-xs uppercase tracking-widest text-textSecondary font-sans">
                          No hay fotografías subidas en esta sección
                        </span>
                        <span className="text-[11px] text-neutral-400 font-sans font-light mt-1">
                          Sube una foto a continuación para publicarla en el sitio web.
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
                          <Upload size={22} className="text-accentMain mb-2" />
                          <span className="text-xs uppercase tracking-widest text-textMain font-sans font-medium">
                            + Subir Fotografía (Espacio disponible: {section.maxPhotos - currentPhotos.length} de {section.maxPhotos})
                          </span>
                          <span className="text-[11px] text-textSecondary font-sans font-light mt-1">
                            Haz clic aquí o arrastra tu archivo (JPG, PNG o WebP de alta resolución)
                          </span>
                        </label>
                        
                        <input
                          id={`file-input-${section.id}`}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          disabled={isUploadingThisSection}
                          onChange={(e) => handleFileUpload(section, e.target.files)}
                          className="hidden"
                        />

                        {/* Barra de progreso si está subiendo */}
                        {isUploadingThisSection && (
                          <div className="p-4 bg-neutral-50 border border-neutral-200">
                            <div className="flex justify-between text-xs font-sans text-textSecondary mb-2">
                              <span>Subiendo fotografía a Firebase Storage...</span>
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
              Esta fotografía se eliminará de la sección <strong className="text-textMain font-normal">"{photoToDelete.sectionTitle}"</strong> y desaparecerá de la web pública de forma permanente.
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
                  <span>Sí, Eliminar</span>
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
