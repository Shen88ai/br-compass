import * as THREE from 'three';
import gsap from 'gsap';
import type { DeviceTier } from './types';
import { detectDeviceTier } from './device-tier';
import { initCompassCore, animateCompassCore, animateCenterText, onCompassCoreHover, onCompassCoreClick, showMiddleRing, hideMiddleRing } from './compass-core';
import { initNebulaBg, animateNebulaBg } from './nebula-bg';
import { initPhasePlanets, onPlanetHover, onPlanetClick, showPlanets } from './phase-planets';
import { initEnergyBridges, createBridge, animateBridgeProgress, clearBridges } from './energy-bridges';
import { phases, directions } from './config';
import { pathInfo, pathConfigs } from '../../data/path-mapping';
import { stateManager } from './state-manager';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let animationId: number | null = null;
let lastRender = 0;
let isInitialized = false;
let lastHoveredDir: { angle: number; color: string } | null = null;
let raycaster: THREE.Raycaster;
let mouse: THREE.Vector2;
let currentPath: string | null = null;
let pathLabelSprites: THREE.Sprite[] = [];
let selectedPathFrame: THREE.Mesh;
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

export async function initFateWheel(canvas: HTMLCanvasElement): Promise<void> {
  if (isInitialized) return;
  isInitialized = true;

  console.log('[FateWheel] initFateWheel starting...');

  const deviceTier = detectDeviceTier();
  console.log('[FateWheel] deviceTier:', deviceTier);

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

  console.log('[FateWheel] Initializing nebula background...');
  initNebulaBg(scene, renderer);

  console.log('[FateWheel] Initializing compass core...');
  await initCompassCore(scene, deviceTier);

  console.log('[FateWheel] Initializing phase planets...');
  initPhasePlanets(scene);

  console.log('[FateWheel] Initializing energy bridges...');
  initEnergyBridges(scene);

  window.addEventListener('fate-wheel:direction-selected', onDirectionSelected);
  window.addEventListener('fate-wheel:diagnosis-complete', onDiagnosisComplete);

  window.addEventListener('resize', onResize);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('click', onClick, true);
  document.addEventListener('visibilitychange', onVisibilityChange);

  console.log('[FateWheel] Starting render loop...');
  
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  
  startRenderLoop();
  console.log('[FateWheel] initFateWheel complete!');
}

function onDirectionSelected(): void {
  console.log('[FateWheel] onDirectionSelected');
  showMiddleRing();
  triggerRayEffect();
  createAndAnimateBridges();
}

function triggerRayEffect(): void {
  directions.forEach((dir, i) => {
    setTimeout(() => {
      const rayLength = 5;
      const endPos = new THREE.Vector3(
        Math.cos(dir.angle) * rayLength,
        Math.sin(dir.angle) * rayLength,
        0
      );
      createRayBurst(new THREE.Vector3(0, 0, 0), endPos, dir.color);
    }, i * 100);
  });
}

function createRayBurst(start: THREE.Vector3, end: THREE.Vector3, color: string): void {
  const direction = end.clone().sub(start).normalize();
  const length = start.distanceTo(end);
  
  const geometry = new THREE.BoxGeometry(0.03, length, 0.03);
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 1,
  });
  
  const ray = new THREE.Mesh(geometry, material);
  ray.position.copy(start).add(direction.clone().multiplyScalar(length / 2));
  ray.lookAt(end.clone().add(start));
  ray.rotateX(Math.PI / 2);
  scene.add(ray);

  ray.scale.set(0.1, 0.01, 0.1);
  gsap.to(ray.scale, {
    x: 1, y: 1, z: 1,
    duration: 0.3,
    ease: 'power2.out',
  });
  
  gsap.to(material, {
    opacity: 0,
    duration: 1.0,
    ease: 'power2.out',
    delay: 0.3,
    onComplete: () => {
      scene.remove(ray);
      geometry.dispose();
      material.dispose();
    },
  });
}

function createAndAnimateBridges(): void {
  clearBridges();
  const orbitRadius = 4.0;
  phases.forEach((phase, i) => {
    const angle = (i / phases.length) * Math.PI * 2;
    const planetPos = new THREE.Vector3(
      Math.cos(angle) * orbitRadius,
      Math.sin(angle) * orbitRadius,
      0
    );
    const bridge = createBridge(
      new THREE.Vector3(0, 0, 0),
      planetPos,
      phase.color,
      '#D4A843'
    );
    animateBridgeProgress(bridge, 1.5);
  });
}

function onDiagnosisComplete(): void {
  console.log('[FateWheel] onDiagnosisComplete - showing planets');
  const data = stateManager.getData();
  currentPath = data.determinedPath;
  
  createPathLabels();
  createPathFrame();
  
  startPathLabelRotation();
  
  if (currentPath) {
    showSelectedPathFrame(currentPath);
  }
  
  showPlanets();
}

function createPathLabels(): void {
  pathLabelSprites.forEach(sprite => {
    scene.remove(sprite);
    sprite.material.map?.dispose();
    (sprite.material as THREE.Material).dispose();
  });
  pathLabelSprites = [];
  
  const orbitRadius = 2.65;

  const pathKeys = Object.keys(pathInfo);
  pathKeys.forEach((key) => {
    const info = pathInfo[key];
    const config = pathConfigs[key] || [];
    const strategy = config.length > 0 ? config[0].strategy : '';
    const angle = (pathKeys.indexOf(key) / pathKeys.length) * Math.PI * 2;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = 512;
    canvas.height = 128;

    ctx.font = 'bold 48px "Noto Sans TC", "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillText(info.name, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1.6, 0.4, 1);
    sprite.position.set(Math.cos(angle) * orbitRadius, Math.sin(angle) * orbitRadius, 0);
    sprite.userData.pathKey = key;
    sprite.userData.orbitAngle = angle;
    sprite.userData.orbitRadius = orbitRadius;
    sprite.userData.strategy = strategy;
    sprite.userData.checkpoints = config.map((c: { slug: string }) => c.slug);
    scene.add(sprite);
    pathLabelSprites.push(sprite);
  });
}

function createPathFrame(): void {
  if (selectedPathFrame) {
    scene.remove(selectedPathFrame);
    selectedPathFrame.geometry.dispose();
    (selectedPathFrame.material as THREE.Material).dispose();
  }
  
  const frameGeo = new THREE.RingGeometry(0.85, 1.0, 6);
  const frameMat = new THREE.MeshBasicMaterial({
    color: 0xD4A843,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
  });
  selectedPathFrame = new THREE.Mesh(frameGeo, frameMat);
  selectedPathFrame.visible = false;
  scene.add(selectedPathFrame);
}

function showSelectedPathFrame(pathKey: string): void {
  const label = pathLabelSprites.find(s => s.userData.pathKey === pathKey);
  if (label && selectedPathFrame) {
    selectedPathFrame.visible = true;
    selectedPathFrame.position.copy(label.position);
    
    const mat = selectedPathFrame.material as THREE.MeshBasicMaterial;
    gsap.to(mat, { opacity: 0.8, duration: 0.5 });
    
    const pathColor = getPathColor(pathKey);
    mat.color.set(pathColor);
  }
}

function getPathColor(pathKey: string): number {
  const colors: Record<string, number> = {
    A: 0x7DD3FC,
    B: 0xFFD700,
    C: 0xD4A843,
    D: 0x00FF87,
    E: 0xE5FF00,
    F: 0xFF6B6B,
    G: 0xC0C0C0,
  };
  return colors[pathKey] || 0xD4A843;
}

function startPathLabelRotation(): void {
  pathLabelSprites.forEach((sprite) => {
    const startAngle = sprite.userData.orbitAngle;
    const radius = sprite.userData.orbitRadius;
    const angleObj = { angle: startAngle };

    gsap.to(angleObj, {
      angle: startAngle + Math.PI * 2,
      duration: 60,
      ease: 'none',
      repeat: -1,
      onUpdate: () => {
        sprite.position.x = Math.cos(angleObj.angle) * radius;
        sprite.position.y = Math.sin(angleObj.angle) * radius;
        
        if (currentPath && sprite.userData.pathKey === currentPath && selectedPathFrame) {
          selectedPathFrame.position.copy(sprite.position);
        }
      },
    });
  });
}

function startRenderLoop(): void {
  function loop(time: number) {
    animationId = requestAnimationFrame(loop);

    const delta = time - lastRender;
    if (delta < FRAME_INTERVAL) return;
    lastRender = time - (delta % FRAME_INTERVAL);

    animateCompassCore(time * 0.001);
    animateCenterText(time * 0.001);
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

function onMouseMove(e: MouseEvent): void {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  lastHoveredDir = null;
  directions.forEach((dir: { angle: number; color: string }) => {
    const x = Math.cos(dir.angle) * 1.2;
    const y = Math.sin(dir.angle) * 1.2;
    const dist = Math.sqrt(Math.pow(mouse.x * 5 - x, 2) + Math.pow(mouse.y * 5 - y, 2));
    if (dist < 0.5) {
      lastHoveredDir = dir;
    }
  });
  
  onCompassCoreHover(raycaster, camera, mouse, lastHoveredDir ? () => {
    if (lastHoveredDir) {
      const rayLength = 2;
      const endPos = new THREE.Vector3(
        Math.cos(lastHoveredDir.angle) * rayLength,
        Math.sin(lastHoveredDir.angle) * rayLength,
        0
      );
      createRayBurst(new THREE.Vector3(0, 0, 0), endPos, lastHoveredDir.color);
    }
  } : undefined);
  onPlanetHover(raycaster, camera, mouse);
}

function onClick(e: MouseEvent): void {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  
  onCompassCoreClick(raycaster, camera, mouse);
  onPlanetClick(raycaster, camera, mouse);
  onPathLabelClick(raycaster, camera, mouse);
}

function onPathLabelClick(raycaster: THREE.Raycaster, camera: THREE.Camera, mouse: THREE.Vector2): void {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(pathLabelSprites);
  
  if (intersects.length > 0) {
    const clickedSprite = intersects[0].object as THREE.Sprite;
    const pathKey = clickedSprite.userData.pathKey;
    
    window.dispatchEvent(new CustomEvent('path-label-click', {
      detail: { pathKey }
    }));
  }
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
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('click', onClick, true);
  window.removeEventListener('fate-wheel:direction-selected', onDirectionSelected);
  window.removeEventListener('fate-wheel:diagnosis-complete', onDiagnosisComplete);
  renderer.dispose();
  isInitialized = false;
}