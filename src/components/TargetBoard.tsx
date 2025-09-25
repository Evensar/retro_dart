import { useRef, useState, forwardRef } from 'react';
import type { Marker } from '../types';
import { MarkerComponent } from './MarkerComponent';

interface TargetBoardProps {
  markers: Marker[];
  onMarkerUpdate: (marker: Marker) => void;
  onMarkerRemove: (markerId: string) => void;
  onMarkerMove: (markerId: string, x: number, y: number) => void;
  isFacilitator: boolean;
}

export const TargetBoard = forwardRef<HTMLDivElement, TargetBoardProps>(({ markers, onMarkerUpdate, onMarkerRemove, onMarkerMove, isFacilitator }, ref) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [draggedMarker, setDraggedMarker] = useState<Marker | null>(null);

  const handleBoardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!boardRef.current || !draggedMarker) return;

    const rect = boardRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert to percentage coordinates
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    // Update marker position
    onMarkerMove(draggedMarker.id, xPercent, yPercent);
    setDraggedMarker(null);
  };

  const handleMarkerDrag = (marker: Marker) => {
    setDraggedMarker(marker);
  };

  return (
    <div ref={ref} className="flex-1 bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
        Måltavla
      </h2>
      
      <div
        ref={boardRef}
        className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] mx-auto rounded-full cursor-crosshair shadow-2xl"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Ccircle cx='200' cy='200' r='190' fill='%23000' stroke='%23000' stroke-width='4'/%3E%3Ccircle cx='200' cy='200' r='170' fill='%23fff'/%3E%3Ccircle cx='200' cy='200' r='150' fill='%23000'/%3E%3Ccircle cx='200' cy='200' r='130' fill='%23fff'/%3E%3Ccircle cx='200' cy='200' r='110' fill='%23000'/%3E%3Ccircle cx='200' cy='200' r='90' fill='%23fff'/%3E%3Ccircle cx='200' cy='200' r='70' fill='%23000'/%3E%3Ccircle cx='200' cy='200' r='50' fill='%23fff'/%3E%3Ccircle cx='200' cy='200' r='30' fill='%23dc2626'/%3E%3Ccircle cx='200' cy='200' r='10' fill='%23fbbf24'/%3E%3C/svg%3E")`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        onClick={handleBoardClick}
      >

        {/* Markers */}
        {markers.map((marker) => (
          <MarkerComponent
            key={marker.id}
            marker={marker}
            onUpdate={onMarkerUpdate}
            onRemove={onMarkerRemove}
            onDrag={handleMarkerDrag}
            isFacilitator={isFacilitator}
          />
        ))}
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>1. Lägg till mål i listan till vänster</p>
        <p>2. Klicka på "Lägg till markör" under varje mål</p>
        <p>3. Dra markörerna till önskad position på tavlan</p>
      </div>
    </div>
  );
});

TargetBoard.displayName = 'TargetBoard';
