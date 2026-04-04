uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uEmissiveIntensity;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  float n = fbm(uv * 4.0 + uTime * 0.3);
  vec3 color = mix(uColor1, uColor2, n);

  vec3 viewDir = normalize(vViewPosition);
  vec3 normal = normalize(vNormal);
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

  color += fresnel * uEmissiveIntensity * 0.4;
  float alpha = 0.85 + fresnel * 0.15;

  gl_FragColor = vec4(color, alpha);
}
