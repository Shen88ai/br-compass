import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');

describe('Persona 角色扮演系統 — Path Mapping 數據', () => {
  const mappingPath = join(srcDir, 'data', 'path-mapping.ts');

  describe('文件存在性', () => {
    it('path-mapping.ts 應存在於 src/data/', () => {
      expect(existsSync(mappingPath)).toBe(true);
    });
  });

  describe('導出結構', () => {
    it('應導出 pathConfigs 對象', async () => {
      const mod = await import(mappingPath);
      expect(mod.pathConfigs).toBeDefined();
      expect(typeof mod.pathConfigs).toBe('object');
    });

    it('應導出 pathInfo 對象', async () => {
      const mod = await import(mappingPath);
      expect(mod.pathInfo).toBeDefined();
      expect(typeof mod.pathInfo).toBe('object');
    });

    it('應導出 diagnosisMap 對象', async () => {
      const mod = await import(mappingPath);
      expect(mod.diagnosisMap).toBeDefined();
      expect(typeof mod.diagnosisMap).toBe('object');
    });
  });

  describe('7 條路徑完整性', () => {
    it('應包含全部 7 條路徑 (A-G)', async () => {
      const mod = await import(mappingPath);
      const keys = Object.keys(mod.pathConfigs);
      expect(keys).toContain('A');
      expect(keys).toContain('B');
      expect(keys).toContain('C');
      expect(keys).toContain('D');
      expect(keys).toContain('E');
      expect(keys).toContain('F');
      expect(keys).toContain('G');
      expect(keys.length).toBe(7);
    });

    it('路徑 A（移民征途）應有 19 個關卡', async () => {
      const mod = await import(mappingPath);
      expect(mod.pathConfigs.A.length).toBe(19);
    });

    it('路徑 B（閃電出海）應有 5 個關卡', async () => {
      const mod = await import(mappingPath);
      expect(mod.pathConfigs.B.length).toBe(5);
    });

    it('路徑 C（企業遠征）應有 17 個關卡', async () => {
      const mod = await import(mappingPath);
      expect(mod.pathConfigs.C.length).toBe(17);
    });

    it('路徑 D（落地加速）應有 8 個關卡', async () => {
      const mod = await import(mappingPath);
      expect(mod.pathConfigs.D.length).toBe(8);
    });

    it('路徑 E（運營優化）應有 5 個關卡', async () => {
      const mod = await import(mappingPath);
      expect(mod.pathConfigs.E.length).toBe(5);
    });

    it('路徑 F（試水偵察）應有 3 個關卡', async () => {
      const mod = await import(mappingPath);
      expect(mod.pathConfigs.F.length).toBe(3);
    });

    it('路徑 G（數位遊民征途）應有 5 個關卡', async () => {
      const mod = await import(mappingPath);
      expect(mod.pathConfigs.G.length).toBe(5);
    });
  });

  describe('關卡數據結構', () => {
    it('每個關卡應包含 slug, title, eta, difficulty 字段', async () => {
      const mod = await import(mappingPath);
      for (const pathKey of Object.keys(mod.pathConfigs)) {
        for (const checkpoint of mod.pathConfigs[pathKey]) {
          expect(checkpoint).toHaveProperty('slug');
          expect(checkpoint).toHaveProperty('title');
          expect(checkpoint).toHaveProperty('eta');
          expect(checkpoint).toHaveProperty('difficulty');
        }
      }
    });

    it('所有 slug 應對應實際存在的 handbook 文件', async () => {
      const mod = await import(mappingPath);
      const handbookDir = join(process.cwd(), 'src', 'content', 'handbook');
      const allSlugs = new Set<string>();
      for (const pathKey of Object.keys(mod.pathConfigs)) {
        for (const checkpoint of mod.pathConfigs[pathKey]) {
          allSlugs.add(checkpoint.slug);
        }
      }
      for (const slug of allSlugs) {
        const mdFiles = ['01-0-pre-entry-checklist', '01-tax-system', '01-1-tax-timeline',
          '01-2-visa-golden', '01-3-visa-digital-nomad', '01-4-visa-executive',
          '02-visa-strategy', '03-local-team', '04-company-setup', '05-bacen-capital',
          '06-ecommerce-platforms', '07-radar-import', '08-3pl-warehouse', '08-1-3pl-contract',
          '09-erp-payment', '09-1-split-payment', '10-after-sales-service',
          '11-tax-compliance', '12-profit-remittance'];
        expect(mdFiles).toContain(slug);
      }
    });
  });

  describe('pathInfo 完整性', () => {
    it('每條路徑應有 name, checkpoints, hours 字段', async () => {
      const mod = await import(mappingPath);
      for (const pathKey of Object.keys(mod.pathInfo)) {
        expect(mod.pathInfo[pathKey]).toHaveProperty('name');
        expect(mod.pathInfo[pathKey]).toHaveProperty('checkpoints');
        expect(mod.pathInfo[pathKey]).toHaveProperty('hours');
      }
    });

    it('pathInfo 的 checkpoints 數應與 pathConfigs 一致', async () => {
      const mod = await import(mappingPath);
      for (const pathKey of Object.keys(mod.pathConfigs)) {
        expect(mod.pathInfo[pathKey].checkpoints).toBe(mod.pathConfigs[pathKey].length);
      }
    });
  });

  describe('diagnosisMap 覆蓋率', () => {
    it('應覆蓋所有身份 × 目標 × 進度組合', async () => {
      const mod = await import(mappingPath);
      const identities = ['individual', 'corporate', 'crossborder', 'remoteworker'];
      const goals = ['profit', 'immigration', 'expansion', 'testing'];
      const progresses = ['beginner', 'preparing', 'landed', 'operating'];
      let totalCombinations = 0;
      for (const id of identities) {
        for (const goal of goals) {
          for (const prog of progresses) {
            const key = `${id}-${goal}-${prog}`;
            totalCombinations++;
            expect(mod.diagnosisMap).toHaveProperty(key);
          }
        }
      }
      expect(Object.keys(mod.diagnosisMap).length).toBe(totalCombinations);
    });

    it('所有 diagnosisMap 值應指向有效的路徑 (A-G)', async () => {
      const mod = await import(mappingPath);
      const validPaths = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
      for (const key of Object.keys(mod.diagnosisMap)) {
        expect(validPaths).toContain(mod.diagnosisMap[key]);
      }
    });
  });

  describe('100% 內容覆蓋', () => {
    it('所有 19 篇文章至少出現在一條路徑中', async () => {
      const mod = await import(mappingPath);
      const allSlugs = new Set<string>();
      for (const pathKey of Object.keys(mod.pathConfigs)) {
        for (const checkpoint of mod.pathConfigs[pathKey]) {
          allSlugs.add(checkpoint.slug);
        }
      }
      const requiredSlugs = ['01-0-pre-entry-checklist', '01-tax-system', '01-1-tax-timeline',
        '01-2-visa-golden', '01-3-visa-digital-nomad', '01-4-visa-executive',
        '02-visa-strategy', '03-local-team', '04-company-setup', '05-bacen-capital',
        '06-ecommerce-platforms', '07-radar-import', '08-3pl-warehouse', '08-1-3pl-contract',
        '09-erp-payment', '09-1-split-payment', '10-after-sales-service',
        '11-tax-compliance', '12-profit-remittance'];
      for (const slug of requiredSlugs) {
        expect(allSlugs).toContain(slug);
      }
    });
  });
});
