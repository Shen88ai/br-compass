import { describe, it, expect, vi, beforeEach } from 'vitest';

const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, value: string) => { store[key] = value; },
  clear: () => { for (const k in store) delete store[k]; },
};

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true, configurable: true });
const dispatchSpy = vi.fn();
Object.defineProperty(globalThis, 'window', {
  value: { dispatchEvent: dispatchSpy, matchMedia: () => ({ matches: false }) }, writable: true, configurable: true,
});

describe('FateWheelStateManager', () => {
  beforeEach(async () => { vi.resetModules(); localStorageMock.clear(); dispatchSpy.mockClear(); });

  it('should start in idle state', async () => {
    const { stateManager } = await import('../../src/lib/fate-wheel/state-manager');
    expect(stateManager.getState()).toBe('idle');
  });

  it('should transition to compass-selected when direction is selected', async () => {
    const { stateManager } = await import('../../src/lib/fate-wheel/state-manager');
    stateManager.selectDirection('north');
    expect(stateManager.getState()).toBe('compass-selected');
    expect(stateManager.getData().selectedDirection).toBe('north');
  });

  it('should answer questions and complete diagnosis', async () => {
    const { stateManager } = await import('../../src/lib/fate-wheel/state-manager');
    stateManager.answerQuestion(1, 'individual');
    expect(stateManager.getData().currentQuestion).toBe(2);
    stateManager.answerQuestion(2, 'immigration');
    expect(stateManager.getData().currentQuestion).toBe(3);
    stateManager.answerQuestion(3, 'beginner');
    expect(stateManager.getState()).toBe('diagnosis-complete');
    expect(stateManager.getData().determinedPath).toBe('A');
  });

  it('should save to localStorage on diagnosis complete', async () => {
    const { stateManager } = await import('../../src/lib/fate-wheel/state-manager');
    stateManager.answerQuestion(1, 'individual');
    stateManager.answerQuestion(2, 'immigration');
    stateManager.answerQuestion(3, 'beginner');
    const stored = localStorageMock.getItem('persona-journey');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.source).toBe('fate-wheel');
    expect(parsed.path).toBe('A');
  });

  it('should map remoteworker to path G', async () => {
    const { stateManager } = await import('../../src/lib/fate-wheel/state-manager');
    stateManager.answerQuestion(1, 'remoteworker');
    expect(stateManager.getState()).toBe('diagnosis-complete');
    expect(stateManager.getData().determinedPath).toBe('G');
  });

  it('should dispatch custom events on state changes', async () => {
    const { stateManager } = await import('../../src/lib/fate-wheel/state-manager');
    stateManager.selectDirection('east');
    const events = dispatchSpy.mock.calls.map((c: any) => c[0].type);
    expect(events).toContain('fate-wheel:state-change');
    expect(events).toContain('fate-wheel:direction-selected');
  });

  it('should set hovered planet', async () => {
    const { stateManager } = await import('../../src/lib/fate-wheel/state-manager');
    stateManager.setHoveredPlanet(2);
    expect(stateManager.getState()).toBe('planet-hover');
    expect(stateManager.getData().hoveredPlanet).toBe(2);
  });

  it('should restore from localStorage', async () => {
    localStorageMock.setItem('persona-journey', JSON.stringify({
      path: 'B',
      diagnosis: { identity: 'crossborder', goal: 'testing', progress: 'beginner' },
      source: 'fate-wheel',
    }));
    const { stateManager } = await import('../../src/lib/fate-wheel/state-manager');
    const restored = (stateManager.constructor as any).restoreFromStorage();
    expect(restored?.state).toBe('diagnosis-complete');
    expect(restored?.determinedPath).toBe('B');
  });
});
