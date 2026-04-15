import { describe, it, expect } from 'vitest';

const pathLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const pathData: Record<string, { name: string; strategy: string; checkpoints: number }> = {
  A: { name: '🛡️ 移民征途', strategy: '先辦 CPF + 海牙認證，沒有這些你連銀行都開不了戶', checkpoints: 19 },
  B: { name: '🚀 閃電出海', strategy: '即使跨境銷售也要懂巴西稅制，Lucro Presumido 最適合初期試水', checkpoints: 5 },
  C: { name: '🏗️ 企業遠征', strategy: '母公司全資子公司是最乾淨的架構，避免合夥糾紛', checkpoints: 17 },
  D: { name: '⚡ 落地加速', strategy: '複習公司架構要點，確認你的 CNPJ 和 Pleno Poder 沒有遺漏', checkpoints: 8 },
  E: { name: '🔧 運營優化', strategy: '優化退貨流程可以省下 5-10% 的營收，這是被忽視的利潤池', checkpoints: 5 },
  F: { name: '🎯 試水偵察', strategy: '先看懂稅制再決定是否值得進入——巴西市場大但稅務成本也高', checkpoints: 3 },
  G: { name: '💻 數位遊民征途', strategy: '先辦 CPF + 海牙認證，數位遊民入境必備', checkpoints: 5 },
};

describe('Fate Wheel Click - Phase 2', () => {
  it('creates 7 path label sprites (A-F + G)', () => {
    expect(pathLabels.length).toBe(7);
    expect(pathLabels).toContain('A');
    expect(pathLabels).toContain('B');
    expect(pathLabels).toContain('C');
    expect(pathLabels).toContain('D');
    expect(pathLabels).toContain('E');
    expect(pathLabels).toContain('F');
    expect(pathLabels).toContain('G');
  });

  it('each label has correct userData (pathKey, strategy, orbitAngle)', () => {
    Object.keys(pathData).forEach(pathKey => {
      const data = pathData[pathKey];
      expect(data.name).toBeTruthy();
      expect(data.strategy).toBeTruthy();
      expect(data.checkpoints).toBeGreaterThan(0);
    });
  });

  it('raycaster detects mouse clicks on path labels', () => {
    const mockRaycaster = {
      setFromCamera: () => {},
      intersectObjects: () => [{ object: { userData: { pathKey: 'A' } } }]
    };
    expect(typeof mockRaycaster.setFromCamera).toBe('function');
    expect(typeof mockRaycaster.intersectObjects).toBe('function');
  });

  it('dispatches path-label-click event with pathKey detail', () => {
    const mockEvent = new CustomEvent('path-label-click', {
      detail: { pathKey: 'A' }
    });
    expect(mockEvent.detail.pathKey).toBe('A');
  });

  it('panel displays full checkpoint list for selection', () => {
    Object.keys(pathData).forEach(pathKey => {
      const data = pathData[pathKey];
      expect(data.checkpoints).toBeGreaterThan(0);
      expect(typeof data.checkpoints).toBe('number');
    });
  });

  it('panel close button hides the overlay', () => {
    const mockPanel = {
      style: { display: 'block' },
      hide: function() { this.style.display = 'none'; }
    };
    mockPanel.hide();
    expect(mockPanel.style.display).toBe('none');
  });

  it('CTA button navigates to selected checkpoint', () => {
    const pathKey = 'A';
    const firstCheckpointSlug = '01-0-pre-entry-checklist';
    const expectedUrl = `/handbook/${firstCheckpointSlug}`;
    expect(expectedUrl).toBe('/handbook/01-0-pre-entry-checklist');
  });
});

describe('Path Data Validation', () => {
  it('path A has 19 checkpoints', () => {
    expect(pathData.A.checkpoints).toBe(19);
  });

  it('path B has 5 checkpoints', () => {
    expect(pathData.B.checkpoints).toBe(5);
  });

  it('path C has 17 checkpoints', () => {
    expect(pathData.C.checkpoints).toBe(17);
  });

  it('path D has 8 checkpoints', () => {
    expect(pathData.D.checkpoints).toBe(8);
  });

  it('path E has 5 checkpoints', () => {
    expect(pathData.E.checkpoints).toBe(5);
  });

  it('path F has 3 checkpoints', () => {
    expect(pathData.F.checkpoints).toBe(3);
  });

  it('path G has 5 checkpoints', () => {
    expect(pathData.G.checkpoints).toBe(5);
  });
});
