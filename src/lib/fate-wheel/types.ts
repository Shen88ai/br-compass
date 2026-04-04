export type DeviceTier = 'high' | 'medium' | 'low';

export type FateWheelState =
  | 'idle'
  | 'compass-selected'
  | 'answering'
  | 'diagnosis-complete'
  | 'planet-hover'
  | 'navigating';

export interface FateWheelStateData {
  state: FateWheelState;
  selectedDirection: string | null;
  answers: {
    identity: string | null;
    goal: string | null;
    progress: string | null;
  };
  currentQuestion: number;
  determinedPath: string | null;
  hoveredPlanet: number | null;
}

export interface PhaseConfig {
  id: number;
  name: string;
  icon: string;
  color: string;
  colorRgb: string;
  radius: number;
  orbitPeriod: number;
  slug: string;
  articleCount: number;
  timeRange: string;
  desc: string;
}

export interface DirectionConfig {
  id: string;
  name: string;
  phase: string;
  desc: string;
  color: string;
  angle: number;
}

export interface QuestionConfig {
  id: number;
  title: string;
  options: { value: string; icon: string; title: string; desc: string }[];
}
