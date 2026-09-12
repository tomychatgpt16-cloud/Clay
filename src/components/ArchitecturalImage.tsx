import { useState, useRef, useEffect } from 'react';
import { Camera, Layers } from 'lucide-react';

interface CompositeCropProp {
  compositeUrl: string;
  bgPos: string;
  sectionLabel: string;
}

interface ArchitecturalImageProps {
  src: string;
  fallbackUrl: string;
  alt: string;
  title?: string;
  slotPath?: string;
  className?: string;
  aspectRatio?: string;
  showSlotIndicator?: boolean;
  priority?: boolean;
  objectFit?: 'cover' | 'contain';
  useComposite?: boolean;
  compositeCrop?: CompositeCropProp;
  customSrc?: string;
  customCompositeUrl?: string;
  onUploadClick?: () => void;
}

export default function ArchitecturalImage({
  src,
  fallbackUrl,
  alt,
  title,
  slotPath,
  className = '',
  aspectRatio = 'aspect-[4/3]',
  showSlotIndicator = true,
  objectFit = 'cover',
  useComposite = false,
  compositeCrop,
  customSrc,
  customCompositeUrl,
  onUploadClick,
}: ArchitecturalImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Active composite URL: preference order = customCompositeUrl -> compositeCrop.compositeUrl
  const effectiveCompositeUrl = customCompositeUrl || compositeCrop?.compositeUrl || '/images/products/six-stones-composite.jpg';

  // Determine whether to use composite cropped section
  const isCroppingComposite = Boolean(useComposite && compositeCrop && effectiveCompositeUrl);

  // Active standard image
  const activeImage = customSrc || (hasError ? fallbackUrl : src);

  // Check if image is already completed in cache
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [activeImage]);

  return (
    <div 
      className={`relative overflow-hidden group/arch bg-[#202120] ${aspectRatio} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background marble veining texture placeholder during load */}
      <div className="absolute inset-0 bg-[#252625] bg-marble-charcoal opacity-90 transition-opacity duration-700" />

      {/* Main Image: Either Composite Cropped Section or Standard Image */}
      {isCroppingComposite && compositeCrop ? (
        <div
          className="w-full h-full transition-transform duration-700 ease-out group-hover/arch:scale-105 bg-no-repeat"
          style={{
            backgroundImage: `url(${effectiveCompositeUrl}), url(/images/products/six-stones-composite.svg), url(${fallbackUrl})`,
            backgroundSize: '300% 200%',
            backgroundPosition: compositeCrop.bgPos,
          }}
          role="img"
          aria-label={alt}
        />
      ) : (
        <img
          ref={imgRef}
          src={activeImage}
          alt={alt}
          loading="eager"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            if (!hasError) {
              setHasError(true);
            }
          }}
          className={`w-full h-full object-${objectFit} transition-all duration-700 ease-out group-hover/arch:scale-105 ${
            isLoaded ? 'opacity-100 filter-none' : 'opacity-0'
          }`}
        />
      )}

      {/* Subtle vignette / light architectural gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#111211]/70 via-[#202120]/10 to-transparent pointer-events-none" />

      {/* Subtle "Company Photo Slot" Indicator (Hoverable & Accessible) */}
      {showSlotIndicator && (
        <div 
          onClick={(e) => {
            if (onUploadClick) {
              e.stopPropagation();
              onUploadClick();
            }
          }}
          className={`absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] tracking-wider transition-all duration-300 font-mono ${
            onUploadClick ? 'cursor-pointer' : ''
          } ${
            isHovered 
              ? 'bg-[#111211]/90 text-[#F4F3EF] border border-[#858582] shadow-lg translate-y-0 opacity-100 hover:border-white' 
              : 'bg-[#202120]/60 text-[#B7B6B2] border border-[#414240]/40 opacity-0 group-hover/arch:opacity-85'
          }`}
          title={
            onUploadClick
              ? 'Click to manage or upload company photographs'
              : isCroppingComposite && compositeCrop
              ? `6-Stone Sheet Section: ${compositeCrop.sectionLabel} (${effectiveCompositeUrl})`
              : `Company photo slot: ${slotPath}`
          }
        >
          <Camera className="w-3 h-3 text-[#D8D6D1]" />
          <span className="truncate max-w-[170px] sm:max-w-[230px]">
            {isCroppingComposite && compositeCrop
              ? (isHovered ? (onUploadClick ? 'Change Photo • ' + compositeCrop.sectionLabel : compositeCrop.sectionLabel) : '6-Stone Crop')
              : (isHovered ? (onUploadClick ? `Replace: ${slotPath}` : `Slot: ${slotPath}`) : 'Photo Slot')}
          </span>
        </div>
      )}

      {/* Title tag on bottom if passed and not loaded */}
      {!isCroppingComposite && !isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
          <div className="w-10 h-10 rounded-sm bg-[#202120]/80 border border-[#414240] flex items-center justify-center mb-2">
            <Layers className="w-5 h-5 text-[#B7B6B2]" />
          </div>
          <span className="font-serif text-sm text-[#F4F3EF] tracking-wider">
            {title || alt}
          </span>
          {slotPath && (
            <span className="text-[10px] text-[#B7B6B2] font-mono mt-1">
              {slotPath}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
