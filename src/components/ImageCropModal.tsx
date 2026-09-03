import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  X, 
  Check, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Crop,
  Eye,
  Smartphone,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  User,
  Crosshair,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface AspectRatioOption {
  label: string;
  ratio: number; // width / height
  id: string;
  orientation: 'vertical' | 'horizontal' | 'cuadrado';
}

const ASPECT_RATIOS: AspectRatioOption[] = [
  { id: '3:4', label: '3:4 (Vertical)', ratio: 3 / 4, orientation: 'vertical' },
  { id: '4:5', label: '4:5 (Especialidades)', ratio: 4 / 5, orientation: 'vertical' },
  { id: '16:9', label: '16:9 (Apaisada)', ratio: 16 / 9, orientation: 'horizontal' },
  { id: '4:3', label: '4:3 (Detalles)', ratio: 4 / 3, orientation: 'horizontal' },
  { id: '1:1', label: '1:1 (Cuadrado)', ratio: 1 / 1, orientation: 'cuadrado' },
  { id: 'original', label: 'Original', ratio: 0, orientation: 'cuadrado' },
];

interface ImageCropModalProps {
  isOpen: boolean;
  file: File | null;
  sectionTitle: string;
  slotLabel?: string;
  targetAspectRatio?: string;
  recommendationTip?: string;
  onConfirm: (croppedFile: File) => void;
  onCancel: () => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  file,
  sectionTitle,
  slotLabel,
  targetAspectRatio = '3:4',
  recommendationTip,
  onConfirm,
  onCancel,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);

  // Estados de transformación
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedRatioId, setSelectedRatioId] = useState<string>('3:4');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  // Estados de UI
  const [showWebPreview, setShowWebPreview] = useState(false);
  const [showTips, setShowTips] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const initialTouchDistanceRef = useRef<number | null>(null);

  // 1. Detección y forzado automático de la proporción recomendada según la sección
  const recommendedRatioId = useMemo(() => {
    if (targetAspectRatio.includes('16:9')) return '16:9';
    if (targetAspectRatio.includes('4:5')) return '4:5';
    if (targetAspectRatio.includes('4:3')) return '4:3';
    if (targetAspectRatio.includes('1:1')) return '1:1';
    return '3:4';
  }, [targetAspectRatio]);

  // Bloquear y preseleccionar siempre el formato recomendado al abrir
  useEffect(() => {
    setSelectedRatioId(recommendedRatioId);
  }, [recommendedRatioId, isOpen]);

  // Cargar imagen en memoria
  useEffect(() => {
    if (!file) {
      setImageSrc(null);
      setImageElement(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setImageSrc(objectUrl);

    const img = new Image();
    img.src = objectUrl;
    img.onload = () => {
      setImageElement(img);
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
    };

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const currentRatioOption = ASPECT_RATIOS.find((r) => r.id === selectedRatioId) || ASPECT_RATIOS[0];
  const activeRatio = currentRatioOption.ratio === 0 && imageElement 
    ? imageElement.naturalWidth / imageElement.naturalHeight 
    : currentRatioOption.ratio;

  // 2. Detección inteligente de formato y orientación
  const formatAnalysis = useMemo(() => {
    if (!imageElement) return null;

    const imgW = rotation === 90 || rotation === 270 ? imageElement.naturalHeight : imageElement.naturalWidth;
    const imgH = rotation === 90 || rotation === 270 ? imageElement.naturalWidth : imageElement.naturalHeight;
    const imageRatio = imgW / imgH;

    const isImageHorizontal = imageRatio > 1.15;
    const isImageVertical = imageRatio < 0.88;
    const isTargetVertical = activeRatio < 0.95;
    const isTargetHorizontal = activeRatio > 1.05;

    // Detectar si hay discordancia
    const isMismatch = (isImageHorizontal && isTargetVertical) || (isImageVertical && isTargetHorizontal);

    return {
      imageWidth: imgW,
      imageHeight: imgH,
      imageRatio,
      isImageHorizontal,
      isImageVertical,
      isTargetVertical,
      isTargetHorizontal,
      isMismatch,
      orientationName: isImageHorizontal ? 'horizontal (apaisada)' : isImageVertical ? 'vertical' : 'cuadrada',
      targetOrientationName: isTargetVertical ? 'vertical' : isTargetHorizontal ? 'horizontal panorámica' : 'cuadrada'
    };
  }, [imageElement, rotation, activeRatio]);

  // Manejo de arrastre con ratón
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Manejo de gestos táctiles para móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialTouchDistanceRef.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    } else if (e.touches.length === 2 && initialTouchDistanceRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / initialTouchDistanceRef.current;
      setZoom((prev) => Math.min(Math.max(prev * factor, 1), 3.5));
      initialTouchDistanceRef.current = dist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    initialTouchDistanceRef.current = null;
  };

  // Zoom continuo con rueda
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0015;
    setZoom((prev) => Math.min(Math.max(prev + delta, 1), 3.5));
  };

  // Controles de un solo toque para máxima comodidad
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 3.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 1));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  // 3. Botones de encuadre inteligente
  // Enfoque a rostro (sube el encuadre al tercio superior)
  const handleFocusFace = () => {
    if (!containerRef.current) return;
    const boxHeight = containerRef.current.clientHeight;
    setPan((prev) => ({
      x: prev.x,
      y: Math.round(boxHeight * 0.18) // Mueve hacia abajo la imagen para enfocar la cabeza
    }));
  };

  // Centrado total
  const handleCenter = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  // Restablecer formato recomendado oficial
  const handleResetToRecommended = () => {
    setSelectedRatioId(recommendedRatioId);
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  // Generar recorte final en Canvas de alta resolución
  const handleCropAndSave = async () => {
    if (!imageElement || !containerRef.current || !file) return;

    setIsProcessing(true);

    try {
      const cropBox = containerRef.current.getBoundingClientRect();
      const exportWidth = 1920; // Alta definición web
      const exportHeight = Math.round(exportWidth / activeRatio);

      const canvas = document.createElement('canvas');
      canvas.width = exportWidth;
      canvas.height = exportHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No se pudo inicializar el lienzo de Canvas.');
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fondo blanco neutro
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, exportWidth, exportHeight);

      // Escala de la caja al canvas final
      const scaleToCanvas = exportWidth / cropBox.width;

      ctx.translate(exportWidth / 2, exportHeight / 2);
      ctx.translate(pan.x * scaleToCanvas, pan.y * scaleToCanvas);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      const isRotated90 = rotation === 90 || rotation === 270;
      const naturalW = isRotated90 ? imageElement.naturalHeight : imageElement.naturalWidth;
      const naturalH = isRotated90 ? imageElement.naturalWidth : imageElement.naturalHeight;

      // Escala "cover"
      const coverScale = Math.max(cropBox.width / naturalW, cropBox.height / naturalH);
      const renderW = imageElement.naturalWidth * coverScale * scaleToCanvas;
      const renderH = imageElement.naturalHeight * coverScale * scaleToCanvas;

      ctx.drawImage(imageElement, -renderW / 2, -renderH / 2, renderW, renderH);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }

          const croppedFileName = file.name.replace(/\.[^/.]+$/, '') + '_opt.jpg';
          const croppedFile = new File([blob], croppedFileName, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });

          setIsProcessing(false);
          onConfirm(croppedFile);
        },
        'image/jpeg',
        0.92
      );
    } catch (err) {
      console.error('Error al procesar el recorte:', err);
      setIsProcessing(false);
    }
  };

  if (!isOpen || !file || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto overscroll-contain animate-fadeIn">
      <div className="bg-white w-full max-w-3xl photo-card-secondary border border-neutral-300 shadow-2xl flex flex-col max-h-[96vh] overflow-hidden my-auto">
        
        {/* Cabecera del Editor */}
        <div className="bg-neutral-50 px-4 sm:px-6 py-3 border-b border-neutral-200 flex items-center justify-between shrink-0">
          <div className="flex-1 pr-2 truncate">
            <div className="flex items-center gap-2">
              <Crop size={15} className="text-accentMain shrink-0" />
              <h2 className="title-main text-xs sm:text-sm text-textMain tracking-widest truncate">
                ENCUADRE & RECORTE INTELIGENTE
              </h2>
            </div>
            <p className="text-[11px] text-textSecondary font-sans truncate mt-0.5">
              {sectionTitle} {slotLabel ? `— ${slotLabel}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowTips(!showTips)}
              className={`p-1.5 border text-xs font-sans flex items-center gap-1 transition-colors ${
                showTips ? 'bg-accentMain text-white border-accentMain' : 'bg-white text-textSecondary border-neutral-300 hover:text-textMain'
              }`}
              title="Mostrar u ocultar consejos de recorte"
            >
              <HelpCircle size={14} />
              <span className="hidden sm:inline text-[11px]">Guía Web</span>
            </button>

            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="p-1.5 text-textSecondary hover:text-textMain transition-colors"
              title="Cerrar sin guardar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ALERTA INTELIGENTE: Si el formato de la foto no coincide con el recomendado */}
        {formatAnalysis?.isMismatch && (
          <div className="bg-amber-50 border-b border-amber-300 px-4 py-3 text-xs font-sans text-neutral-800 shrink-0 animate-fadeIn">
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold text-amber-900 text-xs uppercase tracking-wider">
                    Aviso: Foto {formatAnalysis.orientationName} detectada
                  </span>
                  <span className="bg-amber-500 text-white text-[9px] px-2 py-0.5 uppercase tracking-widest font-sans font-medium flex items-center gap-1">
                    <Lock size={9} /> Ajustada a {targetAspectRatio}
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 font-light leading-relaxed">
                  Has subido una imagen con orientación <strong>{formatAnalysis.orientationName}</strong>, pero esta sección de la web requiere un formato <strong>{formatAnalysis.targetOrientationName} ({targetAspectRatio})</strong>.
                  Para que la web quede perfecta y no se deforme, hemos fijado automáticamente el marco recomendado.
                  <span className="block mt-1 font-medium text-amber-950">
                    👉 Arrastra la foto con el dedo o ratón para centrar a las personas o elementos clave.
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Guía de recomendación específica para este slot */}
        {showTips && !formatAnalysis?.isMismatch && (
          <div className="bg-neutral-100/80 border-b border-neutral-200 px-4 py-2.5 text-xs font-sans text-neutral-700 shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-accentMain shrink-0" />
              <span className="text-[11px] text-textSecondary font-light leading-relaxed truncate">
                <strong className="font-medium text-textMain">Recomendación Web ({targetAspectRatio}):</strong> {recommendationTip || 'Encuadra el sujeto principal dentro de la cuadrícula.'}
              </span>
            </div>
          </div>
        )}

        {/* Área de Visualización y Enmarcado con Visor de Cámara Réflex */}
        <div 
          className="relative flex-1 min-h-[250px] sm:min-h-[360px] bg-neutral-950 flex items-center justify-center overflow-hidden select-none touch-none"
          onWheel={handleWheel}
        >
          {/* Cuadro de Recorte Interactivo */}
          <div 
            ref={containerRef}
            style={{
              aspectRatio: `${activeRatio}`,
              maxHeight: 'min(48vh, 350px)',
              maxWidth: '86%',
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`relative w-full h-full shadow-[0_0_0_9999px_rgba(0,0,0,0.8)] border border-white/80 overflow-hidden cursor-move touch-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {/* Imagen interactiva */}
            {imageElement && (
              <div
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.08s ease-out',
                }}
                className="w-full h-full flex items-center justify-center pointer-events-none"
              >
                <img
                  src={imageSrc}
                  alt="Vista previa recorte"
                  className="max-w-none w-full h-full object-cover select-none pointer-events-none"
                />
              </div>
            )}

            {/* Regla de Tercios */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-25">
              <div className="border-r border-b border-white"></div>
              <div className="border-r border-b border-white"></div>
              <div className="border-b border-white"></div>
              <div className="border-r border-b border-white"></div>
              <div className="border-r border-b border-white"></div>
              <div className="border-b border-white"></div>
              <div className="border-r border-white"></div>
              <div className="border-r border-white"></div>
              <div></div>
            </div>

            {/* Esquinas de Visor de Cámara Profesional (Viewfinder Brackets) */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accentSecondary pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accentSecondary pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accentSecondary pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accentSecondary pointer-events-none"></div>

            {/* Ayuda de gestos móvil */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none px-2">
              <span className="bg-black/75 backdrop-blur-sm text-white text-[9px] sm:text-[10px] uppercase font-sans tracking-widest px-2.5 py-0.5 flex items-center gap-1.5">
                <Smartphone size={11} className="text-accentSecondary" />
                Arrastra para encuadrar • Pellizca para zoom
              </span>
            </div>
          </div>

          {/* Maqueta de Vista Previa en Vivo (Simulador Web) */}
          {showWebPreview && (
            <div className="absolute top-3 right-3 z-30 bg-white/95 backdrop-blur-md p-3 border border-neutral-300 shadow-xl max-w-[160px] animate-fadeIn">
              <span className="block text-[9px] uppercase tracking-widest text-textSecondary font-sans mb-1 font-medium">
                En la web pública:
              </span>
              <div 
                style={{ aspectRatio: `${activeRatio}` }}
                className="w-full photo-card-secondary overflow-hidden bg-neutral-100 relative mb-1"
              >
                {imageElement && (
                  <img
                    src={imageSrc}
                    alt="Mini preview"
                    style={{
                      transform: `translate(${pan.x * 0.25}px, ${pan.y * 0.25}px) rotate(${rotation}deg) scale(${zoom})`,
                      transformOrigin: 'center center',
                    }}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <span className="block text-[9px] text-textMain truncate font-serif uppercase">
                {sectionTitle}
              </span>
            </div>
          )}
        </div>

        {/* Barra de Herramientas Optimizada y Cómoda */}
        <div className="p-3 sm:p-5 bg-white border-t border-neutral-200 flex flex-col gap-3 shrink-0 overflow-y-auto max-h-[40vh]">
          
          {/* Selector de Ratios con Enfoque en el Formato Recomendado */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-textSecondary font-sans font-medium whitespace-nowrap">
                Formato:
              </span>
              {selectedRatioId === recommendedRatioId ? (
                <span className="text-[9px] text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 uppercase tracking-wider font-sans font-medium">
                  ✓ Recomendado para esta sección
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResetToRecommended}
                  className="text-[9px] text-accentMain hover:underline font-sans"
                >
                  Restablecer a {targetAspectRatio}
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar w-full sm:w-auto justify-start sm:justify-end">
              {ASPECT_RATIOS.map((item) => {
                const isSelected = selectedRatioId === item.id;
                const isRecommended = item.id === recommendedRatioId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedRatioId(item.id);
                      setPan({ x: 0, y: 0 });
                    }}
                    className={`text-[10px] uppercase font-sans px-2.5 py-1 transition-colors border whitespace-nowrap flex items-center gap-1 ${
                      isSelected
                        ? 'bg-accentMain text-white border-accentMain font-medium shadow-sm'
                        : isRecommended
                        ? 'bg-amber-50 text-accentMain border-amber-300 font-medium'
                        : 'bg-neutral-100 text-textSecondary border-neutral-200 hover:bg-neutral-200'
                    }`}
                  >
                    {item.label}
                    {isRecommended && <span className="text-[8px] bg-black/10 px-1 font-bold">★ Web</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controles de Acción Rápida: Enfoque Rostro, Centrado, Rotar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100">
            
            {/* Botones de Ayuda al Encuadre */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={handleFocusFace}
                className="px-2.5 py-1.5 border border-neutral-300 text-[11px] font-sans text-textMain hover:bg-neutral-50 flex items-center gap-1 transition-colors"
                title="Alinear rostro con el tercio superior"
              >
                <User size={12} className="text-accentMain" />
                <span>Enfocar Rostro</span>
              </button>

              <button
                type="button"
                onClick={handleCenter}
                className="px-2.5 py-1.5 border border-neutral-300 text-[11px] font-sans text-textSecondary hover:text-textMain hover:bg-neutral-50 flex items-center gap-1 transition-colors"
                title="Centrar en el marco"
              >
                <Crosshair size={12} />
                <span>Centrar</span>
              </button>

              <button
                type="button"
                onClick={handleRotate}
                className="px-2.5 py-1.5 border border-neutral-300 text-[11px] font-sans text-textSecondary hover:text-textMain hover:bg-neutral-50 flex items-center gap-1 transition-colors"
                title="Girar 90 grados"
              >
                <RotateCw size={12} />
                <span>Girar 90°</span>
              </button>
            </div>

            {/* Simulador Web Toggle */}
            <button
              type="button"
              onClick={() => setShowWebPreview(!showWebPreview)}
              className={`px-2.5 py-1.5 border text-[11px] font-sans flex items-center gap-1 transition-colors ${
                showWebPreview ? 'bg-accentMain text-white border-accentMain' : 'border-neutral-300 text-textSecondary hover:bg-neutral-50'
              }`}
              title="Previsualizar cómo queda en la web"
            >
              <Eye size={12} />
              <span>Simulador Web</span>
            </button>

          </div>

          {/* Fila de Zoom con botones táctiles */}
          <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
            <span className="text-[10px] uppercase font-sans text-textSecondary w-12 shrink-0">
              Zoom:
            </span>
            <button
              type="button"
              onClick={handleZoomOut}
              className="w-7 h-7 border border-neutral-300 flex items-center justify-center text-textSecondary hover:text-textMain hover:bg-neutral-50 shrink-0"
              title="Reducir zoom"
            >
              <ZoomOut size={13} />
            </button>
            
            <input
              type="range"
              min={1}
              max={3.5}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-accentMain h-1.5 bg-neutral-200 cursor-pointer"
            />

            <button
              type="button"
              onClick={handleZoomIn}
              className="w-7 h-7 border border-neutral-300 flex items-center justify-center text-textSecondary hover:text-textMain hover:bg-neutral-50 shrink-0"
              title="Aumentar zoom"
            >
              <ZoomIn size={13} />
            </button>
            <span className="text-xs font-sans text-textSecondary w-10 text-right shrink-0">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Botones Principales de Guardar / Cancelar */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-200 gap-3">
            <span className="text-[10px] text-textSecondary font-sans font-light hidden sm:inline-flex items-center gap-1">
              <Sparkles size={12} className="text-accentMain" />
              Procesamiento de alta resolución sin pixelación
            </span>

            <div className="flex items-center gap-2.5 w-full sm:w-auto ml-auto">
              <button
                type="button"
                onClick={onCancel}
                disabled={isProcessing}
                className="w-1/3 sm:w-auto text-xs uppercase tracking-widest font-sans px-4 py-2.5 text-textSecondary hover:text-textMain border border-neutral-300 transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleCropAndSave}
                disabled={isProcessing}
                className="w-2/3 sm:w-auto btn-primary text-xs tracking-widest uppercase flex items-center justify-center gap-2 py-2.5"
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Aplicar y Subir a la Web</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ImageCropModal;
