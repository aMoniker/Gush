import { k } from "/kaboom.js";
import { announce } from "/utils.js";
import state from "/state.js";
import * as powerups from "/objects/powerups.js";
import * as monster from "/objects/monster.js";
import { monsterWave, monsterWaveCircle, monsterWaveLineVertical, monsterWaveLineHorizontal, coinReward, coinRewardCircle, crateWall, crateWallHorizontal, crateWallVertical, spawnObject } from "/levels/maps/utils.js";
import music from "/music.js";
import input from "/input.js";

const map = [
  "┌────────────────────────────────────────────────────────────────────┐",
  "│···························p·········t··············p········t······│",
  "│··········p··································Z······················│",
  "│····Z··········p·······t··················p········p·············p··│",
  "│·································p··································│",
  "│···┌────────────────┐···┌─────────────────┐···┌(┐2222222222222┌(┐·t·│",
  "│·p·│                │···│                 │···│ │·············│ │···│",
  "│···│ ┌────────────┐ │·t·│   ┌──%───%──┐   │p··│ │·············│ │·p·│",
  "│···│ │············│ │···│   │h·······e│   │···│ │·············│ │···│",
  "│··p│ │·?········?·│ │···│   │····@····│   │··p│ │·············│ │··p│",
  "│···│ │············│ │···│   │·········│   │···│ │·············│ │···│",
  "│·p·│ │······m·····│ │···│   │·········│   │p··│ │·············│ │t··│",
  "│···│ │············│ │p··│   └─}┐^^^┌}─┘   │···│ │···M·········│ │···│",
  "│···│ │············│ │···│      │···│      │···│ │·········S···│ │···│",
  "│···│ │············│ │···│      │···│      │·p·│ │·············│ │··t│",
  "│t··│ │············│ │··t│      │···│      │···│ │··?·······?··│ │···│",
  "│···│ │··t·········│ │···│      │···│      │···│ │······?······│ │t··│",
  "│···│ │········p···│ │···│      │···│      │···│ └─────────────┘ │···│",
  "│·t·│ │············│ │···│      │···│      │··p│                 │···│",
  "│···└(┘111111111111└(┘···└──────┘···└──────┘···└─────────────────┘···│",
  "│········t··········p········t············t········p······p··p·····t·│",
  "│·············p···········t·······Z····t········p·····p·········p····│",
  "└────────────────────────────────────────────────────────────────┐···│",
  "                                                                 │···│",
  "┌───────────────────────────────────────────────┐ ┌────────────┐ │···│",
  "│····o······o····o····g·······g····g············│ │············│ │···│",
  "│·O······g····o···g······g·············o··o·····│ │··········33│ │···│",
  "│··o···o···o····g···g······o····o···g·······g···│ │··········3·└(┘···│",
  "│o··┌───────────────────────────────────────┐···│ │··········3·······│",
  "│···│                                       │···│ │··········3·······│",
  "│·g·│ ┌────(──────────────────────────────┐ │···│ │··········3·······│",
  "│···│ │·······4···························│ │·O·│ │··········3·······│",
  "│···│ │···┌(┐·4···························│ │···│ │··········3·┌(┐···│",
  "│·o·│ │···│ │44···························│ │···│ │··········33│ │···│",
  "│···│ │···│ │·····························│ │···│ │············│ │···│",
  "│o··│ │···│ │·····························│ │···│ └────────────┘ │·g·│",
  "│··g│ │···│ │·····························│ │···│                │···│",
  "│···│ │···│ │·····························│ │···└──────────────┐ │···│",
  "│o··│ │···│ │·····························│ │············o·····│ │···│",
  "│··g│ │···│ │·····························│ │············o···O·│ │···│",
  "│···│ │···│ │·····························│ │O···········o·····│ │g··│",
  "│···│ │···│ └──────────────────────────(┐·│ └──────────────┐···│ │···│",
  "│··o│ │···│                             │b│                │···│ │···│",
  "│·g·│ │···│ ┌─────────────────────────┐ │E└(─────────────┐ │···│ │···│",
  "│···│ │···│ │························>│ │··5·············│ │···│ │··g│",
  "│···│ │···│ │·························│ │555·············│ │ooo│ │···│",
  "│·g·│ │···│ │·························│ │················│ │···│ │···│",
  "│···│ │···│ │·························│ │················│ │···│ │···│",
  "│·o·│ │···│ │·························│ │················│ │···│ │gg·│",
  "│···│ │···│ │·························│ │················│ │···│ │···│",
  "│g··│ │···│ │·························│ │················│ │···│ │···│",
  "│···│ │···│ │·························│ │················│ │···│ │···│",
  "│···│ │···│ │·························│ │················│ │···│ │··g│",
  "│·g·│ │···│ │·························│ │················│ │···│ │···│",
  "│··g│ │···│ │·······················66│ │················│ │···│ │···│",
  "│···│ │···│ │·······················6·└(┘················│ │···│ │···│",
  "│g··│ │···│ │·······················6·EB·················│ │···│ │···│",
  "│···│ │···│ └──────────────────────────(─────────────────┘ │···│ │···│",
  "│···│ │···│                                                │···│ │···│",
  "│·o·│ │·O·└────────────────────────────────────────────────┘···│ │···│",
  "│···│ │o·o·············Oo·····················Og···········o···│ │o··│",
  "│··o│ │···················Oo··················og···········o·O·│ │··o│",
  "│o··│ │················Oo·····················Og···········o···│ │···│",
  "│···│ └────────────────────────────────────────────────────────┘ │·o·│",
  "│·o·│                                                            │···│",
  "│···└(───(───(───(───(─────&────&────&────&─────(───(───(───(───(┘···│",
  "│······o···g····g·······g·············g········g·············o·····O·│",
  "│·O··········o··············g·······················g··········o··o·o│",
  "│····o·g··o··g······g···········g···········g················o·······│",
  "└────(───(───(───(───(─────&────&────&────&─────(───(───(───(───(────┘",
];







const bgMusic = "stark-nuances";

map.onStart = () => {
  music.crossFade(bgMusic);
  announce("-- ORC STRONGHOLD --", { silent: true });
}

map.triggers = {
  1: async () => {
    monsterWaveCircle(monster.zombiePlain, 5, [12, 13], 2);
    monsterWaveCircle(monster.zombiePlain, 7, [12, 13], 3);
    monsterWaveCircle(monster.zombiePlain, 9, [12, 13], 4);
  },
  2: async () => {
    monsterWaveCircle(monster.zombieTiny, 6, [56, 11], 2);
    monsterWaveLineHorizontal(monster.zombiePlain, [51, 10], 11);
    monsterWaveLineHorizontal(monster.zombiePlain, [51, 12], 11);
    monsterWaveLineHorizontal(monster.zombiePlain, [51, 14], 11);
  },
  3: async () => {
    let seek = 0;
    if (music.name() === bgMusic) seek = music.time();
    music.crossFade("battle-8");
    const crates = crateWallVertical([63, 28], 4);
    await Promise.all([
      monsterWaveLineVertical(monster.zombiePlain, [52, 26], 8),
      monsterWaveLineVertical(monster.zombieTiny, [54, 26], 8),
      monsterWaveLineVertical(monster.zombiePlain, [56, 26], 8),
    ]);
    await Promise.all([
      monsterWaveLineVertical(monster.zombiePlain, [62, 26], 8),
      monsterWaveLineVertical(monster.zombieTiny, [60, 26], 8),
      monsterWaveLineVertical(monster.zombiePlain, [58, 26], 8),
    ]);
    await Promise.all([
      monsterWaveLineVertical(monster.zombiePlain, [52, 26], 8),
      monsterWaveLineVertical(monster.zombieTiny, [54, 26], 8),
      monsterWaveLineVertical(monster.zombiePlain, [56, 26], 8),
    ]);
    const center = [57, 29];
    coinRewardCircle(9, center, 1);
    coinRewardCircle(11, center, 2);
    coinRewardCircle(13, center, 3);
    spawnObject(powerups.flask("small", "red"), ...center);
    crates.forEach(c => c.destroy());
    music.crossFade(bgMusic, { seek });
  },
  4: async () => {
    let seek = 0;
    if (music.name() === bgMusic) seek = music.time();
    music.crossFade("battle-3");
    const crates = [
      ...crateWallVertical([12, 31], 1),
      ...crateWallVertical([41, 41], 1),
    ];
    await monsterWaveLineHorizontal(monster.goblin, [17, 32], 5),
    await monsterWaveLineHorizontal(monster.goblin, [25, 32], 5),
    await monsterWaveLineHorizontal(monster.goblin, [32, 32], 5),
    await monsterWaveLineVertical(monster.goblin, [38, 35], 5),
    await monsterWaveLineHorizontal(monster.goblin, [32, 38], 5),
    await monsterWaveLineHorizontal(monster.goblin, [25, 38], 5),
    await monsterWaveLineHorizontal(monster.goblin, [17, 38], 5),
    await Promise.all([
      monsterWaveLineHorizontal(monster.goblin, [20, 35], 5),
      monsterWaveLineHorizontal(monster.goblin, [20, 36], 5),
    ]);
    await Promise.all([
      monsterWaveLineHorizontal(monster.goblin, [27, 35], 5),
      monsterWaveLineHorizontal(monster.goblin, [27, 36], 5),
    ]);
    const center = [36, 35];

    await Promise.all([
      monsterWaveCircle(monster.goblin, 4, center, 2),
      monsterWaveCircle(monster.goblin, 7, center, 3),
      monsterWaveCircle(monster.goblin, 8, center, 4),
      monsterWaveCircle(monster.goblin, 11, center, 5),
    ]);
    coinRewardCircle(8, center, 1);
    coinRewardCircle(10, center, 2);
    coinRewardCircle(12, center, 3);
    spawnObject(powerups.flask("small", "red"), ...center);
    crates.forEach(c => c.destroy());
    music.crossFade(bgMusic, { seek });
  },
  5: async () => {
    let seek = 0;
    if (music.name() === bgMusic) seek = music.time();
    music.crossFade("battle-8");
    const crates = [
      ...crateWallVertical([41, 43], 1),
      ...crateWallVertical([40, 56], 1),
    ];
    await Promise.all([
      monsterWaveLineVertical(monster.goblin, [42, 47], 5),
      monsterWaveLineHorizontal(monster.goblin, [44, 45], 5),
    ]);
    const center = [49, 50];
    await Promise.all([
      monsterWaveCircle(monster.goblin, 5, center, 2),
      monsterWaveCircle(monster.goblin, 9, center, 3),
      monsterWaveCircle(monster.goblin, 11, center, 4),
      monsterWaveCircle(monster.goblin, 13, center, 5),
    ]);
    await Promise.all([
      monsterWaveCircle(monster.orcShaman, 4, center, 2),
      monsterWaveCircle(monster.orcWarrior, 5, center, 3),
      monsterWaveCircle(monster.orcWarrior, 8, center, 4),
      monsterWaveCircle(monster.orcWarrior, 11, center, 5),
    ]);
    coinRewardCircle(8, center, 1);
    coinRewardCircle(10, center, 2);
    coinRewardCircle(12, center, 3);
    spawnObject(powerups.flask("big", "red"), ...center);
    crates.forEach(c => c.destroy());
    music.crossFade(bgMusic, { seek });
  },
  6: async () => {
    let seek = 0;
    if (music.name() === bgMusic) seek = music.time();
    music.crossFade("battle-8");
    const crates = [
      ...crateWallVertical([36, 44], 2),
      ...crateWallVertical([37, 45], 1),
      ...crateWallVertical([38, 56], 1),
    ];
    await monsterWaveLineVertical(monster.goblin, [36, 49], 5);
    await monsterWaveLineHorizontal(monster.goblin, [27, 48], 5);
    await monsterWaveLineHorizontal(monster.goblin, [19, 48], 5);
    await monsterWaveLineVertical(monster.goblin, [16, 50], 5);
    await monsterWaveLineHorizontal(monster.goblin, [18, 54], 5);
    await monsterWaveLineHorizontal(monster.goblin, [30, 54], 5);
    const center = [24, 49];
    await Promise.all([
      monsterWaveCircle(monster.goblin, 12, center, 2),
      monsterWaveCircle(monster.goblin, 13, center, 3),
      monsterWaveCircle(monster.goblin, 14, center, 4),
      monsterWaveCircle(monster.goblin, 15, center, 5),
    ]);
    spawnObject(powerups.flask("small", "blue"), ...center);
    await Promise.all([
      monsterWaveCircle(monster.ogre, 4, center, 2),
      monsterWaveCircle(monster.orcShaman, 5, center, 3),
      monsterWaveCircle(monster.orcWarrior, 8, center, 4),
      monsterWaveCircle(monster.orcMasked, 11, center, 5),
    ]);
    spawnObject(powerups.flask("small", "blue"), ...center);
    await Promise.all([
      monsterWaveCircle(monster.randomOrc, 4, center, 2),
      monsterWaveCircle(monster.randomOrc, 5, center, 3),
      monsterWaveCircle(monster.randomOrc, 8, center, 4),
      monsterWaveCircle(monster.randomOrc, 11, center, 5),
    ]);
    spawnObject(powerups.flask("small", "blue"), ...center);
    await Promise.all([
      monsterWaveCircle(monster.ogre, 3, center, 2),
      monsterWaveCircle(monster.ogre, 4, center, 3),
      monsterWaveCircle(monster.ogre, 7, center, 4),
      monsterWaveCircle(monster.ogre, 8, center, 5),
    ]);
    coinRewardCircle(12, center, 1);
    coinRewardCircle(13, center, 2);
    coinRewardCircle(14, center, 3);
    coinRewardCircle(15, center, 4);
    coinRewardCircle(16, center, 5);
    crates.forEach(c => c.destroy());
    music.crossFade(bgMusic, { seek });
  },
};

export default map;