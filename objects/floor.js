import { k } from "/kaboom.js"
import { rng } from "/utils.js"

export const floorTileRandom = () => {
  let frame = 0;
  if (rng.gen() > 0.9) { // damaged floor
    frame = k.choose([3, 5, 6, 7]);
  } else { // normal floor
    frame = k.choose([0, 1, 2, 4]);
  }
  return [
    k.sprite("floor", { frame }),
  ];
};

export const floorLadder = () => ([
  k.sprite("floor", { frame: 8 }),
]);

export const floorTrap = () => ([
  k.sprite("floor", { frame: 10 }),
  "floor_trap"
]);