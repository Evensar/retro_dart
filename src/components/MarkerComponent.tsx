import { useState } from 'react';
import type { Marker } from '../types';
import { X } from 'lucide-react';

interface MarkerComponentProps {
  marker: Marker;
  onUpdate: (marker: Marker) => void;
  onRemove: (markerId: string) => void;
  onDrag: (marker: Marker) => void;
  isFacilitator: boolean;
}

export function MarkerComponent({ 
  marker, 
  onRemove, 
  onDrag, 
  isFacilitator 
}: MarkerComponentProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onDrag(marker);
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: `${marker.position.x}%`,
        top: `${marker.position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
      }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
    >
      {/* Marker circle */}
      <div
        className="w-10 h-10 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white font-bold text-sm cursor-move hover:scale-110 transition-transform"
        style={{ backgroundColor: marker.color }}
      >
        {marker.score}
      </div>
      
      {/* Remove button */}
      {isFacilitator && isHovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(marker.id);
          }}
          className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <X className="w-2 h-2 text-white" />
        </button>
      )}
    </div>
  );
}
