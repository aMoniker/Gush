import { k } from "/kaboom.js";
import hp from "/components/hp.js";
import gusher from "/components/gusher.js";
import skullDropper from "/components/skull-dropper.js";
import lifecycle from "/components/lifecycle.js";
import monsterAISimple from "/components/monster-ai-simple.js";
import monsterAINecro from "/components/monster-ai-necro.js";
import monsterAIShaman from "/components/monster-ai-shaman.js";
import monsterAIMimic from "/components/monster-ai-mimic.js";
import monsterAIDemonSmall from "/components/monster-ai-demon-small.js";
import monsterAIDemonBoss from "/components/monster-ai-demon-boss.js";
import { rng } from "/utils.js"

const buildMonster = (spriteName, area, extraAttrs) => ([
  k.sprite(spriteName, { noArea: true }),
  k.solid(),
  k.area(k.vec2(area[0], area[1]), k.vec2(area[2], area[3])),
  k.color(1, 1, 1, 1),
  skullDropper(),
  "monster",
  "killable",
  {
    hit: false,
    dmg: 1,
    isDestroying: false,
    playerLOS: false,
    aiEnabled: true,
    spawning: false,
  },
  ...(extraAttrs ?? []),
]);

export const imp = () => buildMonster("imp", [-4, -2, 4, 7], [
  hp({ current: 1, max: 1 }),
  gusher({ size: "small" }),
  monsterAISimple({ speed: 54 }),
]);
export const wogol = () => buildMonster("wogol", [-4, -2, 4, 9], [
  hp({ current: 3, max: 3 }),
  gusher({ size: "small" }),
  monsterAISimple({ speed: 42 }),
]);
export const demonSmall = () => buildMonster("demon_small", [-4, -4, 4, 10], [
  hp({ current: 3, max: 3 }),
  gusher({ size: "small" }),
  monsterAIDemonSmall({ speed: 47.7 }),
]);
export const demonBig = () => buildMonster("demon_big", [-9, -8, 9, 16], [
  hp({ current: 1998, max: 1998 }),
  gusher({ size: "large" }),
  "demon_boss",
  monsterAIDemonBoss(),
  {
    noSlap: true,
  }
]);

export const muddy = () => buildMonster("muddy", [-5, -6, 5, 8], [
  hp({ current: 4, max: 4 }),
  gusher({ size: "medium" }),
  monsterAISimple({ speed: 7 }),
  { dmg: 2 },
  // spits mud
]);
export const swampy = () => buildMonster("swampy", [-5, -6, 5, 8], [
  hp({ current: 5, max: 5 }),
  gusher({ size: "medium" }),
  monsterAISimple({ speed: 5 }),
  // spits slime
  { dmg: 3 },
]);

export const necromancer = () => buildMonster("necromancer", [-5, -5, 5, 9], [
  hp({ current: 4, max: 4 }),
  gusher({ size: "medium" }),
  monsterAINecro(),
]);
export const skeleton = () => buildMonster("skeleton", [-4, -4, 4, 8], [
  hp({ current: 1, max: 1 }),
  lifecycle({
    onAdd: (s) => {
      s.on("death", () => {
        k.play("bone-hit-1", {
          volume: 0.77,
          speed: 0.8,
          detune: k.map(rng.gen(), 0, 1, -700, -200),
        });
      });
    }
  }),
  monsterAISimple({ speed: 33 }),
]);

export const goblin = () => buildMonster("goblin", [-4, 0, 4, 7], [
  hp({ current: 2, max: 2 }),
  gusher({ size: "small" }),
  monsterAISimple({ speed: 50 }),
  "monster_orc",
]);
export const orcMasked = () => buildMonster("orc_masked", [-4.5, -4, 4.5, 8], [
  hp({ current: 5, max: 5 }),
  gusher({ size: "medium" }),
  monsterAISimple({ speed: 33 }),
  "monster_orc",
]);
export const orcShaman = () => buildMonster("orc_shaman", [-4.5, -4, 4.5, 8], [
  hp({ current: 3, max: 3 }),
  gusher({ size: "medium" }),
  "monster_orc",
  monsterAIShaman(),
]);
export const orcWarrior = () => buildMonster("orc_warrior", [-4.5, -4, 4.5, 8], [
  hp({ current: 4, max: 4 }),
  gusher({ size: "medium" }),
  "monster_orc",
  monsterAISimple({ speed: 33 }),
]);
export const ogre = () => buildMonster("ogre", [-8, -5, 8, 16], [
  hp({ current: 10, max: 10 }),
  gusher({ size: "large" }),
  monsterAISimple({ speed: 33 }),
  // TODO - flashes color then charges at player
  "monster_orc",
  { dmg: 2 },
]);
export const randomOrc = () => {
  return k.choose([orcMasked, orcShaman, orcWarrior])()
};

export const zombieTiny = () => buildMonster("zombie_tiny", [-3, 0, 3, 7], [
  hp({ current: 1, max: 1 }),
  gusher({ size: "small" }),
  monsterAISimple({ speed: 13 }),
]);
export const zombiePlain = () => buildMonster("zombie", [-4, -5, 4, 7], [
  hp({ current: 2, max: 2 }),
  gusher({ size: "small" }),
  monsterAISimple({ speed: 18 }),
]);
export const zombieIce = () => buildMonster("zombie_ice", [-4, -5, 4, 7], [
  hp({ current: 5, max: 5 }),
  monsterAISimple({ speed: 1 }),
  // TODO - breaks like ice, splits into two smaller ice zombie shards
  { dmg: 2 },
]);
export const zombieBig = () => buildMonster("zombie_big", [-8, -7, 8, 16], [
  hp({ current: 7, max: 7 }),
  gusher({ size: "large" }),
  monsterAISimple({ speed: 23 }),
  { dmg: 3 },
]);
export const randomZombie = () => {
  // return k.choose([zombieIce, zombieTiny, zombiePlain])();

  const rnd = rng.gen();
  switch (true) {
    case (rnd <= 0.1): return zombieBig();
    case (rnd <= 0.5): return zombiePlain();
    default: return zombieTiny();
  }

  // return k.choose([zombieTiny, zombiePlain, zombieBig])();
}

export const mimic = () => ([
  k.sprite("chest", { noArea: true, frame: 6 }),
  k.solid(),
  k.area(k.vec2(-8, -5), k.vec2(8, 8)),
  k.color(1, 1, 1, 1),
  hp({ current: 3, max: 3 }),
  // when player gets a couple tiles away, mimic roars to life, runs at player
  monsterAIMimic(),
  lifecycle({
    onAdd: (m) => {
      m.on("death", () => k.play("wood-4", {
        speed: 0.1,
        detune: 2000,
      }))
    }
  }),
  "monster",
  "killable",
]);