import { k } from "/kaboom.js";
import { flashColor, tween, easing, rng } from "/utils.js";
import { config } from "/config.js";
import { boundaryMap, translateWorldToMapCoords } from "/levels/spatial.js";

const handleMonsterCollision = (player, monster) => {
  if (monster.dead || monster.spawning) return;
  player.hurt(monster.dmg, monster);
};

const handleMonsterHurt = (monster, amt, hurtBy) => {
  // flash the monster red
  flashColor(monster, [1, 0, 0, 1], 0.2);

  // slap the monster away
  if (!monster.noSlap) {
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
  }

  k.play("punch-clean-heavy", {
    loop: false,
    volume: 0.666,
    detune: -100,
  });
};

const handleMonsterDeath = (monster, killedBy) => {
  monster.isDestroying = true;
  monster.aiEnabled = false;
  monster.solid = false;
  monster.color ?? monster.use(k.color(1, 1, 1, 1));
  monster.angle ?? monster.use(k.rotate(0));
  monster.scale ?? monster.use(k.scale(1));
  const flip = killedBy.pos.x - monster.pos.x >= 0 ? 1 : -1;

  // death effects; bye bye monster
  tween(monster, 2, {
    "color.r": 1,
    "color.g": 0,
    "color.b": 0,
    "color.a": 0,
    "angle": monster.angle + (Math.PI / 2 * flip),
    "pos.y": monster.pos.y - config.tileHeight / 2,
    "pos.x": monster.pos.x - (config.tileWidth * 2 * flip),
  }, easing.easeOutQuart).then(() => {
    monster.destroy();
    monster.isDestroying = false;
  });
};


// we check against our own boundary index and push monsters out if they're nearby.
// simply using a collides handler for all monsters makes the game unplayably slow.
const handleBoundaries = (monster) => {
    const coords = translateWorldToMapCoords(monster.pos.x, monster.pos.y);
    const checks = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        checks.push({ x: coords.x + x, y: coords.y + y });
      }
    }
    for (const check of checks) {
      if (boundaryMap.has(check.x, check.y)) {
        monster.pushOutAll();
        break;
      }
    }
};

const pushOutAllMonsters = () => k.every("monster", (m) => m.pushOutAll());

export default () => {
  k.collides("player", "monster", handleMonsterCollision);
  k.on("hurt", "monster", handleMonsterHurt);
  k.on("death", "monster", handleMonsterDeath);
  k.action("monster", handleBoundaries);
  k.loop(1, pushOutAllMonsters); // push out all monsters every second
};