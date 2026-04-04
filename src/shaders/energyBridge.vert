attribute float linePosition;
varying float vPosition;

void main() {
  vPosition = linePosition;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
