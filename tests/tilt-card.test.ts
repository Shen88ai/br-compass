import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');

describe('方案一：奢華級微交互 — 3D 傾斜卡片', () => {
  describe('global.css 應定義 3D 傾斜樣式', () => {
    it('應定義 .tilt-card 基礎 3D 透視容器', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.tilt-card|\.card-3d|perspective.*1000/);
    });

    it('應定義 .tilt-inner 內部元素 3D 變換過渡', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.tilt-inner|\.tilt-content|transform-style.*preserve-3d/);
    });

    it('應定義 .tilt-glow 光暈跟隨效果', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.tilt-glow|\.card-glow|radial-gradient.*follow/);
    });

    it('應定義 .tilt-shine 反光掃過效果', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.tilt-shine|\.card-shine|linear-gradient.*shine/);
    });
  });

  describe('handbook/index.astro 應包含 3D 傾斜腳本', () => {
    it('應包含 tilt 效果的 mousemove event listener', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', 'index.astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/tilt|mousemove.*card|rotateX.*rotateY|getBoundingClientRect/);
    });

    it('應在卡片上使用 tilt-card 或類似 class', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', 'index.astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/tilt-card|card-3d|tilt-effect/);
    });
  });
});
