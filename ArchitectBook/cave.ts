import { lerp } from "./Math";
import { noise } from "./noise";

export const isCave = async (props: {
  seed: string;
  x: number;
  y: number;
  z: number;
  height: number;
}): Promise<boolean> => {
  const breakingpoint1 = lerp({
    alpha: props.y / props.height,
    a: 0.25,
    b: 0.7,
  });

  const caveNoise = await noise({
    seed: props.seed,
    a: props.x / 256,
    b: props.y / 256,
    c: props.z / 256,
  });

  if (caveNoise >= breakingpoint1) {
    const breakingpoint2 = lerp({
      alpha: props.y / props.height,
      a: 0.2,
      b: 0.7,
    });

    return (
      (await noise({
        seed: props.seed,
        a: props.x / 16,
        b: props.y / 16,
        c: props.z / 20,
      })) > breakingpoint2 ||
      (await noise({
        seed: props.seed,
        c: props.x / 60,
        b: props.y / 75,
        a: props.z / 64,
      })) > breakingpoint2
    );
  } else {
    return false;
  }
};
