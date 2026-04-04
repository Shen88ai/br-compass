import type { DeviceTier } from './types';

export function detectDeviceTier(): DeviceTier {
  if (typeof window === 'undefined') return 'low';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'low';
  }

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) return 'low';

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (debugInfo) {
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    if (/Mali-T|Adreno \(TM\) 3|PowerVR/i.test(renderer)) {
      return 'medium';
    }
  }

  const pixelCount = window.innerWidth * window.innerHeight * window.devicePixelRatio;
  if (pixelCount > 4_000_000) return 'medium';
  if (pixelCount > 2_000_000) return 'high';

  return /Mobi|Android|iPhone|iPad/i.test(window.navigator.userAgent) ? 'medium' : 'high';
}
