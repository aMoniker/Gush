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
  k.origin("center"),
  "static",
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
    k.origin("center"),
    "static",
    "floor"
  ];
};

export const floorLadderDown = () => ([
  k.sprite("floor", { frame: 8 }),
  k.layer("game"),
  k.origin("center"),
  "static",
  "ladder_down",
]);

export const floorTrap = () => ([
  k.sprite("floor", { frame: 15 }),
  k.layer("game"),
  k.origin("center"),
  "static",
  "floor_trap",
  {
    sprung: false,
    canSpring: true,
  }
]);

export const chest = () => ([
  k.sprite("chest", { frame: 0 }),
  k.solid(),
  "static",
  "chest",
  "boundary", // chests can't be walked over
  {
    opened: false,
  }
]);

export const crate = () => ([
  k.sprite("crate", { noArea: true }),
  k.area(k.vec2(-6, -9), k.vec2(6, 8)),
  k.solid(),
  "crate",
]);