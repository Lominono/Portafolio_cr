import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  Check, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Maximize2,
  Crop,
  Sparkles
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
  targetAspectRatio?: string;
  onConfirm: (croppedFile: File) => void;
  onCancel: () => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  file,
  sectionTitle,
  targetAspectRatio = '3:4',
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

  const containerRef = useRef<HTMLDivElement>(null);
  const initialTouchDistanceRef = useRef<number | null>(null);

  // Detectar ratio inicial según la sección
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

  // Manejo de touch táctil para móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    } else if (e.touches.length === 2) {
      // Pinch to zoom inicial
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
      setZoom((prev) => Math.min(Math.max(prev * factor, 1), 3));
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
    setZoom((prev) => Math.min(Math.max(prev + delta, 1), 3));
  };

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
      const exportWidth = 1800; // Alta resolución profesional
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

      // Fondo transparente/blanco
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, exportWidth, exportHeight);

      // Calcular escala de la caja de recorte al canvas final
      const scaleToCanvas = exportWidth / cropBox.width;

      // Transformaciones del Canvas
      ctx.translate(exportWidth / 2, exportHeight / 2);
      ctx.translate(pan.x * scaleToCanvas, pan.y * scaleToCanvas);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // Calcular dimensiones base de la imagen para centrarla
      const isRotated90 = rotation === 90 || rotation === 270;
      const naturalW = isRotated90 ? imageElement.naturalHeight : imageElement.naturalWidth;
      const naturalH = isRotated90 ? imageElement.naturalWidth : imageElement.naturalHeight;

      // Escala inicial para cubrir la caja ("cover")
      const coverScale = Math.max(cropBox.width / naturalW, cropBox.height / naturalH);
      const renderW = imageElement.naturalWidth * coverScale * scaleToCanvas;
      const renderH = imageElement.naturalHeight * coverScale * scaleToCanvas;

      ctx.drawImage(imageElement, -renderW / 2, -renderH / 2, renderW, renderH);

      // Convertir Canvas a Blob de alta calidad
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }

          const croppedFileName = file.name.replace(/\.[^/.]+$/, '') + '_encuadre.jpg';
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl photo-card-secondary border border-neutral-300 shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* Cabecera del Editor */}
        <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Crop size={16} className="text-accentMain" />
              <h2 className="title-main text-base text-textMain">
                AJUSTAR ENCUADRE Y RECORTE
              </h2>
            </div>
            <p className="text-[11px] text-textSecondary font-sans font-light mt-0.5">
              Sección: <strong className="font-normal text-textMain">{sectionTitle}</strong> (Recomendado: {targetAspectRatio})
            </p>
          </div>

          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="p-2 text-textSecondary hover:text-textMain transition-colors"
            title="Cancelar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Área de Visualización y Enmarcado Interactivo */}
        <div 
          className="relative flex-1 min-h-[320px] sm:min-h-[420px] bg-neutral-900 flex items-center justify-center overflow-hidden select-none"
          onWheel={handleWheel}
        >
          {/* Contenedor del Cuadro de Recorte */}
          <div 
            ref={containerRef}
            style={{
              aspectRatio: `${activeRatio}`,
              maxHeight: '380px',
              maxWidth: '90%',
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`relative w-full h-full shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] border-2 border-white/90 overflow-hidden cursor-move ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {/* Imagen interactiva */}
            {imageElement && (
              <div
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out',
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

            {/* Guía de Composición (Regla de Tercios) */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30 hover:opacity-50 transition-opacity">
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

            {/* Mensaje de ayuda sutil */}
            <div className="absolute bottom-2 left-2 right-2 flex justify-center pointer-events-none">
              <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase font-sans tracking-widest px-2.5 py-1 flex items-center gap-1.5 rounded-none">
                <Move size={10} />
                Arrastra para encuadrar el rostro o sujeto
              </span>
            </div>
          </div>
        </div>

        {/* Barra de Herramientas de Ajuste */}
        <div className="p-4 sm:p-6 bg-white border-t border-neutral-200 flex flex-col gap-4">
          
          {/* Selector de Relación de Aspecto */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-[10px] uppercase tracking-widest text-textSecondary font-sans font-medium">
              Proporción de Recorte:
            </span>
            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              {ASPECT_RATIOS.map((item) => {
                const isSelected = selectedRatioId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedRatioId(item.id);
                      setPan({ x: 0, y: 0 });
                    }}
                    className={`text-[10px] uppercase tracking-wider font-sans px-2.5 py-1.5 transition-colors border ${
                      isSelected
                        ? 'bg-accentMain text-white border-accentMain font-medium'
                        : 'bg-neutral-100 text-textSecondary border-neutral-200 hover:bg-neutral-200'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controles de Zoom y Rotación */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-neutral-100">
            
            {/* Slider de Zoom */}
            <div className="flex items-center gap-3 w-full sm:w-1/2">
              <ZoomOut size={16} className="text-textSecondary shrink-0" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-accentMain h-1.5 bg-neutral-200 cursor-pointer"
              />
              <ZoomIn size={16} className="text-textSecondary shrink-0" />
              <span className="text-xs font-sans text-textSecondary w-10 text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Botones de Rotación y Reseteo */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleRotate}
                className="inline-flex items-center gap-1.5 text-xs text-textSecondary hover:text-textMain border border-neutral-300 px-3 py-1.5 transition-colors"
                title="Girar 90 grados en sentido horario"
              >
                <RotateCw size={13} />
                <span>Girar 90°</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-textSecondary hover:text-textMain border border-neutral-300 px-3 py-1.5 transition-colors"
                title="Restablecer posición y zoom"
              >
                <Maximize2 size={13} />
                <span>Centrar</span>
              </button>
            </div>

          </div>

          {/* Botones Finales de Acción */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
            <span className="text-[10px] text-textSecondary font-sans font-light hidden sm:inline-flex items-center gap-1">
              <Sparkles size={12} className="text-accentMain" />
              La imagen se optimizará automáticamente para una carga ultrarrápida.
            </span>

            <div className="flex items-center gap-3 ml-auto w-full sm:w-auto">
              <button
                type="button"
                onClick={onCancel}
                disabled={isProcessing}
                className="w-1/2 sm:w-auto text-xs uppercase tracking-widest font-sans px-5 py-2.5 text-textSecondary hover:text-textMain border border-neutral-300 transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleCropAndSave}
                disabled={isProcessing}
                className="w-1/2 sm:w-auto btn-primary text-xs tracking-widest uppercase flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Confirmar y Subir</span>
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
