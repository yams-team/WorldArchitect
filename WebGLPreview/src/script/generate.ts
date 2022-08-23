import type { Chunk } from "./Chunk";
import type { Block } from "./Block";

export const generateChunk = (): Chunk => {
  const chunk: Chunk = new Array();
  for (let x = 0; x < 16; x++) {
    const row = new Array<Array<Block>>();
    for (let y = 0; y < 32; y++) {
      const column = new Array<Block>();
      for (let z = 0; z < 16; z++) {
        if (y >= 30 && Math.random() > 0.5) {
          column.push({
            id: 0,
            variant: 0,
            textId: "minecraft:air",
          });
        } else {
          column.push({
            id: 3,
            variant: 0,
            textId: "minecraft:dirt",
          });
        }
      }
      row.push(column);
    }
    chunk.push(row as any);
  }

  return chunk;
};
