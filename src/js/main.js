import * as THREE from 'three'

let EffectComposer = require('three-effectcomposer')(THREE)


import { beep, tap, getWaveform } from './tone-source'
let work = require('webworkify')
let metronome = work(require('./metronome.worker'))
let beat = 0;

let workerMetronome = true;

if(workerMetronome){
  metronome.addEventListener('message', onMetronomeTick);
  metronome.postMessage('start');
}


import sceneFactory from './scene-factory';

//Instantiate a renderer and append it to the body
let renderer = new THREE.WebGLRenderer({ antialias: true });
let canvas = renderer.domElement;

window.document.body.appendChild(canvas);

//Check how big that render canvas is and the set width, height
let bounds = canvas.getBoundingClientRect();
let width = Math.ceil(bounds.width);
let height = Math.ceil(bounds.height);
renderer.setSize(width, height);

//Create our scene
let scene = sceneFactory();

//Create a new camera and position it to face the box in the scene
let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000 );
camera.position.z = 0.5;
camera.position.y = -4;
camera.rotateX(Math.PI/2);

var canvasCtx = canvas.getContext('webgl');
canvasCtx.strokeStyle = 'rgb(250, 250, 250)';
canvasCtx.lineWidth = 2;

//Render the scene on each animation frame, making any scene or camera updates
function render() {
	window.requestAnimationFrame(render);
  renderer.render(scene, camera);
  scene.onFrame();
}
render();

// let composer = new EffectComposer(renderer);
// let renderPass = new EffectComposer.RenderPass(scene, camera);
// renderPass.renderToScreen = true;
// composer.addPass(renderPass);

let toneIndex = 0;
function onMetronomeTick(){
  let tones = [ 261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.26 ];


  if(beat%4 === 0){
    beep(tones[toneIndex] * 0.5);
    toneIndex = (toneIndex+1) % tones.length;
  }


  beat = (beat+1)%16;
}
