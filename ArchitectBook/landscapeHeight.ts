import { stretchToRange } from "./Math";
import { noise } from "./noise";

export const getLandscapeHeight = async (props: {
  seed: string;
  x: number;
  z: number;
}): Promise<number> => {
  const posId = JSON.stringify(props);

  return Math.floor(
    stretchToRange({
      value: await noise({
        seed: props.seed,
        a: props.x / 102400,
        b: props.z / 102400,
      }),
      min: 64,
      max: 256,
    }) +
      stretchToRange({
        value: await noise({
          seed: props.seed,
          a: props.x / 256,
          b: props.z / 256,
        }),
        min: 0,
        max: 32,
      }) +
      stretchToRange({
        value: await noise({
          seed: props.seed,
          a: props.x / 64,
          b: props.z / 64,
        }),
        min: 0,
        max: 16,
      }) +
      stretchToRange({
        value: await noise({
          seed: props.seed,
          a: props.x / 16,
          b: props.z / 16,
        }),
        min: 0,
        max: 3,
      })
  );
};
