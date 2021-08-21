import { k } from "/kaboom.js";
import { tween, easing } from "/utils.js";

export const createSword = (player) => {
  const hitBox = k.add([
    k.rect(24, 48),
    k.origin("center"),
    k.rotate(0),
    k.color(0, 0, 0, 0),
    k.layer("game"),
    "player_weapon_hitbox",
  ]);
  hitBox.hidden = true;

  const vfxSlash = k.add([
    k.sprite("vfx-slash", { noArea: true, animSpeed: 0.1 }),
    k.layer("fx"),
    k.origin("center"),
    k.rotate(0),
    k.color(0.5, 0.5, 1, 0.47),
  ]);
  vfxSlash.hidden = true;

  let cancelWhooshTimeoutId = 0;
  const whooshes = ["slash-1", "slash-2", "slash-5"];
  let whoosh = 0;

  let cancelSlashTimeoutId = 0;
  const slashes = ["metal-slash-1", "metal-slash-2", "metal-slash-3"];
  let slash = 0;

  const weapon = k.add([
    k.sprite("weapon_knight_sword", { noArea: true }),
    k.origin("bot"),
    k.layer("game"),
    k.color(1, 1, 1, 1),
    "weapon",
    {
      damage: 1,
      attacking: false,
      attackingDir: null,
      attack: () => {
        if (weapon.attacking) return;
        weapon.attacking = true;
        weapon.attackingDir = player.dirAttack.clone();

        const slashSound = slashes[slash % slashes.length];
        slash++;
        if (cancelSlashTimeoutId) window.clearTimeout(cancelSlashTimeoutId);
        cancelSlashTimeoutId = window.setTimeout(() => slash = 0, 1000);

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
            m.hurt(weapon.damage, player);
            if (!hits.size) k.play(slashSound, { volume: 0.666 });
            hits.add(m._id);
          }
        }
        const cancelHitboxOverlapEvent = k.overlaps(
          "player_weapon_hitbox", "monster", (hb, m) => {
            if (!m.hidden && !m.dead && !hits.has(m._id)) {
              m.hurt(weapon.damage, player);
              if (!hits.size) k.play(slashSound, { volume: 0.666 });
              hits.add(m._id);
            }
          }
        );
        
        const whooshSound = whooshes[whoosh % whooshes.length];
        whoosh++;
        if (cancelWhooshTimeoutId) window.clearTimeout(cancelWhooshTimeoutId);
        cancelWhooshTimeoutId = window.setTimeout(() => whoosh = 0, 1000);
        k.play(whooshSound, {
          loop: false,
          volume: 0.5,
          speed: 0.5,
          detune: 0,
        });

        const vfxTime = vfxSlash.animSpeed * vfxSlash.numFrames();
        vfxSlash.hidden = false;
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
        const flip = player.xFlipped ? -1 : 1
        weapon.pos = player.pos.add(-flip * 1, 7);

        // use the stored dir when attacking, so the hitbox/vfx stick to the player,
        // but don't reposition or spin during the attack
        const dir = weapon.attacking ? weapon.attackingDir.unit() : player.dirAttack.unit();

        // If the player isn't moving, they can attack either left or right
        const atRest = dir.x === 0 && dir.y === 0;
        const dirX = atRest ? flip : dir.x;
        const dirY = atRest ? 0 : dir.y;
        const scale = 20;

        hitBox.pos = player.pos.add(k.vec2(dirX * scale, dirY * scale));
        hitBox.angle = Math.atan2(dirX, dirY) + Math.PI / 2;
        vfxSlash.pos = hitBox.pos;
        if (!weapon.attacking) {
          weapon.angle = flip * Math.PI / 3;
          vfxSlash.angle = hitBox.angle + -Math.PI / 2;
          vfxSlash.flipX(player.xFlipped);
        }
      },
    }
  ]);

  // set the initial weapon position, uses setTimeout to avoid mis-positioning
  setTimeout(() => weapon.updatePosition());

  return weapon;
};