import { k } from "/kaboom.js";
import { aiBasicMoveAttack } from "/components/utils.js";
import { config } from "/config.js";
import state from "/state.js";

export default (options = {}) => {
  let isAwake = false;
  const awakeDistance = config.tileWidth * 2.5;
  const basicMoveOptions = { runAnim: "mimic_open", idleAnim: "mimic_open" };

  return {
    id: "monster_ai_mimic",
    require: ["monster"],
    dir: k.vec2(0, 0),
    speed: options.speed ?? 33,
    aiWasDisabled: true,
    aiAttackDistLOS: config.tileWidth * 7.77,
    aiAttackDistForce: config.tileWidth * 5,
    add() {
      this.aiEnabled = false;
      this.invulnerable = true;
    },
    update() { // called every frame
      if (!this || this.dead || !state.player) return;
      if (!this.playerLOS) return; // don't calculate distance until in LOS

      if (!isAwake && this.pos.dist(state.player.pos) <= awakeDistance) {
        isAwake = true;
        this.aiEnabled = true;
        this.invulnerable = false;
        this.play("mimic_open");
        k.play("monster-16", {
          volume: 0.8,
          speed: 1.33,
        });
      }

      aiBasicMoveAttack(this, basicMoveOptions);
    },
  };
}