import { k } from "/kaboom.js";
import { rng, tween, easing } from "/utils.js";
import lifecycle from "/components/lifecycle.js";
import { coordsInBbox, getRenderedWorldBbox } from "/levels/spatial.js";
import { config } from "/config.js";
import { lineSegmentsIntersect } from "/levels/spatial.js";

const startBeamSize = 0.01;
const endBeamSize = 2;

export const createLaserStaff = (player) => {
  const beam = k.add([
    k.rect(config.renderedWidth, startBeamSize, { noArea: true }),
    k.color(0, 1, 0, 0),
    k.origin("left"),
    k.pos(0, 0),
    k.rotate(0),
    k.layer("fx"),
  ]);
  beam.hidden = true;

  const fullMeterWidth = 8;
  const meter = k.add([
    k.rect(fullMeterWidth, fullMeterWidth * 0.33, { noArea: true }),
    k.color(0, 1, 0, 0.77),
    k.origin("center"),
    k.pos(0, 0),
    k.layer("fx"),
  ]);
  meter.hidden = true;

  let beamSound = null;

  const minimumBeamTime = 333;
  const beamContinueTime = 100;
  let beamTimeStarted = 0;
  let clearAttackTimeoutId = null;

  let canHit = true;
  let timeSinceLastHit = 0;
  const timeBetweenHits = 100;

  let charge = 100;
  const chargeCostPerSec = 10;
  const chargeFillPerSec = 25;
  const maxCharge = 100;
  const minChargeToAttack = 20;

  const weapon = k.add([
    k.sprite("weapon_green_magic_staff", { noArea: true }),
    k.origin("center"),
    k.pos(0, 0),
    k.layer("game"),
    k.color(1, 1, 1, 1),
    "weapon",
    lifecycle({
      onUpdate: (w) => {
        if (charge === maxCharge && !w.attacking) return;
        if (w.attacking) {
          meter.hidden = false;
          charge = Math.max(0, charge - k.dt() * chargeCostPerSec);
          if (charge === 0) {
            if (clearAttackTimeoutId) clearTimeout(clearAttackTimeoutId);
            stopAttack();
          }
        } else {
          charge = Math.min(maxCharge, charge + k.dt() * chargeFillPerSec);
          if (charge === maxCharge) meter.hidden = true;
        }
        meter.width = (fullMeterWidth * (charge / maxCharge));
      },
    }),
    {
      damage: 0.3334,
      attacking: false,
      attack: () => {
        if (weapon.attacking) {
          const dtms = k.dt() * 1000;
          beamTimeStarted += dtms;
          timeSinceLastHit += dtms;
          if (timeSinceLastHit >= timeBetweenHits) {
            canHit = true;
          }

          const beamCutoff = Math.max(
            minimumBeamTime - beamTimeStarted, beamContinueTime
          );
          if (clearAttackTimeoutId) clearTimeout(clearAttackTimeoutId);
          clearAttackTimeoutId = setTimeout(stopAttack, beamCutoff);
          beam.color.a = k.map(Math.sin(beamTimeStarted / 33), -1, 1, 0.33, 1);

          if (canHit) {
            timeSinceLastHit = 0;
            canHit = false;
            setTimeout(checkBeamHits, 0);
          }
        } else {
          if (charge >= minChargeToAttack) {
            // begin attack
            startAttack();
            beamTimeStarted = 0;
            if (clearAttackTimeoutId) clearTimeout(clearAttackTimeoutId);
            clearAttackTimeoutId = setTimeout(stopAttack, minimumBeamTime);
          }
        }
      },
      // To be called in the same place where player positioning is updated.
      // It cannot be called in its own action() function, since it will be janky.
      updatePosition: () => {
        const flip = player.xFlipped ? -1 : 1
        weapon.pos.x = player.pos.x;
        weapon.pos.y = player.pos.y + 10;
        const dir = player.dirAttack.unit();
        weapon.angle = Math.atan2(dir.x, dir.y) + Math.PI;
        beam.pos.x = weapon.pos.x + dir.x * 15;
        beam.pos.y = weapon.pos.y + dir.y * 15;
        beam.angle = Math.atan2(dir.x, dir.y) - Math.PI / 2;
        meter.pos.x = player.pos.x;
        meter.pos.y = player.pos.y + 10;
        weapon.flipX(player.xFlipped);
      },
    }
  ]);

  const checkBeamHits = () => {
    // kaboom does not rotate area hitboxes, so we have to check if the line
    // of the beam intersects with a monster manually
    const beamPoint1 = [beam.pos.x, beam.pos.y];
    const beamPoint2 = [
      beam.pos.x + beam.width * Math.sin(beam.angle + Math.PI / 2),
      beam.pos.y + beam.width * Math.cos(beam.angle + Math.PI / 2),
    ];
    const beamSegment = [...beamPoint1, ...beamPoint2];

    k.every("monster", (m) => {
      const x = m.pos.x;
      const y = m.pos.y;
      const { p1, p2 } = m.area;
      // check if the beam line intersects with each side of the monster hitbox rect
      const monsterSegments = [
        [x + p1.x, y + p1.y, x + p2.x, y + p1.y], // top
        [x + p1.x, y + p1.y, x + p1.x, y + p2.y], // left
        [x + p1.x, y + p2.y, x + p2.x, y + p2.y], // bot
        [x + p2.x, y + p1.y, x + p2.x, y + p2.y], // right
      ];
      for (let monsterSegment of monsterSegments) {
        if (lineSegmentsIntersect(beamSegment, monsterSegment)) {
          m.hurt(weapon.damage, player);
          break;
        }
      }
    });
  };

  const startAttack = () => {
    weapon.attacking = true;
    k.play("alien-weapon-6", {
      loop: false,
      speed: 0.77,
      volume: 0.33,
    });
    if (weapon.attacking) {
      beamSound = k.play("laser-beam-plasma-loop", {
        loop: true,
        volume: 0.33,
        detune: -500,
      });
    }
    beam.hidden = false;
    beam.color.a = 1;

    beam.height = startBeamSize;
    tween(beam, minimumBeamTime / 1000, {
      "height": endBeamSize,
    });
  };

  const stopAttack = () => {
    weapon.attacking = false;
    if (beamSound) beamSound.stop();
    beam.hidden = true;
    beam.color.a = 0;
  };

  // set the initial weapon position, uses setTimeout to avoid mis-positioning
  setTimeout(() => weapon.updatePosition());

  return weapon;
};