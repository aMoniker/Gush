import { k } from "/kaboom.js";
import { config } from "/config.js";
import state from "/state.js";

export const aiPlayerInRange = (monster, options = {}) => {
  const defaults = { runAnim: "run", idleAnim: "idle" };
  const opts = { ...defaults, ...options }
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
      if (monster.curAnim() !== opts.runAnim) monster.play(opts.runAnim);
    }
    monster.aiWasDisabled = false;
  } else {
    monster.aiWasDisabled = true;
    if (monster.curAnim() !== opts.idleAnim) monster.play(opts.idleAnim);
  }

  return inRange;
}

export const aiBasicMoveAttack = (monster, options = {}) => {
  if (monster.hidden || monster.dead || !monster.aiEnabled) {
    monster.aiWasDisabled = true;
    return;
  }
  if (aiPlayerInRange(monster, options)) {
    monster.dir = state.player.pos.sub(monster.pos).unit(),
    monster.move(monster.dir.scale(monster.speed));
  }
}