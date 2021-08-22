import { k } from "/kaboom.js";
import { announce } from "/utils.js";
import state from "/state.js";
import * as powerups from "/objects/powerups.js";
import * as monster from "/objects/monster.js";
import { monsterWave, monsterWaveCircle, monsterWaveLineVertical, monsterWaveLineHorizontal, coinReward, coinRewardCircle, crateWall, crateWallHorizontal, crateWallVertical, spawnObject } from "/levels/maps/utils.js";
import music from "/music.js";
import input, { vibrateGamepad } from "/input.js";

const map = [
  "        ┌─┐        ",
  "        │>│        ",
  "        │·│        ",
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
  "│···@·········E···│",
  "│·················│",
  "└──(─(─(─)─(─(─(──┘",
];

export default map;

const bgMusic = "party-on-1";

map.onStart = () => {
  music.play(bgMusic);
};

const center = [9, 12];

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
      ...crateWallHorizontal([8, 21], 3),
      ...crateWallHorizontal([9, 4], 1),
    ];

    let canShowHint = true;
    boss.on("hurt", (amt) => {
      if (amt < 666) {
        if (canShowHint) {
          announce("It's too strong!");
          announce("Find FLASKS & use DEADLY BURP!");
          canShowHint = false;
        }
      } else {
        announce("MASSIVE DAMAGE - KEEP GOING!");
        k.play("monster-12", { speed: 0.5 });
      }
    });

    boss.on("death", () => {
      music.stop();
      music.play("peek-a-boo-2");
      k.play("spell-4");
      announce("UNBELIEVABLE TRIUMPH");
      vibrateGamepad(1000, 0, 1);
      crates.forEach(c => c.destroy());
      k.every("monster", m => m.hurt(666, state.player));
    })

    const burpPotionLocation = [9, 16];
    const otherPotionLocation = () => k.choose([[2, 13], [14, 13], [9, 6], [9, 18]]);

    // after some boss rotations, spawn a single burp potion
    let rotationCount = 0;
    const rotationsBeforeBurpPotion = 2;
    boss.on("boss-finished-attack-rotation", () => {
      rotationCount++;
      if (rotationCount >= rotationsBeforeBurpPotion) {
        rotationCount = 0;
        setTimeout(() => {
          spawnObject(powerups.flask("small", "green"), 9, 16);
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
}