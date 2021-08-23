import { k } from "/kaboom.js";
import { config } from "/config.js";
import state from "/state.js";
import { aiBasicMoveAttack } from "/components/utils.js"
import lifecycle from "/components/lifecycle.js";
import { rng } from "/utils.js";

export default (options = {}) => {

  // spawn several expanding circles of bullets
  const bulletFlower = (m) => {
    const waveCount = 6;
    const bulletsPerWave = 13;
    const timeBetweenWaves = 0.66;

    let spin = 0;
    const startAngle = k.map(rng.gen(), 0, 1, 0, Math.PI * 2);
    const sliceAngle = (Math.PI * 2) / bulletsPerWave;

    return new Promise(resolve => {
      let count = 0;
      const bulletIntervalId = setInterval(() => {
        if (count >= waveCount || m.dead) {
          clearInterval(bulletIntervalId);
          resolve();
          return;
        }
        count++;
        k.play("laser-plasma-rifle-fire", {
          volume: 0.1,
        });
        const bulletsInWave = [];
        for (let j = 0; j < bulletsPerWave; j++) {
          const b = k.add(bullet());
          b.pos = m.pos.clone();
          const a = startAngle + spin + sliceAngle * j;
          b.dir = k.vec2(Math.cos(a), Math.sin(a)).unit();
          b.on("update", () => b.move(b.dir.scale(b.speed)));
          bulletsInWave.push(b);
        }
        spin += (sliceAngle / 2);
        k.wait(5, () => bulletsInWave.forEach(bullet => bullet && bullet.destroy()));
      }, timeBetweenWaves * 1000);
    });
  };

  // spawn a sweep of bullets going around in a circle
  const bulletSweep = (m) => {
    const bulletCount = 33;
    const timeBetweenShots = 0.05;

    const startAngle = k.map(rng.gen(), 0, 1, 0, Math.PI * 2);
    const sliceAngle = (Math.PI * 2) / bulletCount;

    return new Promise(resolve => {
      let spin = 0;
      let count = 0;
      const bulletIntervalId = setInterval(() => {
        if (count >= bulletCount || m.dead) {
          clearInterval(bulletIntervalId);
          resolve();
          return;
        }
        count++;
        k.play("laser-plasma-rifle-fire", {
          volume: 0.1,
        });
          const b = k.add(bullet());
          b.pos = m.pos.clone();
          const a = startAngle + spin;
          b.dir = k.vec2(Math.cos(a), Math.sin(a)).unit();
          b.on("update", () => b.move(b.dir.scale(b.speed)));
          k.wait(5, () => b && b.destroy());
          spin += sliceAngle;
      }, timeBetweenShots * 1000);
    });
  }

  const timeBetweenSpells = 6.66;
  let spellTimer = 0;

  let currentAttack = 0;
  const attackRotation = [
    bulletFlower,
    bulletSweep,
  ];

  const bullet = () => ([
    k.sprite("tank_explosion3", { noArea: true }),
    k.origin("center"),
    k.pos(0, 0),
    k.area(k.vec2(-10, -10), k.vec2(10, 10)),
    k.rotate(0),
    k.scale(0.1),
    "monster_projectile",
    {
      dir: k.vec2(0, 0),
      speed: 66.6,
      damage: 1,
    }
  ]);

  let canAttack = true;
  return {
    id: "monster_ai_demon_boss",
    require: ["monster"],
    dir: k.vec2(0, 0),
    speed: options.speed ?? 47,
    aiAttackDistLOS: config.tileWidth * 7.77,
    aiAttackDistForce: config.tileWidth * 5,
    add() {
      k.overlaps("player", "monster_projectile", (p, mp) => {
        p.hurt(mp.damage, p);
        mp.destroy();
      });
      k.overlaps("monster_projectile", "boundary", (mp, b) => {
        if (b && !b.is("crevasse")) mp.destroy();
      });
      setTimeout(() => this.play("idle"), 0);
    },
    update() { // called every frame
      if (!this || this.dead || !state.player) return;
      if (!canAttack || !this.aiEnabled) return;

      // cast boss attacks on rotation
      spellTimer += k.dt();
      if (spellTimer >= timeBetweenSpells) {
        spellTimer = 0;
        canAttack = false;
        if (currentAttack >= attackRotation.length) {
          this.trigger("boss-finished-attack-rotation");
          currentAttack = 0;
        }
        this.trigger("boss-attacking");
        const attack = attackRotation[currentAttack];
        this.play("run");
        attack(this).then(() => {
          canAttack = true;
          this.play("idle");
        });
        currentAttack++;
      }
    },
  };
}