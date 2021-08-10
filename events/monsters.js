import { k } from "/kaboom.js";

const handleMonsterCollision = (player, monster) => {
  if (monster.dead) return;
  player.hurt(1, monster); // TODO - make dmg amnt depend on monster?
};

export default () => {
  k.collides("player", "monster", handleMonsterCollision);
};