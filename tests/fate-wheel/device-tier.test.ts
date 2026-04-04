import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('detectDeviceTier', () => {
  const origWindow = globalThis.window;
  const origDocument = globalThis.document;
  const origNavigator = globalThis.navigator;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'window', { value: origWindow, writable: true, configurable: true });
    Object.defineProperty(globalThis, 'document', { value: origDocument, writable: true, configurable: true });
    Object.defineProperty(globalThis, 'navigator', { value: origNavigator, writable: true, configurable: true });
  });

  it('should return low when prefers-reduced-motion is reduce', async () => {
    const mockMatchMedia = vi.fn().mockReturnValue({ matches: true });
    (globalThis as any).window = { matchMedia: mockMatchMedia };

    const { detectDeviceTier } = await import('../../src/lib/fate-wheel/device-tier');
    expect(detectDeviceTier()).toBe('low');
  });

  it('should return low when WebGL is not available', async () => {
    const mockMatchMedia = vi.fn().mockReturnValue({ matches: false });
    const mockCanvas = { getContext: () => null };
    const mockDocument = { createElement: () => mockCanvas };
    (globalThis as any).window = {
      matchMedia: mockMatchMedia,
      innerWidth: 1920,
      innerHeight: 1080,
      devicePixelRatio: 1,
    };
    (globalThis as any).document = mockDocument;

    const { detectDeviceTier } = await import('../../src/lib/fate-wheel/device-tier');
    expect(detectDeviceTier()).toBe('low');
  });

  it('should return high for desktop with good GPU and moderate resolution', async () => {
    const mockMatchMedia = vi.fn().mockReturnValue({ matches: false });
    const mockGetParameter = vi.fn().mockReturnValue('NVIDIA GeForce RTX 3080');
    const mockGetExtension = vi.fn().mockReturnValue({
      UNMASKED_RENDERER_WEBGL: 0x1234,
    });
    const mockGl = {
      getExtension: mockGetExtension,
      getParameter: mockGetParameter,
    };
    const mockCanvas = { getContext: () => mockGl };
    const mockDocument = { createElement: () => mockCanvas };
    (globalThis as any).window = {
      matchMedia: mockMatchMedia,
      innerWidth: 1920,
      innerHeight: 1080,
      devicePixelRatio: 1,
    };
    (globalThis as any).document = mockDocument;

    const { detectDeviceTier } = await import('../../src/lib/fate-wheel/device-tier');
    expect(detectDeviceTier()).toBe('high');
  });

  it('should return medium for mobile devices', async () => {
    const mockMatchMedia = vi.fn().mockReturnValue({ matches: false });
    const mockGetParameter = vi.fn().mockReturnValue('NVIDIA GeForce RTX 3080');
    const mockGetExtension = vi.fn().mockReturnValue({
      UNMASKED_RENDERER_WEBGL: 0x1234,
    });
    const mockGl = {
      getExtension: mockGetExtension,
      getParameter: mockGetParameter,
    };
    const mockCanvas = { getContext: () => mockGl };
    const mockDocument = { createElement: () => mockCanvas };
    const mockNavigator = { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)' };
    (globalThis as any).window = {
      matchMedia: mockMatchMedia,
      innerWidth: 390,
      innerHeight: 844,
      devicePixelRatio: 3,
      navigator: mockNavigator,
    };
    (globalThis as any).document = mockDocument;
    (globalThis as any).navigator = mockNavigator;

    const { detectDeviceTier } = await import('../../src/lib/fate-wheel/device-tier');
    expect(detectDeviceTier()).toBe('medium');
  });

  it('should return medium for known low-end GPUs', async () => {
    const mockMatchMedia = vi.fn().mockReturnValue({ matches: false });
    const mockGetParameter = vi.fn().mockReturnValue('Mali-T860');
    const mockGetExtension = vi.fn().mockReturnValue({
      UNMASKED_RENDERER_WEBGL: 0x1234,
    });
    const mockGl = {
      getExtension: mockGetExtension,
      getParameter: mockGetParameter,
    };
    const mockCanvas = { getContext: () => mockGl };
    const mockDocument = { createElement: () => mockCanvas };
    (globalThis as any).window = {
      matchMedia: mockMatchMedia,
      innerWidth: 1920,
      innerHeight: 1080,
      devicePixelRatio: 1,
    };
    (globalThis as any).document = mockDocument;

    const { detectDeviceTier } = await import('../../src/lib/fate-wheel/device-tier');
    expect(detectDeviceTier()).toBe('medium');
  });
});
