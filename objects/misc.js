import { k } from "/kaboom.js";
import { rng } from "/utils.js";
import { config } from "/config.js";

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

const hw = config.tileWidth / 2;
const hh = config.tileHeight / 2;
export const floorTrap = () => ([
  k.sprite("floor", { frame: 15, noArea: true }),
  k.layer("game"),
  k.origin("center"),
  // k.area(config.tileWidth * 0.75, config.tileHeight * 0.75),
  k.area(k.vec2(-hw * 0.75, -hh * 0.75), k.vec2(hw * 0.75, hh * 0.75)),
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
    wasEmpty: false,
  }
]);

export const crate = () => ([
  k.sprite("crate", { noArea: true }),
  k.area(k.vec2(-9, -9), k.vec2(9, 9)),
  k.solid(),
  "crate",
]);