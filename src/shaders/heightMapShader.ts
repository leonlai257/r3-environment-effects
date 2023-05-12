const heightMapVertex = `
varying vec3 vPos;

void main() {
  vPos = position;
  gl_Position =  projectionMatrix * modelViewMatrix * vec4(vPos,1.0);
}
`

const heightMapFragment = `    
varying vec3 vPos;

uniform float limits;
uniform sampler2D colorTexture;
uniform float height;

void main() {
  float h = (vPos.z - (-limits))/(limits * height * 10.);
  vec4 diffuseColor = texture2D(colorTexture, vec2(vPos.z, h));
  gl_FragColor = vec4(diffuseColor.rgb, 1.0);
}
`

export { heightMapVertex, heightMapFragment }
