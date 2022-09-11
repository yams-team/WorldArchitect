/**
 * stretch a normalized (-1 -> 1) value to a range
 */
export const stretchToRange = (props: {
  value: number;
  min: number;
  max: number;
}) => {
  if (props.value < -1 || props.value > 1 || props.min > props.max) {
    throw new Error("invalid arguments");
  }

  return Math.floor(
    ((props.value + 1) * (props.max - props.min)) / 2 + props.min
  );
};

/**
 * clamps a value between a min and max
 */
export const clamp = (props: { value: number; min: number; max: number }) => {
  if (props.min > props.max) {
    throw new Error("invalid arguments");
  }

  return Math.min(Math.max(props.value, props.min), props.max);
};

/**
 * get lerped value at position alpha between a and b
 */
export const lerp = (props: { alpha: number; a: number; b: number }) => {
  const alpha = clamp({ value: props.alpha, min: 0, max: 1 });
  const x = alpha * props.b + (1 - alpha) * props.a;
  return x;
};
