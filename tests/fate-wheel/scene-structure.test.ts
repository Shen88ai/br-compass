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

  it('should export scene-manager init function', async () => {
    const { initFateWheel, disposeFateWheel } = await import('../../src/lib/fate-wheel/scene-manager');
    expect(typeof initFateWheel).toBe('function');
    expect(typeof disposeFateWheel).toBe('function');
  });

  it('should export compass-core functions', async () => {
    const { initCompassCore, animateCompassCore, onCompassCoreHover, onCompassCoreClick } =
      await import('../../src/lib/fate-wheel/compass-core');
    expect(typeof initCompassCore).toBe('function');
    expect(typeof animateCompassCore).toBe('function');
    expect(typeof onCompassCoreHover).toBe('function');
    expect(typeof onCompassCoreClick).toBe('function');
  });

  it('should export nebula-bg functions', async () => {
    const { initNebulaBg, animateNebulaBg } = await import('../../src/lib/fate-wheel/nebula-bg');
    expect(typeof initNebulaBg).toBe('function');
    expect(typeof animateNebulaBg).toBe('function');
  });

  it('should export gsap-timelines init function', async () => {
    const { initGsapTimelines } = await import('../../src/lib/fate-wheel/gsap-timelines');
    expect(typeof initGsapTimelines).toBe('function');
  });
});
