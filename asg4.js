import * as THREE from 'three';
let canvas, renderer, fov, aspect, near, far, camera, scene, boxWidth, boxDepth, boxHeight, geometry, material,cube;
function main() {
  canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer({canvas});
  fov = 75;
  aspect = 2;  // the canvas default
  near = 0.1;
  far = 5;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;
  scene = new THREE.Scene();
  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }
  boxWidth = 1;
  boxHeight = 1;
  boxDepth = 1;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  material = new THREE.MeshPhongMaterial({color: 0x44aa88});  // greenish blue

  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function render(time) {
    time *= 0.001;  // convert time to seconds
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
    cube.rotation.x = time;
    cube.rotation.y = time;
   
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

main();

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }