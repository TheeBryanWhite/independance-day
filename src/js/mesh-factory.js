import { BoxGeometry, BufferAttribute, BufferGeometry, Mesh, PlaneGeometry, Vector3 } from 'three';

import * as Colors from './colors';
import * as Materials from './materials';

function MeshFactory(geometry, material){
  let buffer = new BufferGeometry().fromGeometry(geometry);
  setupAttributes(buffer);

  let mesh = new Mesh(buffer, material);

  return mesh;
}

function setupAttributes(geometry){
  var vectors = [
    new Vector3( 1, 0, 0 ),
    new Vector3( 0, 1, 0 ),
    new Vector3( 0, 0, 1 )
  ];
  var position = geometry.attributes.position;
  var centers = new Float32Array(position.count*3);

  for (var i=0, l=position.count; i<l; i++ ) {
    vectors[i%3].toArray(centers, i*3);
  }

  geometry.addAttribute('center', new BufferAttribute(centers, 3));
}

function GroundGeometry(width=16, depth=16, height=2, gridX=16, gridY=16, gridZ=4){
  let groundGeometry = new PlaneGeometry(width, depth, gridX, gridY);
  groundGeometry.vertices = groundGeometry.vertices.map(v => {
    let r = Math.round(Math.random()*gridZ)/gridZ;
    let z = r*height * Math.abs(v.x)/width;

    return new Vector3(v.x, v.y, z);
  });

  return groundGeometry;
}

export function Box({color=Colors.GREEN, fog=0.0, width=1, depth=1, height=1} = {}){
    let material = Materials.ArcadeRetro({color, fog});
    let geometry = new BoxGeometry(width, depth, height);

    return MeshFactory(geometry, material);
}

export function Ground({color=Colors.GREEN, fog=0.0, width=16, depth=16, height=2, gridX=16, gridY=16, gridZ=4} = {}){
    let material = Materials.ArcadeRetro({color, fog});
    let geometry = GroundGeometry(width, depth, height, gridX, gridY, gridZ);

    return MeshFactory(geometry, material);
}
