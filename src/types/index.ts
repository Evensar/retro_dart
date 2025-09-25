export interface Participant {
  id: string;
  name: string;
  color: string;
}

export interface Goal {
  id: string;
  text: string;
  markers: Marker[];
}

export interface Marker {
  id: string;
  participantId: string;
  goalId: string;
  score: number;
  position: { x: number; y: number };
  color: string;
}

export interface Retrospective {
  id: string;
  title: string;
  goals: Goal[];
  participants: Participant[];
  isActive: boolean;
  createdAt: Date;
}

export interface RetrospectiveState {
  currentRetro: Retrospective | null;
  participants: Participant[];
  goals: Goal[];
  markers: Marker[];
  isFacilitator: boolean;
  participantId: string | null;
}

export const PREDEFINED_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#6366f1', // indigo
  '#84cc16', // lime
];

export const SCORE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];
