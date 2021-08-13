import { k } from "/kaboom.js";
import { tween, easing, rng } from "/utils.js";
import { config } from "/config.js";
import { getMapCoordsFromWorld, wallIndex, wallsByCoords } from "/levels/utils.js";

const handleMonsterCollision = (player, monster) => {
  if (monster.dead) return;
  player.hurt(monster.dmg, monster);
};

const handleMonsterHurt = (monster, amt, hurtBy) => {
  // flash the monster red
  if (!monster.color) monster.use(k.color(1, 0, 0, 1));
  k.wait(0.1, () => monster.color = undefined);

  // slap the monster away
  monster.hit = true;
  const slapDir = monster.pos.sub(hurtBy.pos).unit();
  const slapTime = 0.3;
  const slapDist = config.tileWidth * 0.5;
  tween(monster, slapTime, {
    "pos.x": monster.pos.x + slapDir.x * slapDist,
    "pos.y": monster.pos.y + slapDir.y * slapDist,
  }, easing.linear, () => {
    monster.pushOutAll();
  }).then(() => {
    monster.hit = false;
  });

  k.play("punch-clean-heavy", {
    loop: false,
    volume: 0.666,
    detune: -100,
  });
};

// TODO - some of these still need some adjustments
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
    k.color(1, 1, 1, 0.88),
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


// we check against our own boundary index and push monsters out if they're nearby.
// simply using a collides handler for all monsters makes the game unplayably slow.
const handleWallBoundaries = (monster) => {
    const coords = getMapCoordsFromWorld(monster.pos.x, monster.pos.y);
    const checks = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        checks.push({ x: coords.x + x, y: coords.y + y });
      }
    }
    for (const check of checks) {
      if (wallIndex.get(check.x, check.y)) {
        monster.pushOutAll();
        break;
      }
    }
};

export default () => {
  k.collides("player", "monster", handleMonsterCollision);
  k.on("hurt", "monster", handleMonsterHurt);
  k.on("death", "monster", handleMonsterDeath);
  k.action("monster", handleWallBoundaries);
};