/* Apple UI Design System – Verified: 8pt Grid, SF Pro Typography, Material-Depth, Natural Spring Motion */
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
  AlertCircle,
  User,
  Crosshair,
  Lock,
  CheckCircle2
} from 'lucide-react';

interface ImageCropModalProps {
  isOpen: boolean;
  file: File | null;
  sectionTitle: string;
  slotLabel?: string;
  targetAspectRatio?: string; // e.g. '3:4 (Vertical)', '4:5 (Vertical)', '16:9 (Apaisada)', '4:3 (Apaisada)'
  recommendationTip?: string;
  onConfirm: (croppedFile: File) => void;
  onCancel: () => void;
}

interface RatioConfig {
  id: string;
  label: string;
  ratio: number; // width / height
  orientation: 'vertical' | 'horizontal' | 'cuadrado';
  exportWidth: number;
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
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWebPreview, setShowWebPreview] = useState(false);

  // Dimensiones del contenedor de recorte
  const [boxDimensions, setBoxDimensions] = useState({ width: 300, height: 400 });
  const previewAreaRef = useRef<HTMLDivElement>(null);
  const initialTouchDistanceRef = useRef<number | null>(null);

  // 1. Proporción ESTRICTA Y OBLIGATORIA según el espacio en la web
  const lockedRatioConfig: RatioConfig = useMemo(() => {
    if (targetAspectRatio.includes('16:9')) {
      return { id: '16:9', label: '16:9 (Apaisada / Panorámica)', ratio: 16 / 9, orientation: 'horizontal', exportWidth: 1920 };
    }
    if (targetAspectRatio.includes('4:5')) {
      return { id: '4:5', label: '4:5 (Especialidades)', ratio: 4 / 5, orientation: 'vertical', exportWidth: 1440 };
    }
    if (targetAspectRatio.includes('4:3')) {
      return { id: '4:3', label: '4:3 (Detalles / Momentos)', ratio: 4 / 3, orientation: 'horizontal', exportWidth: 1600 };
    }
    if (targetAspectRatio.includes('1:1')) {
      return { id: '1:1', label: '1:1 (Cuadrado)', ratio: 1 / 1, orientation: 'cuadrado', exportWidth: 1440 };
    }
    // Por defecto 3:4 (Retratos y portadas principales)
    return { id: '3:4', label: '3:4 (Retrato Vertical)', ratio: 3 / 4, orientation: 'vertical', exportWidth: 1440 };
  }, [targetAspectRatio]);

  const targetRatio = lockedRatioConfig.ratio;

  // 2. Cargar imagen en memoria
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

  // 3. Calcular tamaño del cuadro de recorte para que se adapte al viewport del modal
  const updateBoxDimensions = useCallback(() => {
    if (!previewAreaRef.current) return;
    const container = previewAreaRef.current;
    const maxWidth = Math.min(container.clientWidth - 48, 560);
    const maxHeight = Math.min(container.clientHeight - 48, 380);

    let w = maxWidth;
    let h = w / targetRatio;

    if (h > maxHeight) {
      h = maxHeight;
      w = h * targetRatio;
    }

    setBoxDimensions({
      width: Math.round(w),
      height: Math.round(h)
    });
  }, [targetRatio]);

  useEffect(() => {
    if (isOpen) {
      updateBoxDimensions();
      window.addEventListener('resize', updateBoxDimensions);
      return () => window.removeEventListener('resize', updateBoxDimensions);
    }
  }, [isOpen, updateBoxDimensions]);

  // 4. Dimensiones efectivas de la imagen rotada
  const { rotatedWidth, rotatedHeight } = useMemo(() => {
    if (!imageElement) return { rotatedWidth: 1, rotatedHeight: 1 };
    const isSwapped = rotation === 90 || rotation === 270;
    return {
      rotatedWidth: isSwapped ? imageElement.naturalHeight : imageElement.naturalWidth,
      rotatedHeight: isSwapped ? imageElement.naturalWidth : imageElement.naturalHeight,
    };
  }, [imageElement, rotation]);

  // 5. Escala base para cubrir el marco 100% (Cover)
  const baseScale = useMemo(() => {
    if (!boxDimensions.width || !boxDimensions.height) return 1;
    return Math.max(
      boxDimensions.width / rotatedWidth,
      boxDimensions.height / rotatedHeight
    );
  }, [boxDimensions, rotatedWidth, rotatedHeight]);

  // Dimensiones de renderizado de la imagen
  const renderedImgWidth = (imageElement?.naturalWidth || 1) * baseScale * zoom;
  const renderedImgHeight = (imageElement?.naturalHeight || 1) * baseScale * zoom;

  // Dimensiones del cuadro delimitador rotado
  const currentRotatedWidth = (rotation === 90 || rotation === 270 ? renderedImgHeight : renderedImgWidth);
  const currentRotatedHeight = (rotation === 90 || rotation === 270 ? renderedImgWidth : renderedImgHeight);

  // Límites de desplazamiento (Panning) para que la imagen NUNCA deje huecos vacíos
  const maxPanX = Math.max(0, (currentRotatedWidth - boxDimensions.width) / 2);
  const maxPanY = Math.max(0, (currentRotatedHeight - boxDimensions.height) / 2);

  // Restringir pan dentro de los límites
  const clampPan = useCallback((x: number, y: number) => {
    return {
      x: Math.max(-maxPanX, Math.min(maxPanX, x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, y)),
    };
  }, [maxPanX, maxPanY]);

  // 6. Manejo de arrastre (Ratón)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const rawX = e.clientX - dragStart.x;
    const rawY = e.clientY - dragStart.y;
    setPan(clampPan(rawX, rawY));
  }, [isDragging, dragStart, clampPan]);

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

  // 7. Manejo táctil para móviles
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
      const rawX = e.touches[0].clientX - dragStart.x;
      const rawY = e.touches[0].clientY - dragStart.y;
      setPan(clampPan(rawX, rawY));
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

  // Zoom con rueda del ratón
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0015;
    setZoom((prev) => {
      const nextZoom = Math.min(Math.max(prev + delta, 1), 3.5);
      return nextZoom;
    });
  };

  // Botones de acción rápida
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3.5));
  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(prev - 0.2, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
    setPan({ x: 0, y: 0 });
  };

  const handleCenter = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleFocusFace = () => {
    // Sube el encuadre para enfocar la cabeza en el tercio superior
    setPan((prev) => clampPan(prev.x, maxPanY * 0.5));
  };

  // 8. GENERACIÓN EXACTA DE RECORTE EN CANVAS DE ALTA RESOLUCIÓN
  const handleCropAndSave = async () => {
    if (!imageElement || !file) return;

    setIsProcessing(true);

    try {
      const exportWidth = lockedRatioConfig.exportWidth;
      const exportHeight = Math.round(exportWidth / targetRatio);

      const canvas = document.createElement('canvas');
      canvas.width = exportWidth;
      canvas.height = exportHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No se pudo inicializar el contexto de imagen 2D.');
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fondo blanco neutro
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, exportWidth, exportHeight);

      // Factor exacto de escala desde el visor del modal al canvas final
      const factor = exportWidth / boxDimensions.width;

      // 1. Centrar el punto de dibujo en el centro del canvas
      ctx.translate(exportWidth / 2, exportHeight / 2);

      // 2. Aplicar traslación proporcional exacta
      ctx.translate(pan.x * factor, pan.y * factor);

      // 3. Aplicar rotación
      ctx.rotate((rotation * Math.PI) / 180);

      // 4. Dimensiones exactas de dibujo
      const canvasDrawW = renderedImgWidth * factor;
      const canvasDrawH = renderedImgHeight * factor;

      // 5. Dibujar imagen centrada en el origen rotado y trasladado
      ctx.drawImage(
        imageElement,
        -canvasDrawW / 2,
        -canvasDrawH / 2,
        canvasDrawW,
        canvasDrawH
      );

      // Exportar a archivo JPEG de alta calidad
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }

          const croppedFileName = file.name.replace(/\.[^/.]+$/, '') + `_${lockedRatioConfig.id.replace(':', 'x')}.jpg`;
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
      console.error('Error al procesar el recorte milimétrico:', err);
      setIsProcessing(false);
    }
  };

  if (!isOpen || !file || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto overscroll-contain animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-apple-card border border-neutral-300 shadow-2xl flex flex-col max-h-[96vh] overflow-hidden my-auto">
        
        {/* Cabecera del Editor con Identificación de Marco */}
        <div className="bg-neutral-50 px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between shrink-0">
          <div className="flex-1 pr-3 truncate">
            <div className="flex items-center gap-2">
              <Crop size={16} className="text-accentMain shrink-0" />
              <h2 className="title-main text-xs sm:text-sm text-textMain tracking-widest truncate">
                ENCUADRE EXACTO DE FOTOGRAFÍA
              </h2>
            </div>
            <p className="text-[11px] text-textSecondary font-sans truncate mt-0.5">
              {sectionTitle} {slotLabel ? `— ${slotLabel}` : ''}
            </p>
          </div>

          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="w-8 h-8 rounded-apple-btn flex items-center justify-center text-textSecondary hover:text-textMain hover:bg-black/[0.05] transition-colors"
            title="Cerrar sin guardar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Notificación de Bloqueo de Formato Obligatorio */}
        <div className="bg-accentMain/[0.06] border-b border-accentMain/20 px-5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-sans shrink-0">
          <div className="flex items-center gap-2">
            <Lock size={13} className="text-accentMain shrink-0" />
            <span className="text-[11px] text-textMain font-medium">
              Formato Obligatorio para este marco: <strong className="text-accentMain">{lockedRatioConfig.label}</strong>
            </span>
          </div>
          {recommendationTip ? (
            <div className="flex items-center gap-1.5 text-[10px] text-textSecondary">
              <AlertCircle size={12} className="text-accentMain shrink-0" />
              <span className="truncate max-w-md">{recommendationTip}</span>
            </div>
          ) : (
            <span className="text-[10px] text-textSecondary hidden sm:inline-flex items-center gap-1">
              <CheckCircle2 size={12} className="text-green-600" />
              Garantiza 100% de coincidencia en la web
            </span>
          )}
        </div>

        {/* Visor de Encuadre */}
        <div 
          ref={previewAreaRef}
          className="relative flex-1 min-h-[280px] sm:min-h-[380px] bg-neutral-950 flex items-center justify-center overflow-hidden select-none touch-none p-4"
          onWheel={handleWheel}
        >
          {/* Marco de Recorte con Esquinas Apple y Sombra Perimetral */}
          <div 
            style={{
              width: `${boxDimensions.width}px`,
              height: `${boxDimensions.height}px`,
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`relative rounded-apple-card shadow-[0_0_0_9999px_rgba(0,0,0,0.85)] border-2 border-accentMain overflow-hidden cursor-move touch-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {/* Imagen interactiva renderizada con precisión milimétrica */}
            {imageElement && (
              <img
                src={imageSrc}
                alt="Vista previa recorte"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: `${renderedImgWidth}px`,
                  height: `${renderedImgHeight}px`,
                  transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                  maxWidth: 'none',
                  maxHeight: 'none',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              />
            )}

            {/* Regla de Tercios Fotográficos */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20">
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

            {/* Guía de esquinas Apple redondeadas */}
            <div className="absolute inset-0 border border-white/40 rounded-apple-card pointer-events-none"></div>

            {/* Ayuda de gestos móvil */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none px-2">
              <span className="bg-black/80 backdrop-blur-sm text-white text-[9px] uppercase font-sans tracking-widest px-3 py-1 rounded-apple-badge flex items-center gap-1.5 shadow-sm">
                <Smartphone size={11} className="text-accentSecondary" />
                Arrastra para encuadrar • Zoom con slider abajo
              </span>
            </div>
          </div>

          {/* Maqueta de Vista Previa (Simulador Web) */}
          {showWebPreview && (
            <div className="absolute top-4 right-4 z-30 bg-white/95 backdrop-blur-md p-3.5 rounded-apple-card border border-neutral-300 shadow-2xl max-w-[170px] animate-fadeIn">
              <span className="block text-[9px] uppercase tracking-widest text-textSecondary font-sans mb-1.5 font-medium">
                En la web pública:
              </span>
              <div 
                style={{ aspectRatio: `${targetRatio}` }}
                className="w-full rounded-apple-card overflow-hidden bg-neutral-100 relative mb-1.5 border border-black/[0.08] shadow-apple-subtle"
              >
                {imageElement && (
                  <img
                    src={imageSrc}
                    alt="Mini preview"
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: `${renderedImgWidth * (140 / boxDimensions.width)}px`,
                      height: `${renderedImgHeight * (140 / boxDimensions.width)}px`,
                      transform: `translate(-50%, -50%) translate(${pan.x * (140 / boxDimensions.width)}px, ${pan.y * (140 / boxDimensions.width)}px) rotate(${rotation}deg)`,
                      transformOrigin: 'center center',
                    }}
                    className="max-w-none pointer-events-none"
                  />
                )}
              </div>
              <span className="block text-[10px] text-textMain truncate font-serif uppercase text-center">
                {sectionTitle}
              </span>
            </div>
          )}
        </div>

        {/* Barra de Controles y Ajuste Fino */}
        <div className="p-4 sm:p-5 bg-white border-t border-neutral-200 flex flex-col gap-3.5 shrink-0">
          
          {/* Fila de Herramientas de Encuadre */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleFocusFace}
                className="min-h-[36px] px-3 rounded-apple-btn border border-neutral-200 text-xs font-sans text-textMain hover:bg-neutral-50 flex items-center gap-1.5 transition-colors active:scale-95"
                title="Alinear rostro con el tercio superior"
              >
                <User size={13} className="text-accentMain" />
                <span>Enfocar Rostro</span>
              </button>

              <button
                type="button"
                onClick={handleCenter}
                className="min-h-[36px] px-3 rounded-apple-btn border border-neutral-200 text-xs font-sans text-textSecondary hover:text-textMain hover:bg-neutral-50 flex items-center gap-1.5 transition-colors active:scale-95"
                title="Centrar en el marco"
              >
                <Crosshair size={13} />
                <span>Centrar</span>
              </button>

              <button
                type="button"
                onClick={handleRotate}
                className="min-h-[36px] px-3 rounded-apple-btn border border-neutral-200 text-xs font-sans text-textSecondary hover:text-textMain hover:bg-neutral-50 flex items-center gap-1.5 transition-colors active:scale-95"
                title="Girar 90 grados"
              >
                <RotateCw size={13} />
                <span>Girar 90°</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowWebPreview(!showWebPreview)}
              className={`min-h-[36px] px-3 rounded-apple-btn border text-xs font-sans flex items-center gap-1.5 transition-all ${
                showWebPreview 
                  ? 'bg-accentMain text-white border-accentMain shadow-sm' 
                  : 'border-neutral-200 text-textSecondary hover:bg-neutral-50'
              }`}
              title="Previsualizar cómo queda en la web"
            >
              <Eye size={13} />
              <span>Simulador Web</span>
            </button>
          </div>

          {/* Fila de Zoom con Control Deslizante Apple */}
          <div className="flex items-center gap-3 pt-2 border-t border-neutral-100">
            <span className="text-[10px] uppercase tracking-widest font-sans text-textSecondary w-12 shrink-0">
              Zoom:
            </span>
            <button
              type="button"
              onClick={handleZoomOut}
              className="w-8 h-8 rounded-apple-btn border border-neutral-200 flex items-center justify-center text-textSecondary hover:text-textMain hover:bg-neutral-50 shrink-0 active:scale-90 transition-all"
              title="Reducir zoom"
            >
              <ZoomOut size={14} />
            </button>
            
            <input
              type="range"
              min={1}
              max={3.5}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-accentMain h-2 bg-neutral-200 rounded-lg cursor-pointer"
            />

            <button
              type="button"
              onClick={handleZoomIn}
              className="w-8 h-8 rounded-apple-btn border border-neutral-200 flex items-center justify-center text-textSecondary hover:text-textMain hover:bg-neutral-50 shrink-0 active:scale-90 transition-all"
              title="Aumentar zoom"
            >
              <ZoomIn size={14} />
            </button>
            <span className="text-xs font-sans text-textSecondary w-12 text-right shrink-0">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Botones Principales de Guardar / Cancelar */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-200 gap-3">
            <span className="text-[11px] text-textSecondary font-sans font-light hidden sm:inline-flex items-center gap-1.5">
              <Sparkles size={13} className="text-accentMain" />
              Recorte sin pixelación calibrado para {lockedRatioConfig.exportWidth}px
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto ml-auto">
              <button
                type="button"
                onClick={onCancel}
                disabled={isProcessing}
                className="w-1/3 sm:w-auto min-h-[44px] text-xs uppercase tracking-widest font-sans px-5 rounded-apple-btn text-textSecondary hover:text-textMain border border-neutral-200 hover:bg-neutral-50 active:scale-95 transition-all"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleCropAndSave}
                disabled={isProcessing}
                className="w-2/3 sm:w-auto min-h-[44px] btn-primary text-xs tracking-widest uppercase flex items-center justify-center gap-2 px-6"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
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
