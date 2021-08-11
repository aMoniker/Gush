import { k } from "/kaboom.js";
import { tween, easing } from "/utils.js";
import { config } from "/config.js";

const handleMonsterCollision = (player, monster) => {
  if (monster.dead) return;
  player.hurt(1, monster); // TODO - make dmg amnt depend on monster?
};

const handleMonsterDeath = (monster) => {
  monster.solid = undefined;
  if (!monster.color) monster.use(k.color(1, 0, 0, 1));
  if (!monster.angle) monster.use(k.rotate(0));
  if (!monster.scale) monster.use(k.scale(1));
  tween(monster, 1, {
    "color.a": 0,
    "angle": monster.angle + (Math.PI * 4),
    "pos.y": monster.pos.y - config.tileHeight / 2,
    "scale.x": 0,
    "scale.y": 0,
  }).then(() => {
    monster.destroy();
  });
};

export default () => {
  k.collides("player", "monster", handleMonsterCollision);
  k.on("death", "monster", handleMonsterDeath);
};