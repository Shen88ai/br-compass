import * as THREE from 'three';
import gsap from 'gsap';
import { phases } from './config';
import { stateManager } from './state-manager';

let planetsGroup: THREE.Group;
let planetMeshes: THREE.Mesh[] = [];
let isInitialized = false;

export function initPhasePlanets(scene: THREE.Scene): void {
  planetsGroup = new THREE.Group();
  const orbitRadius = 4.0;

  phases.forEach((phase, i) => {
    const angle = (i / phases.length) * Math.PI * 2;

    const geo = new THREE.SphereGeometry(phase.radius * 0.1, 16, 16);
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(phase.color),
      emissive: new THREE.Color(phase.color),
      emissiveIntensity: 0.2,
      roughness: 0.3,
      metalness: 0.5,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      Math.cos(angle) * orbitRadius,
      Math.sin(angle) * orbitRadius,
      0
    );
    mesh.userData.phaseId = phase.id;
    planetsGroup.add(mesh);
    planetMeshes.push(mesh);
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
    planetMeshes,
    { scale: 0, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      stagger: 0.2,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
    }
  );

  startOrbitAnimation();
}

function startOrbitAnimation(): void {
  const orbitRadius = 4.0;

  phases.forEach((phase, i) => {
    const mesh = planetMeshes[i];
    if (!mesh) return;

    const startAngle = (i / phases.length) * Math.PI * 2;
    const duration = phase.orbitPeriod;

    gsap.to({ angle: startAngle }, {
      angle: startAngle + Math.PI * 2,
      duration,
      ease: 'none',
      repeat: -1,
      onUpdate: function () {
        const a = (this.targets()[0] as any).angle;
        mesh.position.x = Math.cos(a) * orbitRadius;
        mesh.position.y = Math.sin(a) * orbitRadius;
      },
    });

    gsap.to(mesh.rotation, {
      y: Math.PI * 2,
      duration: duration * 0.3,
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

    gsap.to(planet.scale, { x: 2, y: 2, z: 2, duration: 0.3 });
    stateManager.setHoveredPlanet(phaseId);
  } else {
    planetMeshes.forEach((mesh) => {
      gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
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
    const phaseId = (intersects[0].object as THREE.Mesh).userData.phaseId as number;
    stateManager.navigateToPlanet(phaseId);
  }
}
