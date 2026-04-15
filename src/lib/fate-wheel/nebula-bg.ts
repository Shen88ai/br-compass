import * as THREE from 'three';
import gsap from 'gsap';
import type { DeviceTier } from './types';

let particlesMesh: THREE.Points;
let nebulaSprites: THREE.Sprite[] = [];
let sceneRef: THREE.Scene;

const STAR_COUNT = 800;

export function initNebulaBg(scene: THREE.Scene, _renderer: THREE.WebGLRenderer, _tier: DeviceTier): void {
  sceneRef = scene;

  const starPositions = new Float32Array(STAR_COUNT * 3);
  const starSizes = new Float32Array(STAR_COUNT);
  const starColors = new Float32Array(STAR_COUNT * 3);

  for (let i = 0; i < STAR_COUNT; i++) {
    const i3 = i * 3;
    const radius = 8 + Math.random() * 12;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i3 + 2] = radius * Math.cos(phi) * 0.3 - 5;

    starSizes[i] = 0.5 + Math.random() * 2;

    const colorChoice = Math.random();
    if (colorChoice < 0.4) {
      starColors[i3] = 0.9; starColors[i3 + 1] = 0.95; starColors[i3 + 2] = 1.0;
    } else if (colorChoice < 0.6) {
      starColors[i3] = 1.0; starColors[i3 + 1] = 0.85; starColors[i3 + 2] = 0.6;
    } else if (colorChoice < 0.8) {
      starColors[i3] = 0.85; starColors[i3 + 1] = 0.65; starColors[i3 + 2] = 0.2;
    } else {
      starColors[i3] = 0.1; starColors[i3 + 1] = 0.6; starColors[i3 + 2] = 0.7;
    }
  }

  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starVertShader = `
    attribute float size;
    attribute vec3 color;
    varying vec3 vColor;
    varying float vAlpha;
    uniform float uTime;
    
    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      float dist = length(position.xy);
      vAlpha = smoothstep(15.0, 5.0, dist) * (0.5 + 0.5 * sin(uTime * 2.0 + dist * 0.5));
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const starFragShader = `
    varying vec3 vColor;
    varying float vAlpha;
    
    void main() {
      float dist = length(gl_PointCoord - 0.5);
      if (dist > 0.5) discard;
      float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
      gl_FragColor = vec4(vColor, alpha);
    }
  `;

  const starMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: starVertShader,
    fragmentShader: starFragShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  particlesMesh = new THREE.Points(starGeo, starMat);
  particlesMesh.position.z = -5;
  scene.add(particlesMesh);

  createNebulaClouds();
  createAmbientGlow();
}

function createNebulaClouds(): void {
  const cloudConfigs = [
    { x: -8, y: 3, z: -8, scale: 6, color: 0x3d1a5c, opacity: 0.15 },
    { x: 6, y: -2, z: -6, scale: 5, color: 0xd4a843, opacity: 0.12 },
    { x: -4, y: -4, z: -7, scale: 4, color: 0x1a5c4d, opacity: 0.1 },
    { x: 8, y: 4, z: -9, scale: 7, color: 0x5c3d1a, opacity: 0.08 },
    { x: 0, y: 6, z: -8, scale: 5, color: 0x1a3d5c, opacity: 0.12 },
    { x: -6, y: -2, z: -10, scale: 4, color: 0x5c1a3d, opacity: 0.1 },
    { x: 3, y: 5, z: -7, scale: 3, color: 0xd4a843, opacity: 0.15 },
    { x: -2, y: 4, z: -6, scale: 3.5, color: 0x3d5c1a, opacity: 0.1 },
  ];

  cloudConfigs.forEach((cfg, i) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, `rgba(255, 255, 255, 1)`);
    gradient.addColorStop(0.3, `rgba(255, 255, 255, 0.5)`);
    gradient.addColorStop(0.6, `rgba(255, 255, 255, 0.15)`);
    gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      color: cfg.color,
      transparent: true,
      opacity: cfg.opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const sprite = new THREE.Sprite(material);
    sprite.position.set(cfg.x, cfg.y, cfg.z);
    sprite.scale.set(cfg.scale, cfg.scale, 1);
    sprite.userData.baseOpacity = cfg.opacity;
    sprite.userData.phase = i * 0.5;
    nebulaSprites.push(sprite);
    sceneRef.add(sprite);

    gsap.to(sprite.scale, {
      x: cfg.scale * 1.2,
      y: cfg.scale * 1.2,
      z: 1,
      duration: 3 + i * 0.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  });
}

function createAmbientGlow(): void {
  const glowConfigs = [
    { radius: 3, color: 0xd4a843, opacity: 0.08, y: 0 },
    { radius: 2, color: 0xffffff, opacity: 0.05, y: 0.5 },
    { radius: 4, color: 0x3d5c1a, opacity: 0.06, y: -0.5 },
  ];

  glowConfigs.forEach((cfg, i) => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      color: cfg.color,
      transparent: true,
      opacity: cfg.opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const glow = new THREE.Sprite(material);
    glow.position.set(0, cfg.y, 0.5);
    glow.scale.set(cfg.radius * 2, cfg.radius * 2, 1);
    sceneRef.add(glow);
  });
}

export function animateNebulaBg(time: number): void {
  if (particlesMesh) {
    (particlesMesh.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
    particlesMesh.rotation.z = time * 0.01;
  }

  nebulaSprites.forEach((sprite) => {
    const phase = sprite.userData.phase;
    const baseOpacity = sprite.userData.baseOpacity;
    const newOpacity = baseOpacity * (0.7 + 0.3 * Math.sin(time * 0.5 + phase));
    (sprite.material as THREE.SpriteMaterial).opacity = newOpacity;
  });
}
