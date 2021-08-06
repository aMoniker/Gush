import { k } from "/kaboom.js"
import { rng } from "/utils.js"

/**
 * Misc game objects:
 * . random floor tile
 * + door
 * > hole/down
 * ? chest
 * c crate
 */

export const emptyTile = () => undefined;

export const edgeTile = () => ([
  k.sprite("edge"),
  k.layer("floor"),
]);

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

export const floorLadderDown = () => ([
  k.sprite("floor", { frame: 8 }),
  k.layer("game"),
  "ladder_down",
  "interactive",
]);

export const floorTrap = () => ([
  k.sprite("floor", { frame: 10 }),
  k.layer("game"),
  "floor_trap",
  "interactive",
  {
    sprung: false,
    canSpring: true,
  }
]);