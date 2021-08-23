import { k } from "/kaboom.js";
import { config } from "/config.js";
import state from "/state.js";
import { randInt } from "/utils.js";
import { skeleton } from "/objects/monster.js";
import { boundaryMap, getWorldPos, translateWorldToMapCoords } from "/levels/spatial.js";import lifecycle from "/components/lifecycle.js";
import { monsterWave, spawnObject } from "/levels/maps/utils.js";
import { aiPlayerInRange } from "/components/utils.js"

export default (options = {}) => {
  const minSpellDist = config.tileWidth * 2.5; // can't cast spells if player too close
  const maxSpellDist = config.tileWidth * 11; // or if too far away
  const timeBetweenSpells = 1.33;
  let spellTimer = timeBetweenSpells / 2;

  let skellies = [];
  const maxSkellies = 3;
  const timeBetweenSpawns = 1;
  let skellyTimer = timeBetweenSpawns;

  const makeSkellyConfig = (i, sx, sy) => ({
    config: [
      ...skeleton(),
      lifecycle({
        onDestroy: (s) => {
          skellies[i] = null;
          // if all skellies are null, reset the array
          if (!skellies.filter(s => s !== null).length) skellies = [];
        },
      }),
    ],
    x: sx,
    y: sy,
  });

  const projectileSpell = () => ([
    k.sprite("necro-spell", { noArea: true, animSpeed: 0.01 }),
    k.origin("center"),
    k.area(k.vec2(-4, -4), k.vec2(4, 4)),
    k.rotate(0),
    "monster_projectile",
    lifecycle({
      onAdd: (p) => {
        p.play("main");
        k.play("spell-20", {
          volume: 0.33,
          speed: 1.77,
          detune: -1500,
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
      damage: 1,
    }
  ]);

  return {
    id: "monster_ai_necro",
    require: ["monster"],
    dir: k.vec2(0, 0),
    speed: options.speed ?? 47,
    aiAttackDistLOS: config.tileWidth * 7.77,
    aiAttackDistForce: config.tileWidth * 5,
    update() { // called every frame
      if (!aiPlayerInRange(this)) return;
      if (!this || this.dead || !state.player) return;

      // spawn skeletons and keep track
      // if all skeletons are dead, spawn more after timer is up
      skellyTimer += k.dt();
      if (!skellies.length && skellyTimer >= timeBetweenSpawns) {
        skellyTimer = 0;
        const skelliesToSpawn = [];
        const { x, y } = translateWorldToMapCoords(this.pos.x, this.pos.y);
        for (let i = 0; i < maxSkellies; i++) {
          // choose random coordinates around the necro until a free space is found
          for (let j = 0; j < 10; j++) { // try 10 times, then give up
            const sx = x + randInt(-1, 1);
            const sy = y + randInt(-1, 1);
            if (!boundaryMap.has(sx, sy)) {
              const skellyConfig = makeSkellyConfig(i, sx, sy);
              skelliesToSpawn.push(skellyConfig);
              break;
            }
          }
        }

        monsterWave(() => skelliesToSpawn.map(s => {
          const skelly = spawnObject(s.config, s.x, s.y);
          skellies.push(skelly);
          return skelly;
        }));
      }

      maxSpellDist

      // otherwise... cast spells at player
      spellTimer += k.dt();
      if (this.playerLOS && spellTimer >= timeBetweenSpells) {
        const dist = this.pos.dist(state.player.pos);
        if (dist >= minSpellDist && dist <= maxSpellDist) {
          spellTimer = 0;
          k.add([ // spawn spell projectile
            ...projectileSpell(),
            k.pos(this.pos),
          ]);
        }
      }
    },
    destroy() {
      skellies.forEach(s => {
        if (!s || s.dead) return;
        s.dead = true;
        s.trigger("death", this);
      });
      skellies = [];
    },
  };
}