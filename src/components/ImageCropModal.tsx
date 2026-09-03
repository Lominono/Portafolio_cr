import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  Check, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Crop,
  Eye,
  Info,
  Smartphone,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface AspectRatioOption {
  label: string;
  ratio: number; // width / height
  id: string;
}

const ASPECT_RATIOS: AspectRatioOption[] = [
  { id: '3:4', label: '3:4 (Vertical)', ratio: 3 / 4 },
  { id: '4:5', label: '4:5 (Especialidades)', ratio: 4 / 5 },
  { id: '16:9', label: '16:9 (Apaisada)', ratio: 16 / 9 },
  { id: '4:3', label: '4:3 (Detalles)', ratio: 4 / 3 },
  { id: '1:1', label: '1:1 (Cuadrado)', ratio: 1 / 1 },
  { id: 'original', label: 'Original', ratio: 0 },
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

  // Estados de UI móvil
  const [showWebPreview, setShowWebPreview] = useState(false);
  const [showTips, setShowTips] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const initialTouchDistanceRef = useRef<number | null>(null);

  // Detectar ratio inicial según la ranura
  useEffect(() => {
    if (targetAspectRatio.includes('16:9')) {
      setSelectedRatioId('16:9');
    } else if (targetAspectRatio.includes('4:5')) {
      setSelectedRatioId('4:5');
    } else if (targetAspectRatio.includes('4:3')) {
      setSelectedRatioId('4:3');
    } else if (targetAspectRatio.includes('1:1')) {
      setSelectedRatioId('1:1');
    } else {
      setSelectedRatioId('3:4');
    }
  }, [targetAspectRatio, isOpen]);

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

  // Manejo de touch táctil para móviles (touch-action: none)
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

  // Zoom con rueda de ratón
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0015;
    setZoom((prev) => Math.min(Math.max(prev + delta, 1), 3.5));
  };

  // Zoom táctil por botones
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 3.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 1));

  // Rotar 90 grados
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Resetear encuadre
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  };

  // Generar recorte final en Canvas de alta resolución
  const handleCropAndSave = async () => {
    if (!imageElement || !containerRef.current || !file) return;

    setIsProcessing(true);

    try {
      const cropBox = containerRef.current.getBoundingClientRect();
      const exportWidth = 1920; // Alta definición cinematográfica
      const exportHeight = Math.round(exportWidth / activeRatio);

      const canvas = document.createElement('canvas');
      canvas.width = exportWidth;
      canvas.height = exportHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No se pudo inicializar el contexto de Canvas.');
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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto overscroll-contain">
      <div className="bg-white w-full max-w-3xl photo-card-secondary border border-neutral-300 shadow-2xl flex flex-col max-h-[96vh] overflow-hidden my-auto">
        
        {/* Cabecera del Editor */}
        <div className="bg-neutral-50 px-4 sm:px-6 py-3.5 border-b border-neutral-200 flex items-center justify-between shrink-0">
          <div className="flex-1 pr-2 truncate">
            <div className="flex items-center gap-2">
              <Crop size={16} className="text-accentMain shrink-0" />
              <h2 className="title-main text-sm sm:text-base text-textMain truncate">
                EDITOR & RECORTE INTELIGENTE
              </h2>
            </div>
            <p className="text-[11px] text-textSecondary font-sans truncate">
              {sectionTitle} {slotLabel ? `— ${slotLabel}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowTips(!showTips)}
              className={`p-1.5 rounded-none border text-xs font-sans flex items-center gap-1 transition-colors ${
                showTips ? 'bg-accentMain text-white border-accentMain' : 'bg-white text-textSecondary border-neutral-300 hover:text-textMain'
              }`}
              title="Ver recomendaciones de recorte"
            >
              <HelpCircle size={14} />
              <span className="hidden sm:inline">Guía Web</span>
            </button>

            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="p-1.5 text-textSecondary hover:text-textMain transition-colors"
              title="Cerrar editor"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tarjeta de Recomendaciones y Guía Visual para que quede bien en la Web */}
        {showTips && (
          <div className="bg-amber-50/70 border-b border-amber-200 px-4 py-3 text-xs font-sans text-neutral-800 shrink-0 transition-all">
            <div className="flex items-start gap-2.5">
              <Info size={16} className="text-accentMain shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <strong className="text-textMain font-medium">Recomendación para esta ranura:</strong>
                  <span className="bg-accentMain text-white text-[10px] px-2 py-0.2 uppercase tracking-widest font-sans font-medium">
                    Proporción {targetAspectRatio}
                  </span>
                </div>
                <p className="text-[11px] text-textSecondary font-light leading-relaxed">
                  {recommendationTip || 
                    'Encuadra el sujeto principal dentro de la cuadrícula de tercios. En teléfonos móviles la web adapta las fotos verticalmente: evita cortar rostros o detalles esenciales en los bordes.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Área de Visualización y Enmarcado Táctil */}
        <div 
          className="relative flex-1 min-h-[260px] sm:min-h-[380px] bg-neutral-950 flex items-center justify-center overflow-hidden select-none touch-none"
          onWheel={handleWheel}
        >
          {/* Cuadro de Recorte */}
          <div 
            ref={containerRef}
            style={{
              aspectRatio: `${activeRatio}`,
              maxHeight: 'min(50vh, 360px)',
              maxWidth: '88%',
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`relative w-full h-full shadow-[0_0_0_9999px_rgba(0,0,0,0.75)] border-2 border-white/90 overflow-hidden cursor-move touch-none ${
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
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30">
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

            {/* Ayuda de gestos móvil */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none px-2">
              <span className="bg-black/70 backdrop-blur-sm text-white text-[9px] sm:text-[10px] uppercase font-sans tracking-widest px-2.5 py-1 flex items-center gap-1.5">
                <Smartphone size={11} className="text-accentSecondary" />
                Arrastra con 1 dedo para centrar • Pellizca para zoom
              </span>
            </div>
          </div>

          {/* Maqueta de Vista Previa en Vivo (Mini Simulación Web) */}
          {showWebPreview && (
            <div className="absolute top-3 right-3 z-30 bg-white/95 backdrop-blur-md p-3 border border-neutral-300 shadow-xl max-w-[160px] animate-fadeIn">
              <span className="block text-[9px] uppercase tracking-widest text-textSecondary font-sans mb-1 font-medium">
                En la web se verá:
              </span>
              <div 
                style={{ aspectRatio: `${activeRatio}` }}
                className="w-full photo-card-secondary overflow-hidden bg-neutral-100 relative mb-1.5"
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

        {/* Barra de Herramientas Táctil (Optimizado para Teléfonos) */}
        <div className="p-3 sm:p-5 bg-white border-t border-neutral-200 flex flex-col gap-3 shrink-0 overflow-y-auto max-h-[38vh]">
          
          {/* Selector de Ratios (Horizontal con scroll) */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase tracking-wider text-textSecondary font-sans font-medium whitespace-nowrap">
              Formato:
            </span>
            <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar w-full justify-end">
              {ASPECT_RATIOS.map((item) => {
                const isSelected = selectedRatioId === item.id;
                const isRecommended = targetAspectRatio.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedRatioId(item.id);
                      setPan({ x: 0, y: 0 });
                    }}
                    className={`text-[10px] uppercase font-sans px-2.5 py-1.5 transition-colors border whitespace-nowrap flex items-center gap-1 ${
                      isSelected
                        ? 'bg-accentMain text-white border-accentMain font-medium'
                        : isRecommended
                        ? 'bg-amber-50 text-accentMain border-amber-300 font-medium'
                        : 'bg-neutral-100 text-textSecondary border-neutral-200 hover:bg-neutral-200'
                    }`}
                  >
                    {item.label}
                    {isRecommended && <span className="text-[8px] bg-white/20 px-1 rounded-none">Web</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fila de Controles de Zoom, Giro y Previsualización */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-neutral-100">
            
            {/* Controles de Zoom con Botones Grandes para Móvil */}
            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <button
                type="button"
                onClick={handleZoomOut}
                className="w-8 h-8 rounded-none border border-neutral-200 flex items-center justify-center text-textSecondary hover:text-textMain hover:bg-neutral-50 active:bg-neutral-100 shrink-0"
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
                className="w-full accent-accentMain h-1.5 bg-neutral-200 cursor-pointer"
              />

              <button
                type="button"
                onClick={handleZoomIn}
                className="w-8 h-8 rounded-none border border-neutral-200 flex items-center justify-center text-textSecondary hover:text-textMain hover:bg-neutral-50 active:bg-neutral-100 shrink-0"
                title="Aumentar zoom"
              >
                <ZoomIn size={14} />
              </button>
            </div>

            {/* Acciones Rápidas: Rotar, Centrar, Previsualizar */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleRotate}
                className="px-2.5 py-1.5 border border-neutral-200 text-[11px] font-sans text-textSecondary hover:text-textMain hover:bg-neutral-50 flex items-center gap-1 transition-colors"
                title="Girar 90 grados"
              >
                <RotateCw size={13} />
                <span className="hidden sm:inline">Girar 90°</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 py-1.5 border border-neutral-200 text-[11px] font-sans text-textSecondary hover:text-textMain hover:bg-neutral-50 flex items-center gap-1 transition-colors"
                title="Centrar foto"
              >
                <Maximize2 size={13} />
                <span className="hidden sm:inline">Centrar</span>
              </button>

              <button
                type="button"
                onClick={() => setShowWebPreview(!showWebPreview)}
                className={`px-2.5 py-1.5 border text-[11px] font-sans flex items-center gap-1 transition-colors ${
                  showWebPreview ? 'bg-accentMain text-white border-accentMain' : 'border-neutral-200 text-textSecondary hover:bg-neutral-50'
                }`}
                title="Previsualizar cómo queda en la web"
              >
                <Eye size={13} />
                <span className="hidden sm:inline">Simulador Web</span>
              </button>
            </div>

          </div>

          {/* Botones Principales de Guardar / Cancelar (Sticky en móvil) */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-200 gap-3">
            <span className="text-[10px] text-textSecondary font-sans font-light hidden sm:inline-flex items-center gap-1">
              <Sparkles size={12} className="text-accentMain" />
              Optimizada a alta resolución sin perder nitidez
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
                    <span>Aplicar y Subir</span>
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
