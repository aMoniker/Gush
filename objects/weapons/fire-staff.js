import { k } from "/kaboom.js";
import { rng, tween, easing } from "/utils.js";
import lifecycle from "/components/lifecycle.js";
import { coordsInBbox, getRenderedWorldBbox } from "/levels/spatial.js";

export const createFireStaff = (player) => {
  const fireballConfig = () => ([
    k.sprite("fireball-magic", { noArea: true, animSpeed: 0.01 }),
    k.area(k.vec2(-6, -6), k.vec2(6, 6)),
    k.rotate(0),
    k.origin("center"),
    k.layer("game"),
    k.scale(0.5),
    lifecycle({
      onAdd: (a) => {
        a.play("main");
        let struck = false;
        let cancelMonsterCollides = null;
        let cancelBoundaryCollides = null;
        const cancelCollides = () => {
          if (cancelMonsterCollides) cancelMonsterCollides();
          if (cancelBoundaryCollides) cancelBoundaryCollides();
        };

        let didHit = false;
        const hitSomething = (tag) => {
          if (didHit) return;
          didHit = true;

          cancelCollides();

          // if the fireball fizzled, it only explodes if it was on-screen
          if (tag === "fizzled") {
            const bbox = getRenderedWorldBbox(player.pos.x, player.pos.y);
            if (!coordsInBbox(bbox, a.pos.x, a.pos.y)) {
              a.destroy();
              return;
            }
          }

          // show an explosion effect
          const explosion = k.add([
            k.sprite("explosion-round", { noArea: true, animSpeed: 0.01 }),
            k.origin("center"),
            k.pos(a.pos.clone()),
            k.layer("fx"),
          ]);
          explosion.play("main", false);
          k.wait(explosion.animSpeed * explosion.numFrames(), () => {
            explosion.destroy();
          });

          // play an explosion sound depending on what was hit
          let explodeSound = null;
          if (tag === "monster") {
            explodeSound = k.choose(["explosion-2", "explosion-4"]);
          } else {
            explodeSound = "explosion-5";
          }
          k.play(explodeSound, {
            detune: k.map(rng.gen(), 0, 1, -300, 100),
          });

          // everything within the explosion hitbox takes damage
          const hitBox = k.add([
            k.rect(32, 32),
            k.origin("center"),
            k.pos(a.pos.clone()),
            k.color(0, 0, 0, 0),
            k.rotate(a.angle),
          ]);
          setTimeout(() => {
            for (const m of k.get("monster")) {
              if (hitBox.isOverlapped(m) && !m.dead) {
                m.hurt(a.damage, player);
              }
            }
            hitBox.destroy();
          }, 0);
          a.destroy();
        };

        // watch for monster collisions
        cancelMonsterCollides = a.collides("monster", (m) => {
          if (!m.dead) hitSomething("monster");
        });
        // check if the fireball is overlapping a monster immediately
        let immediateHit = false;
        for (const m of k.get("monster")) {
          if (!a.isOverlapped(m)) continue;
          if (!m.dead) hitSomething("monster");
        }
        // watch for wall collisions
        cancelBoundaryCollides = a.collides("boundary", (b) => {
          if (b && !b.is("crevasse")) hitSomething("boundary");
        });
        // check if the fireball is overlapping a boundary immediately
        for (const b of k.get("boundary")) {
          // TODO - make this use boundaryMap
          if (b && a.isOverlapped(b) && !b.is("crevasse")) {
            hitSomething("boundary");
            break;
          }
        }
        // the fireball explodes after five seconds no matter what
        k.wait(5, () => {
          hitSomething("fizzled");
        });
      },
      onUpdate: (a) => {
        k.readd(a);
        a.move(a.dir.unit().scale(a.speed));
      },
    }),
    "weapon",
    {
      dir: k.vec2(0, 0),
      speed: 108,
      damage: 5,
    }
  ]);

  const delayBetweenShots = 1.33;

  const weapon = k.add([
    k.sprite("weapon_red_magic_staff", { noArea: true }),
    k.origin("center"),
    k.pos(0, 0),
    k.layer("game"),
    k.color(1, 1, 1, 1),
    "weapon",
    {
      attacking: false,
      attack: () => {
        if (weapon.attacking) return;
        weapon.attacking = true;

        const castSound = k.choose(["fire-big-lit-1", "fire-big-lit-2"]);
        k.play(castSound, {
          volume: 1,
          detune: k.map(rng.gen(), 0, 1, -200, 200),
        });

        const spawnPointScale = 15;
        const spawnDir = player.dirAttack.unit();
        const spawnPos = weapon.pos.add(k.vec2(
          spawnDir.x * spawnPointScale,
          spawnDir.y * spawnPointScale
        ));

        // spawn fireball
        const fireball = k.add([
          ...fireballConfig(),
          k.pos(spawnPos),
        ]);
        fireball.dir = player.dirAttack.clone();
        fireball.angle = Math.atan2(fireball.dir.x, fireball.dir.y) - Math.PI / 2;

        // allow next attack
        k.wait(delayBetweenShots, () => weapon.attacking = false);
      },
      // To be called in the same place where player positioning is updated.
      // It cannot be called in its own action() function, since it will be janky.
      updatePosition: () => {
        const flip = player.xFlipped ? -1 : 1
        weapon.pos.x = player.pos.x;
        weapon.pos.y = player.pos.y + 10;
        const dir = player.dirAttack.unit();
        weapon.angle = Math.atan2(dir.x, dir.y) + Math.PI;
        weapon.flipX(player.xFlipped);
      },
    }
  ]);

  // set the initial weapon position, uses setTimeout to avoid mis-positioning
  setTimeout(() => weapon.updatePosition());

  return weapon;
};