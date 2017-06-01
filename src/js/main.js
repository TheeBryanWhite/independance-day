import glsl from 'glslify';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, ShaderMaterial, MeshBasicMaterial, Mesh, PlaneGeometry, Vector2, Vector3 } from 'three';

let scanlines = glsl`
uniform vec2 u_resolution;
uniform sampler2D map;

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution;
  vec4 color = vec4(0.0, st.y, 0.0, 1.0);
  float line = gl_FragCoord.y - (2.0 * floor(gl_FragCoord.y/2.0));

  gl_FragColor = color * line;
}
`;

let renderer = new WebGLRenderer({ antialias: true });
let canvas = renderer.domElement;
document.body.appendChild(canvas);
let bounds = canvas.getBoundingClientRect();

let width = Math.ceil(bounds.width);
let height = Math.ceil(bounds.height);

let scene = new Scene();
renderer.setSize(width, height);

let geometry = new BoxGeometry( 1, 1, 1 );
let groundMaterial = new MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
let m = new ShaderMaterial({ fragmentShader: scanlines });
m.uniforms.u_resolution = { type: 'v2', value: new Vector2(width, height) };


let groundWidth = 16;
let groundDepth = 16;
let groundGeometry = new PlaneGeometry(groundWidth, groundDepth, 16, 16);
let ground = new Mesh(groundGeometry, m);
ground.rotation.x = 0.1;
ground.rotation.z = 0.04;
ground.geometry.vertices = ground.geometry.vertices.map(v => new Vector3(v.x, v.y, Math.random() * 2 * Math.abs(v.x)/groundWidth))
scene.add(ground);


let camera = new PerspectiveCamera(75, width / height, 0.1, 1000 );
camera.position.z = 0.5;
camera.position.y = -4;
camera.rotateX(Math.PI/2);

function render() {
	window.requestAnimationFrame( render );
  ground.rotateOnAxis(new Vector3(0, 0, 1), 0.001);
	renderer.render( scene, camera );
}
render();
