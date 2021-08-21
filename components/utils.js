import { k } from "/kaboom.js";
import { config } from "/config.js";
import state from "/state.js";

export const aiPlayerInRange = (monster) => {
  const { player } = state;
  if (!player || player.hit || player.dead) return false;

  const dist = monster.pos.dist(player.pos);
  const inRange = dist < monster.aiAttackDistForce
    || (monster.playerLOS && dist < monster.aiAttackDistLOS)

  if (inRange) {
    // readd the monster the first time it's enabled
    // we can't readd every frame since it changes the _id,
    // which we depend on for hitbox checking elsewhere
    if (monster.aiWasDisabled) {
      k.readd(monster);
      if (monster.curAnim() !== "run") monster.play("run");
    }
    monster.aiWasDisabled = false;
  } else {
    monster.aiWasDisabled = true;
    if (monster.curAnim() !== "idle") monster.play("idle");
  }

  return inRange;
}

export const aiBasicMoveAttack = (monster) => {
  if (monster.hidden || monster.dead || !monster.aiEnabled) {
    monster.aiWasDisabled = true;
    return;
  }
  if (aiPlayerInRange(monster)) {
    monster.dir = state.player.pos.sub(monster.pos).unit(),
    monster.move(monster.dir.scale(monster.speed));
  }
}