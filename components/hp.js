import { k } from "/kaboom.js";
import { tween } from "/utils.js";
import { vibrateGamepad } from "/input.js";

export default (options) => {
  let currentHp = options.current;
  const maxHp = options.max ?? currentHp;
  if (currentHp > maxHp) currentHp = maxHp;
  const maxShields = 3;
  let currentShields = Math.max(0, Math.min(maxShields, options.currentShield ?? 0));

  // show healthbar by default, pass false to disable
  let healthBar = null;
  const fullHealthBarWidth = 8;

  const createHealthBar = () => {
    healthBar = k.add([
      k.rect(fullHealthBarWidth, fullHealthBarWidth * 0.33, { noArea: true }),
      k.color(1, 0, 0, 0.88),
      k.origin("center"),
      k.pos(0, 0),
      k.layer("fx"),
    ]);
    healthBar.hidden = true;
    updateHealthBar();
  }

  const updateHealthBar = () => {
    if (!healthBar) return;
    healthBar.width = Math.min(1, currentHp / maxHp) * fullHealthBarWidth;
    healthBar.hidden = currentHp === maxHp;
  };

  // play a heartbeat sound when player health is low
  let heartbeatSound = null;
  let heartbeatRumble = null;
  const manageHeartbeat = (obj) => {
    const lowHealth = currentHp + currentShields <= 1;
    if (!lowHealth || obj.dead) {
      if (heartbeatSound) {
        heartbeatSound.stop();
        heartbeatSound = null;
      }
      if (heartbeatRumble) clearInterval(heartbeatRumble);
    } else if (!heartbeatSound) {
      heartbeatSound = k.play("heartbeat-slow-2", {
        loop: true,
        volume: 0.47,
      });
      heartbeatRumble = setInterval(() => {
        vibrateGamepad(77, 0.77, 0);
      }, 1040);
    }
  };

  return {
    id: "hp",
    require: ["killable", "pos"],
    dead: false,
    healing: false,

    add() {
      if (options.showHealthBar ?? true) createHealthBar();
    },

    update() {
      if (healthBar) {
        healthBar.pos.x = this.pos.x;
        healthBar.pos.y = this.pos.y + this.height / 2;
      }
    },

    destroy() {
      if (healthBar) {
        healthBar.destroy();
        healthBar = null;
      }
    },

    hurt(x, hurtBy) {
      if (this.dead) return;
      if (this.is("monster") && !this.solid) return;
      if (this.invulnerable) return;

      let amt = x ?? 1;
      if (currentShields) {
        amt = 0; // shields absorb any amount of dmg, and lose one point
        currentShields--;
      } else {
        currentHp -= amt;
      }
      if (currentHp <= 0) {
        this.dead = true;
        if (healthBar) {
          healthBar.destroy();
          healthBar = null;
        }
        this.trigger("death", hurtBy);
      } else {
        updateHealthBar();
        this.trigger("hurt", amt, hurtBy);
      }

      if (options.heartbeat) manageHeartbeat(this);
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
          k.scale(0.22),
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

      updateHealthBar();
      this.trigger("heal", amt, healedBy);
      if (options.heartbeat) manageHeartbeat(this);
    },

    addShields(shieldAmt) {
      currentShields = Math.max(0, Math.min(maxShields, currentShields + shieldAmt));
      this.trigger("shielded", shieldAmt);
      if (options.heartbeat) manageHeartbeat(this);
    },

    hp() { return currentHp; },
    maxHp() { return maxHp; },
    shields() { return currentShields; },
  };
}