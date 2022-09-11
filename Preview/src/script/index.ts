import {
  PerspectiveCamera,
  Scene,
  BoxGeometry,
  MeshNormalMaterial,
  Mesh,
  WebGLRenderer,
  FogExp2,
  DirectionalLight,
  HemisphereLight,
  MeshLambertMaterial,
  Material,
  Group,
  InstancedMesh,
  Matrix4,
} from "three";
import { OrbitControls as Controls } from "three/examples/jsm/controls/OrbitControls";
import type { Block } from "architect-book/types";
import type { Chunk } from "architect-book/types";
import { getChunk } from "architect-book";

const camera = new PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.01,
  25
);
camera.position.set(0, 20, 5);

const scene = new Scene();

const skyLight = new HemisphereLight(0xffffff, 0x000000, 0.5);
scene.add(skyLight);

const blocksGroup = new Group();
scene.add(blocksGroup);

const blockSize = 0.2;

const geometry = new BoxGeometry(blockSize, blockSize, blockSize);
const colorMat = (color: number) =>
  new MeshLambertMaterial({ color, precision: "lowp" });
const material = new Map<string, Material>([
  ["minecraft:stone", colorMat(0x7f7f7f)],
  ["minecraft:grass", colorMat(0x00ff00)],
  ["minecraft:dirt", colorMat(0x7f3f00)],
]);

const chunkLoop = (
  chunk: Chunk,
  chunkX: number,
  chunkZ: number,
  fn: (x: number, y: number, z: number, block: Block) => void
) => {
  const startX = 16 * chunkX;
  const startZ = 16 * chunkZ;

  for (let x = 0; x < 64; x++) {
    for (let y = 0; y < 319; y++) {
      for (let z = 0; z < 64; z++) {
        if (
          Array.isArray(chunk) &&
          x < chunk.length &&
          Array.isArray(chunk[x]) &&
          y < chunk[x].length &&
          Array.isArray(chunk[x][y]) &&
          z < chunk[x][y].length
        ) {
          const block = chunk[x][y][z];
          fn(x + startX, y, z + startZ, block);
        }
      }
    }
  }
};

const loadChunk = (chunk: Chunk, chunkX: number, chunkZ: number) => {
  const instanceGroups = new Map(
    Array.from(material.keys()).map((key) => {
      const mat = material.get(key)!;

      let count = 0;
      chunkLoop(chunk, chunkX, chunkZ, (_x, _y, _z, block) => {
        if (block.textId === key) {
          count++;
        }
      });

      return [key, new InstancedMesh(geometry, mat, count)];
    })
  );

  const instanceGroupIndex = new Map<string, number>();

  chunkLoop(chunk, chunkX, chunkZ, (x, y, z, block) => {
    if (block.id === 0) {
      return;
    }

    const instanceGroup = instanceGroups.get(block.textId);

    if (!instanceGroup) {
      throw new Error(`No instance group for block ${block.textId}`);
    }

    const i = instanceGroupIndex.get(block.textId) ?? 0;

    instanceGroup.setMatrixAt(
      i,
      new Matrix4().makeTranslation(x * blockSize, y * blockSize, z * blockSize)
    );

    instanceGroupIndex.set(block.textId, i + 1);
  });

  for (const instanceGroup of instanceGroups.values()) {
    blocksGroup.add(instanceGroup);
  }
};

const renderer = new WebGLRenderer({ antialias: false, precision: "lowp" });
const controls = new Controls(camera, renderer.domElement);
controls.target.set(8 * blockSize, 75 * blockSize, 8 * blockSize);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);

  controls.update();
});

document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

blocksGroup.clear();

(async (radius: number) => {
  for (let x = -radius; x < radius; x++) {
    for (let z = -radius; z < radius; z++) {
      const chunkName = `Chunk(${x}, ${z})`;
      console.time(chunkName);
      const chunk = await getChunk({
        seed: "the seed of notch",
        chunkX: x,
        chunkZ: z,
      });
      console.timeEnd(chunkName);

      loadChunk(chunk, x, z);
    }
  }
})(2);
