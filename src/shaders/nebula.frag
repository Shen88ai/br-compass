uniform float uTime;
uniform vec2 uResolution;

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
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 p = uv * 3.0;

  float n1 = fbm(p + uTime * 0.02);
  float n2 = fbm(p * 1.5 - uTime * 0.015);

  vec3 deepSpace = vec3(0.012, 0.012, 0.031);
  vec3 goldNebula = vec3(0.83, 0.66, 0.26);
  vec3 greenNebula = vec3(0.0, 1.0, 0.53);

  vec3 color = deepSpace;
  color = mix(color, goldNebula, n1 * 0.15);
  color = mix(color, greenNebula, n2 * 0.08);

  float stars = step(0.998, hash(gl_FragCoord.xy * 0.1 + uTime * 0.001));
  color += stars * 0.5;

  gl_FragColor = vec4(color, 1.0);
}
