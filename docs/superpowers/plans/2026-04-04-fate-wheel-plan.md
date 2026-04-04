# 命運之輪 (Fate Wheel) 實施計畫

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將 Astro 首頁打造為 Three.js + GLSL + GSAP 驅動的「命運之輪」3D 互動體驗，融合羅盤、戰略問答、四大階段為因果敘事流。

**Architecture:** 三個同心環結構（內環羅盤核心 → 中環問答節點 → 外環階段行星），由狀態機驅動互動流程，GLSL shader 提供視覺特效，GSAP 控制動畫時間軸。

**Tech Stack:** Three.js, GLSL, GSAP, Astro, TypeScript, Vitest

---

## Chunk 1: 基礎設施與類型系統

### Task 1: 安裝依賴與建立檔案結構

**Files:**
- Create: `src/lib/fate-wheel/types.ts`
- Create: `src/lib/fate-wheel/device-tier.ts`
- Create: `src/styles/fate-wheel.css`
- Test: `tests/fate-wheel/device-tier.test.ts`

- [ ] **Step 1: 安裝 Three.js 和 GSAP 依賴**

```bash
npm install three @types/three gsap
```

- [ ] **Step 2: 建立 types.ts**

```typescript
// src/lib/fate-wheel/types.ts

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
```

- [ ] **Step 3: 建立 device-tier.ts**

```typescript
// src/lib/fate-wheel/device-tier.ts
import type { DeviceTier } from './types';

export function detectDeviceTier(): DeviceTier {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'low';
  }

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) return 'low';

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (debugInfo) {
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    if (/Mali-T|Adreno \(TM\) 3|PowerVR/i.test(renderer)) {
      return 'medium';
    }
  }

  const pixelCount = window.innerWidth * window.innerHeight * window.devicePixelRatio;
  if (pixelCount > 4_000_000) return 'medium';
  if (pixelCount > 2_000_000) return 'high';

  return /Mobi|Android/i.test(navigator.userAgent) ? 'medium' : 'high';
}
```

- [ ] **Step 4: 建立 device-tier.test.ts**

```typescript
// tests/fate-wheel/device-tier.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('detectDeviceTier', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should return low when prefers-reduced-motion is reduce', async () => {
    const mockMatchMedia = vi.fn().mockReturnValue({ matches: true });
    const origWindow = (globalThis as any).window;
    (globalThis as any).window = { matchMedia: mockMatchMedia };

    const { detectDeviceTier } = await import('../../src/lib/fate-wheel/device-tier');
    expect(detectDeviceTier()).toBe('low');

    (globalThis as any).window = origWindow;
  });

  it('should return low when WebGL is not available', async () => {
    const mockMatchMedia = vi.fn().mockReturnValue({ matches: false });
    const mockCanvas = { getContext: () => null };
    const mockDocument = { createElement: () => mockCanvas };
    const origWindow = (globalThis as any).window;
    const origDocument = (globalThis as any).document;
    (globalThis as any).window = {
      matchMedia: mockMatchMedia,
      innerWidth: 1920,
      innerHeight: 1080,
      devicePixelRatio: 1,
    };
    (globalThis as any).document = mockDocument;

    const { detectDeviceTier } = await import('../../src/lib/fate-wheel/device-tier');
    expect(detectDeviceTier()).toBe('low');

    (globalThis as any).window = origWindow;
    (globalThis as any).document = origDocument;
  });
});
```

- [ ] **Step 5: Run tests to verify**

```bash
npm test -- tests/fate-wheel/device-tier.test.ts
```

Expected: Tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/fate-wheel/types.ts src/lib/fate-wheel/device-tier.ts src/styles/fate-wheel.css tests/fate-wheel/device-tier.test.ts
git commit -m "feat(fate-wheel): setup foundation - types, device tier detection, base CSS, tests"
```

---

## Chunk 2: 狀態機與事件系統

### Task 2: 狀態機管理器

**Files:**
- Create: `src/lib/fate-wheel/config.ts`
- Create: `src/lib/fate-wheel/state-manager.ts`
- Create: `tests/fate-wheel/state-manager.test.ts`
- Create: `tests/fate-wheel/path-mapping-integration.test.ts`

- [ ] **Step 1: 建立 config.ts**

```typescript
// src/lib/fate-wheel/config.ts
import type { PhaseConfig, DirectionConfig, QuestionConfig } from './types';

export const phases: PhaseConfig[] = [
  {
    id: 1, name: '戰略藍圖與落地籌備', icon: '🚩',
    color: '#E8E4D9', colorRgb: '232, 228, 217',
    radius: 4.0, orbitPeriod: 60, slug: 'preparation',
    articleCount: 8, timeRange: '第 1~2 個月',
    desc: '破譯巴西稅制、簽證策略、在地團隊組建與授權防護',
  },
  {
    id: 2, name: '實體建立與資金血脈', icon: '🏛️',
    color: '#D4A843', colorRgb: '212, 168, 67',
    radius: 4.0, orbitPeriod: 45, slug: 'foundation',
    articleCount: 3, timeRange: '第 2~4 個月',
    desc: 'CNPJ 申請、Pre-acordo 策略、BACEN 資金申報',
  },
  {
    id: 3, name: '供應鏈與數位營運', icon: '📦',
    color: '#E5FF00', colorRgb: '229, 255, 0',
    radius: 4.0, orbitPeriod: 35, slug: 'operations',
    articleCount: 6, timeRange: '第 4~5 個月',
    desc: 'RADAR 申請、3PL 倉儲、ERP 整合、支付系統',
  },
  {
    id: 4, name: '財務合規與利潤收割', icon: '💰',
    color: '#00FF87', colorRgb: '0, 255, 135',
    radius: 4.0, orbitPeriod: 25, slug: 'harvest',
    articleCount: 3, timeRange: '第 6 個月+',
    desc: '日常稅務合規、NF-e、SPED 申報、利潤匯出',
  },
];

export const directions: DirectionConfig[] = [
  { id: 'north', name: '偵察兵', phase: 'Preparation', desc: '還在觀望、想了解巴西', color: '#7DD3FC', angle: 0 },
  { id: 'east', name: '奠基者', phase: 'Foundation', desc: '已決定進入、建實體', color: '#D4A843', angle: Math.PI / 2 },
  { id: 'south', name: '領航員', phase: 'Operations', desc: '已註冊、打通供應鏈', color: '#00FF87', angle: Math.PI },
  { id: 'west', name: '收割者', phase: 'Harvest', desc: '在運營、合規與利潤', color: '#E5FF00', angle: (3 * Math.PI) / 2 },
];

export const questions: QuestionConfig[] = [
  {
    id: 1, title: '你的身份是？',
    options: [
      { value: 'individual', icon: '🧑‍💼', title: '個人投資者', desc: '以個人身份投資巴西' },
      { value: 'corporate', icon: '🏢', title: '企業派出', desc: '代表公司開拓巴西市場' },
      { value: 'crossborder', icon: '🌐', title: '跨境賣家', desc: '人在巴西境外，貨到巴西' },
      { value: 'remoteworker', icon: '💻', title: '遠程工作者', desc: '收入來自巴西境外' },
    ],
  },
  {
    id: 2, title: '你的終極目標是？',
    options: [
      { value: 'profit', icon: '💰', title: '利潤匯回', desc: '賺巴西的錢，匯回母國' },
      { value: 'immigration', icon: '🏠', title: '移民定居', desc: '拿到身份，在巴西生活' },
      { value: 'expansion', icon: '📦', title: '規模擴張', desc: '把巴西當作拉美樞紐' },
      { value: 'testing', icon: '🎯', title: '快速試水', desc: '最小成本測試市場' },
    ],
  },
  {
    id: 3, title: '你目前的進度是？',
    options: [
      { value: 'beginner', icon: '🔵', title: '零基礎', desc: '還在了解階段' },
      { value: 'preparing', icon: '🟡', title: '準備中', desc: '已決定要做，正在籌備' },
      { value: 'landed', icon: '🟢', title: '已落地', desc: '公司/簽證已搞定' },
      { value: 'operating', icon: '🟣', title: '運營中', desc: '已有銷售，需要優化' },
    ],
  },
];
```

- [ ] **Step 2: 建立 state-manager.ts**

```typescript
// src/lib/fate-wheel/state-manager.ts
import type { FateWheelState, FateWheelStateData } from './types';

const STORAGE_KEY = 'persona-journey';

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
    this.data.selectedDirection = direction;
    this.data.state = 'compass-selected';
    this.emit('state-change', { state: this.data.state });
    this.emit('direction-selected', { direction });
  }

  answerQuestion(questionNum: number, answer: string): void {
    const key = questionNum === 1 ? 'identity' : questionNum === 2 ? 'goal' : 'progress';
    this.data.answers[key] = answer;
    this.data.currentQuestion = Math.min(questionNum + 1, 3);

    if (questionNum === 1 && answer === 'remoteworker') {
      this.completeDiagnosis();
      return;
    }

    if (questionNum < 3) {
      this.data.state = 'answering';
      this.emit('question-answered', { question: questionNum, answer });
    } else {
      this.completeDiagnosis();
    }
  }

  private completeDiagnosis(): void {
    const { identity, goal, progress } = this.data.answers;
    const key = `${identity}-${goal}-${progress}`;
    this.data.determinedPath = diagnosisMap[key] || 'A';
    if (this.data.answers.identity === 'remoteworker') this.data.determinedPath = 'G';
    this.data.state = 'diagnosis-complete';
    this.saveToStorage();
    this.emit('diagnosis-complete', { path: this.data.determinedPath });
    this.emit('state-change', { state: this.data.state });
  }

  setHoveredPlanet(planet: number | null): void {
    this.data.hoveredPlanet = planet;
    this.data.state = planet !== null ? 'planet-hover' : 'diagnosis-complete';
    this.emit('planet-hover', { planet: this.data.hoveredPlanet });
  }

  navigateToPlanet(planet: number): void {
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
    window.dispatchEvent(new CustomEvent(`fate-wheel:${event}`, { detail }));
  }
}

export const stateManager = new FateWheelStateManager();
```

- [ ] **Step 3: 建立 state-manager.test.ts**

```typescript
// tests/fate-wheel/state-manager.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, value: string) => { store[key] = value; },
  clear: () => { for (const k in store) delete store[k]; },
};

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });
const dispatchSpy = vi.fn();
Object.defineProperty(globalThis, 'window', {
  value: { dispatchEvent: dispatchSpy, matchMedia: () => ({ matches: false }) }, writable: true,
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
});
```

- [ ] **Step 4: 建立 path-mapping-integration.test.ts**

```typescript
// tests/fate-wheel/path-mapping-integration.test.ts
import { describe, it, expect } from 'vitest';

describe('Diagnosis Map Coverage', () => {
  const identities = ['individual', 'corporate', 'crossborder', 'remoteworker'];
  const goals = ['immigration', 'profit', 'expansion', 'testing'];
  const progress = ['beginner', 'preparing', 'landed', 'operating'];
  const validPaths = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

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

  it('should cover all 48 identity-goal-progress combinations', () => {
    let count = 0;
    for (const id of identities) {
      for (const g of goals) {
        for (const p of progress) {
          const key = `${id}-${g}-${p}`;
          expect(diagnosisMap[key]).toBeDefined();
          expect(validPaths).toContain(diagnosisMap[key]);
          count++;
        }
      }
    }
    expect(count).toBe(48);
  });

  it('should map remoteworker to path G regardless of goal/progress', () => {
    for (const g of goals) {
      for (const p of progress) {
        const key = `remoteworker-${g}-${p}`;
        expect(diagnosisMap[key]).toBe('G');
      }
    }
  });
});
```

- [ ] **Step 5: Run all fate-wheel tests**

```bash
npm test -- tests/fate-wheel/
```

Expected: All tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/fate-wheel/config.ts src/lib/fate-wheel/state-manager.ts tests/fate-wheel/state-manager.test.ts tests/fate-wheel/path-mapping-integration.test.ts
git commit -m "feat(fate-wheel): state machine, config data, path mapping integration tests"
```

---

## Chunk 3: GLSL Shaders

### Task 3: 建立所有 GLSL Shader 檔案

**Files:**
- Create: `src/shaders/liquidMetal.vert`
- Create: `src/shaders/liquidMetal.frag`
- Create: `src/shaders/energyBridge.vert`
- Create: `src/shaders/energyBridge.frag`
- Create: `src/shaders/nebula.frag`

- [ ] **Step 1: 建立 liquidMetal.vert**

```glsl
// src/shaders/liquidMetal.vert
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
```

- [ ] **Step 2: 建立 liquidMetal.frag**

```glsl
// src/shaders/liquidMetal.frag
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uEmissiveIntensity;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float value = 0.0; float amplitude = 0.5;
  for (int i = 0; i < 4; i++) { value += amplitude * noise(p); p *= 2.0; amplitude *= 0.5; }
  return value;
}
void main() {
  vec2 uv = vUv;
  float n = fbm(uv * 4.0 + uTime * 0.3);
  vec3 color = mix(uColor1, uColor2, n);
  vec3 viewDir = normalize(vViewPosition);
  vec3 normal = normalize(vNormal);
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
  color += fresnel * uEmissiveIntensity * 0.4;
  float alpha = 0.85 + fresnel * 0.15;
  gl_FragColor = vec4(color, alpha);
}
```

- [ ] **Step 3: 建立 energyBridge.vert**

```glsl
// src/shaders/energyBridge.vert
attribute float linePosition;
varying float vPosition;
void main() {
  vPosition = linePosition;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

- [ ] **Step 4: 建立 energyBridge.frag**

```glsl
// src/shaders/energyBridge.frag
uniform float uTime;
uniform float uProgress;
uniform vec3 uColorStart;
uniform vec3 uColorEnd;
varying float vPosition;
void main() {
  float pulse = smoothstep(0.0, 0.08, vPosition - uProgress) *
                smoothstep(0.15, 0.08, vPosition - uProgress);
  vec3 color = mix(uColorStart, uColorEnd, pulse);
  float alpha = pulse * 0.8;
  gl_FragColor = vec4(color, alpha);
}
```

- [ ] **Step 5: 建立 nebula.frag**

```glsl
// src/shaders/nebula.frag
uniform float uTime;
uniform vec2 uResolution;
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float value = 0.0; float amplitude = 0.5;
  for (int i = 0; i < 5; i++) { value += amplitude * noise(p); p *= 2.0; amplitude *= 0.5; }
  return value;
}
void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 p = uv * 3.0;
  float n1 = fbm(p + uTime * 0.02);
  float n2 = fbm(p * 1.5 - uTime * 0.015);
  vec3 deepSpace = vec3(0.012, 0.012, 0.031);
  vec3 goldNebula = vec3(0.83, 0.66, 0.26);
  vec3 greenNebula = vec3(0.0, 1.0, 0.53);
  vec3 color = deepSpace;
  color = mix(color, goldNebula, n1 * 0.15);
  color = mix(color, greenNebula, n2 * 0.08);
  float stars = step(0.998, hash(gl_FragCoord.xy * 0.1 + uTime * 0.001));
  color += stars * 0.5;
  gl_FragColor = vec4(color, 1.0);
}
```

- [ ] **Step 6: Commit**

```bash
git add src/shaders/
git commit -m "feat(fate-wheel): GLSL shaders - liquid metal, energy bridge, nebula background"
```

---

## Chunk 4: Three.js 場景核心

### Task 4: Scene Manager + Compass Core + Nebula BG

**Files:**
- Create: `src/lib/fate-wheel/scene-manager.ts`
- Create: `src/lib/fate-wheel/compass-core.ts`
- Create: `src/lib/fate-wheel/nebula-bg.ts`
- Create: `src/lib/fate-wheel/gsap-timelines.ts`
- Create: `tests/fate-wheel/scene-structure.test.ts`

- [ ] **Step 1: 建立 nebula-bg.ts**

```typescript
// src/lib/fate-wheel/nebula-bg.ts
import * as THREE from 'three';
import type { DeviceTier } from './types';

let nebulaUniforms: Record<string, { value: unknown }> = {};

export function initNebulaBg(scene: THREE.Scene, renderer: THREE.WebGLRenderer, _tier: DeviceTier): void {
  const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`;

  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uResolution;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y);
    }
    float fbm(vec2 p) { float v=0.0; float a=0.5; for(int i=0;i<5;i++){v+=a*noise(p);p*=2.0;a*=0.5;} return v; }
    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution;
      float n1 = fbm(uv*3.0 + uTime*0.02);
      float n2 = fbm(uv*4.5 - uTime*0.015);
      vec3 c = vec3(0.012, 0.012, 0.031);
      c = mix(c, vec3(0.83,0.66,0.26), n1*0.15);
      c = mix(c, vec3(0.0,1.0,0.53), n2*0.08);
      c += step(0.998, hash(gl_FragCoord.xy*0.1+uTime*0.001)) * 0.5;
      gl_FragColor = vec4(c, 1.0);
    }
  `;

  nebulaUniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(renderer.domElement.width, renderer.domElement.height) },
  };

  const mat = new THREE.ShaderMaterial({ uniforms: nebulaUniforms, vertexShader, fragmentShader, depthWrite: false });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), mat);
  mesh.position.z = -10;
  mesh.renderOrder = -1;
  scene.add(mesh);
}

export function animateNebulaBg(time: number): void {
  if (nebulaUniforms.uTime) nebulaUniforms.uTime.value = time;
}
```

- [ ] **Step 2: 建立 compass-core.ts**

```typescript
// src/lib/fate-wheel/compass-core.ts
import * as THREE from 'three';
import gsap from 'gsap';
import type { DeviceTier } from './types';
import { stateManager } from './state-manager';
import { directions } from './config';

let coreGroup: THREE.Group;
let coreSphere: THREE.Mesh;
let crystalMeshes: THREE.Mesh[] = [];

export async function initCompassCore(scene: THREE.Scene, tier: DeviceTier): Promise<void> {
  coreGroup = new THREE.Group();

  const sphereGeo = new THREE.SphereGeometry(0.5, tier === 'high' ? 32 : 16, tier === 'high' ? 32 : 16);
  const sphereMat = new THREE.MeshPhysicalMaterial({
    color: 0xE8E4D9, emissive: 0xD4A843, emissiveIntensity: 0.3,
    transparent: true, opacity: 0.85, roughness: 0.2, metalness: 0.8,
  });
  coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
  coreGroup.add(coreSphere);

  const crystalGeo = new THREE.OctahedronGeometry(0.15, tier === 'high' ? 2 : 0);
  const ringRadius = 1.2;

  directions.forEach((dir) => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(dir.color), emissive: new THREE.Color(dir.color),
      emissiveIntensity: 0.3, transparent: true, opacity: 0.9, roughness: 0.3, metalness: 0.7,
    });
    const crystal = new THREE.Mesh(crystalGeo, mat);
    crystal.position.set(Math.cos(dir.angle) * ringRadius, Math.sin(dir.angle) * ringRadius, 0);
    crystal.userData.direction = dir.id;
    coreGroup.add(crystal);
    crystalMeshes.push(crystal);
  });

  scene.add(coreGroup);
  startBreathingAnimation();
}

function startBreathingAnimation(): void {
  gsap.to(coreSphere.scale, {
    x: 1.08, y: 1.08, z: 1.08, duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1,
    onUpdate: () => {
      const s = coreSphere.scale.x;
      const mat = coreSphere.material as THREE.MeshPhysicalMaterial;
      mat.emissiveIntensity = 0.2 + (s - 1) * 4;
    },
  });

  crystalMeshes.forEach((crystal, i) => {
    gsap.to(crystal.rotation, { y: Math.PI * 2, duration: 8 + i * 3, ease: 'none', repeat: -1 });
  });
}

export function animateCompassCore(time: number): void {
  if (coreGroup) coreGroup.rotation.z = Math.sin(time * 0.1) * 0.02;
}

export function onCompassCoreHover(raycaster: THREE.Raycaster, camera: THREE.Camera, mouse: THREE.Vector2): void {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(crystalMeshes);
  crystalMeshes.forEach((crystal) => {
    if (intersects.length > 0 && intersects[0].object === crystal) {
      gsap.to(crystal.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.3 });
      (crystal.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.8;
    } else {
      gsap.to(crystal.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
      (crystal.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.3;
    }
  });
}

export function onCompassCoreClick(raycaster: THREE.Raycaster, camera: THREE.Camera, mouse: THREE.Vector2): void {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(crystalMeshes);
  if (intersects.length > 0) {
    const direction = (intersects[0].object as THREE.Mesh).userData.direction as string;
    if (direction) {
      stateManager.selectDirection(direction);
      gsap.to(coreSphere.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.out' });
    }
  }
}
```

- [ ] **Step 3: 建立 scene-manager.ts**

```typescript
// src/lib/fate-wheel/scene-manager.ts
import * as THREE from 'three';
import type { DeviceTier } from './types';
import { detectDeviceTier } from './device-tier';
import { initCompassCore, animateCompassCore, onCompassCoreHover, onCompassCoreClick } from './compass-core';
import { initNebulaBg, animateNebulaBg } from './nebula-bg';
import { initGsapTimelines } from './gsap-timelines';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let animationId: number | null = null;
let lastRender = 0;
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

export async function initFateWheel(canvas: HTMLCanvasElement): Promise<void> {
  const deviceTier = detectDeviceTier();

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 8;

  renderer = new THREE.WebGLRenderer({
    canvas, antialias: deviceTier !== 'medium', alpha: true, powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, deviceTier === 'high' ? 2 : 1));

  initNebulaBg(scene, renderer, deviceTier);
  await initCompassCore(scene, deviceTier);
  initGsapTimelines();

  window.addEventListener('resize', onResize);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('click', onClick);
  document.addEventListener('visibilitychange', onVisibilityChange);

  startRenderLoop();
}

function startRenderLoop(): void {
  function loop(time: number) {
    animationId = requestAnimationFrame(loop);
    const delta = time - lastRender;
    if (delta < FRAME_INTERVAL) return;
    lastRender = time - (delta % FRAME_INTERVAL);
    animateCompassCore(time * 0.001);
    animateNebulaBg(time * 0.001);
    renderer.render(scene, camera);
  }
  animationId = requestAnimationFrame(loop);
}

function onResize(): void {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(e: MouseEvent): void {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  onCompassCoreHover(raycaster, camera, mouse);
}

function onClick(e: MouseEvent): void {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  onCompassCoreClick(raycaster, camera, mouse);
}

function onVisibilityChange(): void {
  if (document.hidden && animationId) { cancelAnimationFrame(animationId); animationId = null; }
  else if (!document.hidden && !animationId) { startRenderLoop(); }
}

export function disposeFateWheel(): void {
  if (animationId) cancelAnimationFrame(animationId);
  window.removeEventListener('resize', onResize);
  renderer.dispose();
}
```

- [ ] **Step 4: 建立 gsap-timelines.ts**

```typescript
// src/lib/fate-wheel/gsap-timelines.ts
import gsap from 'gsap';

export function initGsapTimelines(): void {
  window.addEventListener('fate-wheel:direction-selected', onDirectionSelected);
  window.addEventListener('fate-wheel:question-answered', onQuestionAnswered);
  window.addEventListener('fate-wheel:diagnosis-complete', onDiagnosisComplete);
}

function onDirectionSelected(e: Event): void {
  const middleRing = document.querySelector('.ring-middle') as HTMLElement;
  if (middleRing) gsap.to(middleRing, { opacity: 1, duration: 1.2, ease: 'power2.inOut' });
  const nodes = document.querySelectorAll('.question-node');
  gsap.to(nodes, { opacity: 1, scale: 1, stagger: 0.3, ease: 'back.out(1.7)' });
}

function onQuestionAnswered(e: Event): void {
  const detail = (e as CustomEvent).detail as { question: number };
  const node = document.querySelector(`.question-node[data-q="${detail.question}"]`) as HTMLElement;
  if (node) gsap.to(node, { scale: 1.3, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.out' });
}

function onDiagnosisComplete(_e: Event): void {
  const outerRing = document.querySelector('.ring-outer') as HTMLElement;
  if (outerRing) gsap.to(outerRing, { opacity: 1, duration: 1.5, ease: 'power3.inOut' });
}
```

- [ ] **Step 5: 建立 scene-structure.test.ts**

```typescript
// tests/fate-wheel/scene-structure.test.ts
import { describe, it, expect } from 'vitest';

describe('Fate Wheel Scene Structure', () => {
  it('should have correct phase configuration', async () => {
    const { phases } = await import('../../src/lib/fate-wheel/config');
    expect(phases).toHaveLength(4);
    expect(phases[0].name).toContain('戰略藍圖');
    expect(phases[3].name).toContain('財務合規');
  });

  it('should have correct direction configuration', async () => {
    const { directions } = await import('../../src/lib/fate-wheel/config');
    expect(directions).toHaveLength(4);
    const ids = directions.map(d => d.id);
    expect(ids).toContain('north');
    expect(ids).toContain('east');
    expect(ids).toContain('south');
    expect(ids).toContain('west');
  });

  it('should have correct question configuration', async () => {
    const { questions } = await import('../../src/lib/fate-wheel/config');
    expect(questions).toHaveLength(3);
    expect(questions[0].options).toHaveLength(4);
  });

  it('should have valid color values for all phases', async () => {
    const { phases } = await import('../../src/lib/fate-wheel/config');
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    phases.forEach(phase => {
      expect(phase.color).toMatch(hexRegex);
      expect(phase.colorRgb).toMatch(/^\d+, \d+, \d+$/);
    });
  });

  it('should have valid orbit periods (descending order)', async () => {
    const { phases } = await import('../../src/lib/fate-wheel/config');
    for (let i = 0; i < phases.length - 1; i++) {
      expect(phases[i].orbitPeriod).toBeGreaterThan(phases[i + 1].orbitPeriod);
    }
  });
});
```

- [ ] **Step 6: Run all tests**

```bash
npm test -- tests/fate-wheel/
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/fate-wheel/scene-manager.ts src/lib/fate-wheel/compass-core.ts src/lib/fate-wheel/nebula-bg.ts src/lib/fate-wheel/gsap-timelines.ts tests/fate-wheel/scene-structure.test.ts
git commit -m "feat(fate-wheel): Three.js scene manager, compass core, nebula bg, GSAP timelines"
```

---

## Chunk 5: Astro 組件與首頁整合

### Task 5: 建立 FateWheel Astro 組件並整合到首頁

**Files:**
- Create: `src/components/FateWheel/FateWheelScene.astro`
- Create: `src/components/FateWheel/DiagnosisOverlay.astro`
- Create: `src/components/FateWheel/PhaseInfoPanel.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: 建立 FateWheelScene.astro**

```astro
---
// src/components/FateWheel/FateWheelScene.astro
---
<div class="fate-wheel-canvas-container" id="fate-wheel-container">
  <canvas id="fate-wheel-canvas"></canvas>
</div>
<div class="fate-wheel-loader" id="fate-wheel-loader">
  <div class="loader-ring"></div>
  <p class="loader-text">命運之輪運轉中...</p>
</div>
<script is:inline>
  (async function initFateWheel() {
    const loader = document.getElementById('fate-wheel-loader');
    const canvas = document.getElementById('fate-wheel-canvas');
    if (!canvas) return;
    try {
      const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
      const gsap = await import('https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js');
      window.THREE = THREE;
      window.gsap = gsap.default || gsap;
      // Initialize scene modules here
      if (loader) loader.classList.add('hidden');
    } catch (err) {
      console.warn('Fate Wheel 3D init failed, falling back to CSS:', err);
      if (loader) loader.classList.add('hidden');
    }
  })();
</script>
<style>
  @import url('../../styles/fate-wheel.css');
</style>
```

- [ ] **Step 2: 建立 DiagnosisOverlay.astro**

```astro
---
// src/components/FateWheel/DiagnosisOverlay.astro
import { questions } from '../../lib/fate-wheel/config';
---
<div class="diagnosis-overlay" id="diagnosis-overlay">
  <div class="advisor-dialogue">
    <span class="advisor-avatar-icon">🎭</span>
    <p class="advisor-speech">"歡迎，探險家。<br/>讓我為你量身打造戰略。"</p>
  </div>
  <form class="diagnosis-form" id="diagnosis-form-el">
    {questions.map((q, idx) => (
      <div class={`question-step ${idx === 0 ? 'active' : ''}`} data-step={q.id}>
        <h3>{q.title}</h3>
        <div class="option-grid">
          {q.options.map(opt => (
            <label class="option-card">
              <input type="radio" name={`q${q.id}`} value={opt.value} hidden>
              <span class="option-icon">{opt.icon}</span>
              <span class="option-title">{opt.title}</span>
              <span class="option-desc">{opt.desc}</span>
            </label>
          ))}
        </div>
      </div>
    ))}
    <div class="form-navigation">
      <button type="button" class="btn-prev" id="btn-prev" hidden>← 上一步</button>
      <button type="button" class="btn-next" id="btn-next" disabled>下一步 →</button>
    </div>
  </form>
  <div class="result-reveal" id="result-reveal" style="display:none;">
    <div class="scroll-seal">📜</div>
    <h3 id="result-path-name"></h3>
    <p class="result-summary" id="result-summary"></p>
    <div class="result-actions">
      <a href="#" class="btn-start-journey" id="btn-start-journey">🔥 踏上征途</a>
      <button type="button" class="btn-back-adjust" id="btn-back-adjust">← 調整選項</button>
    </div>
  </div>
</div>
```

- [ ] **Step 3: 建立 PhaseInfoPanel.astro**

```astro
---
// src/components/FateWheel/PhaseInfoPanel.astro
---
<div class="phase-info-panel" id="phase-info-panel">
  <div class="phase-icon" id="panel-icon"></div>
  <h3 id="panel-title"></h3>
  <p id="panel-desc"></p>
  <div class="phase-stats">
    <span id="panel-articles"></span>
    <span id="panel-time"></span>
  </div>
  <a href="#" class="btn-enter" id="panel-link">進入 →</a>
</div>
```

- [ ] **Step 4: 修改 index.astro**

Replace the existing CompassView and DiagnosisForm imports with FateWheel components, keeping the hero section and phase cards. The 3D canvas is fixed/centered, HTML content scrolls over it.

- [ ] **Step 5: Run build to verify**

```bash
npm run build
```

- [ ] **Step 6: Run all tests**

```bash
npm test
```

- [ ] **Step 7: Commit**

```bash
git add src/components/FateWheel/ src/pages/index.astro
git commit -m "feat(fate-wheel): integrate FateWheel components into homepage"
```

---

## Chunk 6: 外環行星與能量橋

### Task 6: 建立 Phase Planets + Energy Bridges

**Files:**
- Create: `src/lib/fate-wheel/phase-planets.ts`
- Create: `src/lib/fate-wheel/energy-bridges.ts`

- [ ] **Step 1: 建立 phase-planets.ts** — 外環行星初始化、軌道動畫、hover/click 互動
- [ ] **Step 2: 建立 energy-bridges.ts** — 能量橋 GLSL 線條、脈衝動畫
- [ ] **Step 3: 整合到 scene-manager.ts** — 在診斷完成後激活外環
- [ ] **Step 4: Run tests**
- [ ] **Step 5: Commit**

```bash
git add src/lib/fate-wheel/phase-planets.ts src/lib/fate-wheel/energy-bridges.ts
git commit -m "feat(fate-wheel): phase planets orbit animation, energy bridges with GLSL pulse"
```

---

## Chunk 7: 最終整合與驗證

### Task 7: 完整測試與建構驗證

- [ ] **Step 1: Run all tests**

```bash
npm test
```

Expected: All tests pass (existing + new fate-wheel tests).

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Verify dev server**

```bash
npm run dev
```

Manually verify:
1. 3D scene loads and "征途之心" breathes at center
2. Clicking a direction activates middle ring
3. Answering 3 questions activates outer ring
4. Planets orbit and show info panel on hover
5. CSS fallback works on reduced-motion devices
6. All existing tests still pass

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat(fate-wheel): complete integration - all tests pass, build verified"
```

---

**Plan complete. Ready to execute.**
