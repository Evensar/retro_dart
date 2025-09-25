import { useEffect, useState, useRef } from 'react';
import { RetrospectiveProvider, useRetrospective } from './context/RetrospectiveContext';
import { TargetBoard } from './components/TargetBoard';
import { GoalList } from './components/GoalList';
import { ParticipantManager } from './components/ParticipantManager';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ExportModal } from './components/ExportModal';
import type { Marker, Goal, Participant } from './types';
import { v4 as uuidv4 } from 'uuid';
import { Download } from 'lucide-react';

function AppContent() {
  const { state, dispatch } = useRetrospective();
  const [showExportModal, setShowExportModal] = useState(false);
  const targetBoardRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('session') || uuidv4();
  });

  // Initialize session if needed
  useEffect(() => {
    if (!state.currentRetro) {
      const newRetro = {
        id: sessionId,
        title: 'Retrospektiv Måltavla',
        goals: [],
        participants: [],
        isActive: true,
        createdAt: new Date(),
      };
      dispatch({ type: 'SET_RETRO', payload: newRetro });
    }
  }, [sessionId, state.currentRetro, dispatch]);

  const handleAddParticipant = (name: string, color: string) => {
    const participant: Participant = {
      id: uuidv4(),
      name,
      color,
    };
    dispatch({ type: 'ADD_PARTICIPANT', payload: participant });
    dispatch({ type: 'SET_PARTICIPANT_ID', payload: participant.id });
  };

  const handleJoinAsFacilitator = () => {
    dispatch({ type: 'SET_FACILITATOR', payload: true });
  };

  const handleJoinAsParticipant = (name: string, color: string) => {
    handleAddParticipant(name, color);
  };

  const handleAddGoal = (text: string) => {
    const goal: Goal = {
      id: uuidv4(),
      text,
      markers: [],
    };
    dispatch({ type: 'ADD_GOAL', payload: goal });
  };

  const handleUpdateGoal = (goalId: string, text: string) => {
    const goal = state.goals.find(g => g.id === goalId);
    if (goal) {
      dispatch({ type: 'UPDATE_GOAL', payload: { ...goal, text } });
    }
  };

  const handleRemoveGoal = (goalId: string) => {
    dispatch({ type: 'REMOVE_GOAL', payload: goalId });
  };

  const handleAddMarker = (goalId: string, participantId: string, score: number, color: string) => {
    const marker: Marker = {
      id: uuidv4(),
      participantId,
      goalId,
      score,
      position: { x: 50, y: 50 }, // Center position
      color,
    };
    dispatch({ type: 'ADD_MARKER', payload: marker });
  };

  const handleUpdateMarker = (marker: Marker) => {
    dispatch({ type: 'UPDATE_MARKER', payload: marker });
  };

  const handleRemoveMarker = (markerId: string) => {
    dispatch({ type: 'REMOVE_MARKER', payload: markerId });
  };

  const handleMarkerMove = (markerId: string, x: number, y: number) => {
    const marker = state.markers.find(m => m.id === markerId);
    if (marker) {
      handleUpdateMarker({
        ...marker,
        position: { x, y },
      });
    }
  };

  // Show welcome screen if no participant or facilitator is set
  if (!state.participantId && !state.isFacilitator) {
    return (
      <WelcomeScreen
        onJoinAsParticipant={handleJoinAsParticipant}
        onJoinAsFacilitator={handleJoinAsFacilitator}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                🎯 Retrospektiv Måltavla
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="text-xs sm:text-sm text-gray-500">
                  Session: {sessionId.slice(0, 8)}...
                </div>
                {state.isFacilitator && (
                  <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Facilitator
                  </div>
                )}
                <button
                  onClick={() => setShowExportModal(true)}
                  className="px-2 sm:px-3 py-1 bg-blue-600 text-white text-xs sm:text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Exportera</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left column - Goals and Participants */}
            <div className="space-y-4 sm:space-y-6 order-2 xl:order-1">
              <GoalList
                goals={state.goals}
                participants={state.participants}
                onAddGoal={handleAddGoal}
                onUpdateGoal={handleUpdateGoal}
                onRemoveGoal={handleRemoveGoal}
                onAddMarker={handleAddMarker}
                isFacilitator={state.isFacilitator}
                currentParticipantId={state.participantId}
              />
              
              <ParticipantManager
                participants={state.participants}
                onAddParticipant={handleAddParticipant}
                onUpdateParticipant={(participant) => dispatch({ type: 'UPDATE_PARTICIPANT', payload: participant })}
                isFacilitator={state.isFacilitator}
                currentParticipantId={state.participantId}
                sessionId={sessionId}
              />
            </div>

            {/* Right column - Target Board */}
            <div className="xl:col-span-2 order-1 xl:order-2">
              <TargetBoard
                ref={targetBoardRef}
                markers={state.markers}
                onMarkerUpdate={handleUpdateMarker}
                onMarkerRemove={handleRemoveMarker}
                onMarkerMove={handleMarkerMove}
                isFacilitator={state.isFacilitator}
              />
            </div>
          </div>
        </main>

        {/* Export modal */}
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          goals={state.goals}
          markers={state.markers}
          participants={state.participants}
        />
      </div>
  );
}

function App() {
  return (
    <RetrospectiveProvider>
      <AppContent />
    </RetrospectiveProvider>
  );
}

export default App;
