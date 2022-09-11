import {
  RandomFn,
  NoiseFunction2D,
  NoiseFunction3D,
  NoiseFunction4D,
  createNoise3D,
  createNoise4D,
} from "simplex-noise";

import alea from "alea";
import { createNoise2D } from "simplex-noise";

type Props = {
  seed: string;
  a: number;
  b: number;
  c?: number;
  d?: number;
};

type dimensions = 2 | 3 | 4;

const prngDict = new Map<dimensions, RandomFn>();

const getPrng = async (props: Props) => {
  const dimension = props.c ? (props.d ? 4 : 3) : 2;

  if (prngDict.has(dimension)) {
    return prngDict.get(dimension)!;
  } else {
    const prng = alea(props.seed);
    prngDict.set(dimension, prng);
    return prng;
  }
};

type noiseFunction = NoiseFunction2D | NoiseFunction3D | NoiseFunction4D;

const noiseDict = new Map<dimensions, noiseFunction>();

const getNoise = async (props: Props) => {
  const dimension = props.c ? (props.d ? 4 : 3) : 2;

  if (noiseDict.has(dimension)) {
    return noiseDict.get(dimension)!;
  } else {
    const prng = await getPrng(props);
    const noise =
      dimension == 2
        ? createNoise2D(prng)
        : dimension == 3
        ? createNoise3D(prng)
        : createNoise4D(prng);
    noiseDict.set(dimension, noise);
    return noise;
  }
};

/**
 * Simplex Noise -1 to 1
 */
export const noise = async (props: Props): Promise<number> =>
  (await getNoise(props)).call(globalThis, props.a, props.b, props.c, props.d);
