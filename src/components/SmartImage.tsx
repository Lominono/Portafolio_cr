/* Apple UI Design System – Verified: 8pt Grid, SF Pro Typography, Material-Depth, Natural Spring Motion */
import React, { useState } from 'react';
import { Camera, Maximize2 } from 'lucide-react';

interface SmartImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallbackLabel?: string;
  onClick?: () => void;
  expandable?: boolean;
  priority?: boolean;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  fallbackLabel,
  onClick,
  expandable = true,
  priority = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Si no hay src o hubo error al cargar
  if (!src || hasError) {
    return (
      <div 
        className={`w-full h-full flex flex-col items-center justify-center p-6 text-center bg-neutral-50 border border-black/[0.04] select-none ${containerClassName}`}
      >
        <div className="w-10 h-10 rounded-apple-btn bg-accentMain/10 text-accentMain flex items-center justify-center mb-3">
          <Camera size={18} strokeWidth={1.4} />
        </div>
        <span className="w-6 h-px bg-accentMain mb-2 opacity-50"></span>
        <span className="text-textSecondary text-xs font-sans font-light">
          {fallbackLabel || alt || 'Fotografía de Cristian'}
        </span>
        {hasError && (
          <span className="text-[11px] text-accentMain/80 font-sans mt-1">
            Imagen no disponible temporalmente
          </span>
        )}
      </div>
    );
  }

  const isClickable = Boolean(onClick);

  return (
    <div 
      className={`relative w-full h-full overflow-hidden group ${isClickable ? 'cursor-pointer' : ''} ${containerClassName}`}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick?.() : undefined}
      aria-label={isClickable ? `Ampliar fotografía: ${alt}` : alt}
    >
      {/* Skeleton loader mientras descarga la imagen */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-neutral-100/90 animate-pulse flex items-center justify-center z-10">
          <div className="w-8 h-8 rounded-full border-2 border-accentMain/30 border-t-accentMain animate-spin" />
        </div>
      )}

      {/* Imagen real con fade-in al completar */}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-all duration-700 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
        } ${className}`}
      />

      {/* Overlay con indicación de zoom al pasar el cursor si es interactiva */}
      {isClickable && expandable && isLoaded && (
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <div className="apple-glass px-3.5 py-1.5 rounded-apple-btn text-textMain text-xs font-sans shadow-apple-subtle flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
            <Maximize2 size={13} className="text-accentMain" />
            <span className="font-normal text-xs">Ampliar</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartImage;
