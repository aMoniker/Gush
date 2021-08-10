import { k } from "/kaboom.js";

export const createSword = (player) => {
  const vfxSlash = k.add([
    k.sprite("vfx-slash", { noArea: true, nimSpeed: 0.001 }),
    k.layer("fx"),
    k.color(1,1,1,0.77),
  ]);
  vfxSlash.hidden = true;

  const weapon = k.add([
    k.sprite("weapon_knight_sword", { noArea: true }),
    k.origin("bot"),
    k.layer("game"),
    "weapon",
    {
      damage: 2,
      attacking: false,
      attack: () => {
        if (weapon.attacking) return;
        weapon.attacking = true;

        hitBox.hidden = false;

        // TODO - check if the hitbox is overlapping a monster
        // we have to check here and not in a separate event, because
        // if the hitbox is hidden and already overlapping a monster,
        // then the overlap event will not fire on attack.

        const vfxTime = vfxSlash.animSpeed * vfxSlash.numFrames();
        vfxSlash.hidden = false
        vfxSlash.stop();
        vfxSlash.play("main", false);
        k.wait(vfxTime, () => {
          vfxSlash.hidden = true;
        });

        // TODO - use easing function
        // https://easings.net/#
        const startAngle = weapon.angle;
        const dir = player.xFlipped ? 1 : -1;
        const rotateTo = weapon.angle + (dir * Math.PI * 2);
        const sliceTime = 0.3;
        let spent = 0;
        const cancelSlice = k.action(() => {
          spent += k.dt();
          if (spent < sliceTime) {
            weapon.angle = (spent / sliceTime) * rotateTo;
          } else {
            weapon.angle = startAngle;
            cancelSlice();
          }
        });

        k.wait(Math.max(vfxTime, sliceTime), () => {
          weapon.attacking = false;
          hitBox.hidden = true;
        });
      },
      // To be called in the same place where player positioning is updated.
      // It cannot be called in its own action() function, since it will be janky.
      updatePosition: () => {
        const dir = player.xFlipped ? -1 : 1
        weapon.pos = player.pos.add(-dir * 1, 7);
        vfxSlash.pos = player.pos.add(0, dir * 30);
        vfxSlash.flipX(player.xFlipped);
        hitBox.pos = player.pos.add(dir * 16, 4);
        if (!weapon.attacking) {
          weapon.angle = dir * Math.PI / 3;
          vfxSlash.angle = dir * Math.PI / 2;
        }
      },
    }
  ]);

  const hitBox = k.add([
    k.rect(24, 48),
    k.origin("center"),
    k.color(1, 0, 0, 0.5),
    k.layer("game"),
    "player_weapon_hitbox",
    {
      weapon,
    }
  ]);
  hitBox.hidden = true;

  // set the initial weapon position, uses setTimeout to avoid mis-positioning
  setTimeout(() => weapon.updatePosition());

  return weapon;
};