import { k } from "/kaboom.js";
import hp from "/components/hp.js";

/**
 * Monsters:
 * d small demon
 * D big demon
 * g goblin
 * i imp
 * m muddy
 * n necromancer
 * o ogre
 * O random orc
 * s skeleton
 * S swampy
 * w wogol
 * Z big zombie
 * z random zombie
 */

const basicMob = (spriteName, area, extraAttrs) => ([
  k.sprite(spriteName, { noArea: true }),
  k.solid(),
  k.area(k.vec2(area[0], area[1]), k.vec2(area[2], area[3])),
  hp({ current: 2, max: 2 }),
  "non-player",
  "monster",
  "killable",
  ...(extraAttrs ?? []),
]);

export const demonSmall = () => basicMob("demon_small", [4, 10, 12, 23]);
export const demonBig = () => basicMob("demon_big", [7, 10, 25, 35,]);
export const goblin = () => basicMob("goblin", [5, 7, 12, 16]);
export const imp = () => basicMob("imp", [4, 7, 13, 16]);
export const ogre = () => basicMob("ogre", [8, 8, 24, 31]);
export const muddy = () => basicMob("muddy", [2, 2, 14, 16]);
export const swampy = () => basicMob("swampy", [2, 2, 14, 16]);
export const wogol = () => basicMob("wogol", [4, 7, 12, 19]);

export const necromancer = () => basicMob("necromancer", [3, 5, 13, 19]);
export const skeleton = () => basicMob("skeleton", [4, 4, 12, 16]);

export const orcMasked = () => basicMob("orc_masked", [4, 7, 14, 19]);
export const orcShaman = () => basicMob("orc_shaman", [4, 7, 14, 19]);
export const orcWarrior = () => basicMob("orc_warrior", [4, 6, 14, 19]);
export const randomOrc = () => {
  return k.choose([orcMasked, orcShaman, orcWarrior])()
};

export const zombieBig = () => basicMob("zombie_big", [8, 10, 24, 33]);
export const zombieIce = () => basicMob("zombie_ice", [4, 3, 12, 15]);
export const zombieTiny = () => basicMob("zombie_tiny", [5, 8, 12, 15]);
export const zombiePlain = () => basicMob("zombie", [4, 3, 12, 15]);
export const randomZombie = () => {
  return k.choose([zombieIce, zombieTiny, zombiePlain])();
}

// TODO - prevent mimic damage to player until opened
export const mimic = () => ([
  k.sprite("chest", { noArea: true, frame: 6 }),
  k.solid(),
  k.area(k.vec2(0, 3), k.vec2(16, 16)),
  "non-player",
  "monster",
  "killable",
])