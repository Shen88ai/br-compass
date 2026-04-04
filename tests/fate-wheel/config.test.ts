import { describe, it, expect } from 'vitest';

describe('Fate Wheel Config', () => {
  it('should have correct phase configuration', async () => {
    const { phases } = await import('../../src/lib/fate-wheel/config');
    expect(phases).toHaveLength(4);
    expect(phases[0].name).toContain('戰略藍圖');
    expect(phases[1].name).toContain('實體建立');
    expect(phases[2].name).toContain('供應鏈');
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
    expect(questions[1].options).toHaveLength(4);
    expect(questions[2].options).toHaveLength(4);
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

  it('should have direction angles evenly spaced', async () => {
    const { directions } = await import('../../src/lib/fate-wheel/config');
    const expectedAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    directions.forEach((dir, i) => {
      expect(dir.angle).toBeCloseTo(expectedAngles[i], 5);
    });
  });
});
