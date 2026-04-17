import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');

describe('TaxRiver 河流漏斗混合視覺化組件', () => {
  const componentPath = join(srcDir, 'components', 'TaxVisualization', 'TaxRiver.astro');

  describe('組件存在性', () => {
    it('TaxRiver.astro 組件應存在於 components 目錄', () => {
      expect(existsSync(componentPath)).toBe(true);
    });
  });

  describe('河流結構', () => {
    it('組件應展示上游（進口）元素', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/上游|進口|import/);
    });

    it('組件應展示中游（稅務交匯）元素', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/中游|CBS|IBS|IRPJ|CSLL/);
    });

    it('組件應展示下游（淨利）元素', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/下游|淨利|net|profit/);
    });
  });

  describe('CBS/IBS 軌道', () => {
    it('應展示進項發票', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/進項|import|inbound/);
    });

    it('應展示可抵扣額', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/抵扣|credit|420/);
    });

    it('應展示銷項收取', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/銷項|sales|outbound|672/);
    });

    it('應展示實繳 CBS/IBS', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/實繳|CBS|IBS|net.*tax|252/);
    });
  });

  describe('IRPJ/CSLL 軌道', () => {
    it('應展示毛利', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/毛利|gross|900/);
    });

    it('應展示 IRPJ', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/IRPJ|irpj/);
    });

    it('應展示 CSLL', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/CSLL|csll/);
    });

    it('應展示營運成本', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/營運成本|operational|cost|500/);
    });
  });

  describe('兩條軌道並行', () => {
    it('CBS/IBS 和 IRPJ/CSLL 應並行展示', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/軌道|track|parallel|並行/);
    });

    it('應有視覺分隔', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/border|divider|分隔|VS|vs/);
    });
  });

  describe('數值展示', () => {
    it('應展示 R$ 1,500 (進項發票)', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/R?\$?\s*1[.,]?500|1500/);
    });

    it('應展示 R$ 420 (進項抵扣)', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/R?\$?\s*420/);
    });

    it('應展示 R$ 672 (銷項收取)', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/R?\$?\s*672/);
    });

    it('應展示 R$ 252 (實繳)', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/R?\$?\s*252/);
    });

    it('應展示 R$ 900 (毛利)', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/R?\$?\s*900/);
    });
  });

  describe('專案風格', () => {
    it('應使用專案配色', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/neon-green|#00FF87|color-neon-green/);
      expect(component).toMatch(/neon-yellow|#E5FF00|color-neon-yellow/);
    });

    it('應有響應式設計', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/@media|responsive/);
    });
  });

  describe('Hover 動畫', () => {
    it('應有 hover 效果', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/hover|transform|scale/);
    });
  });

  describe('Props 介面', () => {
    it('應定義 Props 介面', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/interface Props/);
    });
  });

  describe('總結計算', () => {
    it('應展示最終淨利計算', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/總利潤|total.*profit|最終|final/);
    });
  });
});
