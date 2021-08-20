import { k } from "/kaboom.js";
import { config } from "/config.js";
import state from "/state.js";

const losAttackDist = config.tileWidth * 7.77;
const forceAttackDist = config.tileWidth * 5;

export default (options) => {

  let wasDisabled = true;

  return {
    id: "monster_ai_simple",
    require: ["monster"],
    dir: k.vec2(0, 0),
    speed: options.speed ?? 47,
    update() { // called every frame
      if (this.hidden || !this.aiEnabled) {
        wasDisabled = true;
        return;
      }
      const { player } = state;
      if (!player || player.hit || player.dead) return;

      const dist = this.pos.dist(player.pos);
      if (dist < forceAttackDist
      || (this.playerLOS && dist < losAttackDist)
      ) {
        // readd the monster the first time it's enabled
        // can't readd every frame since it changes the _id,
        // which we depend on for weapon comparisons elsewhere
        if (wasDisabled) k.readd(this);
        wasDisabled = false;

        this.dir = player.pos.sub(this.pos).unit(),
        this.move(this.dir.scale(this.speed));
      } else {
        wasDisabled = true;
      }
    },
  };
}