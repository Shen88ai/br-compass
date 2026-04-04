import * as THREE from 'three';
import type { DeviceTier } from './types';
import { detectDeviceTier } from './device-tier';
import { initCompassCore, animateCompassCore, onCompassCoreHover, onCompassCoreClick } from './compass-core';
import { initNebulaBg, animateNebulaBg } from './nebula-bg';
import { initGsapTimelines } from './gsap-timelines';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let animationId: number | null = null;
let lastRender = 0;
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

export async function initFateWheel(canvas: HTMLCanvasElement): Promise<void> {
  const deviceTier = detectDeviceTier();

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 8;

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: deviceTier !== 'medium',
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, deviceTier === 'high' ? 2 : 1));

  initNebulaBg(scene, renderer, deviceTier);
  await initCompassCore(scene, deviceTier);
  initGsapTimelines();

  window.addEventListener('resize', onResize);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('click', onClick);
  document.addEventListener('visibilitychange', onVisibilityChange);

  startRenderLoop();
}

function startRenderLoop(): void {
  function loop(time: number) {
    animationId = requestAnimationFrame(loop);

    const delta = time - lastRender;
    if (delta < FRAME_INTERVAL) return;
    lastRender = time - (delta % FRAME_INTERVAL);

    animateCompassCore(time * 0.001);
    animateNebulaBg(time * 0.001);

    renderer.render(scene, camera);
  }
  animationId = requestAnimationFrame(loop);
}

function onResize(): void {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(e: MouseEvent): void {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  onCompassCoreHover(raycaster, camera, mouse);
}

function onClick(e: MouseEvent): void {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  onCompassCoreClick(raycaster, camera, mouse);
}

function onVisibilityChange(): void {
  if (document.hidden && animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  } else if (!document.hidden && !animationId) {
    startRenderLoop();
  }
}

export function disposeFateWheel(): void {
  if (animationId) cancelAnimationFrame(animationId);
  window.removeEventListener('resize', onResize);
  renderer.dispose();
}
