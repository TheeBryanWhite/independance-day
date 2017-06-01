import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, PlaneGeometry } from 'three';

let width = window.innerWidth;
let height = window.innerHeight;
let scene = new Scene();

let renderer = new WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild( renderer.domElement );

let geometry = new BoxGeometry( 1, 1, 1 );
let material = new MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
let cube = new Mesh( geometry, material );
scene.add( cube );

let groundGeometry = new PlaneGeometry(18, 5, 16, 16);
let ground = new Mesh(groundGeometry, material);
ground.rotation.x = 0.5;
scene.add(ground);


let camera = new PerspectiveCamera(75, width / height, 0.1, 1000 );
camera.position.z = 0.5;
camera.position.y = -4;
camera.rotateX(Math.PI/2);

function render() {
	window.requestAnimationFrame( render );
  cube.rotation.set(cube.rotation.x + 0.01, cube.rotation.y + 0.01, cube.rotation.z + 0.01);
	renderer.render( scene, camera );
}
render();
