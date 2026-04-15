import * as THREE from 'three';
import gsap from 'gsap';
import { phases } from './config';
import { stateManager } from './state-manager';
import { pathInfo } from '../../data/path-mapping';

let planetsGroup: THREE.Group;
let planetMeshes: THREE.Mesh[] = [];
let orbitLines: THREE.Line[] = [];
let labelSprites: THREE.Sprite[] = [];
let pathLabelGroup: THREE.Group;
let pathLabelSprites: THREE.Sprite[] = [];
let selectedPathFrame: THREE.Mesh;
let isInitialized = false;
let currentPath: string | null = null;

export function initPhasePlanets(scene: THREE.Scene): void {
  planetsGroup = new THREE.Group();
  const orbitRadius = 3.5;

  phases.forEach((phase, i) => {
    const angle = (i / phases.length) * Math.PI * 2 - Math.PI / 2;
    const color = new THREE.Color(phase.color);

    const orbitGeo = new THREE.BufferGeometry();
    const orbitPoints: THREE.Vector3[] = [];
    for (let j = 0; j <= 64; j++) {
      const a = (j / 64) * Math.PI * 2;
      orbitPoints.push(new THREE.Vector3(Math.cos(a) * orbitRadius, Math.sin(a) * orbitRadius, 0));
    }
    orbitGeo.setFromPoints(orbitPoints);
    const orbitMat = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.2,
    });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    planetsGroup.add(orbitLine);
    orbitLines.push(orbitLine);

    const planetGeo = new THREE.IcosahedronGeometry(0.25, 1);
    const planetMat = new THREE.MeshPhysicalMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: 0.9,
    });
    const planet = new THREE.Mesh(planetGeo, planetMat);
    planet.position.set(Math.cos(angle) * orbitRadius, Math.sin(angle) * orbitRadius, 0);
    planet.userData.phaseId = phase.id;
    planet.userData.orbitAngle = angle;
    planet.userData.orbitRadius = orbitRadius;
    planet.userData.orbitSpeed = 0.3 + (phases.length - i) * 0.1;
    planetsGroup.add(planet);
    planetMeshes.push(planet);

    const ringGeo = new THREE.RingGeometry(0.28, 0.32, 6);
    const ringMat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(planet.position);
    ring.rotation.x = Math.PI / 2;
    planetsGroup.add(ring);
  });

  planetsGroup.visible = false;
  scene.add(planetsGroup);

  window.addEventListener('fate-wheel:diagnosis-complete', () => {
    activatePlanets();
  });
}

function activatePlanets(): void {
  if (isInitialized) return;
  isInitialized = true;

  planetsGroup.visible = true;

  gsap.fromTo(
    planetsGroup.scale,
    { x: 0.5, y: 0.5, z: 0.5 },
    { x: 1, y: 1, z: 1, duration: 1, ease: 'back.out(1.7)' }
  );

  gsap.fromTo(
    orbitLines,
    { 'material.opacity': 0 },
    { duration: 1.5, ease: 'power2.out', 'material.opacity': 0.3 }
  );

  planetMeshes.forEach((planet, i) => {
    gsap.fromTo(
      planet.scale,
      { x: 0, y: 0, z: 0 },
      {
        x: 1, y: 1, z: 1,
        duration: 0.8,
        delay: 0.3 + i * 0.2,
        ease: 'elastic.out(1, 0.5)',
      }
    );
  });

  startOrbitAnimation();
}

function startOrbitAnimation(): void {
  planetMeshes.forEach((planet, i) => {
    const startAngle = planet.userData.orbitAngle;
    const radius = planet.userData.orbitRadius;
    const speed = planet.userData.orbitSpeed;
    const angleObj = { angle: startAngle };

    gsap.to(angleObj, {
      angle: startAngle + Math.PI * 2,
      duration: 20 / speed,
      ease: 'none',
      repeat: -1,
      onUpdate: () => {
        planet.position.x = Math.cos(angleObj.angle) * radius;
        planet.position.y = Math.sin(angleObj.angle) * radius;
        
        const children = planetsGroup.children;
        const ringIndex = phases.length + i;
        if (children[ringIndex]) {
          children[ringIndex].position.copy(planet.position);
        }
      },
    });

    gsap.to(planet.rotation, {
      y: Math.PI * 2,
      duration: 5 + i * 2,
      ease: 'none',
      repeat: -1,
    });
  });
}

export function onPlanetHover(
  raycaster: THREE.Raycaster,
  camera: THREE.Camera,
  mouse: THREE.Vector2
): void {
  if (!isInitialized) return;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planetMeshes);

  if (intersects.length > 0) {
    const planet = intersects[0].object as THREE.Mesh;
    const phaseId = planet.userData.phaseId as number;

    gsap.to(planet.scale, { x: 1.8, y: 1.8, z: 1.8, duration: 0.3 });
    gsap.to(planet.material, { emissiveIntensity: 1, duration: 0.3 });
    stateManager.setHoveredPlanet(phaseId);
  } else {
    planetMeshes.forEach((mesh) => {
      gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
      gsap.to(mesh.material, { emissiveIntensity: 0.5, duration: 0.3 });
    });
    stateManager.setHoveredPlanet(null);
  }
}

export function onPlanetClick(
  raycaster: THREE.Raycaster,
  camera: THREE.Camera,
  mouse: THREE.Vector2
): void {
  if (!isInitialized) return;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planetMeshes);

  if (intersects.length > 0) {
    const planet = intersects[0].object as THREE.Mesh;
    const phaseId = planet.userData.phaseId as number;

    gsap.to(planet.scale, {
      x: 2.5, y: 2.5, z: 2.5,
      duration: 0.4,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
    });

    stateManager.navigateToPlanet(phaseId);
  }
}

export function showPlanets(): void {
  activatePlanets();
}

export function hidePlanets(): void {
  if (planetsGroup) {
    planetsGroup.visible = false;
  }
}
