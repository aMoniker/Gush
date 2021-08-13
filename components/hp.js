import { k } from "/kaboom.js";
import { tween } from "/utils.js";

export default (options) => {
  let currentHp = options.current;
  const maxHp = options.max ?? currentHp;
  if (currentHp > maxHp) currentHp = maxHp;

  return {
    id: "hp",
    require: ["killable", "pos"],
    dead: false,
    healing: false,
    hurt(x, hurtBy) {
      const amt = x ?? 1;
      currentHp -= amt;
      if (currentHp <= 0) {
        this.dead = true;
        this.trigger("death", hurtBy);
      } else {
        this.trigger("hurt", amt, hurtBy);
      }
    },
    heal(x, healedBy) {
      const amt = x ?? 1;
      currentHp = Math.min(currentHp + amt, maxHp);
      // show a green healing effect if there's not already one in progress
      if (!this.healing) {
        this.healing = true;
        const vfxHealing = k.add([
          k.sprite("vfx-healing", { noArea: true }),
          k.origin("center"),
          k.color(1, 1, 1, 0),
          k.scale(0.42),
          k.rotate(0),
          k.pos(this.pos),
          k.layer("fx"),
        ]);
        vfxHealing.play("main", false);

        const cancelVfxHealing = this.action(() => {
          vfxHealing.pos = this.pos;
        });

        tween(vfxHealing, 1, { "color.a": 1 })
          .then(() => tween(vfxHealing, 1, { "color.a": 0 }))
          .then(() => {
            cancelVfxHealing();
            vfxHealing.destroy();
            this.healing = false;
          });

        k.play("glyph-activation", {
          loop: false,
          volume: 0.33,
          speed: 1.33,
        });
      }

      this.trigger("heal", amt, healedBy);
    },
    hp() { return currentHp; },
    maxHp() { return maxHp; },
  };
}