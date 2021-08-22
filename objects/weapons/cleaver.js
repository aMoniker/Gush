import { k } from "/kaboom.js";
import { tween, easing } from "/utils.js";
import lifecycle from "/components/lifecycle.js";
import { config } from "/config.js";

export const createCleaver = (player) => {

  const cleaverThrowTime = 0.77;
  const cleaverThrowDist = config.tileWidth * 7.77;
  const minTimeBetweenThrows = 0.25; // in case it's picked up mid throw

  const cleaverReturn = (c) => {
    if (c.returning) return;
    c.time = 0;
    c.returning = true;
    c.startPos = c.pos.clone();
    c.targetPos = player.pos;
  };

  const cleaverConfig = () => ([
    k.sprite("weapon_cleaver", { noArea: true }),
    k.area(k.vec2(-4, -4), k.vec2(4, 4)),
    k.rotate(0),
    k.origin("center"),
    k.layer("game"),
    lifecycle({
      onAdd: (a) => {
        a.startPos = a.pos.clone();
        const hitMonster = (m) => {
          if (m.hidden || m.dead) return;
          m.hurt(a.damage, player);
        };
        // watch for monster collisions
        a.collides("monster", (m) => {
          hitMonster(m);
        });
        // check if the cleaver is overlapping a monster immediately
        for (const m of k.get("monster")) {
          if (!a.isOverlapped(m)) continue;
          hitMonster(m);
        }
        // allow player to pick up cleaver early after return has begun
        const cancelPlayerCollides = a.collides("player", (p) => {
          if (!a.returning) return;
          if (cancelPlayerCollides) cancelPlayerCollides();
          a.trigger("returned");
          a.destroy();
        });
        // return early if it hits a boundary
        const cancelBoundaryCollides = a.collides("boundary", (b) => {
          if (b && !b.is("crevasse")) {
            cleaverReturn(a);
            if (cancelBoundaryCollides) cancelBoundaryCollides();
          }
        });
        // return if it overlaps a boundary on throw
        for (const b of k.get("boundary")) {
          if (b && a.isOverlapped(b) && !b.is("crevasse")) {
            cleaverReturn(a);
            if (cancelBoundaryCollides) cancelBoundaryCollides();
            break;
          }
        }
      },
      onUpdate: (a) => {
        a.time += k.dt();
        if (a.time > cleaverThrowTime) {
          if (a.returning) {
            a.trigger("returned");
            a.destroy();
          } else {
            cleaverReturn(a);
          }
        }
        if (a.returning) a.targetPos = player.pos;
        const ease = a.returning ? easing.easeInSine : easing.easeOutSine;
        const diff = a.targetPos.sub(a.startPos);
        const scale = ease(a.time / cleaverThrowTime);
        a.pos = a.startPos.add(diff.scale(scale));
        a.angle += 0.5 * (a.dir.x >= 0 ? -1 : 1); // spin
      },
    }),
    "weapon",
    {
      startPos: k.vec2(0, 0),
      targetPos: k.vec2(0, 0),
      damage: 3,
      time: 0,
      returning: false,
    }
  ]);

  let canThrow = true;

  const weapon = k.add([
    k.sprite("weapon_cleaver", { noArea: true }),
    k.origin("center"),
    k.layer("game"),
    k.color(1, 1, 1, 1),
    "weapon",
    {
      attacking: false,
      attack: () => {
        if (weapon.attacking || !canThrow) return;
        weapon.attacking = true;
        canThrow = false;

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
        cleaver.flipX(player.xFlipped);
        cleaver.targetPos = weapon.pos.add(
          player.dirAttack.unit().scale(cleaverThrowDist)
        );

        // hide cleaver on player
        weapon.hidden = true;

        // minimum time between throws to prevent boundary spamming
        setTimeout(() => canThrow = true, minTimeBetweenThrows * 1000);

        cleaver.on("returned", () => {
          weapon.hidden = false;
          weapon.attacking = false;
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