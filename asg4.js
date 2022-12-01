import * as THREE from 'three';
// import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from "/Room/three.js-master/examples/jsm/loaders/OBJLoader.js";
import {MTLLoader} from '/Room/three.js-master/examples/jsm/loaders/MTLLoader.js';
import {RectAreaLightUniformsLib} from '/Room/three.js-master/examples/jsm/lights/RectAreaLightUniformsLib.js';
import {RectAreaLightHelper} from '/Room/three.js-master/examples/jsm/helpers/RectAreaLightHelper.js';
import {GUI} from '/Room/three.js-master/examples/jsm/libs/lil-gui.module.min.js';
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
let chandelier1, chandelier2, chandelier3;
// the chandelier will have 4 bulbs
let bulb1, bulb2, bulb3, bulb4, bulb5, bulb6, bulb7, bulb8, detail;
let objLoader, mtlLoader;
let table, table2, table3, table4;
let bed_panel;
let tube_light1, tube_light2, fireplace_mesh;
let color, intensity, width, height;
let bulb_light_1, bulb_light_2, bulb_light_3, bulb_light_4;
let fireplace_glow;
let table_point_light_1, table_point_light_2, table_point_light_3, table_point_light_4;
let pickPosition = {x: 0, y: 0};
let render_to_texture_cube, render_cube1;
class PickObject {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }
  pick(normalizedPosition, scene, camera, time) {
    if (this.pickedObject) {
      this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
      this.pickedObject = undefined;
    }
    this.raycaster.setFromCamera(normalizedPosition, camera);
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      // pick the first object. It's the closest one
      this.pickedObject = intersectedObjects[0].object;
      // save its color
      this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
      // set its emissive color to flashing red/yellow
      this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
    }
  }
}

function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width  / rect.width,
    y: (event.clientY - rect.top ) * canvas.height / rect.height,
  };
}

function setPickPosition(event) {
  let position = getCanvasRelativePosition(event);
  pickPosition.x = (position.x / canvas.width ) *  2 - 1;
  pickPosition.y = (position.y / canvas.height) * -2 + 1;
}

function clearPickPosition(){
  pickPosition.x = -100000;
  pickPosition.y = -100000;
}

function eventListenerFunction(){
  // window.addEventListener('mousemove', setPickPosition);
  // window.addEventListener('mouseout', clearPickPosition);
  // window.addEventListener('mouseleave', clearPickPosition);

  // window.addEventListener('touchstart', (event) => {
  //   // prevent the window from scrolling
  //   event.preventDefault();
  //   setPickPosition(event.touches[0]);
  // }, {passive: false});

  // window.addEventListener('touchmove', (event) => {
  //   setPickPosition(event.touches[0]);
  // });

  // window.addEventListener('touchend', clearPickPosition);
}

let render_Camera, render_Scene, render_Far, render_Near, render_Aspect, render_Fov, renderTarget;
function main() {
  canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer({canvas, alpha: true,});
  renderer.physicallyCorrectLights = true;
  RectAreaLightUniformsLib.init();
  fov = 75;
  aspect = 2;  // the canvas default
  near = 0.1;
  far = 1000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  // RENDER TO TEXTURE CODE BEGIN
  // trying to render by texture here
  renderTarget = new THREE.WebGLRenderTarget(512, 512); // ------
  render_Scene = new THREE.Scene();
  render_Fov = 75;
  render_Aspect = 1;
  render_Near = 0.1;
  render_Far = 20;
  render_Camera = new THREE.PerspectiveCamera(render_Fov, render_Aspect, render_Near, render_Far);
  render_Camera.position.z = 2;
  render_Scene.background = new THREE.Color(0x26b6c9);
  // adding light in the rendering scene
  {
  let color = 0xFFFFFF;
    let intensity = 1;
    let light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, -3, 2);
    render_Scene.add(light);
  }
  // making 2 cubes here 

  boxWidth = 1;
  boxHeight = 1;
  boxDepth = 1;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  material = new THREE.MeshPhongMaterial({color: 0xf5f062, fog:false});
  render_cube1 = new THREE.Mesh(geometry, material);
  render_Scene.add(render_cube1);

  // boxWidth = 2;
  // boxHeight = 2;
  // boxDepth = 2;
  // geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  // material = new THREE.MeshPhongMaterial({color: 0xff0000, fog:false});
  // let render_cube2 = new THREE.Mesh(geometry, material);
  // render_cube2.x = 5;
  // render_Scene.add(render_cube1);

  // RENDER TO TEXTURE CODE END

  controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update();
  camera.position.z = 8;

  // clearPickPosition();
  // eventListenerFunction();

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

  // trying to add fog in here
  {
    // const near = 70;
    // const far = 300;
    // const color = 'white';
    // scene.fog = new THREE.Fog(color, near, far);
    // scene.background = new THREE.Color(color);
  const color = 0xFFFFFF;
  const density = 0.007;
  scene.fog = new THREE.FogExp2(color, density);
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


  // boxWidth = 1;
  // boxHeight = 1;
  // boxDepth = 1;
  // geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  // material = new THREE.MeshPhongMaterial({color: 0x44aa88});  // greenish blue
  // cube = new THREE.Mesh(geometry, material);
  // scene.add(cube);

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
  material = new THREE.MeshPhongMaterial({map: texture, fog:false});
//   material = new THREE.MeshPhongMaterial({color: 0x44aa88});
  floor_cube = new THREE.Mesh(geometry, material);
  floor_cube.position.x = 2;
  floor_cube.position.z = -40;
  floor_cube.position.y = -12;
  floor_cube.fog = false;
  scene.add(floor_cube);

  // trying to make the carpet
  boxWidth = 30;
  boxHeight = 0.1;
  boxDepth = 30;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  loader = new THREE.TextureLoader();
  texture = loader.load('Carpet0021_1_350.jpeg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  material = new THREE.MeshPhongMaterial({map: texture, fog:false});
  let carpet = new THREE.Mesh(geometry, material);
  carpet.position.x = 10;
  carpet.position.z = -40;
  carpet.position.y = -11.6;
  scene.add(carpet);

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
  material = new THREE.MeshPhongMaterial({map: texture, fog:false}); // changed it from phong
  wall_left = new THREE.Mesh(geometry, material);
  wall_left.position.x = -20;
  wall_left.position.z = -40;
  wall_left.position.y = 10;
  wall_left.fog = false;
  scene.add(wall_left);

  // making the right wall
  boxWidth = 0.5;
  boxHeight = 45;
  boxDepth = 45;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  loader = new THREE.TextureLoader();
  texture = loader.load('wall_tile.jpeg');
  // texture = loader.load('shopping.jpg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  // texture.repeat.set(10, 10);
  material = new THREE.MeshPhongMaterial({map: texture, fog:false});
  wall_right = new THREE.Mesh(geometry, material);
  wall_right.position.x = 24.5;
  wall_right.position.z = -40;
  wall_right.position.y = 10;
  wall_right.fog = false;
  scene.add(wall_right);

  // making the back wall: we want this wall to be a window in the future
  boxWidth = 45;
  boxHeight = 45;
  boxDepth = 0.5;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  material = new THREE.MeshPhongMaterial({color: 0x44aa88, fog:false});
  material = new THREE.MeshPhysicalMaterial({  
    roughness: 0,  
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
  material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, fog:false});
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
  material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, fog:false});
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
  material = new THREE.MeshPhongMaterial({color: 0xFFFFFF, fog:false});
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
  material = new THREE.MeshPhongMaterial({map: texture, fog:false});
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
    new THREE.MeshBasicMaterial({map: loader.load('wood2.jpeg'), fog:false}),
    new THREE.MeshBasicMaterial({map: loader.load('wolf.jpg'), fog:false}),
    new THREE.MeshBasicMaterial({map: loader.load('wood2.jpeg'), fog:false}),
    new THREE.MeshBasicMaterial({map: loader.load('wood2.jpeg'), fog:false}),
    new THREE.MeshBasicMaterial({map: loader.load('wood2.jpeg'), fog:false}),
    new THREE.MeshBasicMaterial({map: loader.load('wood2.jpeg'), fog:false}),
  ];
  painting = new THREE.Mesh(geometry, materials);
  painting.position.x = 23;
  painting.position.z = -41;
  painting.position.y = 4;
  scene.add(painting);

  // Making the bed side tables
  let radiusTop = 2;  // ui: radiusTop
  let radiusBottom = 2;  // ui: radiusBottom
  height = 4;  // ui: height
  let radialSegments = 8;  // ui: radialSegments
  geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
  material = new THREE.MeshPhongMaterial({color: 0xacacad, fog:false});
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
  material = new THREE.MeshPhongMaterial({color: 0xacacad, fog:false});
  bedside_table_right = new THREE.Mesh(geometry, material);
  bedside_table_right.position.x = 18; // this is left-right
  bedside_table_right.position.y = -9; // this is the depth
  bedside_table_right.position.z = -28; // this is front-back
  scene.add(bedside_table_right);

  // making the bed
  objLoader = new OBJLoader();
  mtlLoader = new MTLLoader();
  mtlLoader.load('enlarged-bed-obj (7)/enlarged-bed.mtl', (mtl) => {
    mtl.preload();
   for (const material of Object.values(mtl.materials)) {
     material.side = THREE.DoubleSide;
     material.fog = false;
   }
    objLoader.setMaterials(mtl);
    objLoader.load('enlarged-bed-obj (7)/enlarged-bed.obj', (root) => {
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

  // objLoader = new OBJLoader();
  // mtlLoader = new MTLLoader();
  // mtlLoader.load('indoor plant_02_obj/indoor plant_02.mtl', (mtl) => {
  //   mtl.preload();
  //  for (const material of Object.values(mtl.materials)) {
  //    material.side = THREE.DoubleSide;
  //  }
  //   objLoader.setMaterials(mtl);
  //   objLoader.load('indoor plant_02_obj/indoor plant_02.obj', (root) => {
  //     root.position.y = -14;
  //     root.position.x = 24;
  //     root.position.z = -42;
  //     scene.add(root);
  //     const box = new THREE.Box3().setFromObject(root);
  // const boxSize = box.getSize(new THREE.Vector3()).length();
  // const boxCenter = box.getCenter(new THREE.Vector3());
  // console.log(boxSize);
  // console.log(boxCenter);
  //   });
  // });

  // adding the chandelier (this might contain animation too)
  // first part of the chandelier
  radiusTop = 0.1;  // ui: radiusTop
  radiusBottom = 0.1;  // ui: radiusBottom
  height = 7;  // ui: height
  radialSegments = 10;  // ui: radialSegments
  geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
  material = new THREE.MeshPhongMaterial({color: 0xF5F5DC, fog:false});
  chandelier1 = new THREE.Mesh(geometry, material);
  chandelier1.position.y = 27;
  chandelier1.position.z = -33;
  scene.add(chandelier1);

  // second part of the chandelier
  radiusTop = 0.1;  // ui: radiusTop
  radiusBottom = 0.1;  // ui: radiusBottom
  height = 15;  // ui: height
  radialSegments = 10;  // ui: radialSegments
  geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
  material = new THREE.MeshPhongMaterial({color: 0xF5F5DC, fog:false});
  chandelier2 = new THREE.Mesh(geometry, material);
  chandelier2.position.y = 23.5;
  chandelier2.position.z = -33;
  chandelier2.rotation.z = 90;
  chandelier2.rotation.y = 75;
  scene.add(chandelier2);

  // third part of the chandelier
  radiusTop = 0.1;  // ui: radiusTop
  radiusBottom = 0.1;  // ui: radiusBottom
  height = 15;  // ui: height
  radialSegments = 10;  // ui: radialSegments
  geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
  material = new THREE.MeshPhongMaterial({color: 0xF5F5DC, fog:false});
  chandelier3 = new THREE.Mesh(geometry, material);
  chandelier3.position.y = 23.5;
  chandelier3.position.z = -33;
  chandelier3.rotation.z = -90;
  chandelier3.rotation.x = -20;
  scene.add(chandelier3);

  // bulb1 orbit
  const bulb1Orbit = new THREE.Object3D();
  bulb1Orbit.position.x = 5;
  chandelier3.add(bulb1Orbit);

  // bulb1 - Rotation Established
  radiusTop = 0.9;
  detail = 1;
  geometry = new THREE.DodecahedronGeometry(radiusTop, detail);
  material = new THREE.MeshPhongMaterial({color: 0xf2c933, emissive: 0xf5e889, emissiveIntensity: 0.5, fog:false});
  bulb1 = new THREE.Mesh(geometry, material);
  // bulb1.position.y = 22;
  // bulb1.position.z = -30;
  // bulb1.position.x = 7;
  bulb1.position.y = 7.7;
  bulb1.position.z = -0.08;
  bulb1.position.x = -5.24;
  // chandelier2.add(bulb1);
  bulb1Orbit.add(bulb1);
  // scene.add(bulb1);

  radiusTop = 1.1;
  detail = 0;
  geometry = new THREE.DodecahedronGeometry(radiusTop, detail);
  material = new THREE.MeshPhongMaterial({color: 0xffffff, wireframe:true, fog:false});
  bulb2 = new THREE.Mesh(geometry, material);
  bulb2.position.y = 7.7;
  bulb2.position.z = -0.08;
  bulb2.position.x = -5.24;
  bulb1Orbit.add(bulb2);
  // scene.add(bulb2);
  

  // bulb2

  // bulb2 orbit
  let bulb2Orbit = new THREE.Object3D();
  bulb2Orbit.position.x = 5;
  chandelier2.add(bulb2Orbit);

  radiusTop = 0.9;
  detail = 1;
  geometry = new THREE.DodecahedronGeometry(radiusTop, detail);
  material = new THREE.MeshPhongMaterial({color: 0xf2c933, emissive: 0xf5e889, emissiveIntensity: 0.5, fog:false});
  bulb3 = new THREE.Mesh(geometry, material);
  // bulb3.position.y = 20;
  // bulb3.position.z = -35;
  // bulb3.position.x = -6.5;
  bulb3.position.y = 7.54;
  bulb3.position.z = 0.66;
  bulb3.position.x = -5.24;
  // bulb2Orbit
  bulb2Orbit.add(bulb3);
  // scene.add(bulb3);

  radiusTop = 1.1;
  detail = 0;
  geometry = new THREE.DodecahedronGeometry(radiusTop, detail);
  material = new THREE.MeshPhongMaterial({color: 0xffffff, wireframe:true, emissive: 0xf5e889, emissiveIntensity: 0.5, fog:false});
  bulb4 = new THREE.Mesh(geometry, material);
  // bulb4.position.y = 20;
  // bulb4.position.z = -35;
  // bulb4.position.x = -6.5;
  bulb4.position.y = 7.54;
  bulb4.position.z = 0.66;
  bulb4.position.x = -5.24;
  bulb2Orbit.add(bulb4);
  // scene.add(bulb4);

  // bulb3 - Rotation established

  // bulb3 Orbit
  let bulb3Orbit = new THREE.Object3D();
  bulb3Orbit.position.x = 5;
  chandelier3.add(bulb3Orbit);

  radiusTop = 0.9;
  detail = 1;
  geometry = new THREE.DodecahedronGeometry(radiusTop, detail);
  material = new THREE.MeshPhongMaterial({color: 0xf2c933, emissive: 0xf5e889, emissiveIntensity: 0.5, fog:false});
  bulb5 = new THREE.Mesh(geometry, material);
  // bulb5.position.y = 25;
  // bulb5.position.z = -35.5;
  // bulb5.position.x = -6.5;
  bulb5.position.y = -7.21;
  bulb5.position.z = 0.41;
  bulb5.position.x = -4.7;
  // scene.add(bulb5);
  bulb3Orbit.add(bulb5);

  radiusTop = 1.1;
  detail = 0;
  geometry = new THREE.DodecahedronGeometry(radiusTop, detail);
  material = new THREE.MeshPhongMaterial({color: 0xffffff, wireframe:true, fog:false});
  bulb6 = new THREE.Mesh(geometry, material);
  // bulb6.position.y = 25;
  // bulb6.position.z = -35.5;
  // bulb6.position.x = -6.5;
  bulb6.position.y = -7.21;
  bulb6.position.z = 0.41;
  bulb6.position.x = -4.7;
  bulb3Orbit.add(bulb6);
  // scene.add(bulb6);

  // bulb4

  // bulb4 Orbit
  let bulb4Orbit = new THREE.Object3D();
  bulb4Orbit.position.x = 5;
  chandelier2.add(bulb4Orbit);

  radiusTop = 0.9;
  detail = 1;
  geometry = new THREE.DodecahedronGeometry(radiusTop, detail);
  material = new THREE.MeshPhongMaterial({color: 0xf2c933, emissive: 0xf5e889, emissiveIntensity: 0.5, fog:false});
  bulb7 = new THREE.Mesh(geometry, material);
  // bulb7.position.y = 27;
  // bulb7.position.z = -30;
  // bulb7.position.x = 7;
  bulb7.position.y = -8.44;
  bulb7.position.z = -0.08;
  bulb7.position.x = -5.24;
  // scene.add(bulb7);
  bulb4Orbit.add(bulb7);

  // const gui = new GUI();
  // gui.add(bulb7.position, 'x', -10, 10, 0.01);
  // gui.add(bulb7.position, 'y', -10, 10, 0.01);
  // gui.add(bulb7.position, 'z', -10, 10, 0.01);

  radiusTop = 1.1;
  detail = 0;
  geometry = new THREE.DodecahedronGeometry(radiusTop, detail);
  material = new THREE.MeshPhongMaterial({color: 0xffffff, wireframe:true, fog:false});
  bulb8 = new THREE.Mesh(geometry, material);
  // bulb8.position.y = 27;
  // bulb8.position.z = -30;
  // bulb8.position.x = 7;
  bulb8.position.y = -8.44;
  bulb8.position.z = -0.08;
  bulb8.position.x = -5.24;
  // scene.add(bulb8);
  bulb4Orbit.add(bulb8);

  // chandelier complete

  // going to render the TV from the object file
  objLoader = new OBJLoader();
  mtlLoader = new MTLLoader();
  mtlLoader.load('flat-screen-lcd-tv-obj/flat-screen-lcd-tv.mtl', (mtl) => {
    mtl.preload();
   for (const material of Object.values(mtl.materials)) {
     material.side = THREE.DoubleSide;
     material.fog = false;
   }
    objLoader.setMaterials(mtl);
    objLoader.load('flat-screen-lcd-tv-obj/flat-screen-lcd-tv.obj', (root) => {
      root.position.y = -1;
      root.position.x = -19;
      root.position.z = -38;
      scene.add(root);
      const box = new THREE.Box3().setFromObject(root);
      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());
      // adding these extra things
      // frameArea(boxSize * 0.8, boxSize, boxCenter, camera);
      // // update the Trackball controls to handle the new size
      // controls.maxDistance = boxSize * 10;
      // controls.target.copy(boxCenter);
      // controls.update();
      console.log(boxSize);
      console.log(boxCenter);
    });
  });

  // going to add the table
  boxWidth = 4;
  boxHeight = 8;
  boxDepth = 11;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  loader = new THREE.TextureLoader();
  texture = loader.load('wood_light.jpeg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.5, 1.5);
  material = new THREE.MeshPhongMaterial({map: texture, fog:false});
  table = new THREE.Mesh(geometry, material);
  table.position.x = -16.5;
  table.position.z = -48;
  table.position.y = -7.5;
  scene.add(table);

  boxWidth = 4;
  boxHeight = 8;
  boxDepth = 11;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  loader = new THREE.TextureLoader();
  texture = loader.load('wood_light.jpeg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.5, 1.5);
  material = new THREE.MeshPhongMaterial({map: texture, fog:false});
  table2 = new THREE.Mesh(geometry, material);
  table2.position.x = -16.5;
  table2.position.z = -25;
  table2.position.y = -7.5;
  scene.add(table2);

  boxWidth = 4;
  boxHeight = 1.5;
  boxDepth = 12;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  loader = new THREE.TextureLoader();
  texture = loader.load('table_texture.jpeg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.5, 1.5);
  material = new THREE.MeshPhongMaterial({map: texture, fog:false});
  table3 = new THREE.Mesh(geometry, material);
  table3.position.x = -16.5;
  table3.position.z = -36.5;
  table3.position.y = -4.2;
  scene.add(table3);

  boxWidth = 4;
  boxHeight = 0.6;
  boxDepth = 12;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  loader = new THREE.TextureLoader();
  texture = loader.load('table_texture.jpeg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.5, 1.5);
  material = new THREE.MeshPhongMaterial({map: texture, fog:false});
  table4 = new THREE.Mesh(geometry, material);
  table4.position.x = -16.5;
  table4.position.z = -36.5;
  table4.position.y = -11.5;
  scene.add(table4);

  // going to add the bed panel
  boxWidth = 1.5;
  boxHeight = 8;
  boxDepth = 25;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  loader = new THREE.TextureLoader();
  texture = loader.load('wood_light.jpeg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.5, 1.5);
  material = new THREE.MeshPhongMaterial({map: texture, fog:false});
  bed_panel = new THREE.Mesh(geometry, material);
  bed_panel.position.x = 23;
  bed_panel.position.z = -40;
  bed_panel.position.y = -7.5;
  scene.add(bed_panel);
  
  // drawing the bed side lights
  // let tubeRadius1 = 1;  // ui: radius
  // let tubeRadius2 = 0.4;  // ui: tubeRadius
  // let tubeRadialSegments = 12;  // ui: radialSegments
  // let tubularSegments = 12;  // ui: tubularSegments
  // geometry = new THREE.TorusGeometry(tubeRadius1, tubeRadius2, tubeRadialSegments, tubularSegments);
  // material = new THREE.MeshPhongMaterial({color: 0xf7e294, emissive: 0xf5e889, emissiveIntensity: 0.35});
  // tube_light1 = new THREE.Mesh(geometry, material);
  // tube_light1.rotation.y = 1.5;
  // tube_light1.position.x = 23;
  // tube_light1.position.z = -30;
  // scene.add(tube_light1);

// this thing is not working
  let points = [];
  for (let i = 0; i < 10; ++i) {
    points.push(new THREE.Vector2(Math.sin(i * 0.03) * 1.5 + 1.5, (i - 5) * .3));
  }
  geometry = new THREE.LatheGeometry(points, 20, 1.5 * Math.PI, 4 * Math.PI);
  material = new THREE.MeshPhongMaterial({color: 0x000000, shininess: 90, fog:false});
  let light_bed = new THREE.Mesh(geometry, material);
  light_bed.rotation.x = THREE.MathUtils.degToRad(180);
  light_bed.position.x = 21;
  light_bed.position.z = -29;
  scene.add(light_bed);

  // tubeRadius1 = 1;  // ui: radius
  // tubeRadius2 = 0.4;  // ui: tubeRadius
  // tubeRadialSegments = 12;  // ui: radialSegments
  // tubularSegments = 12;  // ui: tubularSegments
  // geometry = new THREE.TorusGeometry(tubeRadius1, tubeRadius2, tubeRadialSegments, tubularSegments);
  // material = new THREE.MeshPhongMaterial({color: 0xf7e294, emissive: 0xf5e889, emissiveIntensity: 0.35});
  // tube_light2 = new THREE.Mesh(geometry, material);
  // tube_light2.rotation.y = 1.5;
  // tube_light2.position.x = 23;
  // tube_light2.position.z = -50;
  // scene.add(tube_light2);

  points = [];
  for (let i = 0; i < 10; ++i) {
    points.push(new THREE.Vector2(Math.sin(i * 0.03) * 1.5 + 1.5, (i - 5) * .3));
  }
  geometry = new THREE.LatheGeometry(points, 20, 1.5 * Math.PI, 4 * Math.PI);
  material = new THREE.MeshPhongMaterial({color: 0x000000, shininess: 90, fog:false});
  light_bed = new THREE.Mesh(geometry, material);
  light_bed.rotation.x = THREE.MathUtils.degToRad(180);
  light_bed.position.x = 22;
  light_bed.position.z = -49;
  scene.add(light_bed);

  boxWidth = 0.3;
  boxHeight = 2.2;
  boxDepth = 0.1;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  material = new THREE.MeshPhongMaterial({color: 0x808080, emissive: 0x808080, shininess: 90, fog:false});
  let rod = new THREE.Mesh(geometry, material);
  rod.position.y = -1.3;
  rod.position.x = 22;
  rod.position.z = -29;
  scene.add(rod);

  boxWidth = 0.3;
  boxHeight = 2.2;
  boxDepth = 0.1;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  material = new THREE.MeshPhongMaterial({color: 0x808080, emissive: 0x808080, shininess: 90, fog:false});
  rod = new THREE.Mesh(geometry, material);
  rod.position.y = -1.3;
  rod.position.x = 22;
  rod.position.z = -49;
  scene.add(rod);

  boxWidth = 1.5;
  boxHeight = 0.3;
  boxDepth = 0.3;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  material = new THREE.MeshPhongMaterial({color: 0x808080, emissive: 0x808080, shininess: 90, fog:false});
  rod = new THREE.Mesh(geometry, material);
  rod.position.y = -2.2;
  rod.position.x = 22.6;
  rod.position.z = -29;
  scene.add(rod);

  boxWidth = 1.5;
  boxHeight = 0.3;
  boxDepth = 0.3;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  material = new THREE.MeshPhongMaterial({color: 0x808080, emissive: 0x808080, shininess: 90, fog:false});
  rod = new THREE.Mesh(geometry, material);
  rod.position.y = -2.2;
  rod.position.x = 22.6;
  rod.position.z = -49;
  scene.add(rod);

  //now going to make bed side lights
  // color = 0xffffe0;
  // color = 0xFFFFFF;
  // intensity = 8;
  // let lamp_light = new THREE.PointLight(color, intensity);
  // lamp_light.position.set(21.5, -1, -29);
  // lamp_light.distance = 30;
  // scene.add(lamp_light);
  // let helper = new THREE.PointLightHelper(lamp_light);
  // scene.add(helper);

color = 0xffb6c1;
intensity = 25;
let lamp_light = new THREE.SpotLight(color, intensity);
lamp_light.angle = THREE.MathUtils.degToRad(42);
lamp_light.position.set(20, 0.3, -27.8);
lamp_light.target.position.set(50, -58.38, -50);
scene.add(lamp_light);
scene.add(lamp_light.target);

color =0xffb6c1;
intensity = 25;
lamp_light = new THREE.SpotLight(color, intensity);
lamp_light.angle = THREE.MathUtils.degToRad(42);
lamp_light.position.set(20, 0.3, -51.2);
lamp_light.target.position.set(50, -58.38, -50);
scene.add(lamp_light);
scene.add(lamp_light.target);

  // color = 0xffffe0;
  // intensity = 4;
  // light = new THREE.PointLight(color, intensity);
  // light.position.set(-19, 6.5, -46);
  // light.distance = 22;
  // scene.add(light);

  // trying to create the electric fire place
  boxWidth = 0.4;
  boxHeight = 6.5;
  boxDepth = 12;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  material = new THREE.MeshPhysicalMaterial({  
    roughness: 0.5,  
    transmission: 1,  
    thickness: 4, fog:false
  });
  fireplace_mesh = new THREE.Mesh(geometry, material);
  fireplace_mesh.position.x = -14.88;
  fireplace_mesh.position.z = -37;
  fireplace_mesh.position.y = -8;
  scene.add(fireplace_mesh);
  // trying to use a spotlight
  // it seems like rotation in spotlight does not exisr

  // light for bulb 1 (chandelier)
  color = 0xf7f7c1;
  color = 0xf2f2a7;
  // color = 0xFFFFFF;
  intensity = 50;
  // bulb_light_1 = new THREE.SpotLight(color, intensity);
  bulb_light_1 = new THREE.PointLight(color, intensity);
  // bulb_light_1.position.set(7, 22, -30); // original
  bulb_light_1.position.set(-5.24, 7.7, -0.08);
  // scene.add(bulb_light_1);
  bulb1Orbit.add(bulb_light_1);
  // let helper = new THREE.PointLightHelper(bulb_light_1);
  // scene.add(helper);

  // bulb_light_1.target.position.x = 6;
  // bulb_light_1.target.position.y = -10;
  // bulb_light_1.target.position.z = -30;
  // bulb_light_1.decay = 1.2;
  // bulb_light_1.angle = THREE.MathUtils.degToRad(20);;

  // scene.add(bulb_light_1.target);

  // light for bulb 2 (chandelier)
  color = 0xf7f7c1;
  color = 0xf2f2a7;
  // color = 0xFFFFFF;
  intensity = 50;
  bulb_light_2 = new THREE.PointLight(color, intensity);
  bulb_light_2.position.set(-5.24, 7.54, 0.66);
  bulb2Orbit.add(bulb_light_2);
  // helper = new THREE.PointLightHelper(bulb_light_2);
  // scene.add(helper);

  // bulb_light_2.position.set(-6.5, 20, -35);
  // scene.add(bulb_light_2);
  // scene.add(bulb_light_2.target);
  // bulb_light_2.target.position.x = -10;
  // bulb_light_2.target.position.y = -15;
  // bulb_light_2.target.position.z = -35;
  // bulb_light_2.decay = 1.2;
  // bulb_light_2.angle = THREE.MathUtils.degToRad(20);;

  // light for bulb 3 (chandelier)
  color = 0xf7f7c1;
  color = 0xf2f2a7;
  intensity = 30;
  // bulb_light_3 = new THREE.SpotLight(color, intensity);
  bulb_light_3 = new THREE.PointLight(color, intensity);
  // bulb_light_3.position.set(-6.5, 25, -35.5);
  bulb_light_3.position.set(-10, -15, -15);
  // scene.add(bulb_light_3);
  bulb3Orbit.add(bulb_light_3);

  // scene.add(bulb_light_3.target);
   // bulb_light_3.target.position.x = -10;
  // bulb_light_3.target.position.y = -15;
  // bulb_light_3.target.position.z = -15;
  // bulb_light_3.decay = 1.2;
  // bulb_light_3.angle = THREE.MathUtils.degToRad(20);;

  // light for bulb 4 (chandelier)
  color = 0xf7f7c1;
  color = 0xf2f2a7;
  intensity = 40;
  // bulb_light_4 = new THREE.SpotLight(color, intensity);
  bulb_light_4 = new THREE.PointLight(color, intensity);
  bulb_light_4.position.set(-5.24, -8.44, -0.08);
  bulb4Orbit.add(bulb_light_4);

  // scene.add(bulb_light_4.target);
   // bulb_light_4.target.position.x = 6;
  // bulb_light_4.target.position.y = -10;
  // bulb_light_4.target.position.z = -40;
  // bulb_light_4.decay = 1.2;
  // bulb_light_4.angle = THREE.MathUtils.degToRad(15);
  // this draws the outer boundry and stuff
  // let helper = new THREE.SpotLightHelper(bulb_light_2);
  // scene.add(helper);


  // now to make the fire place more realisic, we will have to give a red glow inside it
  color = 0xFF0000;
  intensity = 110;
  fireplace_glow = new THREE.SpotLight(color, intensity);
  fireplace_glow.position.set(-18, -8, -30);
  fireplace_glow.target.position.z = -50;
  fireplace_glow.target.position.y = -20;
  fireplace_glow.target.position.x = -11;
  fireplace_glow.decay = 1.6;
  fireplace_glow.angle = THREE.MathUtils.degToRad(45);
  scene.add(fireplace_glow);
  scene.add(fireplace_glow.target);

  // making the table point light
  color = 0xffffe0;
  intensity = 10;
  let light = new THREE.PointLight(color, intensity);
  light.position.set(-18.5, -2.7, -22);
  light.distance = 22;
  scene.add(light);
  // let helper = new THREE.PointLightHelper(light);
  // scene.add(helper);

  color = 0xffffe0;
  intensity = 10;
  light = new THREE.PointLight(color, intensity);
  light.position.set(-18.5, -2.7, -28);
  light.distance = 22;
  scene.add(light);
  // helper = new THREE.PointLightHelper(light);
  // scene.add(helper);

  color = 0xffffe0;
  intensity = 10;
  light = new THREE.PointLight(color, intensity);
  light.position.set(-18.5, -2.7, -34);
  light.distance = 22;
  scene.add(light);
  // helper = new THREE.PointLightHelper(light);
  // scene.add(helper);

  color = 0xffffe0;
  intensity = 10;
  light = new THREE.PointLight(color, intensity);
  light.position.set(-18.5, -2.7, -40);
  light.distance = 22;
  scene.add(light);
  // helper = new THREE.PointLightHelper(light);
  // scene.add(helper);

  color = 0xffffe0;
  intensity = 10;
  light = new THREE.PointLight(color, intensity);
  light.position.set(-18.5, -2.7, -46);
  light.distance = 22;
  scene.add(light);
  // helper = new THREE.PointLightHelper(light);
  // scene.add(helper);

  color = 0xffffe0;
  intensity = 10;
  light = new THREE.PointLight(color, intensity);
  light.position.set(-18.5, -2.7, -52);
  light.distance = 22;
  scene.add(light);

  // for the tv
  color = 0xffffe0;
  intensity = 4;
  light = new THREE.PointLight(color, intensity);
  light.position.set(-19, 0.5, -42);
  light.distance = 22;
  scene.add(light);

  // we need to use point light for the lighting behind the table;
  color = 0xffffe0;
  intensity = 4;
  light = new THREE.PointLight(color, intensity);
  light.position.set(-19, 0.5, -38);
  light.distance = 22;
  scene.add(light);

  color = 0xffffe0;
  intensity = 4;
  light = new THREE.PointLight(color, intensity);
  light.position.set(-19, 0.5, -34);
  light.distance = 22;
  scene.add(light);

  color = 0xffffe0;
  intensity = 4;
  light = new THREE.PointLight(color, intensity);
  light.position.set(-19, 0.5, -30);
  light.distance = 22;
  scene.add(light);

  color = 0xffffe0;
  intensity = 4;
  light = new THREE.PointLight(color, intensity);
  light.position.set(-19, 3.5, -30);
  light.distance = 22;
  scene.add(light);

  color = 0xffffe0;
  intensity = 4;
  light = new THREE.PointLight(color, intensity);
  light.position.set(-19, 6.5, -30);
  light.distance = 22;
  scene.add(light);

  color = 0xffffe0;
  intensity = 4;
  light = new THREE.PointLight(color, intensity);
  light.position.set(-19, 10.0, -30);
  light.distance = 22;
  scene.add(light);

  color = 0xffffe0;
  intensity = 4;
  light = new THREE.PointLight(color, intensity);
  light.position.set(-19, 10.0, -34);
  light.distance = 22;
  scene.add(light);

  color = 0xffffe0;
  intensity = 4;
  light = new THREE.PointLight(color, intensity);
  light.position.set(-19, 10.0, -38);
  light.distance = 22;
  scene.add(light);

  color = 0xffffe0;
  intensity = 4;
  light = new THREE.PointLight(color, intensity);
  light.position.set(-19, 10.0, -42);
  light.distance = 22;
  scene.add(light);

  color = 0xffffe0;
  intensity = 4;
  light = new THREE.PointLight(color, intensity);
  light.position.set(-19, 10.0, -46);
  light.distance = 22;
  scene.add(light);

  color = 0xffffe0;
  intensity = 4;
  light = new THREE.PointLight(color, intensity);
  light.position.set(-19, 10.0, -46);
  light.distance = 22;
  scene.add(light);

  color = 0xffffe0;
  intensity = 4;
  light = new THREE.PointLight(color, intensity);
  light.position.set(-19, 6.5, -46);
  light.distance = 22;
  scene.add(light);

  color = 0xffffe0;
  intensity = 4;
  light = new THREE.PointLight(color, intensity);
  light.position.set(-19, 3.5, -46);
  light.distance = 22;
  scene.add(light);

  color = 0xffffe0;
  intensity = 4;
  light = new THREE.PointLight(color, intensity);
  light.position.set(-19, 0.5, -46);
  light.distance = 22;
  scene.add(light);

  // objLoader = new OBJLoader();
  // mtlLoader = new MTLLoader();
  // mtlLoader.load('tree-05-obj/tree-05.mtl', (mtl) => {
  //   mtl.preload();
  //  for (const material of Object.values(mtl.materials)) {
  //    material.side = THREE.DoubleSide;
  //  }
  //   objLoader.setMaterials(mtl);
  //   objLoader.load('tree-05-obj/tree-05.obj', (root) => {
  //     root.position.y = -40;
  //     root.position.x = -200;
  //     root.position.z = -400;
  //     scene.add(root);
  //     const box = new THREE.Box3().setFromObject(root);
  // const boxSize = box.getSize(new THREE.Vector3()).length();
  // const boxCenter = box.getCenter(new THREE.Vector3());
  //   });
  // });

  // trying to add a label here (billboard)
  let baseWidth = 150;
  let borderSize = 6;
  let size = 37;
  let billboard_canvas = document.createElement('canvas').getContext('2d');
  const font =  `${32}px bold sans-serif`;
  billboard_canvas.font = font;
  let textWidth = billboard_canvas.measureText("The Minimalist Room").width;
  let doubleBorderSize = borderSize * 2;
  let width = baseWidth + doubleBorderSize;
  height = size + doubleBorderSize;
  billboard_canvas.canvas.width = width;
  billboard_canvas.canvas.height = height;
  billboard_canvas.textBaseline = 'middle';
  billboard_canvas.textAlign = 'center';
  billboard_canvas.fillStyle = 'grey';
  billboard_canvas.fillRect(0, 0, width, height);
  const scaleFactor = Math.min(1, baseWidth / textWidth);
  billboard_canvas.translate(width / 2, height / 2);
  billboard_canvas.scale(scaleFactor * 3, 1);
  billboard_canvas.fillStyle = 'white';
  billboard_canvas.fillText("The Minimalist Room", 0, 0);
  texture = new THREE.CanvasTexture(billboard_canvas.canvas);
  let labelMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  });
  let label = new THREE.Sprite(labelMaterial);
  label.position.y = -6;
  label.position.z = -4;
  label.position.x = 10;
  label.scale.x = billboard_canvas.canvas.width  *  0.02;
  label.scale.y = billboard_canvas.canvas.height * 0.02;
  scene.add(label);

  // making a quick tree trunk in here
  radiusTop = 4;  // ui: radiusTop
  radiusBottom = 4;  // ui: radiusBottom
  height = 10;  // ui: height
  radialSegments = 12;  // ui: radialSegments
  geometry = new THREE.CylinderGeometry(
    radiusTop, radiusBottom, height, radialSegments);
  material = new THREE.MeshPhongMaterial({color: 0xa35903});
  let tree_trunk = new THREE.Mesh(geometry, material);
  tree_trunk.position.z = -90;
  tree_trunk.position.y = -7;
  scene.add(tree_trunk);
  renderer.render(scene, camera);
  requestAnimationFrame(render);

  // making a quick tree trunk in here
  radiusTop = 5;  // ui: radiusTop
  radiusBottom = 5;  // ui: radiusBottom
  height = 16;  // ui: height
  radialSegments = 12;  // ui: radialSegments
  geometry = new THREE.CylinderGeometry(
    radiusTop, radiusBottom, height, radialSegments);
  material = new THREE.MeshPhongMaterial({color: 0xa35903});
  let tree_trunk2 = new THREE.Mesh(geometry, material);
  tree_trunk2.position.z = -160;
  tree_trunk2.position.x = 14;
  tree_trunk2.position.y = -7;
  scene.add(tree_trunk2);
  renderer.render(scene, camera);
  requestAnimationFrame(render);


  // making a quick tree trunk in here
  radiusTop = 5;  // ui: radiusTop
  radiusBottom = 5;  // ui: radiusBottom
  height = 32;  // ui: height
  radialSegments = 12;  // ui: radialSegments
  geometry = new THREE.CylinderGeometry(
    radiusTop, radiusBottom, height, radialSegments);
  material = new THREE.MeshPhongMaterial({color: 0xa35903});
  let tree_trunk3 = new THREE.Mesh(geometry, material);
  tree_trunk3.position.z = -200;
  tree_trunk3.position.x = 40;
  tree_trunk3.position.y = -7;
  scene.add(tree_trunk3);
  renderer.render(scene, camera);
  requestAnimationFrame(render);

  // adding render to texture
  boxWidth = 3;
  boxHeight = 3;
  boxDepth = 3;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  material = new THREE.MeshPhongMaterial({
    map: renderTarget.texture, fog: false
  });
  render_to_texture_cube = new THREE.Mesh(geometry, material);
  render_to_texture_cube.position.y = -3.9;
  render_to_texture_cube.position.x = 16;
  render_to_texture_cube.position.z = -24;
  scene.add(render_to_texture_cube);
}

  // making the curtains
  objLoader = new OBJLoader();
  mtlLoader = new MTLLoader();
  mtlLoader.load('curtain-single-obj/curtain-single.mtl', (mtl) => {
    mtl.preload();
   for (const material of Object.values(mtl.materials)) {
     material.side = THREE.DoubleSide;
     material.fog = false;
   }
    objLoader.setMaterials(mtl);
    objLoader.load('curtain-single-obj/curtain-single.obj', (root) => {
      root.position.y = 8;
      root.position.x = -20;
      root.position.z = -55;
      scene.add(root);
      const box = new THREE.Box3().setFromObject(root);
  const boxSize = box.getSize(new THREE.Vector3()).length();
  const boxCenter = box.getCenter(new THREE.Vector3());
    });
  });


function render(time) {
    time *= 0.001;  // convert time to seconds
    // let pickHelper = new PickObject();
    // pickHelper.pick(pickPosition, scene, camera, time);
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

    // trying to add animation in the top chandelier
    chandelier2.rotation.x = 0.5 * time; 
    chandelier3.rotation.z = 0.5 * time;

    // trying to set up some rendering to texture here
    renderer.setRenderTarget(renderTarget);
    renderer.render(render_Scene, render_Camera);
    renderer.setRenderTarget(null);

    // adding animation to the render to texture cube
    render_to_texture_cube.rotation.y = time;
    render_cube1.rotation.x = 0.5 * time;
    render_cube1.rotation.y = 0.5 * time;
    // rotating the cube inside the renderer cube


    // set the position of the bulbs
    // bulb1.position.x += Math.sin(time * 0.05);
    // bulb1.position.z += 0.1 * Math.cos(time);f

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