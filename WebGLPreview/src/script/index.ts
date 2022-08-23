import {
  PerspectiveCamera,
  Scene,
  BoxGeometry,
  MeshNormalMaterial,
  Mesh,
  WebGLRenderer,
  FogExp2,
  DirectionalLight,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { degToRad } from "three/src/math/MathUtils";
import type { Chunk } from "./Chunk";
import { generateChunk } from "./generate";

const camera = new PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.01,
  10
);
camera.position.set(0, 10, 5);
camera.rotateX(degToRad(-10));

const scene = new Scene();
scene.fog = new FogExp2(0x000000, 0.00000025);

const dirLight = new DirectionalLight(0xffffff);
dirLight.position.set(-1, 0, 1).normalize();
scene.add(dirLight);

const blockSize = 0.2;
const blockGap = 0.001;

const geometry = new BoxGeometry(blockSize, blockSize, blockSize);
const material = new MeshNormalMaterial();

const loadChunk = (chunk: Chunk) => {
  scene.clear();

  for (let x = 0; x < 255; x++) {
    for (let y = 0; y < 255; y++) {
      for (let z = 0; z < 255; z++) {
        try {
          const block = chunk[x][y][z];
          if (block && block.id !== 0) {
            const mesh = new Mesh(geometry, material);
            mesh.position.set(
              (blockSize + blockGap) * x,
              (blockSize + blockGap) * y,
              (blockSize + blockGap) * z
            );
            scene.add(mesh);
          }
        } catch {
          break;
        }
      }
    }
  }
};

// const velocity = new Vector3(0, 0, 0);

const renderer = new WebGLRenderer({ antialias: true, precision: "lowp" });
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(
  8 * (blockSize + blockGap),
  30 * (blockSize + blockGap),
  8 * (blockSize + blockGap)
);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(() => {
  // controls.target.add(velocity);
  // controls.target0.add(velocity);
  renderer.render(scene, camera);

  controls.update();
});

document.body.appendChild(renderer.domElement);

// window.addEventListener("click", () => {
//   if (!document.pointerLockElement) {
//     renderer.domElement.requestPointerLock ??= (
//       renderer.domElement as any
//     ).mozRequestPointerLock;

//     if (renderer.domElement.requestPointerLock) {
//       renderer.domElement.requestPointerLock();
//     }
//   }
// });

// window.addEventListener("mousemove", (e) => {
//   if (document.pointerLockElement) {
//     camera.rotateOnWorldAxis(new Vector3(0, 1, 0), degToRad(e.movementX / 10));
//     camera.rotateOnWorldAxis(new Vector3(1, 0, 0), degToRad(e.movementY / 10));
//   }
// });

// window.addEventListener("resize", () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });

// window.addEventListener("keydown", (e) => {
//   switch (e.key) {
//     case "r":
//       velocity.set(0, 0, 0);
//       controls.target.set(0, 0, 0);
//       controls.target0.set(0, 0, 0);
//       break;
//     case "e":
//       velocity.setY(0.1);
//       break;
//     case "q":
//       velocity.setY(-0.1);
//       break;
//     case "w":
//       velocity.setZ(-0.1);
//       break;
//     case "s":
//       velocity.setZ(0.1);
//       break;
//     case "a":
//       velocity.setX(-0.1);
//       break;
//     case "d":
//       velocity.setX(0.1);
//       break;
//   }
// });

// window.addEventListener("keyup", (e) => {
//   switch (e.key) {
//     case "e":
//     case "q":
//       velocity.setY(0);
//       break;
//     case "w":
//     case "s":
//       velocity.setZ(0);
//       break;
//     case "a":
//     case "d":
//       velocity.setX(0);
//       break;
//   }
// });

loadChunk(generateChunk());
