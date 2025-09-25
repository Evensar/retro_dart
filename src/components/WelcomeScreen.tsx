import { useState } from 'react';
import { PREDEFINED_COLORS } from '../types';
import { User, Users } from 'lucide-react';

interface WelcomeScreenProps {
  onJoinAsParticipant: (name: string, color: string) => void;
  onJoinAsFacilitator: () => void;
}

export function WelcomeScreen({ onJoinAsParticipant, onJoinAsFacilitator }: WelcomeScreenProps) {
  const [participantName, setParticipantName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PREDEFINED_COLORS[0]);

  const handleJoinAsParticipant = () => {
    if (participantName.trim()) {
      onJoinAsParticipant(participantName.trim(), selectedColor);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Retrospektiv Måltavla
          </h1>
          <p className="text-gray-600">
            Ett interaktivt sätt att reflektera kring mål och aktiviteter
          </p>
        </div>

        <div className="space-y-6">
          {/* Join as participant */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Delta som deltagare
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ditt namn eller alias
                </label>
                <input
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="Ange ditt namn..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleJoinAsParticipant()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Välj din färg
                </label>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleJoinAsParticipant}
                disabled={!participantName.trim()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Delta
              </button>
            </div>
          </div>

          {/* Join as facilitator */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Starta som facilitator
              </h2>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Som facilitator kan du skapa mål, hantera deltagare och kontrollera sessionen.
            </p>

            <button
              onClick={onJoinAsFacilitator}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Starta session
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Dela länken med ditt team för att låta dem delta</p>
        </div>
      </div>
    </div>
  );
}
