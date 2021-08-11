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
  hp({ current: 10, max: 10 }),
  "non-player",
  "monster",
  "killable",
  {
    hit: false,
  },
  ...(extraAttrs ?? []),
]);

export const demonSmall = () => basicMob("demon_small", [-4, -2, 4, 12]);
export const demonBig = () => basicMob("demon_big", [-9, -8, 9, 16]);
export const goblin = () => basicMob("goblin", [-4, 0, 4, 7]);
export const imp = () => basicMob("imp", [-4, -2, 4, 7]);
export const ogre = () => basicMob("ogre", [-8, -5, 8, 16]);
export const muddy = () => basicMob("muddy", [-5, -6, 5, 8]);
export const swampy = () => basicMob("swampy", [-5, -6, 5, 8]);
export const wogol = () => basicMob("wogol", [-4, -2, 4, 9]);

export const necromancer = () => basicMob("necromancer", [-5, -5, 5, 9]);
export const skeleton = () => basicMob("skeleton", [-4, -4, 4, 8]);

export const orcMasked = () => basicMob("orc_masked", [-4.5, -4, 4.5, 8]);
export const orcShaman = () => basicMob("orc_shaman", [-4.5, -4, 4.5, 8]);
export const orcWarrior = () => basicMob("orc_warrior", [-4.5, -4, 4.5, 8]);
export const randomOrc = () => {
  return k.choose([orcMasked, orcShaman, orcWarrior])()
};

export const zombieBig = () => basicMob("zombie_big", [-8, -7, 8, 16]);
export const zombieIce = () => basicMob("zombie_ice", [-4, -5, 4, 7]);
export const zombieTiny = () => basicMob("zombie_tiny", [-3, 0, 3, 7]);
export const zombiePlain = () => basicMob("zombie", [-4, -5, 4, 7]);
export const randomZombie = () => {
  return k.choose([zombieIce, zombieTiny, zombiePlain])();
}

// TODO - prevent mimic damage to player until opened
export const mimic = () => ([
  k.sprite("chest", { noArea: true, frame: 6 }),
  k.solid(),
  k.area(k.vec2(-8, -5), k.vec2(8, 8)),
  hp({ current: 2, max: 2 }),
  "non-player",
  "monster",
  "killable",
]);