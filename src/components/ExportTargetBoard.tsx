import type { Marker, Participant } from '../types';

interface ExportTargetBoardProps {
  markers: Marker[];
  participants: Participant[];
}

export function ExportTargetBoard({ markers, participants }: ExportTargetBoardProps) {
  const getParticipantName = (participantId: string) => {
    return participants.find(p => p.id === participantId)?.name || 'Okänd';
  };

  return (
    <div className="bg-white p-8 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Retrospektiv Måltavla</h2>
      
      {/* Dart board with better export styling */}
      <div className="relative w-96 h-96 mx-auto mb-6">
        {/* Dart board circles */}
        <div className="absolute inset-0 rounded-full border-8 border-black bg-white"></div>
        <div className="absolute inset-4 rounded-full border-6 border-black bg-black"></div>
        <div className="absolute inset-8 rounded-full border-4 border-black bg-white"></div>
        <div className="absolute inset-12 rounded-full border-4 border-black bg-black"></div>
        <div className="absolute inset-16 rounded-full border-4 border-black bg-white"></div>
        <div className="absolute inset-20 rounded-full border-4 border-black bg-black"></div>
        <div className="absolute inset-24 rounded-full border-4 border-black bg-white"></div>
        <div className="absolute inset-28 rounded-full border-4 border-black bg-black"></div>
        <div className="absolute inset-32 rounded-full border-4 border-black bg-white"></div>
        <div className="absolute inset-36 rounded-full border-4 border-black bg-red-600"></div>
        <div className="absolute inset-40 rounded-full border-4 border-black bg-yellow-400"></div>
        
        {/* Score labels */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-lg font-bold text-black">8</div>
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-lg font-bold text-black">7</div>
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-lg font-bold text-black">6</div>
        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 text-lg font-bold text-black">5</div>
        <div className="absolute top-18 left-1/2 transform -translate-x-1/2 text-lg font-bold text-black">4</div>
        <div className="absolute top-22 left-1/2 transform -translate-x-1/2 text-lg font-bold text-black">3</div>
        <div className="absolute top-26 left-1/2 transform -translate-x-1/2 text-lg font-bold text-black">2</div>
        <div className="absolute top-30 left-1/2 transform -translate-x-1/2 text-lg font-bold text-black">1</div>
        
        {/* Markers */}
        {markers.map((marker) => (
          <div
            key={marker.id}
            style={{
              position: 'absolute',
              left: `${marker.position.x}%`,
              top: `${marker.position.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="relative"
          >
            <div
              className="w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: marker.color }}
            >
              {marker.score}
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 whitespace-nowrap">
              {getParticipantName(marker.participantId)}
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="text-sm text-gray-600 text-center">
        <p>Klicka på tavlan för att placera markörer</p>
        <p>Poäng: 1 (yttersta ringen) till 8 (bullseye)</p>
      </div>
    </div>
  );
}
