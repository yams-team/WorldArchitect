import type { Block, Chunk } from "./types";

import { noise } from "./noise";
import { lerp } from "./Math";
import { getLandscapeHeight } from "./landscapeHeight";
import { minecraft } from "./minecraft";
import { isCave } from "./cave";

type Props = {
  seed: string;
  chunkX: number;
  chunkZ: number;
};

export const getChunk = async (props: Props): Promise<Chunk> => {
  const chunk: Chunk = new Array(16);

  let x = 0;
  let y = 0;
  let z = 0;

  const startX = 16 * props.chunkX;
  const startZ = 16 * props.chunkZ;

  const heightCache = new Map<string, number>();

  for (x = 0; x < 16; x++) {
    chunk[x] = new Array<Array<Block>>(384);
    for (y = 0; y < 384; y++) {
      chunk[x][y] = new Array<Block>(16);
      for (z = 0; z < 16; z++) {
        const absX = x + startX;
        const absZ = z + startZ;

        let height = 0;
        {
          const heightCacheId = `${absX};${absZ}`;
          if (heightCache.has(heightCacheId)) {
            height = heightCache.get(heightCacheId)!;
          } else {
            height = await getLandscapeHeight({
              seed: props.seed,
              x: absX,
              z: absZ,
            });
            heightCache.set(heightCacheId, height);
          }
        }

        if (
          y > height ||
          (await isCave({ seed: props.seed, x: absX, y, z: absZ, height }))
        ) {
          chunk[x][y][z] = minecraft.air;
        } else if (y < height) {
          if (
            (await noise({
              seed: props.seed,
              a: absX / 24,
              b: y / 24,
              c: absZ / 24,
            })) >
            lerp({
              alpha: y / height,
              a: 2,
              b: -0.75,
            })
          ) {
            chunk[x][y][z] = minecraft.dirt;
          } else {
            chunk[x][y][z] = minecraft.stone;
          }
        } else {
          chunk[x][y][z] = minecraft.grass;
        }
      }
    }
  }

  return chunk;
};
