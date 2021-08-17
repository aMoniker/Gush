import { k } from "/kaboom.js";
import hp from "/components/hp.js";
import gusher from "/components/gusher.js";
import lifecycle from "/components/lifecycle.js";
import monsterAISimple from "/components/monster-ai-simple.js";

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

const buildMonster = (spriteName, area, extraAttrs) => ([
  k.sprite(spriteName, { noArea: true }),
  k.solid(),
  k.area(k.vec2(area[0], area[1]), k.vec2(area[2], area[3])),
  "monster",
  "killable",
  {
    hit: false,
    dmg: 1,
    isDestroying: false,
    playerLOS: false,
    aiEnabled: true,
  },
  ...(extraAttrs ?? []),
]);

export const demonSmall = () => buildMonster("demon_small", [-4, -2, 4, 12], [
  hp({ current: 3, max: 3 }),
  gusher({ size: "small" }),
  monsterAISimple({ speed: 66.6 }),
]);

export const demonBig = () => buildMonster("demon_big", [-9, -8, 9, 16], [
  hp({ current: 10, max: 10 }),
  gusher({ size: "large" }),
  // monsterAIBigDemon(),
]);

export const goblin = () => buildMonster("goblin", [-4, 0, 4, 7], [
  hp({ current: 2, max: 2 }),
  gusher({ size: "small" }),
  monsterAISimple({ speed: 50 }),
]);

export const imp = () => buildMonster("imp", [-4, -2, 4, 7], [
  hp({ current: 2, max: 2 }),
  gusher({ size: "small" }),
  monsterAISimple({ speed: 54 }),
]);
export const ogre = () => buildMonster("ogre", [-8, -5, 8, 16], [
  hp({ current: 10, max: 10 }),
  gusher({ size: "large" }),
  monsterAISimple({ speed: 27 }),
  { dmg: 2 },
]);

export const muddy = () => buildMonster("muddy", [-5, -6, 5, 8], [
  hp({ current: 4, max: 4 }),
  gusher({ size: "medium" }),
  monsterAISimple({ speed: 7 }),
  { dmg: 2 },
]);
export const swampy = () => buildMonster("swampy", [-5, -6, 5, 8], [
  hp({ current: 5, max: 5 }),
  gusher({ size: "medium" }),
  monsterAISimple({ speed: 5 }),
  { dmg: 3 },
]);

export const wogol = () => buildMonster("wogol", [-4, -2, 4, 9], [
  hp({ current: 3, max: 3 }),
  gusher({ size: "small" }),
  monsterAISimple({ speed: 38 }),
]);

export const necromancer = () => buildMonster("necromancer", [-5, -5, 5, 9], [
  hp({ current: 4, max: 4 }),
  gusher({ size: "medium" }),
  // monsterAINecromancer(), // spawns skellies
]);
export const skeleton = () => buildMonster("skeleton", [-4, -4, 4, 8], [
  hp({ current: 1, max: 1 }),
  monsterAISimple({ speed: 33 }),
]);

export const orcMasked = () => buildMonster("orc_masked", [-4.5, -4, 4.5, 8], [
  hp({ current: 5, max: 5 }),
  gusher({ size: "medium" }),
  monsterAISimple({ speed: 33 }),
]);
export const orcShaman = () => buildMonster("orc_shaman", [-4.5, -4, 4.5, 8], [
  hp({ current: 3, max: 3 }),
  gusher({ size: "medium" }),
  // monsterAIOrcShaman(), // heals friends
]);
export const orcWarrior = () => buildMonster("orc_warrior", [-4.5, -4, 4.5, 8], [
  hp({ current: 4, max: 4 }),
  gusher({ size: "medium" }),
  monsterAISimple({ speed: 33 }),
]);
export const randomOrc = () => {
  return k.choose([orcMasked, orcShaman, orcWarrior])()
};

export const zombieBig = () => buildMonster("zombie_big", [-8, -7, 8, 16], [
  hp({ current: 7, max: 7 }),
  gusher({ size: "large" }),
  monsterAISimple({ speed: 23 }),
  { dmg: 3 },
]);
export const zombieIce = () => buildMonster("zombie_ice", [-4, -5, 4, 7], [
  hp({ current: 5, max: 5 }),
  monsterAISimple({ speed: 1 }),
  { dmg: 2 },
]);
export const zombieTiny = () => buildMonster("zombie_tiny", [-3, 0, 3, 7], [
  hp({ current: 1, max: 1 }),
  gusher({ size: "small" }),
  monsterAISimple({ speed: 13 }),
]);
export const zombiePlain = () => buildMonster("zombie", [-4, -5, 4, 7], [
  hp({ current: 3, max: 3 }),
  gusher({ size: "small" }),
  monsterAISimple({ speed: 18 }),
]);
export const randomZombie = () => {
  return k.choose([zombieIce, zombieTiny, zombiePlain])();
}

// TODO - prevent mimic damage to player until opened
export const mimic = () => ([
  k.sprite("chest", { noArea: true, frame: 6 }),
  k.solid(),
  k.area(k.vec2(-8, -5), k.vec2(8, 8)),
  hp({ current: 3, max: 3 }),
  "monster",
  "killable",
]);