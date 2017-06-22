import * as Colors from './colors'
import * as THREE from 'three'
import { Box, Ground } from './mesh-factory'
import { getWaveform, getFrequencies } from './tone-source';

//This function uses the methods from mesh-factory.js to generate/animate the scene
export default function sceneFactory(){
  let scene = new THREE.Scene();

  let barCount = 16;
  let barSize = 0.1;
  let barHeight = barSize * 20.0;
  let audioBars = [];
  for(var i=0; i<barCount; i++){
    let bar = Box({
      color: Colors.BLUE,
      fog: 0.0,
      width: barSize,
      depth: barSize,
      height: barHeight
    });

    bar.position.x = ((i/(barCount-1)) * 3.0) - 1.5;
    bar.position.z = barHeight * 0.5;
    audioBars.push(bar);
    scene.add(bar);
  }

  let box = Box({ color: Colors.RED, fog: 0.0 });
  box.position.z = 1;
  scene.add(box);

  let ground = Ground({ color: Colors.AMBER, fog: 1.0 });
  scene.add(ground);

  let now = Date.now();

  let peak = 0.0;
  let peakDecay = 0.1;

  //Quick little function I'll call from main.js to animate stuff on each frame
  scene.onFrame = () => {
    box.geometry.rotateZ(0.05);
    box.geometry.rotateY(0.033);

    let waveform = getWaveform();
    let frequencies = getFrequencies();

    for(i=0; i<frequencies.length; i++){
      let f = frequencies[i] / 255;

      audioBars[i].scale.z = f;
      audioBars[i].position.z = barHeight * f * 0.5;
    }

    let wavePeak = Math.max.apply(null, waveform);
    peak = Math.max(wavePeak, peak-peakDecay);
    box.material.uniforms.peak.value = 1.0 + 0.5 * peak;
  }

  return scene;
}
