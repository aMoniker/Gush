import { k } from "/kaboom.js";
import { config } from "/config.js";
import state from "/state.js";
import { aiBasicMoveAttack } from "/components/utils.js"
import lifecycle from "/components/lifecycle.js";

export default (options = {}) => {
  const minSpellDist = config.tileWidth * 3; // can't cast spells if player too close
  const timeBetweenSpells = 3;
  let spellTimer = timeBetweenSpells / 2;

  const projectileSpell = () => ([
    k.sprite("vfx-vortex", { noArea: true, animSpeed: 0.01 }),
    k.origin("center"),
    k.area(k.vec2(-8, -8), k.vec2(8, 8)),
    k.rotate(0),
    k.scale(0.2),
    "monster_projectile",
    lifecycle({
      onAdd: (p) => {
        p.play("main");
        k.play("fire-1", {
          volume: 0.666,
          speed: 0.8,
          detune: -333,
        });

        // point at player
        p.dir = state.player.pos.sub(p.pos).unit();
        p.angle = Math.atan2(p.dir.x, p.dir.y) - Math.PI / 2,

        // on overlap player or boundary, destroy
        p.overlaps("player", (player) => {
          player.hurt(p.damage, p);
          p.destroy();
        });
        p.overlaps("boundary", (b) => {
          if (b && !b.is("crevasse")) p.destroy();
        });

        // after X seconds no matter what, destroy
        k.wait(5, () => p.destroy());
      },
      onUpdate: (p) => {
        p.move(p.dir.scale(p.speed));
      }
    }),
    {
      dir: k.vec2(0, 0),
      speed: 88,
      damage: 2,
    }
  ]);

  return {
    id: "monster_ai_demon_small",
    require: ["monster"],
    dir: k.vec2(0, 0),
    speed: options.speed ?? 47,
    aiAttackDistLOS: config.tileWidth * 7.77,
    aiAttackDistForce: config.tileWidth * 5,
    update() { // called every frame
      // if (!aiPlayerInRange(this)) return;
      if (this.dead) return;

      // cast spells at player
      spellTimer += k.dt();
      if (spellTimer >= timeBetweenSpells
      && this.pos.dist(state.player.pos) >= minSpellDist
      && this.playerLOS
      ) {
        this.aiEnabled = false;
        k.wait(1, () => this.aiEnabled = true);
        spellTimer = 0;
        // spawn spell projectile
        k.add([
          ...projectileSpell(),
          k.pos(this.pos),
        ]);
      }

      aiBasicMoveAttack(this);
    },
  };
}