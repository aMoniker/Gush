import { k } from "/kaboom.js";
import { tween, easing } from "/utils.js";
import lifecycle from "/components/lifecycle.js";

export const createBow = (player) => {
  const arrowConfig = () => ([
    k.sprite("weapon_arrow", { noArea: true }),
    k.area(k.vec2(-3, -3), k.vec2(3, 3)),
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
          if (b && b.is("crevasse")) return;
          cancelCollides();
          struck = true;
          a.destroy();
        };
        // watch for monster collisions
        cancelMonsterCollides = a.collides("monster", (m) => {
          hitMonster(m);
        });
        // check if the arrow is overlapping a monster immediately
        for (const m of k.get("monster")) {
          if (!a.isOverlapped(m)) continue;
          hitMonster(m);
          break; // arrows only hitMonster one monster at a time
        }
        // watch for wall collisions
        cancelBoundaryCollides = a.collides("boundary", (b) => {
          hitBoundary(b);
        });
        // check if the arrow is overlapping a boundary immediately
        for (const b of k.get("boundary")) {
          // TODO - make this use boundaryMap
          if (!a.isOverlapped(b)) continue;
          hitBoundary(b);
          break;
        }
        // destroy the arrow no matter what if too much time has passed
        k.wait(1, () => {
          cancelCollides();
          a.destroy();
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
      speed: 333,
      damage: 2,
    }
  ]);

  const delayBetweenShots = 0.5;

  const weapon = k.add([
    k.sprite("weapon_bow", { noArea: true }),
    k.origin("center"),
    k.layer("game"),
    k.color(1, 1, 1, 1),
    "weapon",
    {
      attacking: false,
      attack: () => {
        if (weapon.attacking) return;
        weapon.attacking = true;

        k.play("bow-release-2", {
          loop: false,
          volume: 0.33,
          detune: -200,
        });
        k.play("whoosh-flutter", {
          loop: false,
          volume: 0.27,
          detune: 300,
        });

        // spawn arrow
        const arrow = k.add([
          ...arrowConfig(),
          k.pos(weapon.pos),
        ]);
        arrow.dir = player.dirAttack.clone();
        arrow.angle = Math.atan2(arrow.dir.x, arrow.dir.y) + Math.PI;
        arrow.flipX(player.xFlipped);

        // allow next attack
        k.wait(delayBetweenShots, () => weapon.attacking = false);
      },
      // To be called in the same place where player positioning is updated.
      // It cannot be called in its own action() function, since it will be janky.
      updatePosition: () => {
        const flip = player.xFlipped ? -1 : 1
        const dir = player.dirAttack.unit();
        const scale = 7.77;
        weapon.pos = player.pos.add(k.vec2(dir.x * scale, dir.y * scale + 5));
        weapon.angle = Math.atan2(dir.x, dir.y) - flip * Math.PI / 2;
        weapon.flipX(player.xFlipped);
      },
    }
  ]);

  // set the initial weapon position, uses setTimeout to avoid mis-positioning
  setTimeout(() => weapon.updatePosition());

  return weapon;
};