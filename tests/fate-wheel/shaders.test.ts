import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const shadersDir = join(process.cwd(), 'src', 'shaders');

describe('GLSL Shaders', () => {
  const shaderFiles = [
    'liquidMetal.vert',
    'liquidMetal.frag',
    'energyBridge.vert',
    'energyBridge.frag',
    'nebula.frag',
  ];

  describe('File existence', () => {
    it.each(shaderFiles)('should have %s', (file) => {
      expect(existsSync(join(shadersDir, file))).toBe(true);
    });
  });

  describe('Shader content validation', () => {
    it('liquidMetal.frag should have main function', () => {
      const content = readFileSync(join(shadersDir, 'liquidMetal.frag'), 'utf-8');
      expect(content).toContain('void main()');
      expect(content).toContain('gl_FragColor');
    });

    it('liquidMetal.vert should have main function', () => {
      const content = readFileSync(join(shadersDir, 'liquidMetal.vert'), 'utf-8');
      expect(content).toContain('void main()');
      expect(content).toContain('gl_Position');
    });

    it('energyBridge.frag should have pulse effect', () => {
      const content = readFileSync(join(shadersDir, 'energyBridge.frag'), 'utf-8');
      expect(content).toContain('uProgress');
      expect(content).toContain('smoothstep');
    });

    it('nebula.frag should have FBM noise', () => {
      const content = readFileSync(join(shadersDir, 'nebula.frag'), 'utf-8');
      expect(content).toContain('fbm');
      expect(content).toContain('uResolution');
    });

    it('all shaders should have valid GLSL syntax (no empty files)', () => {
      shaderFiles.forEach(file => {
        const content = readFileSync(join(shadersDir, file), 'utf-8');
        expect(content.length).toBeGreaterThan(50);
      });
    });
  });
});
