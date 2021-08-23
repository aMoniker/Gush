import { k } from "/kaboom.js";
import { config } from "/config.js";
import state from "/state.js";
import { aiBasicMoveAttack } from "/components/utils.js"
import lifecycle from "/components/lifecycle.js";

export default (options = {}) => {
  const minSpellDist = config.tileWidth * 3; // can't cast spells if player too close
  const maxSpellDist = config.tileWidth * 11; // or if too far away
  const timeBetweenSpells = 3;
  let spellTimer = timeBetweenSpells / 2;

  const projectileSpell = () => ([
    k.sprite("tank_explosion3", { noArea: true }),
    k.origin("center"),
    k.area(k.vec2(-10, -10), k.vec2(10, 10)),
    k.rotate(0),
    k.scale(0.1),
    "monster_projectile",
    lifecycle({
      onAdd: (p) => {
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
        p.angle += 0.0666;
      }
    }),
    {
      dir: k.vec2(0, 0),
      speed: 66.6,
      damage: 1,
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
      if (!this || this.dead || !state.player) return;

      // cast spells at player
      spellTimer += k.dt();
      if (this.playerLOS && spellTimer >= timeBetweenSpells) {
        const dist = this.pos.dist(state.player.pos);
        if (dist >= minSpellDist && dist <= maxSpellDist) {
          this.aiEnabled = false;
          k.wait(1, () => this.aiEnabled = true);
          spellTimer = 0;
          // spawn spell projectile
          k.add([
            ...projectileSpell(),
            k.pos(this.pos),
          ]);
        }
      }

      aiBasicMoveAttack(this);
    },
  };
}