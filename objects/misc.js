import { k } from "/kaboom.js"
import { rng } from "/utils.js"

/**
 * Misc game objects:
 * . random floor tile
 * + door
 * > hole/down
 * < ladder/up
 * ? chest
 * c crate
 */

export const emptyTile = () => undefined;

export const floorTile = () => {
  let frame = 0;
  if (rng.gen() > 0.97) { // damaged floor
    frame = k.choose([3, 5, 6, 7]);
  } else { // normal floor
    frame = k.choose([0, 1, 2, 4]);
  }
  return [
    k.sprite("floor", { frame }),
    k.layer("floor"),
  ];
};

export const floorLadder = () => ([
  k.sprite("floor", { frame: 8 }),
  k.layer("game"),
]);

export const floorTrap = () => ([
  k.sprite("floor", { frame: 10 }),
  k.layer("game"),
  "floor_trap",
  {
    sprung: false,
    canSpring: true,
  }
]);