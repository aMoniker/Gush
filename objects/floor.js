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
    k.layer("game"),
  ];
};

export const floorLadder = () => ([
  k.sprite("floor", { frame: 8 }),
  k.layer("game"),
]);

// const ladder = floorLadder();
// console.log('ladder', ladder);

export const floorTrap = () => ([
  k.sprite("floor", { frame: 10 }),
  k.layer("game"),
  "floor_trap",
  {
    sprung: false,
    canSpring: true,
  }
]);