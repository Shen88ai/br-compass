import type { FateWheelState, FateWheelStateData } from './types';

const STORAGE_KEY = 'persona-journey';

const DEBUG = true;

function log(event: string, data?: unknown): void {
  if (DEBUG && typeof console !== 'undefined') {
    console.log(`[FateWheel] ${event}`, data || '');
  }
}

const diagnosisMap: Record<string, string> = {
  'individual-immigration-beginner': 'A', 'individual-immigration-preparing': 'A',
  'individual-immigration-landed': 'D', 'individual-immigration-operating': 'E',
  'individual-profit-beginner': 'A', 'individual-profit-preparing': 'A',
  'individual-profit-landed': 'D', 'individual-profit-operating': 'E',
  'individual-expansion-beginner': 'A', 'individual-expansion-preparing': 'C',
  'individual-expansion-landed': 'D', 'individual-expansion-operating': 'E',
  'individual-testing-beginner': 'F', 'individual-testing-preparing': 'F',
  'individual-testing-landed': 'B', 'individual-testing-operating': 'E',
  'corporate-immigration-beginner': 'C', 'corporate-immigration-preparing': 'C',
  'corporate-immigration-landed': 'D', 'corporate-immigration-operating': 'E',
  'corporate-profit-beginner': 'C', 'corporate-profit-preparing': 'C',
  'corporate-profit-landed': 'D', 'corporate-profit-operating': 'E',
  'corporate-expansion-beginner': 'C', 'corporate-expansion-preparing': 'C',
  'corporate-expansion-landed': 'D', 'corporate-expansion-operating': 'E',
  'corporate-testing-beginner': 'F', 'corporate-testing-preparing': 'B',
  'corporate-testing-landed': 'D', 'corporate-testing-operating': 'E',
  'crossborder-immigration-beginner': 'A', 'crossborder-immigration-preparing': 'A',
  'crossborder-immigration-landed': 'D', 'crossborder-immigration-operating': 'E',
  'crossborder-profit-beginner': 'C', 'crossborder-profit-preparing': 'C',
  'crossborder-profit-landed': 'D', 'crossborder-profit-operating': 'E',
  'crossborder-expansion-beginner': 'C', 'crossborder-expansion-preparing': 'C',
  'crossborder-expansion-landed': 'D', 'crossborder-expansion-operating': 'E',
  'crossborder-testing-beginner': 'F', 'crossborder-testing-preparing': 'F',
  'crossborder-testing-landed': 'B', 'crossborder-testing-operating': 'E',
  'remoteworker-immigration-beginner': 'G', 'remoteworker-immigration-preparing': 'G',
  'remoteworker-immigration-landed': 'D', 'remoteworker-immigration-operating': 'E',
  'remoteworker-profit-beginner': 'G', 'remoteworker-profit-preparing': 'G',
  'remoteworker-profit-landed': 'D', 'remoteworker-profit-operating': 'E',
  'remoteworker-expansion-beginner': 'G', 'remoteworker-expansion-preparing': 'G',
  'remoteworker-expansion-landed': 'D', 'remoteworker-expansion-operating': 'E',
  'remoteworker-testing-beginner': 'G', 'remoteworker-testing-preparing': 'G',
  'remoteworker-testing-landed': 'D', 'remoteworker-testing-operating': 'E',
};

class FateWheelStateManager {
  private data: FateWheelStateData = {
    state: 'idle', selectedDirection: null,
    answers: { identity: null, goal: null, progress: null },
    currentQuestion: 1, determinedPath: null, hoveredPlanet: null,
  };

  getState(): FateWheelState { return this.data.state; }
  getData(): FateWheelStateData { return { ...this.data }; }

  selectDirection(direction: string): void {
    log('selectDirection', { direction });
    this.data.selectedDirection = direction;
    this.data.state = 'compass-selected';
    this.emit('state-change', { state: this.data.state });
    this.emit('direction-selected', { direction });
  }

  answerQuestion(questionNum: number, answer: string): void {
    log('answerQuestion', { questionNum, answer });
    const key = questionNum === 1 ? 'identity' : questionNum === 2 ? 'goal' : 'progress';
    this.data.answers[key] = answer;
    this.data.currentQuestion = Math.min(questionNum + 1, 3);

    if (questionNum === 1 && answer === 'remoteworker') {
      log('remoteworker shortcut - completing immediately');
      this.completeDiagnosis();
      return;
    }

    if (questionNum < 3) {
      this.data.state = 'answering';
      this.emit('question-answered', { question: questionNum, answer });
    } else {
      log('all questions answered - completing diagnosis');
      this.completeDiagnosis();
    }
  }

  private completeDiagnosis(): void {
    log('completeDiagnosis called');
    const { identity, goal, progress } = this.data.answers;
    const key = `${identity}-${goal}-${progress}`;
    log('diagnosis key', { key, identity, goal, progress });
    this.data.determinedPath = diagnosisMap[key] || 'A';
    if (this.data.answers.identity === 'remoteworker') this.data.determinedPath = 'G';
    this.data.state = 'diagnosis-complete';
    log('determined path', { path: this.data.determinedPath });
    this.saveToStorage();
    this.emit('diagnosis-complete', { path: this.data.determinedPath });
    this.emit('state-change', { state: this.data.state });
    log('diagnosis-complete event emitted');
  }

  setHoveredPlanet(planet: number | null): void {
    log('setHoveredPlanet', { planet });
    this.data.hoveredPlanet = planet;
    this.data.state = planet !== null ? 'planet-hover' : 'diagnosis-complete';
    this.emit('planet-hover', { planet: this.data.hoveredPlanet });
  }

  navigateToPlanet(planet: number): void {
    log('navigateToPlanet', { planet });
    this.data.state = 'navigating';
    this.emit('planet-click', { planet });
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        path: this.data.determinedPath, diagnosis: this.data.answers,
        checkpoints: {}, startedAt: new Date().toISOString(),
        lastVisited: new Date().toISOString(), source: 'fate-wheel',
      }));
    } catch { /* ignore */ }
  }

  static restoreFromStorage(): Partial<FateWheelStateData> | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      const journey = JSON.parse(data);
      if (journey.source === 'fate-wheel' && journey.path) {
        return { state: 'diagnosis-complete' as const, determinedPath: journey.path, answers: journey.diagnosis };
      }
    } catch { /* ignore */ }
    return null;
  }

  private emit(event: string, detail: Record<string, unknown>): void {
    if (typeof window !== 'undefined') {
      log(`emit: fate-wheel:${event}`, detail);
      window.dispatchEvent(new CustomEvent(`fate-wheel:${event}`, { detail }));
    }
  }
}

export const stateManager = new FateWheelStateManager();