import { useState } from 'react';
import type { Participant } from '../types';
import { PREDEFINED_COLORS } from '../types';
import { UserPlus, Users, Copy, Check } from 'lucide-react';

interface ParticipantManagerProps {
  participants: Participant[];
  onAddParticipant: (name: string, color: string) => void;
  onUpdateParticipant: (participant: Participant) => void;
  isFacilitator: boolean;
  currentParticipantId: string | null;
  sessionId: string;
}

export function ParticipantManager({
  participants,
  onAddParticipant,
  isFacilitator,
  currentParticipantId,
  sessionId,
}: ParticipantManagerProps) {
  const [newParticipantName, setNewParticipantName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PREDEFINED_COLORS[0]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAddParticipant = () => {
    if (newParticipantName.trim()) {
      onAddParticipant(newParticipantName.trim(), selectedColor);
      setNewParticipantName('');
      setShowAddForm(false);
    }
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}?session=${sessionId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const getCurrentParticipant = () => {
    return participants.find(p => p.id === currentParticipantId);
  };

  return (
    <div className="w-full max-w-sm xl:max-w-none xl:w-80 bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Deltagare ({participants.length})
        </h2>
        {isFacilitator && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Lägg till
          </button>
        )}
      </div>

      {/* Add participant form */}
      {showAddForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Lägg till deltagare</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newParticipantName}
              onChange={(e) => setNewParticipantName(e.target.value)}
              placeholder="Namn eller alias..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddParticipant()}
            />
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Välj färg
              </label>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-full border-2 ${
                      selectedColor === color ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddParticipant}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Lägg till
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Participants list */}
      <div className="space-y-2">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50"
          >
            <div
              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: participant.color }}
            ></div>
            <span className="flex-1 text-sm text-gray-800">{participant.name}</span>
            {participant.id === currentParticipantId && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Du
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Current participant info */}
      {currentParticipantId && getCurrentParticipant() && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: getCurrentParticipant()?.color }}
            ></div>
            <span className="text-sm font-medium text-blue-800">
              Du deltar som: {getCurrentParticipant()?.name}
            </span>
          </div>
          <p className="text-xs text-blue-600">
            Klicka på "Lägg till markör" under varje mål för att placera din markör på måltavlan.
          </p>
        </div>
      )}

      {/* Share link */}
      {isFacilitator && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Kopierat!' : 'Kopiera länk'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Dela denna länk med ditt team för att låta dem delta
          </p>
        </div>
      )}
    </div>
  );
}
