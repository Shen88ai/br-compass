import * as THREE from 'three';
import gsap from 'gsap';

let bridgesGroup: THREE.Group;
let bridgeLines: THREE.Line[] = [];

const bridgeVertexShader = `
  attribute float linePosition;
  varying float vPosition;
  void main() {
    vPosition = linePosition;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const bridgeFragmentShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uColorStart;
  uniform vec3 uColorEnd;
  varying float vPosition;

  void main() {
    float pulse = smoothstep(0.0, 0.08, vPosition - uProgress) *
                  smoothstep(0.15, 0.08, vPosition - uProgress);
    vec3 color = mix(uColorStart, uColorEnd, pulse);
    float alpha = pulse * 0.8;
    gl_FragColor = vec4(color, alpha);
  }
`;

export function initEnergyBridges(scene: THREE.Scene): void {
  bridgesGroup = new THREE.Group();
  scene.add(bridgesGroup);
}

export function createBridge(
  start: THREE.Vector3,
  end: THREE.Vector3,
  colorStart: string,
  colorEnd: string
): THREE.Line {
  const points = [start, end];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const linePositionAttr = new THREE.Float32BufferAttribute([0, 1], 1);
  geometry.setAttribute('linePosition', linePositionAttr);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uColorStart: { value: new THREE.Color(colorStart) },
      uColorEnd: { value: new THREE.Color(colorEnd) },
    },
    vertexShader: bridgeVertexShader,
    fragmentShader: bridgeFragmentShader,
    transparent: true,
    depthWrite: false,
  });

  const line = new THREE.Line(geometry, material);
  bridgesGroup.add(line);
  bridgeLines.push(line);

  return line;
}

export function animateBridgeProgress(line: THREE.Line, duration: number = 1.0): void {
  const mat = line.material as THREE.ShaderMaterial;
  mat.uniforms.uProgress.value = 0;
  gsap.to(mat.uniforms.uProgress, {
    value: 1,
    duration,
    ease: 'power2.inOut',
  });
}

export function activateAllBridges(): void {
  bridgeLines.forEach((line, i) => {
    setTimeout(() => animateBridgeProgress(line), i * 150);
  });
}

export function clearBridges(): void {
  bridgeLines.forEach((line) => {
    bridgesGroup.remove(line);
    line.geometry.dispose();
    (line.material as THREE.ShaderMaterial).dispose();
  });
  bridgeLines = [];
}
