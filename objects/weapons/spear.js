import { k } from "/kaboom.js";
import { tween, easing } from "/utils.js";

export const createSpear = (player) => {
  const hitBox = k.add([
    k.rect(20, 20),
    k.origin("center"),
    k.pos(0, 0),
    k.rotate(0),
    k.color(1, 0, 0, 0),
    k.layer("game"),
    "player_weapon_hitbox",
  ]);
  hitBox.hidden = true;

  const vfxThrust = k.add([
    k.sprite("vfx-thrust", { noArea: true, animSpeed: 0.05 }),
    k.layer("fx"),
    k.origin("center"),
    k.rotate(0),
    k.color(1, 1, 1, 0.5),
    k.scale(1),
    k.pos(0, 0),
  ]);
  vfxThrust.scale.x = 2;
  vfxThrust.hidden = true;

  let cancelWhooshTimeoutId = 0;
  const whooshes = ["slash-1", "slash-2", "slash-5"];
  let whoosh = 0;

  let cancelSlashTimeoutId = 0;
  const slashes = ["metal-slash-1", "metal-slash-2", "metal-slash-3"];
  let slash = 0;

  const weapon = k.add([
    k.sprite("weapon_spear", { noArea: true }),
    k.origin("center"),
    k.layer("game"),
    k.color(1, 1, 1, 1),
    "weapon",
    {
      damage: 3,
      attacking: false,
      attackingDir: null,
      canAttack: true,
      attack: () => {
        if (weapon.attacking || !weapon.canAttack) return;
        weapon.attacking = true;
        weapon.canAttack = false;
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
          if (!m.hidden && !m.dead
           && hitBox.isOverlapped(m) && !hits.has(m._id)
          ) {
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

        const vfxTime = vfxThrust.animSpeed * vfxThrust.numFrames();
        vfxThrust.hidden = false;
        vfxThrust.stop();
        vfxThrust.play("main", false);
        k.wait(vfxTime, () => {
          vfxThrust.hidden = true;
        });

        const thrustTime = 0.33;
        const dir = player.xFlipped ? 1 : -1;

        // dash in the direction of the spear
        const origSpeed = player.speed;
        player.dir = player.dirAttack.unit();
        player.speed = origSpeed * 3;
        player.forcedMoving = true;
        player.hitFake = true;
        player.invulnerable = true;
        k.wait(thrustTime, () => {
          player.speed = origSpeed;
          player.forcedMoving = false;
          player.hitFake = false;
          player.invulnerable = false;
        });

        const attackFinishTimer = Math.max(vfxTime, thrustTime);
        const hitboxOverlapTimer = thrustTime;
        const canAttackAgainTimer = thrustTime * 2;

        k.wait(attackFinishTimer, () => {
          for (const m of k.get("monster")) {
            // if attack ends overlapping a live monster, bump player backwards
            if (!m.hidden && !m.dead && hitBox.isOverlapped(m)) {
              const oldSpeed = player.speed;
              player.forcedMoving = true;
              player.dir = player.pos.sub(m.pos).unit();
              player.speed = 177;
              k.wait(0.1, () => {
                player.forcedMoving = false;
                player.speed = oldSpeed;
              });
            }
          }
          weapon.attacking = false;
          hitBox.hidden = true;
        });
        k.wait(hitboxOverlapTimer, () => {
          cancelHitboxOverlapEvent();
        });
        k.wait(canAttackAgainTimer, () => {
          weapon.canAttack = true;
        });
      },
      // To be called in the same place where player positioning is updated.
      // It cannot be called in its own action() function, since it will be janky.
      updatePosition: () => {
        const flip = player.xFlipped ? -1 : 1
        weapon.pos = player.pos.add(-flip * 1, 7);

        // use the stored dir when attacking, so the hitbox/vfx stick to the player,
        // but don't reposition or spin during the attack
        const dir = weapon.attacking ? weapon.attackingDir : player.dirAttack;

        // If the player isn't moving, they can attack either left or right
        const atRest = dir.x === 0 && dir.y === 0;
        const dirX = atRest ? flip : dir.x;
        const dirY = atRest ? 0 : dir.y;
        const scale = 10;

        const scaled = k.vec2(dirX, dirY).unit();
        hitBox.pos.x = weapon.pos.x + (scaled.x * scale);
        hitBox.pos.y = weapon.pos.y + (scaled.y * scale);

        if (!weapon.attacking) {
          vfxThrust.pos.x = hitBox.pos.x;
          vfxThrust.pos.y = hitBox.pos.y;
          const atan2 = Math.atan2(dirX, dirY);
          weapon.angle = atan2 + Math.PI;
          hitBox.angle = atan2 + Math.PI / 2;
          vfxThrust.angle = weapon.angle + (Math.PI / 2) * -flip;
          vfxThrust.flipX(player.xFlipped);
        }
      },
    }
  ]);

  // set the initial weapon position, uses setTimeout to avoid mis-positioning
  setTimeout(() => weapon.updatePosition());

  return weapon;
};