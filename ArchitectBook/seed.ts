import { default as xxhash } from "xxhash-wasm";

type Props = {
  seed: string;
};

const xxhashPromise = xxhash();

export const parseSeed = async (props: Props) =>
  (await xxhashPromise).h64(props.seed);
