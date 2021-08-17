import { k } from "/kaboom.js";
import { config } from "/config.js";

const forceAttackDist = config.tileWidth * 7.77;

export default (options) => {  
  return {
    id: "monster_ai_simple",
    require: ["monster"],
    dir: k.vec2(0, 0),
    speed: options.speed ?? 47,
    update() { // called every frame
      if (this.hidden || !this.aiEnabled) return;
      const player = k.get("player")[0];
      if (!this.playerLOS) {
        // if out of LOS, stop attacking unless close enough to force
        if (this.pos.dist(player.pos) > forceAttackDist) return;
      }
      if (!player) return;
      if (player.hit || player.dead) return;
      this.dir = player.pos.sub(this.pos).unit(),
      this.move(this.dir.scale(this.speed));
    },
  };
}