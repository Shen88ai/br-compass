import gsap from 'gsap';

export function initGsapTimelines(): void {
  window.addEventListener('fate-wheel:direction-selected', onDirectionSelected);
  window.addEventListener('fate-wheel:question-answered', onQuestionAnswered);
  window.addEventListener('fate-wheel:diagnosis-complete', onDiagnosisComplete);
}

function onDirectionSelected(e: Event): void {
  const middleRing = document.querySelector('.ring-middle') as HTMLElement;
  if (middleRing) {
    gsap.to(middleRing, { opacity: 1, duration: 1.2, ease: 'power2.inOut' });
  }

  const nodes = document.querySelectorAll('.question-node');
  gsap.to(nodes, {
    opacity: 1,
    scale: 1,
    stagger: 0.3,
    ease: 'back.out(1.7)',
  });
}

function onQuestionAnswered(e: Event): void {
  const detail = (e as CustomEvent).detail as { question: number };
  const node = document.querySelector(`.question-node[data-q="${detail.question}"]`) as HTMLElement;
  if (node) {
    gsap.to(node, {
      scale: 1.3,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
    });
  }
}

function onDiagnosisComplete(_e: Event): void {
  const outerRing = document.querySelector('.ring-outer') as HTMLElement;
  if (outerRing) {
    gsap.to(outerRing, { opacity: 1, duration: 1.5, ease: 'power3.inOut' });
  }
}
