import { k } from "/kaboom.js";
import { tween, easing } from "/utils.js";

// TODO - make the sword (and all weapons) attack at any player.dir

export const createSword = (player) => {
  const vfxSlash = k.add([
    k.sprite("vfx-slash", { noArea: true, nimSpeed: 0.001 }),
    k.layer("fx"),
    k.color(0.5, 0.5, 1, 0.47),
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

        // We do two separate checks to see if the player hit a monster.
        // The first checks if the hitbox is already overlapping a monster,
        // because the overlap event won't trigger if it's already overlapping.
        // The second check is a temporary overlaps event handler, in case the
        // player walks into a monster while their weapon is still mid-swing.
        // For some reason, both can trigger, so we make sure only one does.
        const hits = new Set();
        hitBox.hidden = false;
        for (const m of k.get("monster")) {
          if (!m.hidden && !m.dead && hitBox.isOverlapped(m) && !hits.has(m._id)) {
            hits.add(m._id);
            m.hurt(weapon.damage, player);
          }
        }
        const cancelHitboxOverlapEvent = k.overlaps(
          "player_weapon_hitbox", "monster", (hb, m) => {
            if (!m.hidden && !m.dead && !hits.has(m._id)) {
              hits.add(m._id);
              m.hurt(weapon.damage, player);
            }
          }
        );

        k.play("whoosh-swing", {
          loop: false,
          volume: 0.5,
          speed: 0.5,
          detune: -100,
        });

        const vfxTime = vfxSlash.animSpeed * vfxSlash.numFrames();
        vfxSlash.hidden = false
        vfxSlash.stop();
        vfxSlash.play("main", false);
        k.wait(vfxTime, () => {
          vfxSlash.hidden = true;
        });

        const sliceTime = 0.33;
        const dir = player.xFlipped ? 1 : -1;
        tween(weapon, sliceTime, {
          "angle": weapon.angle + (dir * Math.PI * 2),
        }, easing.easeInOutQuint);

        const attackFinishTimer = Math.max(vfxTime, sliceTime);
        const hitboxOverlapTimer = attackFinishTimer / 2;

        k.wait(hitboxOverlapTimer, () => {
          cancelHitboxOverlapEvent();
        });

        k.wait(attackFinishTimer, () => {
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
    k.color(0, 0, 0, 0),
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