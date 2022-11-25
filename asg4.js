import * as THREE from 'three';
// import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from "/Room/three.js-master/examples/jsm/loaders/OBJLoader.js";
import {MTLLoader} from '/Room/three.js-master/examples/jsm/loaders/MTLLoader.js';
let canvas, renderer, fov, aspect, near, far, camera, scene, boxWidth;
let boxDepth, boxHeight, geometry, material,cube;
let background;
let controls;
let skyMaterials, SkyMaterial, cube1;
let skyboxGeometry;
let floor_cube, wall_left, wall_right, wall_back, wall_top;
let window_frame, window_frame_horizontal_1, window_frame_horizontal_2;
let bedside_table_left, bedside_table_right;
let painting;

function main() {
  canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer({canvas, alpha: true,});

  fov = 75;
  aspect = 2;  // the canvas default
  near = 0.1;
  far = 1000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update();
  camera.position.z = 8;

  scene = new THREE.Scene();
  {
    let color = 0xFFFFFF;
    let intensity = 1;
    let light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
    // adding it to see the roof better
    color = 0xFFFFFF;
    intensity = 0.4;
    light = new THREE.AmbientLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  {
    const loader = new THREE.TextureLoader();
    // const texture = loader.load([
    //   'wall.jpeg',
    //   'wall.jpeg',
    //   'wall.jpeg',
    //   'wall.jpeg',
    //   'wall.jpeg',
    //   'wall.jpeg'
    // ]);
    // scene.background = texture;
    const texture = loader.load(
        "belfast_farmhouse_4k.jpg",
        () => {
          const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
          rt.fromEquirectangularTexture(renderer, texture);
          scene.background = rt.texture;
        });
  }


  boxWidth = 1;
  boxHeight = 1;
  boxDepth = 1;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  material = new THREE.MeshPhongMaterial({color: 0x44aa88});  // greenish blue
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // making the floor cube
  boxWidth = 45;
  boxHeight = 0.5;
  boxDepth = 45;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  let loader = new THREE.TextureLoader();
  let texture = loader.load('wall.jpeg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  // this could also be MeshBasicMaterial
  material = new THREE.MeshPhongMaterial({map: texture,});
//   material = new THREE.MeshPhongMaterial({color: 0x44aa88});
  floor_cube = new THREE.Mesh(geometry, material);
  floor_cube.position.x = 2;
  floor_cube.position.z = -40;
  floor_cube.position.y = -12;
  scene.add(floor_cube);

  // making the first wall
  boxWidth = 0.5;
  boxHeight = 45;
  boxDepth = 45;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  loader = new THREE.TextureLoader();
  texture = loader.load('wall_tile2.jpeg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  material = new THREE.MeshPhongMaterial({map: texture,});
  wall_left = new THREE.Mesh(geometry, material);
  wall_left.position.x = -20;
  wall_left.position.z = -40;
  wall_left.position.y = 10;
  scene.add(wall_left);

  // making the right wall
  boxWidth = 0.5;
  boxHeight = 45;
  boxDepth = 45;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  loader = new THREE.TextureLoader();
  texture = loader.load('wall_tile.jpeg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  material = new THREE.MeshPhongMaterial({map: texture,});
  wall_right = new THREE.Mesh(geometry, material);
  wall_right.position.x = 24.5;
  wall_right.position.z = -40;
  wall_right.position.y = 10;
  scene.add(wall_right);

  // making the back wall: we want this wall to be a window in the future
  boxWidth = 45;
  boxHeight = 45;
  boxDepth = 0.5;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  material = new THREE.MeshPhongMaterial({color: 0x44aa88});
  material = new THREE.MeshPhysicalMaterial({  
    roughness: 0.5,  
    transmission: 1,  
    thickness: 4,
  });
  wall_back = new THREE.Mesh(geometry, material);
  wall_back.position.x = 2;
  wall_back.position.z = -62;
  wall_back.position.y = 9;
  scene.add(wall_back);

  // making the window frame
  // vertical window frame
  boxWidth = 0.4;
  boxHeight = 43;
  boxDepth = 0.4;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  material = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
  window_frame = new THREE.Mesh(geometry, material);
  window_frame.position.x = 4.5;
  window_frame.position.z = -60;
  window_frame.position.y = 9;
  scene.add(window_frame);

  // horizontal window frame 1
  boxWidth = 43;
  boxHeight = 0.4;
  boxDepth = 0.4;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  material = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
  window_frame_horizontal_1 = new THREE.Mesh(geometry, material);
  window_frame_horizontal_1.position.x = 2;
  window_frame_horizontal_1.position.z = -60;
  window_frame_horizontal_1.position.y = 15;
  scene.add(window_frame_horizontal_1);

  // horizontal window frame 2
  boxWidth = 43;
  boxHeight = 0.4;
  boxDepth = 0.4;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  material = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
  window_frame_horizontal_2 = new THREE.Mesh(geometry, material);
  window_frame_horizontal_2.position.x = 2;
  window_frame_horizontal_2.position.z = -60;
  window_frame_horizontal_2.position.y = 2;
  scene.add(window_frame_horizontal_2);

  // making the top wall
  boxWidth = 45;
  boxHeight = 0.5;
  boxDepth = 45;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  loader = new THREE.TextureLoader();
  texture = loader.load('wall_tile2.jpeg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  material = new THREE.MeshPhongMaterial({map: texture,});
  wall_top = new THREE.Mesh(geometry, material);
  wall_top.position.x = 2;
  wall_top.position.z = -40;
  wall_top.position.y = 32;
  scene.add(wall_top);

   // making the painting
   boxWidth = 0.6;
   boxHeight = 12;
   boxDepth = 12;
   geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
   loader = new THREE.TextureLoader();
   const materials = [
    new THREE.MeshBasicMaterial({map: loader.load('wood2.jpeg')}),
    new THREE.MeshBasicMaterial({map: loader.load('wolf.jpg')}),
    new THREE.MeshBasicMaterial({map: loader.load('wood2.jpeg')}),
    new THREE.MeshBasicMaterial({map: loader.load('wood2.jpeg')}),
    new THREE.MeshBasicMaterial({map: loader.load('wood2.jpeg')}),
    new THREE.MeshBasicMaterial({map: loader.load('wood2.jpeg')}),
  ];
  painting = new THREE.Mesh(geometry, materials);
  painting.position.x = 23;
  painting.position.z = -41;
  painting.position.y = 4;
  scene.add(painting);

  // Making the bed side tables
  let radiusTop = 2;  // ui: radiusTop
  let radiusBottom = 2;  // ui: radiusBottom
  let height = 4;  // ui: height
  let radialSegments = 8;  // ui: radialSegments
  geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
  material = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
  bedside_table_left = new THREE.Mesh(geometry, material);
  bedside_table_left.position.x = 18; // this is left-right
  bedside_table_left.position.y = -9; // this is the depth
  bedside_table_left.position.z = -53; // this is front-back
  scene.add(bedside_table_left);

  radiusTop = 2;  // ui: radiusTop
  radiusBottom = 2;  // ui: radiusBottom
  height = 4;  // ui: height
  radialSegments = 8;  // ui: radialSegments
  geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
  material = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
  bedside_table_right = new THREE.Mesh(geometry, material);
  bedside_table_right.position.x = 18; // this is left-right
  bedside_table_right.position.y = -9; // this is the depth
  bedside_table_right.position.z = -28; // this is front-back
  scene.add(bedside_table_right);

  // making the bed
  const objLoader = new OBJLoader();
  const mtlLoader = new MTLLoader();
  mtlLoader.load('enlarged-bed-obj/enlarged-bed.mtl', (mtl) => {
    mtl.preload();
   for (const material of Object.values(mtl.materials)) {
     material.side = THREE.DoubleSide;
   }
    objLoader.setMaterials(mtl);
    objLoader.load('enlarged-bed-obj/enlarged-bed.obj', (root) => {
      root.position.y = -14;
      root.position.x = 24;
      root.position.z = -42;
      scene.add(root);
      const box = new THREE.Box3().setFromObject(root);
  const boxSize = box.getSize(new THREE.Vector3()).length();
  const boxCenter = box.getCenter(new THREE.Vector3());
  console.log(boxSize);
  console.log(boxCenter);
    });
  });


  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function render(time) {
    // time *= 0.001;  // convert time to seconds
    if (resizeRendererToDisplaySize(renderer)) {
        canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    // cube.rotation.x = time;
    // cube.rotation.y = time;

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