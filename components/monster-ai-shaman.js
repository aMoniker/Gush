import { k } from "/kaboom.js";
import { aiBasicMoveAttack } from "/components/utils.js";
import { config } from "/config.js";
import { tween, easing } from "/utils.js";

export default (options = {}) => {
  const healAmt = 2;
  const maxHealDist = config.tileWidth * 5.55;
  const timeBetweenHeals = 5;
  let healTimer = timeBetweenHeals;

  return {
    id: "monster_ai_shaman",
    require: ["monster"],
    dir: k.vec2(0, 0),
    speed: options.speed ?? 33,
    aiWasDisabled: true,
    aiAttackDistLOS: config.tileWidth * 7.77,
    aiAttackDistForce: config.tileWidth * 5,
    update() { // called every frame
      if (!this.aiEnabled) return;
      if (!this || this.dead) return;

      healTimer += k.dt();
      if (healTimer >= timeBetweenHeals) {
        // find damaged orc within range to heal
        let orcToHeal = null;
        const orcs = k.get("monster_orc");
        for (const orc of orcs) {
          if (orc.dead) continue;
          if (orc._id === this._id) continue; // can't heal self
          if (orc.pos.dist(this.pos) > maxHealDist) continue;
          if (orc.hp() >= orc.maxHp()) continue;
          orcToHeal = orc;
          break;
        }
        if (orcToHeal) {
          this.aiEnabled = false;
          this.stop();

          orcToHeal.heal(healAmt);

          const magicBubbles = k.add([
            k.sprite("magic-bubbles", { noArea: true, animSpeed: 0.01 }),
            k.pos(this.pos.clone()),
            k.origin("center"),
            k.layer("fx"),
            k.color(1, 1, 1, 0),
            k.scale(0.5),
          ]);
          magicBubbles.play("main");

          // heal the orc
          tween(magicBubbles, 0.5, { "color.a": 1 }, easing.easeInQuart)
            .then(() => tween(magicBubbles, 1.5, { "color.a": 0 }, easing.easeOutQuart))
            .then(() => {
              this.aiEnabled = true;
              this.play("idle");
              healTimer = 0;
              magicBubbles.destroy();
            });
        }
      }

      aiBasicMoveAttack(this);
    },
  };
}