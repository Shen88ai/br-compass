import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const root = process.cwd();

describe('Phase 3: 搜尋索引實作 - 方案一 方法 B (Data Inject)', () => {
  describe('Fuse.js 應已安裝', () => {
    it('應安裝 fuse.js 套件', () => {
      const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      expect(deps['fuse.js']).toBeDefined();
    });
  });

  describe('前端搜尋組件應使用 Data Inject', () => {
    const pagePath = join(root, 'src', 'pages', 'handbook', 'index.astro');
    let page = '';
    try {
      page = readFileSync(pagePath, 'utf-8');
    } catch (e) {
      // ignore
    }

    it('handbook/index.astro 應提取文章內容成 searchData', () => {
      expect(page).toMatch(/searchData/);
    });

    it('handbook/index.astro 應利用 define:vars 將 searchData 注入腳本', () => {
      expect(page).toMatch(/<script[^>]*define:vars.*searchData/);
    });
    
    it('前端不應發送 fetch 去抓取 search-index.json', () => {
      expect(page).not.toMatch(/fetch\(['"`]\/search-index\.json['"`]\)/);
    });
  });

  describe('進階搜尋體驗優化 (方案三)', () => {
    const pagePath = join(root, 'src', 'pages', 'handbook', 'index.astro');
    let page = '';
    try {
      page = readFileSync(pagePath, 'utf-8');
    } catch (e) {
      // ignore
    }

    it('應實作 Debounce 防抖機制', () => {
      // 檢查是否含有 setTimeout 與 clearTimeout 關鍵字
      expect(page).toMatch(/setTimeout/);
      expect(page).toMatch(/clearTimeout/);
    });

    it('應實作關鍵字的高亮標記 (<mark> 標籤)', () => {
      expect(page).toMatch(/<mark[^>]*>/);
    });

    it('在找不到結果的空白狀態時，應提供推薦詞彙', () => {
      expect(page).toMatch(/推薦搜尋|您可能想尋找|RADAR|CNPJ|3PL/);
    });
  });
});
