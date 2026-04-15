import * as THREE from 'three';
import gsap from 'gsap';
import type { DeviceTier } from './types';
import { stateManager } from './state-manager';
import { directions } from './config';

let coreGroup: THREE.Group;
let coreSphere: THREE.Mesh;
let centerTextSprite: THREE.Sprite;
let crystalMeshes: THREE.Mesh[] = [];
let crystalEdges: THREE.LineSegments[] = [];
let labelSprites: THREE.Sprite[] = [];
let outerRing: THREE.Mesh;
let tickRing: THREE.Mesh;
let glowRing: THREE.Mesh;

function createTextSprite(text: string, color: string, fontSize = 48): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = 512;
  canvas.height = 128;

  ctx.font = `bold ${fontSize * 1.2}px "Noto Sans TC", "Inter", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.4, 0.35, 1);
  return sprite;
}

function createCenterTextSprite(): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = 256;
  canvas.height = 256;

  const material = new THREE.SpriteMaterial({
    map: null,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.6, 0.6, 1);
  
  sprite.userData.canvas = canvas;
  sprite.userData.ctx = ctx;
  updateCenterTextGradient(ctx, canvas, 0);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  material.map = texture;
  sprite.userData.texture = texture;
  
  return sprite;
}

function updateCenterTextGradient(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number): void {
  const colors = [
    { h: 43, s: 75, l: 55 },   // 箔金 #D4A843
    { h: 45, s: 100, l: 50 },  // 金色 #FFD700
    { h: 66, s: 100, l: 50 },  // 熒黃 #E5FF00
    { h: 150, s: 100, l: 50 }, // 螢綠 #00FF87
    { h: 200, s: 80, l: 75 },  // 淡藍 #7DD3FC
  ];
  
  const t = (time % 12.5) / 12.5 * 5;
  const idx = Math.floor(t);
  const frac = t - idx;
  const idx2 = (idx + 1) % 5;
  
  const c1 = colors[idx];
  const c2 = colors[idx2];
  
  const h = c1.h + (c2.h - c1.h + (c2.h < c1.h ? 360 : 0)) * frac;
  const s = c1.s + (c2.s - c1.s) * frac;
  const l = c1.l + (c2.l - c1.l) * frac;
  
  const h2 = (h + 60) % 360;
  const l2 = Math.min(l + 20, 90);
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = `900 140px "Inter", "Noto Sans TC", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  
  ctx.fillStyle = `hsl(${h}, ${s}%, ${l}%)`;
  ctx.fillText('BR', canvas.width / 2, canvas.height / 2);

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle = `hsla(${h2}, ${s}%, ${l2}%, 0.3)`;
  ctx.fillText('BR', canvas.width / 2 - 2, canvas.height / 2 - 2);
}

export async function initCompassCore(scene: THREE.Scene, tier: DeviceTier): Promise<void> {
  coreGroup = new THREE.Group();

  const sphereGeo = new THREE.SphereGeometry(0.5, tier === 'high' ? 32 : 24, tier === 'high' ? 32 : 24);
  const sphereMat = new THREE.MeshPhysicalMaterial({
    color: 0xE8E4D9,
    emissive: 0xD4A843,
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.95,
    roughness: 0.15,
    metalness: 0.9,
  });
  coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
  coreGroup.add(coreSphere);

  centerTextSprite = createCenterTextSprite();
  centerTextSprite.position.z = 0.1;
  coreGroup.add(centerTextSprite);

  const crystalGeo = new THREE.OctahedronGeometry(0.18, tier === 'high' ? 2 : 1);
  const ringRadius = 1.2;

  directions.forEach((dir) => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(dir.color),
      emissive: new THREE.Color(dir.color),
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.15,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      thickness: 0.5,
      envMapIntensity: 1,
    });
    const crystal = new THREE.Mesh(crystalGeo, mat);
    crystal.position.set(Math.cos(dir.angle) * ringRadius, Math.sin(dir.angle) * ringRadius, 0);
    crystal.userData.direction = dir.id;
    crystal.userData.angle = dir.angle;
    coreGroup.add(crystal);
    crystalMeshes.push(crystal);

    const edgeGeo = new THREE.EdgesGeometry(crystalGeo, 15);
    const edgeMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(dir.color),
      linewidth: 2,
      transparent: true,
      opacity: 0.6,
    });
    const edge = new THREE.LineSegments(edgeGeo, edgeMat);
    edge.position.copy(crystal.position);
    edge.rotation.copy(crystal.rotation);
    edge.userData.direction = dir.id;
    coreGroup.add(edge);
    crystalEdges.push(edge);

    const labelSprite = createTextSprite(dir.name, dir.color);
    labelSprite.position.set(Math.cos(dir.angle) * (ringRadius + 0.6), Math.sin(dir.angle) * (ringRadius + 0.6), 0);
    labelSprite.userData.direction = dir.id;
    coreGroup.add(labelSprite);
    labelSprites.push(labelSprite);

    const rayGeo = new THREE.ConeGeometry(0.02, 0.3, 4);
    const rayMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(dir.color),
      transparent: true,
      opacity: 0.4,
    });
    const ray = new THREE.Mesh(rayGeo, rayMat);
    ray.position.set(Math.cos(dir.angle) * (ringRadius + 0.3), Math.sin(dir.angle) * (ringRadius + 0.3), 0);
    ray.rotation.z = dir.angle + Math.PI / 2;
    coreGroup.add(ray);
  });

  const tickRingGeo = new THREE.TorusGeometry(1.5, 0.01, 4, 64);
  const tickRingMat = new THREE.MeshBasicMaterial({ color: 0xD4A843, transparent: true, opacity: 0.3 });
  tickRing = new THREE.Mesh(tickRingGeo, tickRingMat);
  coreGroup.add(tickRing);

  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * Math.PI * 2;
    const isMain = i % 9 === 0;
    const tickGeo = new THREE.BoxGeometry(isMain ? 0.04 : 0.02, isMain ? 0.15 : 0.08, 0.01);
    const tickMat = new THREE.MeshBasicMaterial({
      color: 0xD4A843,
      transparent: true,
      opacity: isMain ? 0.6 : 0.3,
    });
    const tick = new THREE.Mesh(tickGeo, tickMat);
    tick.position.set(Math.cos(angle) * 1.55, Math.sin(angle) * 1.55, 0);
    tick.rotation.z = angle;
    coreGroup.add(tick);
  }

  const glowRingGeo = new THREE.TorusGeometry(0.9, 0.08, 8, 64);
  const glowRingMat = new THREE.MeshBasicMaterial({
    color: 0xD4A843,
    transparent: true,
    opacity: 0.15,
  });
  glowRing = new THREE.Mesh(glowRingGeo, glowRingMat);
  coreGroup.add(glowRing);

  const outerRingGeo = new THREE.TorusGeometry(2.0, 0.015, 8, 64);
  const outerRingMat = new THREE.MeshBasicMaterial({
    color: 0xD4A843,
    transparent: true,
    opacity: 0,
  });
  outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
  coreGroup.add(outerRing);

  scene.add(coreGroup);
  startBreathingAnimation();
}

export function animateCenterText(time: number): void {
  if (centerTextSprite && centerTextSprite.userData.canvas && centerTextSprite.userData.ctx) {
    const ctx = centerTextSprite.userData.ctx as CanvasRenderingContext2D;
    const canvas = centerTextSprite.userData.canvas as HTMLCanvasElement;
    updateCenterTextGradient(ctx, canvas, time);
    const texture = centerTextSprite.userData.texture as THREE.CanvasTexture;
    texture.needsUpdate = true;
  }
}

function startBreathingAnimation(): void {
  gsap.to(coreSphere.scale, {
    x: 1.08, y: 1.08, z: 1.08,
    duration: 2.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    onUpdate: () => {
      const s = coreSphere.scale.x;
      const mat = coreSphere.material as THREE.MeshPhysicalMaterial;
      mat.emissiveIntensity = 0.2 + (s - 1) * 4;
    },
  });

  gsap.to(centerTextSprite.scale, {
    x: 0.66, y: 0.66,
    duration: 2.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  gsap.to(centerTextSprite.material, {
    opacity: 0.85,
    duration: 2.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  crystalMeshes.forEach((crystal, i) => {
    gsap.to(crystal.rotation, {
      y: Math.PI * 2,
      duration: 8 + i * 3,
      ease: 'none',
      repeat: -1,
    });
    gsap.to(crystal.rotation, {
      x: Math.PI * 2,
      duration: 12 + i * 4,
      ease: 'none',
      repeat: -1,
    });
  });

  gsap.to(glowRing.scale, {
    x: 1.1, y: 1.1, z: 1.1,
    duration: 3,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  gsap.to(tickRing.rotation, {
    z: Math.PI * 2,
    duration: 60,
    ease: 'none',
    repeat: -1,
  });
}

export function animateCompassCore(time: number): void {
  if (coreGroup) {
    coreGroup.rotation.z = Math.sin(time * 0.1) * 0.02;
  }
}

let middleRingMesh: THREE.Mesh | null = null;

export function showMiddleRing(): void {
  if (!middleRingMesh && coreGroup) {
    const ringGeo = new THREE.TorusGeometry(2.0, 0.02, 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({ 
      color: 0xD4A843, 
      transparent: true, 
      opacity: 0 
    });
    middleRingMesh = new THREE.Mesh(ringGeo, ringMat);
    coreGroup.add(middleRingMesh);
  }
  if (middleRingMesh) {
    gsap.to((middleRingMesh.material as THREE.MeshBasicMaterial), {
      opacity: 0.6,
      duration: 1.2,
      ease: 'power2.inOut',
    });
  }
}

export function hideMiddleRing(): void {
  if (middleRingMesh) {
    gsap.to((middleRingMesh.material as THREE.MeshBasicMaterial), {
      opacity: 0,
      duration: 0.5,
    });
  }
}

export function onCompassCoreHover(
  raycaster: THREE.Raycaster,
  camera: THREE.Camera,
  mouse: THREE.Vector2,
  triggerRayEffect?: (dir: { angle: number; color: string }) => void
): void {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([...crystalMeshes, ...crystalEdges, ...labelSprites]);

  crystalMeshes.forEach((crystal, i) => {
    const isHovered = intersects.length > 0 && (intersects[0].object === crystal || intersects[0].object === crystalEdges[i]);
    const labelSprite = labelSprites.find((s) => s.userData.direction === crystal.userData.direction);
    const edge = crystalEdges.find((e) => e.userData.direction === crystal.userData.direction);
    const mat = crystal.material as THREE.MeshPhysicalMaterial;
    const edgeMat = edge?.material as THREE.LineBasicMaterial;
    
    if (isHovered) {
      gsap.to(crystal.scale, { x: 1.6, y: 1.6, z: 1.6, duration: 0.25, ease: 'power2.out' });
      gsap.to(mat, { emissiveIntensity: 1.0, opacity: 0.05, duration: 0.25 });
      if (edge) {
        gsap.to(edge.scale, { x: 1.6, y: 1.6, z: 1.6, duration: 0.25, ease: 'power2.out' });
        gsap.to(edgeMat, { opacity: 1.0, duration: 0.25 });
      }
      if (labelSprite) {
        gsap.to(labelSprite.scale, { x: 1.8, y: 0.45, duration: 0.25 });
      }
    } else {
      gsap.to(crystal.scale, { x: 1, y: 1, z: 1, duration: 0.3, ease: 'power2.out' });
      gsap.to(mat, { emissiveIntensity: 0.3, opacity: 0.15, duration: 0.3 });
      if (edge) {
        gsap.to(edge.scale, { x: 1, y: 1, z: 1, duration: 0.3, ease: 'power2.out' });
        gsap.to(edgeMat, { opacity: 0.6, duration: 0.3 });
      }
      if (labelSprite) {
        gsap.to(labelSprite.scale, { x: 1.4, y: 0.35, duration: 0.3 });
      }
    }
  });
}

export function onCompassCoreClick(
  raycaster: THREE.Raycaster,
  camera: THREE.Camera,
  mouse: THREE.Vector2
): void {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([...crystalMeshes, ...crystalEdges, ...labelSprites]);

  if (intersects.length > 0) {
    const obj = intersects[0].object as THREE.Mesh;
    let direction = obj.userData.direction as string;
    if (!direction && obj instanceof THREE.Sprite) {
      const sprite = obj as THREE.Sprite;
      direction = sprite.userData.direction as string;
    }
    
    if (direction) {
      stateManager.selectDirection(direction);
      gsap.to(coreSphere.scale, {
        x: 1.2, y: 1.2, z: 1.2,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
      });
    }
  }
}
