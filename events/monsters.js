import { k } from "/kaboom.js";
import { tween, easing, rng } from "/utils.js";
import { config } from "/config.js";

const handleMonsterCollision = (player, monster) => {
  if (monster.dead) return;
  player.hurt(1, monster); // TODO - make dmg amnt depend on monster?
};

const bloodSpriteConfigs = {
  "vfx-blood-1": (monster, flip) => ([k.pos(monster.pos)]),
  "vfx-blood-2": (monster, flip) => ([k.pos(monster.pos.add(flip * 33, 10))]),
  "vfx-blood-3": (monster, flip) => ([k.pos(monster.pos.add(flip * 40, 20))]),
  "vfx-blood-4": (monster, flip) => ([k.pos(monster.pos.add(-flip * 17, 20))]),
  "vfx-blood-5": (monster, flip) => ([k.pos(monster.pos.add(flip * 20, 17))]),
  "vfx-blood-6": (monster, flip) => ([k.pos(monster.pos.add(flip * 5, 10))]),
  "vfx-blood-7": (monster, flip) => ([k.pos(monster.pos.add(flip * 30, 12))]),
  "vfx-blood-8": (monster, flip) => ([k.pos(monster.pos.add(flip * 40, 17))]),
};

const handleMonsterDeath = (monster, killedBy) => {
  monster.solid = undefined;
  if (!monster.color) monster.use(k.color(1, 0, 0, 1));
  if (!monster.angle) monster.use(k.rotate(0));
  if (!monster.scale) monster.use(k.scale(1));

  // show a random blood sprite
  const bloodSpriteName = k.choose(Object.keys(bloodSpriteConfigs));
  let flipX = killedBy.pos.x - monster.pos.x >= 0;
  const flipDir = flipX ? -1 : 1;
  if (bloodSpriteName === "vfx-blood-4") flipX = !flipX; // this one is backwards
  const bloodSprite = k.sprite(bloodSpriteName, { noArea: true, animSpeed: 0.1, flipX });
  const bloodFrames = bloodSprite.numFrames();
  const blood = k.add([
    bloodSprite,
    k.layer("fx"),
    k.origin("bot"),
    ...bloodSpriteConfigs[bloodSpriteName](monster, flipDir),
  ]);
  blood.play("main", false);
  k.wait(bloodSprite.animSpeed * bloodSprite.numFrames(), () => {
    blood.destroy();
  });

  // GUSH
  k.play("giblet-splatter", {
    loop: false,
    volume: 0.93,
    speed: 1.3,
    detune: k.map(rng.gen(), 0, 1, -700, 200),
  });

  // death effects; bye bye monster
  tween(monster, 1, {
    "color.a": 0,
    "angle": monster.angle + (Math.PI / 2 * -flipDir),
    "pos.y": monster.pos.y - config.tileHeight / 2,
    "pos.x": monster.pos.x - (config.tileWidth * 2 * -flipDir),
  }, easing.easeOutQuart).then(() => {
    monster.destroy();
  });
};

export default () => {
  k.collides("player", "monster", handleMonsterCollision);
  k.on("death", "monster", handleMonsterDeath);
};