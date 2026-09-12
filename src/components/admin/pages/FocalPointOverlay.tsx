import { useState, useRef, useCallback, useEffect } from 'react';
import type { HeroCarouselContent, HeroSlide } from '@/lib/types';

interface FocalPointOverlayProps {
  slides: HeroSlide[];
  currentSlideIndex: number;
  onChange: (slideIndex: number, focalX: number, focalY: number) => void;
  isActive: boolean;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function FocalPointOverlay({
  slides,
  currentSlideIndex,
  onChange,
  isActive,
}: FocalPointOverlayProps) {
  const [dragging, setDragging] = useState(false);
  const [activeSlide, setActiveSlide] = useState(currentSlideIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  // Sync active slide with current slide when not dragging
  useEffect(() => {
    if (!dragging) {
      setActiveSlide(currentSlideIndex);
    }
  }, [currentSlideIndex, dragging]);

  const calculateFocal = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    const x = clamp01((clientX - rect.left) / rect.width);
    const y = clamp01((clientY - rect.top) / rect.height);
    return { x, y };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    const focal = calculateFocal(e.clientX, e.clientY);
    if (focal) {
      onChange(activeSlide, focal.x, focal.y);
    }
  }, [calculateFocal, onChange, activeSlide]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    e.preventDefault();
    const focal = calculateFocal(e.clientX, e.clientY);
    if (focal) {
      onChange(activeSlide, focal.x, focal.y);
    }
  }, [dragging, calculateFocal, onChange, activeSlide]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    e.preventDefault();
    setDragging(false);
  }, [dragging]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const focalX = slides[activeSlide]?.focal_x ?? 0.5;
    const focalY = slides[activeSlide]?.focal_y ?? 0.5;
    const step = e.shiftKey ? 0.05 : 0.01;
    let newX = focalX;
    let newY = focalY;

    switch (e.key) {
      case 'ArrowLeft':
        newX = clamp01(focalX - step);
        e.preventDefault();
        break;
      case 'ArrowRight':
        newX = clamp01(focalX + step);
        e.preventDefault();
        break;
      case 'ArrowUp':
        newY = clamp01(focalY - step);
        e.preventDefault();
        break;
      case 'ArrowDown':
        newY = clamp01(focalY + step);
        e.preventDefault();
        break;
      default:
        return;
    }
    onChange(activeSlide, newX, newY);
  }, [activeSlide, onChange, slides]);

  const slide = slides[activeSlide];
  if (!slide || !isActive) return null;

  const focalX = slide.focal_x ?? 0.5;
  const focalY = slide.focal_y ?? 0.5;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-20"
      style={{ pointerEvents: dragging ? 'all' : 'none' }}
    >
      {/* Rule-of-thirds grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20" />
        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/20" />
        <div className="absolute top-1/3 left-0 right-0 h-px bg-white/20" />
        <div className="absolute top-2/3 left-0 right-0 h-px bg-white/20" />
      </div>

      {/* Focal point marker */}
      <div
        ref={markerRef}
        className={`absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full border-2 border-white bg-gold/80 cursor-crosshair transition-shadow ${
          dragging ? 'shadow-[0_0_0_4px_rgba(214,166,79,0.4)] scale-110' : 'hover:shadow-[0_0_0_3px_rgba(214,166,79,0.3)]'
        }`}
        style={{
          left: `${focalX * 100}%`,
          top: `${focalY * 100}%`,
          pointerEvents: 'all',
        }}
        tabIndex={0}
        role="slider"
        aria-label={`Focal point for slide ${activeSlide + 1}`}
        aria-valuetext={`X: ${Math.round(focalX * 100)}%, Y: ${Math.round(focalY * 100)}%`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
      >
        {/* Crosshair lines */}
        <div className="absolute left-1/2 -ml-px top-[-6px] w-px h-[calc(100%+12px)] bg-white/60" />
        <div className="absolute top-1/2 -mt-px left-[-6px] h-px w-[calc(100%+12px)] bg-white/60" />
      </div>

      {/* Position label */}
      <div
        className="absolute px-1.5 py-0.5 bg-charcoal/80 rounded text-[0.5rem] font-mono text-white/60 pointer-events-none backdrop-blur-sm"
        style={{
          left: `${focalX * 100}%`,
          top: `${focalY * 100}%`,
          transform: 'translate(-50%, 12px)',
        }}
      >
        {Math.round(focalX * 100)}, {Math.round(focalY * 100)}
      </div>
    </div>
  );
}

// Helper: extract HeroSlide[] from section content
export function getHeroSlides(content: Record<string, unknown> | undefined): HeroSlide[] {
  if (!content) return [];
  const data = content as unknown as HeroCarouselContent;
  return data?.slides || [];
}
