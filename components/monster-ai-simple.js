import { k } from "/kaboom.js";

export default (options) => {  
  return {
    id: "monster_ai_simple",
    require: ["monster"],
    dir: k.vec2(0, 0),
    speed: options.speed ?? 47,
    update() { // called every frame
      if (this.hidden || !this.playerLOS || !this.aiEnabled) return;
      const player = k.get("player")[0];
      if (!player) return;
      if (player.hit || player.dead) return;
      this.dir = player.pos.sub(this.pos).unit(),
      this.move(this.dir.scale(this.speed));
    },
  };
}