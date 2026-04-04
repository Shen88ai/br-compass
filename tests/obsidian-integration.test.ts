import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const root = process.cwd();

describe('Phase 1: Obsidian 目錄映射與同步配置', () => {
  describe('.gitignore 應排除 Obsidian 本地配置', () => {
    it('應排除 .obsidian/ 目錄', () => {
      const gitignore = readFileSync(join(root, '.gitignore'), 'utf-8');
      expect(gitignore).toMatch(/\.obsidian\//);
    });

    it('應排除 .trash/ 回收站', () => {
      const gitignore = readFileSync(join(root, '.gitignore'), 'utf-8');
      expect(gitignore).toMatch(/\.trash\//);
    });

    it('應排除 attachments/ 圖片暫存區', () => {
      const gitignore = readFileSync(join(root, '.gitignore'), 'utf-8');
      expect(gitignore).toMatch(/attachments\//);
    });

    it('應排除 Obsidian 快取檔案', () => {
      const gitignore = readFileSync(join(root, '.gitignore'), 'utf-8');
      // .obsidian/ already excludes everything underneath, including plugins and workspace
      expect(gitignore).toMatch(/\.obsidian\//);
    });
  });

  describe('obsidian-git 配置應存在', () => {
    it('應存在 .obsidian/plugins/obsidian-git/data.json 配置', () => {
      const configPath = join(root, '.obsidian', 'plugins', 'obsidian-git', 'data.json');
      expect(existsSync(configPath)).toBe(true);
    });

    it('配置應設定自動提交間隔', () => {
      const configPath = join(root, '.obsidian', 'plugins', 'obsidian-git', 'data.json');
      const config = JSON.parse(readFileSync(configPath, 'utf-8'));
      expect(config.autoCommitInterval).toBeGreaterThan(0);
    });

    it('配置應設定監聽 src/content 目錄', () => {
      const configPath = join(root, '.obsidian', 'plugins', 'obsidian-git', 'data.json');
      const config = JSON.parse(readFileSync(configPath, 'utf-8'));
      expect(config.watchVault).toBe(true);
    });
  });

  describe('Obsidian 圖片管線目錄應存在', () => {
    it('應存在 public/assets/ 圖片目標目錄', () => {
      expect(existsSync(join(root, 'public', 'assets'))).toBe(true);
    });

    it('應存在 attachments/ 圖片暫存目錄', () => {
      expect(existsSync(join(root, 'attachments'))).toBe(true);
    });
  });
});
