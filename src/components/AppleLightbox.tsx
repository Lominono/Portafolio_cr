/* Apple UI Design System – Verified: 8pt Grid, SF Pro Typography, Material-Depth, Natural Spring Motion */
import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface AppleLightboxProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  titles?: string[];
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export const AppleLightbox: React.FC<AppleLightboxProps> = ({
  isOpen,
  images,
  currentIndex,
  titles = [],
  onClose,
  onNavigate,
}) => {
  const currentImage = images[currentIndex];
  const currentTitle = titles[currentIndex];
  const total = images.length;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    } else {
      onNavigate(total - 1);
    }
  }, [currentIndex, total, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < total - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onNavigate(0);
    }
  }, [currentIndex, total, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    // Bloquear scroll del fondo
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentImage) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-2xl transition-all duration-300 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Visor de fotografía en alta resolución"
    >
      {/* Botón Cerrar (44x44px Apple standard) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-200 active:scale-90 shadow-apple-glass"
        aria-label="Cerrar visor"
      >
        <X size={20} strokeWidth={1.75} />
      </button>

      {/* Flecha Anterior (si hay más de 1 imagen) */}
      {total > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-4 sm:left-8 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-200 active:scale-90 shadow-apple-glass"
          aria-label="Fotografía anterior"
        >
          <ChevronLeft size={22} strokeWidth={1.75} />
        </button>
      )}

      {/* Imagen Principal en Pantalla Completa */}
      <div 
        className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage}
          alt={currentTitle || 'Fotografía de Cristian Espinola'}
          className="max-w-full max-h-[75vh] object-contain rounded-[14px] shadow-2xl border border-white/10"
        />

        {/* Barra Inferior con Título y Contador */}
        <div className="mt-4 flex items-center justify-between gap-4 w-full px-2">
          <p className="text-white/90 text-xs sm:text-sm font-sans tracking-wide truncate max-w-[70%]">
            {currentTitle || 'Cristian Espinola · Fotografía'}
          </p>
          {total > 1 && (
            <span className="text-white/60 text-xs font-sans tracking-widest px-3 py-1 rounded-full bg-white/10 border border-white/10 shrink-0">
              {currentIndex + 1} / {total}
            </span>
          )}
        </div>
      </div>

      {/* Flecha Siguiente (si hay más de 1 imagen) */}
      {total > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 sm:right-8 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-200 active:scale-90 shadow-apple-glass"
          aria-label="Fotografía siguiente"
        >
          <ChevronRight size={22} strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
};

export default AppleLightbox;
