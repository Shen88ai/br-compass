import * as THREE from 'three';
import gsap from 'gsap';
import type { DeviceTier } from './types';
import { stateManager } from './state-manager';
import { directions } from './config';

let coreGroup: THREE.Group;
let coreSphere: THREE.Mesh;
let crystalMeshes: THREE.Mesh[] = [];

export async function initCompassCore(scene: THREE.Scene, tier: DeviceTier): Promise<void> {
  coreGroup = new THREE.Group();

  const sphereGeo = new THREE.SphereGeometry(0.5, tier === 'high' ? 32 : 16, tier === 'high' ? 32 : 16);
  const sphereMat = new THREE.MeshPhysicalMaterial({
    color: 0xE8E4D9,
    emissive: 0xD4A843,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.85,
    roughness: 0.2,
    metalness: 0.8,
  });
  coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
  coreGroup.add(coreSphere);

  const crystalGeo = new THREE.OctahedronGeometry(0.15, tier === 'high' ? 2 : 0);
  const ringRadius = 1.2;

  directions.forEach((dir) => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(dir.color),
      emissive: new THREE.Color(dir.color),
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.9,
      roughness: 0.3,
      metalness: 0.7,
    });
    const crystal = new THREE.Mesh(crystalGeo, mat);
    crystal.position.set(Math.cos(dir.angle) * ringRadius, Math.sin(dir.angle) * ringRadius, 0);
    crystal.userData.direction = dir.id;
    coreGroup.add(crystal);
    crystalMeshes.push(crystal);
  });

  scene.add(coreGroup);
  startBreathingAnimation();
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

  crystalMeshes.forEach((crystal, i) => {
    gsap.to(crystal.rotation, {
      y: Math.PI * 2,
      duration: 8 + i * 3,
      ease: 'none',
      repeat: -1,
    });
  });
}

export function animateCompassCore(time: number): void {
  if (coreGroup) {
    coreGroup.rotation.z = Math.sin(time * 0.1) * 0.02;
  }
}

export function onCompassCoreHover(
  raycaster: THREE.Raycaster,
  camera: THREE.Camera,
  mouse: THREE.Vector2
): void {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(crystalMeshes);

  crystalMeshes.forEach((crystal) => {
    if (intersects.length > 0 && intersects[0].object === crystal) {
      gsap.to(crystal.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.3 });
      (crystal.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.8;
    } else {
      gsap.to(crystal.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
      (crystal.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.3;
    }
  });
}

export function onCompassCoreClick(
  raycaster: THREE.Raycaster,
  camera: THREE.Camera,
  mouse: THREE.Vector2
): void {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(crystalMeshes);

  if (intersects.length > 0) {
    const direction = (intersects[0].object as THREE.Mesh).userData.direction as string;
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
