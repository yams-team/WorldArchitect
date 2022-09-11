import type { Block } from "./types";

export const minecraft = {
  air: { id: 0, textId: "minecraft:air", variant: 0 } as Block,
  stone: { id: 1, textId: "minecraft:stone", variant: 0 } as Block,
  granite: { id: 1, textId: "minecraft:stone", variant: 1 } as Block,
  polishedGranite: { id: 1, textId: "minecraft:stone", variant: 2 } as Block,
  diorite: { id: 1, textId: "minecraft:stone", variant: 3 } as Block,
  polishedDiorite: { id: 1, textId: "minecraft:stone", variant: 4 } as Block,
  andesite: { id: 1, textId: "minecraft:stone", variant: 5 } as Block,
  polishedAndesite: { id: 1, textId: "minecraft:stone", variant: 6 } as Block,
  grass: { id: 2, textId: "minecraft:grass", variant: 0 } as Block,
  dirt: { id: 3, textId: "minecraft:dirt", variant: 0 } as Block,
  coarseDirt: { id: 3, textId: "minecraft:dirt", variant: 1 } as Block,
  podzol: { id: 3, textId: "minecraft:dirt", variant: 2 } as Block,
  cobblestone: { id: 4, textId: "minecraft:cobblestone", variant: 0 } as Block,
};
