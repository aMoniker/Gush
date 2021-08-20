import { k } from "/kaboom.js";
import { tween, easing } from "/utils.js";
import lifecycle from "/components/lifecycle.js";

export const createCleaver = (player) => {
  const cleaverConfig = () => ([
    k.sprite("weapon_cleaver", { noArea: true }),
    k.area(k.vec2(-4, -4), k.vec2(4, 4)),
    k.rotate(0),
    k.origin("center"),
    k.layer("game"),
    lifecycle({
      onAdd: (a) => {
        let struck = false;
        let cancelMonsterCollides = null;
        let cancelBoundaryCollides = null;
        const cancelCollides = () => {
          if (cancelMonsterCollides) cancelMonsterCollides();
          if (cancelBoundaryCollides) cancelBoundaryCollides();
        };
        const hitMonster = (m) => {
          // TODO - stick in monster
          if (m.hidden || m.dead || struck) return;
          cancelCollides();
          struck = true;
          m.hurt(a.damage, player);
          a.destroy();
        };
        const hitBoundary = (b) => {
          // TODO - bounce off wall
          if (b.is("crevasse")) return;
          cancelCollides();
          struck = true;
          a.destroy();
        };
        // watch for monster collisions
        cancelMonsterCollides = a.collides("monster", (m) => {
          hitMonster(m);
        });
        // check if the cleaver is overlapping a monster immediately
        for (const m of k.get("monster")) {
          if (!a.isOverlapped(m)) continue;
          hitMonster(m);
          break; // cleavers only hitMonster one monster at a time
        }
        // watch for wall collisions
        cancelBoundaryCollides = a.collides("boundary", (b) => {
          hitBoundary(b);
        });
        // check if the cleaver is overlapping a boundary immediately
        for (const b of k.get("boundary")) {
          // TODO - make this use boundaryMap
          if (!a.isOverlapped(b)) continue;
          hitBoundary();
          break;
        }
        // destroy the cleaver no matter what if too much time has passed
        k.wait(1, () => {
          cancelCollides();
          a.destroy();
        });
      },
      onUpdate: (a) => {
        k.readd(a);
        a.move(a.dir.unit().scale(a.speed));
        a.angle += 0.5 * (a.dir.x >= 0 ? -1 : 1);
      },
    }),
    "weapon",
    {
      dir: k.vec2(0, 0),
      speed: 333,
      damage: 3,
    }
  ]);

  const delayBetweenShots = 0.75;

  const weapon = k.add([
    k.sprite("weapon_cleaver", { noArea: true }),
    k.origin("center"),
    k.layer("game"),
    "weapon",
    {
      attacking: false,
      attack: () => {
        if (weapon.attacking) return;
        weapon.attacking = true;

        k.play("whoosh-flutter", {
          loop: false,
          volume: 0.27,
          detune: 300,
        });

        // spawn cleaver
        const cleaver = k.add([
          ...cleaverConfig(),
          k.pos(weapon.pos),
        ]);
        cleaver.dir = player.dirAttack.clone();
        cleaver.angle = Math.atan2(cleaver.dir.x, cleaver.dir.y) + Math.PI;
        cleaver.flipX(player.xFlipped);

        // hide cleaver on player
        // weapon.color.a = 0;
        weapon.hidden = true;

        // allow next attack
        k.wait(delayBetweenShots, () => {
          weapon.hidden = false;
          weapon.attacking = false
        });
      },
      // To be called in the same place where player positioning is updated.
      // It cannot be called in its own action() function, since it will be janky.
      updatePosition: () => {
        const flip = player.xFlipped ? -1 : 1
        weapon.pos = player.pos.add(flip * -6, 5);
        const dir = player.dirAttack;
        weapon.angle = flip * Math.PI / 8;
        weapon.flipX(player.xFlipped);
      },
    }
  ]);

  // set the initial weapon position, uses setTimeout to avoid mis-positioning
  setTimeout(() => weapon.updatePosition());

  return weapon;
};