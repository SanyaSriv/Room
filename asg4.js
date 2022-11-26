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
  material = new THREE.MeshPhongMaterial({map: texture,}); // changed it from phong
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
  height = 4;  // ui: height
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
  objLoader = new OBJLoader();
  mtlLoader = new MTLLoader();
  mtlLoader.load('enlarged-bed-obj (3)/enlarged-bed.mtl', (mtl) => {
    mtl.preload();
   for (const material of Object.values(mtl.materials)) {
     material.side = THREE.DoubleSide;
   }
    objLoader.setMaterials(mtl);
    objLoader.load('enlarged-bed-obj (3)/enlarged-bed.obj', (root) => {
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

  // adding the chandelier (this might contain animation too)
  // first part of the chandelier
  radiusTop = 0.1;  // ui: radiusTop
  radiusBottom = 0.1;  // ui: radiusBottom
  height = 7;  // ui: height
  radialSegments = 10;  // ui: radialSegments
  geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
  material = new THREE.MeshPhongMaterial({color: 0xF5F5DC});
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
  material = new THREE.MeshPhongMaterial({color: 0xF5F5DC});
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
  material = new THREE.MeshPhongMaterial({color: 0xF5F5DC});
  chandelier3 = new THREE.Mesh(geometry, material);
  chandelier3.position.y = 23.5;
  chandelier3.position.z = -33;
  chandelier3.rotation.z = -90;
  chandelier3.rotation.x = -20;
  scene.add(chandelier3);

  // bulb1
  radiusTop = 0.9;
  detail = 1;
  geometry = new THREE.DodecahedronGeometry(radiusTop, detail);
  material = new THREE.MeshPhongMaterial({color: 0xf2c933, emissive: 0xf5e889, emissiveIntensity: 0.5});
  bulb1 = new THREE.Mesh(geometry, material);
  bulb1.position.y = 22;
  bulb1.position.z = -30;
  bulb1.position.x = 7;
  scene.add(bulb1);

  radiusTop = 1.1;
  detail = 0;
  geometry = new THREE.DodecahedronGeometry(radiusTop, detail);
  material = new THREE.MeshPhongMaterial({color: 0xffffff, wireframe:true});
  bulb2 = new THREE.Mesh(geometry, material);
  bulb2.position.y = 22;
  bulb2.position.z = -30;
  bulb2.position.x = 7;
  scene.add(bulb2);
  
  // bulb2
  radiusTop = 0.9;
  detail = 1;
  geometry = new THREE.DodecahedronGeometry(radiusTop, detail);
  material = new THREE.MeshPhongMaterial({color: 0xf2c933, emissive: 0xf5e889, emissiveIntensity: 0.5});
  bulb3 = new THREE.Mesh(geometry, material);
  bulb3.position.y = 20;
  bulb3.position.z = -35;
  bulb3.position.x = -6.5;
  scene.add(bulb3);

  radiusTop = 1.1;
  detail = 0;
  geometry = new THREE.DodecahedronGeometry(radiusTop, detail);
  material = new THREE.MeshPhongMaterial({color: 0xffffff, wireframe:true, emissive: 0xf5e889, emissiveIntensity: 0.5});
  bulb4 = new THREE.Mesh(geometry, material);
  bulb4.position.y = 20;
  bulb4.position.z = -35;
  bulb4.position.x = -6.5;
  scene.add(bulb4);

  // bulb3
  radiusTop = 0.9;
  detail = 1;
  geometry = new THREE.DodecahedronGeometry(radiusTop, detail);
  material = new THREE.MeshPhongMaterial({color: 0xf2c933, emissive: 0xf5e889, emissiveIntensity: 0.5});
  bulb5 = new THREE.Mesh(geometry, material);
  bulb5.position.y = 25;
  bulb5.position.z = -35.5;
  bulb5.position.x = -6.5;
  scene.add(bulb5);

  radiusTop = 1.1;
  detail = 0;
  geometry = new THREE.DodecahedronGeometry(radiusTop, detail);
  material = new THREE.MeshPhongMaterial({color: 0xffffff, wireframe:true});
  bulb6 = new THREE.Mesh(geometry, material);
  bulb6.position.y = 25;
  bulb6.position.z = -35.5;
  bulb6.position.x = -6.5;
  scene.add(bulb6);

  // bulb4
  radiusTop = 0.9;
  detail = 1;
  geometry = new THREE.DodecahedronGeometry(radiusTop, detail);
  material = new THREE.MeshPhongMaterial({color: 0xf2c933, emissive: 0xf5e889, emissiveIntensity: 0.5});
  bulb7 = new THREE.Mesh(geometry, material);
  bulb7.position.y = 27;
  bulb7.position.z = -30;
  bulb7.position.x = 7;
  scene.add(bulb7);

  radiusTop = 1.1;
  detail = 0;
  geometry = new THREE.DodecahedronGeometry(radiusTop, detail);
  material = new THREE.MeshPhongMaterial({color: 0xffffff, wireframe:true});
  bulb8 = new THREE.Mesh(geometry, material);
  bulb8.position.y = 27;
  bulb8.position.z = -30;
  bulb8.position.x = 7;
  scene.add(bulb8);

  // chandelier complete

  // going to render the TV from the object file
  objLoader = new OBJLoader();
  mtlLoader = new MTLLoader();
  mtlLoader.load('flat-screen-lcd-tv-obj/flat-screen-lcd-tv.mtl', (mtl) => {
    mtl.preload();
   for (const material of Object.values(mtl.materials)) {
     material.side = THREE.DoubleSide;
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
  material = new THREE.MeshPhongMaterial({map: texture,});
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
  material = new THREE.MeshPhongMaterial({map: texture,});
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
  material = new THREE.MeshPhongMaterial({map: texture,});
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
  material = new THREE.MeshPhongMaterial({map: texture,});
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
  material = new THREE.MeshPhongMaterial({map: texture,});
  bed_panel = new THREE.Mesh(geometry, material);
  bed_panel.position.x = 23;
  bed_panel.position.z = -40;
  bed_panel.position.y = -7.5;
  scene.add(bed_panel);
  
  // drawing the bed side lights
  let tubeRadius1 = 1;  // ui: radius
  let tubeRadius2 = 0.4;  // ui: tubeRadius
  let tubeRadialSegments = 12;  // ui: radialSegments
  let tubularSegments = 12;  // ui: tubularSegments
  geometry = new THREE.TorusGeometry(tubeRadius1, tubeRadius2, tubeRadialSegments, tubularSegments);
  material = new THREE.MeshPhongMaterial({color: 0xf7e294, emissive: 0xf5e889, emissiveIntensity: 0.35});
  tube_light1 = new THREE.Mesh(geometry, material);
  tube_light1.rotation.y = 1.5;
  tube_light1.position.x = 23;
  tube_light1.position.z = -30;
  scene.add(tube_light1);

  tubeRadius1 = 1;  // ui: radius
  tubeRadius2 = 0.4;  // ui: tubeRadius
  tubeRadialSegments = 12;  // ui: radialSegments
  tubularSegments = 12;  // ui: tubularSegments
  geometry = new THREE.TorusGeometry(tubeRadius1, tubeRadius2, tubeRadialSegments, tubularSegments);
  material = new THREE.MeshPhongMaterial({color: 0xf7e294, emissive: 0xf5e889, emissiveIntensity: 0.35});
  tube_light2 = new THREE.Mesh(geometry, material);
  tube_light2.rotation.y = 1.5;
  tube_light2.position.x = 23;
  tube_light2.position.z = -50;
  scene.add(tube_light2);

  // trying to create the electric fire place
  boxWidth = 0.4;
  boxHeight = 6.5;
  boxDepth = 12;
  geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  material = new THREE.MeshPhysicalMaterial({  
    roughness: 0.5,  
    transmission: 1,  
    thickness: 4,
  });
  fireplace_mesh = new THREE.Mesh(geometry, material);
  fireplace_mesh.position.x = -14.88;
  fireplace_mesh.position.z = -37;
  fireplace_mesh.position.y = -8;
  scene.add(fireplace_mesh);
  // trying to use a spotlight
  // it seems like rotation in spotlight does not exisr

  // light for bulb 1 (chandelier)
  color = 0xebd110;
  intensity = 4;
  // bulb_light_1 = new THREE.SpotLight(color, intensity);
  bulb_light_1 = new THREE.PointLight(color, intensity);
  bulb_light_1.position.set(7, 22, -30);
  // bulb_light_1.target.position.x = 6;
  // bulb_light_1.target.position.y = -10;
  // bulb_light_1.target.position.z = -30;
  // bulb_light_1.decay = 1.2;
  // bulb_light_1.angle = THREE.MathUtils.degToRad(20);;
  scene.add(bulb_light_1);
  // scene.add(bulb_light_1.target);

  // light for bulb 2 (chandelier)
  color = 0xebd110;
  intensity = 2;
  bulb_light_2 = new THREE.PointLight(color, intensity);
  bulb_light_2.position.set(-6.5, 20, -35);
  // bulb_light_2.target.position.x = -10;
  // bulb_light_2.target.position.y = -15;
  // bulb_light_2.target.position.z = -35;
  // bulb_light_2.decay = 1.2;
  // bulb_light_2.angle = THREE.MathUtils.degToRad(20);;
  scene.add(bulb_light_2);
  // scene.add(bulb_light_2.target);

  // light for bulb 3 (chandelier)
  color = 0xebd110;
  intensity = 4;
  // bulb_light_3 = new THREE.SpotLight(color, intensity);
  bulb_light_3 = new THREE.PointLight(color, intensity);
  bulb_light_3.position.set(-6.5, 25, -35.5);
  // bulb_light_3.target.position.x = -10;
  // bulb_light_3.target.position.y = -15;
  // bulb_light_3.target.position.z = -15;
  // bulb_light_3.decay = 1.2;
  // bulb_light_3.angle = THREE.MathUtils.degToRad(20);;
  scene.add(bulb_light_3);
  // scene.add(bulb_light_3.target);

  // light for bulb 4 (chandelier)
  color = 0xebd110;
  intensity = 6;
  // bulb_light_4 = new THREE.SpotLight(color, intensity);
  bulb_light_4 = new THREE.PointLight(color, intensity);
  bulb_light_4.position.set(7, 27, -30);
  // bulb_light_4.target.position.x = 6;
  // bulb_light_4.target.position.y = -10;
  // bulb_light_4.target.position.z = -40;
  // bulb_light_4.decay = 1.2;
  // bulb_light_4.angle = THREE.MathUtils.degToRad(15);
  scene.add(bulb_light_4);
  // scene.add(bulb_light_4.target);

  // this draws the outer boundry and stuff
  // let helper = new THREE.SpotLightHelper(bulb_light_2);
  // scene.add(helper);


  // now to make the fire place more realisic, we will have to give a red glow inside it
  color = 0xFF0000;
  intensity = 100;
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