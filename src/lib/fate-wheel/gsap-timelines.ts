import gsap from 'gsap';

let isInitialized = false;

export function initGsapTimelines(): void {
  if (isInitialized) return;
  isInitialized = true;

  window.addEventListener('fate-wheel:direction-selected', onDirectionSelected);
}

function onDirectionSelected(_e: Event): void {
  const fallback = document.querySelector('.fate-wheel-fallback .ring-middle') as HTMLElement;
  if (fallback) {
    gsap.to(fallback, { opacity: 1, duration: 1.2, ease: 'power2.inOut' });
  }
}

export function onDiagnosisComplete(): void {
  const outerRing = document.querySelector('.fate-wheel-fallback .ring-outer') as HTMLElement;
  if (outerRing) {
    gsap.to(outerRing, { opacity: 1, duration: 1.5, ease: 'power3.inOut' });
  }
}