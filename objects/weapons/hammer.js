import { k } from "/kaboom.js";
import { rng, tween, easing } from "/utils.js";

export const createHammer = (player) => {
  const hitBox = k.add([
    k.rect(20, 30),
    k.origin("center"),
    k.rotate(0),
    k.color(1, 0, 0, 0),
    k.layer("game"),
    "player_weapon_hitbox",
  ]);
  hitBox.hidden = true;

  let cancelWhooshTimeoutId = 0;
  const whooshes = ["slash-1", "slash-2", "slash-5"];
  let whoosh = 0;

  const weapon = k.add([
    k.sprite("weapon_hammer", { noArea: true }),
    k.origin("bot"),
    k.layer("game"),
    k.scale(1),
    k.color(1, 1, 1, 1),
    "weapon",
    {
      damage: 4,
      attacking: false,
      attackingDir: null,
      attack: () => {
        if (weapon.attacking) return;
        weapon.attacking = true;
        weapon.attackingDir = player.dirAttack.clone();

        // We do two separate checks to see if the player hit a monster.
        // The first checks if the hitbox is already overlapping a monster,
        // because the overlap event won't trigger if it's already overlapping.
        // The second check is a temporary overlaps event handler, in case the
        // player walks into a monster while their weapon is still mid-swing.
        // For some reason, both can trigger, so we make sure only one does.
        // Wait to check until the hammer is about to hit.
        const hits = new Set();
        hitBox.hidden = false;

        const swingTime = 0.5;

        let cancelHitboxOverlapEvent = null;
        k.wait(swingTime * 0.77, () => {
          for (const m of k.get("monster")) {
            if (!m.hidden && !m.dead && hitBox.isOverlapped(m) && !hits.has(m._id)) {
              m.hurt(weapon.damage, player);
              hits.add(m._id);
            }
          }
          cancelHitboxOverlapEvent = k.overlaps(
            "player_weapon_hitbox", "monster", (hb, m) => {
              if (!m.hidden && !m.dead && !hits.has(m._id)) {
                m.hurt(weapon.damage, player);
                hits.add(m._id);
              }
            }
          );
        })
        
        const whooshSound = whooshes[whoosh % whooshes.length];
        whoosh++;
        if (cancelWhooshTimeoutId) window.clearTimeout(cancelWhooshTimeoutId);
        cancelWhooshTimeoutId = window.setTimeout(() => whoosh = 0, 1000);
        k.play(whooshSound, {
          loop: false,
          volume: 0.5,
          speed: 0.5,
          detune: -500,
        });
        
        const flip = player.xFlipped ? 1 : -1;
        const dir = weapon.attackingDir.unit();
        const swingTo = weapon.angle + flip * Math.PI;
        tween(weapon, swingTime, {
          "angle": swingTo,
        }, easing.easeInQuart);

        const scaleUpTime = swingTime * 0.77;
        const scaleDownTime = swingTime * 0.23;

        const scaleEffect = (obj) => {
          tween(obj, scaleUpTime, {
            "scale.x": 1.3,
            "scale.y": 1.3,
          }, easing.easeOutQuart).then(() => tween(obj, scaleDownTime, {
            "scale.x": 1,
            "scale.y": 1,
          }, easing.easeInQuart));  
        }

        scaleEffect(weapon);
        scaleEffect(player);

        const attackFinishTimer = swingTime * 1.5;
        const hitboxOverlapTimer = swingTime;

        k.wait(hitboxOverlapTimer, () => {
          if (cancelHitboxOverlapEvent) cancelHitboxOverlapEvent();
          if (hits.size) {
            k.play("punch-squelch-heavy-1", {
              volume: 1,
              detune: k.map(rng.gen(), 0, 1, -300, 100),
            });
          } else {
            k.play("punch-designed-heavy", { volume: 1, speed: 1.33 });
          }
          k.camShake(1);
        });

        player.hitFake = true;
        k.wait(attackFinishTimer, () => {
          weapon.attacking = false;
          player.hitFake = false;
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
        if (!weapon.attacking) {
          weapon.angle = hitBox.angle - Math.PI / 2;
        }
      },
    }
  ]);

  // set the initial weapon position, uses setTimeout to avoid mis-positioning
  setTimeout(() => weapon.updatePosition());

  return weapon;
};