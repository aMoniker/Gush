import { k } from "/kaboom.js";
import { announce, easing, fadeToScene } from "/utils.js";
import state, { hasUnlockedAllCharacters } from "/state.js";
import * as powerups from "/objects/powerups.js";
import * as monster from "/objects/monster.js";
import { monsterWave, monsterWaveCircle, monsterWaveLineVertical, monsterWaveLineHorizontal, coinReward, coinRewardCircle, crateWall, crateWallHorizontal, crateWallVertical, spawnObject } from "/levels/maps/utils.js";
import music from "/music.js";
import input, { vibrateGamepad } from "/input.js";
import { config } from "/config.js";
import { clearMinimap } from "/ui.js";

const map = [
  "   ┌{%){)%){)%{┐   ",
  "   │···········│   ",
  "   └┐·········┌┘   ",
  "    └┐·······┌┘    ",
  "     └┐·····┌┘     ",
  "      └┐···┌┘      ",
  "       └┐·┌┘       ",
  "        │·│        ",
  "        │·│        ",
  "        │·│        ",
  "        │·│        ",
  "        │·│        ",
  "        │2│        ",
  "        │·│        ",
  "┌─&──&──┘·└──&──&─┐",
  "│·················│",
  "│·················│",
  "│·················│",
  "│···##·······##···│",
  "│···##·······##···│",
  "│·················│",
  "│·················│",
  "│········D········│",
  "│·················│",
  "│·················│",
  "│·················│",
  "│···##·······##···│",
  "│···##·······##···│",
  "│11111111111111111│",
  "│·················│",
  "│·················│",
  "└─(──(─┐···┌─(──(─┘",
  "       │···│       ",
  "       │···│       ",
  "       │···│       ",
  "       │···│       ",
  "       │···│       ",
  "       │···│       ",
  "       │···│       ",
  "       │···│       ",
  "       │···│       ",
  "       │···│       ",
  "       │···│       ",
  "       │···│       ",
  "┌─(─(─(┘···└(─(─(─┐",
  "│·················│",
  "│···@········HE···│",
  "│·················│",
  "└──(─(─(─)─(─(─(──┘",
];

export default map;

const bgMusic = "party-on-1";

map.onStart = () => {
  music.crossFade(bgMusic);
  announce("-- DEMON'S LAIR --", { silent: true });
};

map.clearBurps = true;

const center = [9, 22];

const zombieWave = () => {
  return Promise.all([
    monsterWaveCircle(monster.zombieBig, 3, center, 2),
    monsterWaveCircle(monster.zombiePlain, 4, center, 3),
    monsterWaveCircle(monster.zombiePlain, 5, center, 4),
    monsterWaveCircle(monster.zombieTiny, 9, center, 5),
  ]);
};

const orcWave = () => {
  return Promise.all([
    monsterWaveCircle(monster.ogre, 3, center, 2),
    monsterWaveCircle(monster.randomOrc, 4, center, 3),
    monsterWaveCircle(monster.randomOrc, 5, center, 4),
    monsterWaveCircle(monster.goblin, 9, center, 5),
  ]);
};

const skeletonWave = () => {
  return Promise.all([
    monsterWaveCircle(monster.skeleton, 6, center, 2),
    monsterWaveCircle(monster.skeleton, 7, center, 3),
    monsterWaveCircle(monster.skeleton, 9, center, 4),
    monsterWaveCircle(monster.skeleton, 11, center, 5),
  ]);
};

const demonWave = () => {
  return Promise.all([
    monsterWaveCircle(monster.demonSmall, 3, center, 3),
    monsterWaveCircle(monster.swampy, 4, center, 4),
    monsterWaveCircle(monster.muddy, 5, center, 5),
    monsterWaveCircle(monster.imp, 9, center, 6),
  ]);
};

const necroWave = () => {
  return Promise.all([
    monsterWaveCircle(monster.necromancer, 3, center, 2),
    monsterWaveCircle(monster.skeleton, 12, center, 3),
  ]);
};

const randomMonsterWave = () => k.choose([
  zombieWave, orcWave, skeletonWave, demonWave, necroWave
])

map.triggers = {
  1: async () => {
    const boss = k.get("demon_boss")[0];
    const crates = [
      ...crateWallHorizontal([8, 31], 3),
      ...crateWallHorizontal([9, 14], 1),
    ];

    let canShowHint = true;
    boss.on("hurt", (amt) => {
      if (amt < 666) {
        if (canShowHint) {
          announce("It's too strong!");
          announce("Only DEADLY BURP can KILL it!")
          announce("WAVES of MONSTERS drop FLASKS!");
          canShowHint = false;
        }
      } else {
        announce("MASSIVE DAMAGE - KEEP GOING!");
        k.play("monster-12", { speed: 0.5 });
      }
    });

    boss.on("death", () => {
      music.crossFade("peek-a-boo-2");
      k.play("spell-4");
      announce("UNBELIEVABLE TRIUMPH");
      vibrateGamepad(1000, 0, 1);
      crates.forEach(c => c.destroy());
      k.every("monster", m => m.hurt(666, state.player));
    })

    const burpPotionLocation = [9, 26];
    const otherPotionLocation = () => k.choose([[2, 23], [14, 23], [9, 16], [9, 28]]);

    // after some boss rotations, spawn a single burp potion
    let rotationCount = 0;
    const rotationsBeforeBurpPotion = 2;
    boss.on("boss-finished-attack-rotation", () => {
      rotationCount++;
      if (rotationCount >= rotationsBeforeBurpPotion) {
        rotationCount = 0;
        setTimeout(() => {
          announce("DEADLY BURP FLASK DROPPED");
          spawnObject(powerups.flask("small", "green"), 9, 26);
        }, 3333);
      }
    });

    // spawn random monsters with each boss attack (if no monsters already)
    let canSpawnMonsters = true;
    boss.on("boss-attacking", () => {
      setTimeout(() => {
        if (!canSpawnMonsters) return;
        canSpawnMonsters = false;
        randomMonsterWave()().then(() => {
          canSpawnMonsters = true;
        });
        const size = k.choose(["small", "big"]);
        const type = k.choose(["blue", "red"]);
        spawnObject(powerups.flask(size, type), ...otherPotionLocation());
      }, 3333);
    });
  },
  2: async () => {
    announce("BEHOLD the GOLDEN FLASK of YENDOR");
    const winFlask = spawnObject(powerups.flask("big", "yellow"), 9, 2);
    winFlask.on("picked-up", () => {
      state.player.forcedMoving = true;
      state.player.dir = k.vec2(0, 0);
      let hit = true;
      k.loop(0.77, () => {
        state.player.hit = hit;
        hit = !hit;
      });
      announce("The GOLDEN FLASK is YOURS")
        .then(() => announce("A WINNER is YOU!"))
        .then(() => announce("Thanks for playing!"))
        .then(() => {
          const msg = hasUnlockedAllCharacters()
                    ? "Did you WIN with EVERY character?!"
                    : "Now, UNLOCK more characters!";
          announce(msg);
        })
        .then(() => {
          state.forcedCam = true;
          state.level = 0;
          const startScale = k.width() / config.viewableWidth;
          const endScale = startScale * 3.33;
          const startRot = 0;
          const endRot = Math.PI * 4;
          let time = 0;
          const effectTime = 3.33;
          setTimeout(() => {
            fadeToScene("title-screen", { time: effectTime });
          }, (effectTime / 2) * 1000);
          const cancelEffect = k.action(() => {
            time += k.dt();
            const pct = Math.min(1, time / effectTime);
            const scaleDiff = endScale - startScale;
            const rotDiff = endRot - startRot;
            k.camScale(
              startScale + (scaleDiff * easing.easeInQuart(pct))
            );
            k.camRot(startRot + (rotDiff * easing.easeInQuart(pct)));
            if (pct >= 1) {
              cancelEffect();
              clearMinimap();
              state.forcedCam = false;
            }
          });
        })
    });
  }
}