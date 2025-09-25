import { useState } from 'react';
import type { Goal, Participant } from '../types';
import { SCORE_OPTIONS, PREDEFINED_COLORS } from '../types';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

interface GoalListProps {
  goals: Goal[];
  participants: Participant[];
  onAddGoal: (text: string) => void;
  onUpdateGoal: (goalId: string, text: string) => void;
  onRemoveGoal: (goalId: string) => void;
  onAddMarker: (goalId: string, participantId: string, score: number, color: string) => void;
  isFacilitator: boolean;
  currentParticipantId: string | null;
}

export function GoalList({
  goals,
  participants,
  onAddGoal,
  onUpdateGoal,
  onRemoveGoal,
  onAddMarker,
  isFacilitator,
  currentParticipantId,
}: GoalListProps) {
  const [newGoalText, setNewGoalText] = useState('');
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedScore, setSelectedScore] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>(PREDEFINED_COLORS[0]);

  const handleAddGoal = () => {
    if (newGoalText.trim()) {
      onAddGoal(newGoalText.trim());
      setNewGoalText('');
    }
  };

  const handleStartEdit = (goalId: string, currentText: string) => {
    setEditingGoalId(goalId);
    setEditingText(currentText);
  };

  const handleSaveEdit = () => {
    if (editingText.trim() && editingGoalId) {
      onUpdateGoal(editingGoalId, editingText.trim());
      setEditingGoalId(null);
      setEditingText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingGoalId(null);
    setEditingText('');
  };

  const handleAddMarker = () => {
    if (selectedGoalId && currentParticipantId) {
      onAddMarker(selectedGoalId, currentParticipantId, selectedScore, selectedColor);
      setSelectedGoalId(null);
    }
  };

  const getGoalMarkers = (goalId: string) => {
    return goals.find(g => g.id === goalId)?.markers || [];
  };

  const getParticipantName = (participantId: string) => {
    return participants.find(p => p.id === participantId)?.name || 'Okänd';
  };

  return (
    <div className="w-full max-w-sm xl:max-w-none xl:w-80 bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Mål & Aktiviteter
      </h2>

      {/* Add new goal */}
      {isFacilitator && (
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              placeholder="Lägg till nytt mål..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
            />
            <button
              onClick={handleAddGoal}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Goals list */}
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
            {/* Goal text */}
            <div className="flex items-start justify-between mb-3">
              {editingGoalId === goal.id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    autoFocus
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="p-1 text-green-600 hover:text-green-700"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1 text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <p className="flex-1 text-sm text-gray-800">{goal.text}</p>
                  {isFacilitator && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleStartEdit(goal.id, goal.text)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRemoveGoal(goal.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Markers for this goal */}
            <div className="space-y-2">
              {getGoalMarkers(goal.id).map((marker) => (
                <div
                  key={marker.id}
                  className="flex items-center gap-2 text-xs"
                >
                  <div
                    className="w-4 h-4 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: marker.color }}
                  ></div>
                  <span className="font-medium">{marker.score}</span>
                  <span className="text-gray-600">{getParticipantName(marker.participantId)}</span>
                </div>
              ))}

              {/* Add marker button */}
              {currentParticipantId && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedGoalId(goal.id)}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    Lägg till markör
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Marker selection modal */}
      {selectedGoalId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Lägg till markör</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poäng (1-8)
                </label>
                <select
                  value={selectedScore}
                  onChange={(e) => setSelectedScore(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SCORE_OPTIONS.map(score => (
                    <option key={score} value={score}>{score}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Färg
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
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddMarker}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Lägg till
              </button>
              <button
                onClick={() => setSelectedGoalId(null)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
