import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { RetrospectiveState, Participant, Goal, Marker, Retrospective } from '../types';

type Action =
  | { type: 'SET_RETRO'; payload: Retrospective }
  | { type: 'ADD_PARTICIPANT'; payload: Participant }
  | { type: 'UPDATE_PARTICIPANT'; payload: Participant }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'REMOVE_GOAL'; payload: string }
  | { type: 'ADD_MARKER'; payload: Marker }
  | { type: 'UPDATE_MARKER'; payload: Marker }
  | { type: 'REMOVE_MARKER'; payload: string }
  | { type: 'SET_FACILITATOR'; payload: boolean }
  | { type: 'SET_PARTICIPANT_ID'; payload: string | null };

const initialState: RetrospectiveState = {
  currentRetro: null,
  participants: [],
  goals: [],
  markers: [],
  isFacilitator: false,
  participantId: null,
};

function retrospectiveReducer(state: RetrospectiveState, action: Action): RetrospectiveState {
  switch (action.type) {
    case 'SET_RETRO':
      return {
        ...state,
        currentRetro: action.payload,
        participants: action.payload.participants,
        goals: action.payload.goals,
        markers: action.payload.goals.flatMap(goal => goal.markers),
      };
    
    case 'ADD_PARTICIPANT':
      return {
        ...state,
        participants: [...state.participants, action.payload],
      };
    
    case 'UPDATE_PARTICIPANT':
      return {
        ...state,
        participants: state.participants.map(p => 
          p.id === action.payload.id ? action.payload : p
        ),
      };
    
    case 'ADD_GOAL':
      return {
        ...state,
        goals: [...state.goals, action.payload],
      };
    
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(g => 
          g.id === action.payload.id ? action.payload : g
        ),
      };
    
    case 'REMOVE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(g => g.id !== action.payload),
        markers: state.markers.filter(m => m.goalId !== action.payload),
      };
    
    case 'ADD_MARKER':
      return {
        ...state,
        markers: [...state.markers, action.payload],
        goals: state.goals.map(goal => 
          goal.id === action.payload.goalId 
            ? { ...goal, markers: [...goal.markers, action.payload] }
            : goal
        ),
      };
    
    case 'UPDATE_MARKER':
      return {
        ...state,
        markers: state.markers.map(m => 
          m.id === action.payload.id ? action.payload : m
        ),
        goals: state.goals.map(goal => ({
          ...goal,
          markers: goal.markers.map(m => 
            m.id === action.payload.id ? action.payload : m
          ),
        })),
      };
    
    case 'REMOVE_MARKER':
      return {
        ...state,
        markers: state.markers.filter(m => m.id !== action.payload),
        goals: state.goals.map(goal => ({
          ...goal,
          markers: goal.markers.filter(m => m.id !== action.payload),
        })),
      };
    
    case 'SET_FACILITATOR':
      return {
        ...state,
        isFacilitator: action.payload,
      };
    
    case 'SET_PARTICIPANT_ID':
      return {
        ...state,
        participantId: action.payload,
      };
    
    default:
      return state;
  }
}

const RetrospectiveContext = createContext<{
  state: RetrospectiveState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function RetrospectiveProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(retrospectiveReducer, initialState);

  return (
    <RetrospectiveContext.Provider value={{ state, dispatch }}>
      {children}
    </RetrospectiveContext.Provider>
  );
}

export function useRetrospective() {
  const context = useContext(RetrospectiveContext);
  if (!context) {
    throw new Error('useRetrospective must be used within a RetrospectiveProvider');
  }
  return context;
}
