import { useState, useRef, useCallback } from 'react';

export function FocalPointEditor({
  imageUrl,
  focalX,
  focalY,
  onChange,
}: {
  imageUrl: string;
  focalX: number;
  focalY: number;
  onChange: (x: number, y: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    onChange(x, y);
  }, [onChange]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX, e.clientY);
  }, [updatePosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    updatePosition(e.clientX, e.clientY);
  }, [dragging, updatePosition]);

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className="relative w-full aspect-video rounded overflow-hidden cursor-crosshair select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        role="slider"
        aria-label="Focal point position"
        aria-valuenow={Math.round(focalX * 100)}
        tabIndex={0}
        onKeyDown={(e) => {
          const step = 0.05;
          if (e.key === 'ArrowRight') onChange(Math.min(1, focalX + step), focalY);
          else if (e.key === 'ArrowLeft') onChange(Math.max(0, focalX - step), focalY);
          else if (e.key === 'ArrowDown') onChange(focalX, Math.min(1, focalY + step));
          else if (e.key === 'ArrowUp') onChange(focalX, Math.max(0, focalY - step));
        }}
      >
        <img src={imageUrl} alt="" className="w-full h-full object-cover pointer-events-none" />

        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/10" />
          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/10" />
          <div className="absolute top-1/3 left-0 right-0 h-px bg-white/10" />
          <div className="absolute top-2/3 left-0 right-0 h-px bg-white/10" />
        </div>

        {/* Focal point marker */}
        <div
          className={`absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ${
            dragging ? 'scale-125' : ''
          }`}
          style={{ left: `${focalX * 100}%`, top: `${focalY * 100}%` }}
        >
          <div className="w-full h-full rounded-full border-2 border-white shadow-lg shadow-black/50" />
          <div className="absolute inset-1 rounded-full bg-gold/80" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[0.6rem] text-white/25">
          Click or drag to set the focal point for cropping
        </p>
        <p className="text-[0.6rem] text-white/20">
          {Math.round(focalX * 100)}%, {Math.round(focalY * 100)}%
        </p>
      </div>
    </div>
  );
}
