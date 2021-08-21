import { k } from "/kaboom.js";
import { aiBasicMoveAttack } from "/components/utils.js";
import { config } from "/config.js";

export default (options) => {
  return {
    id: "monster_ai_simple",
    require: ["monster"],
    dir: k.vec2(0, 0),
    speed: options.speed ?? 47,
    aiWasDisabled: true,
    aiAttackDistLOS: config.tileWidth * 7.77,
    aiAttackDistForce: config.tileWidth * 5,
    update() { // called every frame
      aiBasicMoveAttack(this);
    },
  };
}