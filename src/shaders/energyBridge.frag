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
