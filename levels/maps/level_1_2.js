import { k } from "/kaboom.js";
import { announce } from "/utils.js";
import state from "/state.js";
import * as powerups from "/objects/powerups.js";
import * as monster from "/objects/monster.js";
import { monsterWave, monsterWaveCircle, coinReward, coinRewardCircle, crateWall, crateWallHorizontal, crateWallVertical, spawnObject } from "/levels/maps/utils.js";
import music from "/music.js";
import input from "/input.js";

const map = [
  "┌──────────────────────!┐===================┌!──────────────────(────┐",
  "│···················^···/                   /···^·············8······│",
  "│······················┌┘=┌────%─!_!─%────┐=└┐················8······│",
  "│·····················┌┘ ┌┘···············└┐ └┐···············8······│",
  "│····················┌┘ ┌┘········>········└┐ └┐··············8┌(┐···│",
  "│···················┌┘ ┌┘6·┌─────────────┐·7└┐ └┐··············│ │···│",
  "│··················┌┘ ┌┘·6┌┘             └┐7·└┐ └┐·············│ │···│",
  "│·················┌┘ ┌┘··┌┘ ┌(────(────(┐ └┐··└┐ └┐············│ │···│",
  "│················┌┘ ┌┘··┌┘ ┌┘$$$?$?$?$$$└┐ └┐··└┐ └┐···········│ │···│",
  "│···············┌┘ ┌┘··┌┘ ┌┘···4······4··└┐ └┐··└┐ └┐··········│ │···│",
  "│··············┌┘ ┌┘··┌┘ ┌┘····4······4···└┐ └┐··└┐ └┐·········│ │···│",
  "│·············┌┘ ┌┘·t┌┘ ┌┘·····4······4····└┐ └┐t·└┐ └┐········│ │···│",
  "│············┌┘ ┌┘··┌┘ ┌┘····┌(───(───(┐····└┐ └┐··└┐ └┐·······│ │···│",
  "│···········┌┘ ┌┘··┌┘ ┌┘····┌┘         └┐····└┐ └┐··└┐ └┐······│ │···│",
  "│··········┌┘ ┌┘··┌┘ ┌┘·t··┌┘ ┌───────┐ └┐··s·└┐ └┐·t└┐ └┐·····│ │···│",
  "│·········┌┘ ┌┘··┌┘ ┌┘····┌┘ ┌┘w··w··w└┐ └┐····└┐ └┐··└┐ └┐····│ │···│",
  "│········┌┘ ┌┘t·┌┘ ┌┘····┌┘ ┌┘·········└┐ └┐·s··└┐ └┐··└┐ └┐···│ │···│",
  "│·······┌┘ ┌┘··┌┘ ┌┘··p·┌┘ ┌┘···┌───┐···└┐ └┐··s·└┐ └┐t·└┐ └┐··│ │···│",
  "│······┌┘ ┌┘··┌┘ ┌┘·t··┌┘ ┌┘···┌┘   └┐···└┐ └┐····└┐ └┐··└┐ └┐·│ │···│",
  "│55555┌┘ ┌┘··┌┘ ┌┘····┌┘ ┌┘···┌┘ ┌(┐ └┐···└┐ └┐·sZ·└┐ └┐··└┐ │·│ │···│",
  "│^^^^┌┘ ┌┘··┌┘ ┌┘·p··┌┘ ┌┘···┌┘ ┌┘·└┐ └┐···└┐ └┐····└┐ └┐·t└─┘·│ │···│",
  "│····│ ┌┘··┌┘ ┌┘····┌┘ ┌┘···┌┘ ┌┘···└┐ └┐···└┐ └┐··s·└┐ └┐·····│ │···│",
  "│····│ │··┌┘ ┌┘····┌┘ ┌┘···┌┘ ┌┘·····└┐ └┐···└┐ └┐····└┐ └┐····│ │···│",
  "│····│ │··│ ┌┘··t·┌┘ ┌┘···┌┘ ┌┘·······└┐ └┐···└┐ └┐····└┐ └┐··p│ │···│",
  "│····│ │·t│ │····┌┘ ┌┘···┌┘ ┌┘·········└┐ └┐···└┐ └┐·s··└┐ └───┘ │···│",
  "│····│ │··│ │···┌┘ ┌┘···┌┘ ┌┘···········└┐ └┐···└┐ └┐····└┐      │···│",
  "│····│ │··│ │··┌┘ ┌┘···┌┘ ┌┘·············└┐ └┐···└┐ └┐····└──────┘···│",
  "│····│ │··│ │·┌┘ ┌┘···┌┘ ┌┘···············└┐ └┐···└┐ └┐··············│",
  "│····│ │··│ │·│ ┌┘···┌┘ ┌┘·····^·····^·····└┐ └┐···└┐ │··············│",
  "│p··p└!┘··│ │·└─┘···┌┘ ┌┘·······33333·······└┐ └┐···└─┘··············│",
  "│·········│ │·······│ ┌┘········3···3········└┐ │·g···········┌(┐^^^^│",
  "│·········│ └───┐···/ /·····^···3·m·3···^·····/ /·····O·······│ │····│",
  "│·tt·┌_┐··│     │···│ └┐········3···3········┌┘ │·············│ │····│",
  "│····│ │··└─────┘···└┐ └┐·······33333·······┌┘ ┌┘·············│ │····│",
  "│p··p│ │·············└┐ └┐·····^·····^·····┌┘ ┌┘···········O··│ │····│",
  "│····│ │···d··········└┐ └┐···············┌┘ ┌┘····o··········│ │····│",
  "│····│ │·i···i·········└┐ └┐·············┌┘ ┌┘g···············│ │····│",
  "│····│ │················└┐ └┐···········┌┘ ┌┘·········o······g│ │····│",
  "│····│ │·i···i···········└┐ └┐·········┌┘ ┌┘··················│ │····│",
  "│····│ │···d··············└┐ └┐·······┌┘ ┌┘······o············│ │····│",
  "│····│ │···················└┐ └┐·····┌┘ ┌┘················o···│ │$$$$│",
  "│····│ └────────┐··┌─┐······└┐ └┐···┌┘ ┌┘············o········│ │$·S$│",
  "│····│ = ==     │··│ │·······└┐ └┐·┌┘ ┌┘······················│ │$M·$│",
  "│····│ =  =  == │··│ │···i·i··└┐ │·│ ┌┘·················g·····│ │$$$$│",
  "└┐··┌┘ = ==  =  │·s│ │·········│ │^│ │····┌───────────────────┘ └────┘",
  " │··│  =    === │··│ │·d·····d·│ │·│ │····│                           ",
  " │·s│ == == =?= │··│ │·········│ │^│ │····└──────────────────────────┐",
  " │··│ =  =  = = │··│ └─────────┘ │·│ │·······························│",
  " │··│   == ==   │··│             │^│ │·······························│",
  " │··└───────────┘··└────────────(┘·└(┘···············┌───────────┐···│",
  " │···············t···································│           │···│",
  " │t··················································└─┐         │···│",
  " │··┌───────────┐··┌───(┐··┌(───┐···┌───┐·┌───────┐····└┐        │···│",
  " │··│   ==      │·t│    │··│    │···│=?=│·│       └┐····└┐       │···│",
  " │··│ =  = ==== │··│ ┌─(┘··└(─┐ │···│= =│·│ ┌────┐ └┐····└┐      │···│",
  " │·t│ == =   =  │··│ │$·1111·$│ │···│= =│$│ │?···└┐ └┐····└┐     │···│",
  " │··│  = = === =│··│ │········│ │···│= =│$│ │·····└┐ └┐····└┐    │···│",
  " │··│= = = =   =│··│ │········│ │·Z·│= =│$│ │······└┐ └┐····└┐   │···│",
  " │··│= =   == ==│··│ │········│ │···│= =│$│ │·······└┐ └┐····└┐  │···│",
  " │··│= = ====   │··│ │········│ │···│= =│$│ │········└┐ └─┐···└┐ │···│",
  "┌┘··└!_───┐==== │··│ │········│ │$·$│= =│$│ │·········└┐  │····│ │000│",
  "│·········│=$$$ │··│ │········│ │·?·│= =│$│ │·········2└(─┘····│ │·f·│",
  "│·········│=$?$=│··│ │$··??··$│ │$·$│= =│f│ │·········2········│ │t·t│",
  "│·········│=$$$=│··│ └────────┘ └─}─┘= =└─┘ └───────────(──────┘ └───┘",
  "│·········│=====│··│             =     =                              ",
  "│·········└─────┘··└───────────}┐= =┌}───────────────────────────────┐",
  "│··············s············s···│= =│···s········?·········?········m│",
  "│·@·················s·····┌────_┘= =└_!───┐····s······?·········?····│",
  "│·········┌───────────────┘   =       =   └──────────────────────────┘",
  "└─────────┘                   =========                               ",
];



const bgMusic = "cave-3";

map.onStart = () => {
  music.crossFade(bgMusic);
  announce("-- THE WARRENS --", { silent: true });
}

map.triggers = {
  0: () => {
    monsterWave(() => ([
      spawnObject(monster.zombieTiny(), 67, 53),
      spawnObject(monster.zombieTiny(), 66, 53),
      spawnObject(monster.zombieTiny(), 68, 53),
      spawnObject(monster.zombieTiny(), 67, 51),
      spawnObject(monster.zombieTiny(), 66, 51),
      spawnObject(monster.zombieTiny(), 68, 51),
      spawnObject(monster.zombieTiny(), 67, 49),
      spawnObject(monster.zombieTiny(), 66, 49),
      spawnObject(monster.zombieTiny(), 68, 49),
    ]));
  },
  1: async () => {
    const crates = crateWall([25, 52], [26, 52]);
    await monsterWave(() => ([
      spawnObject(monster.zombieTiny(), 22, 57),
      spawnObject(monster.zombieTiny(), 22, 58),
      spawnObject(monster.zombieTiny(), 22, 59),
      spawnObject(monster.zombieTiny(), 22, 60),
      spawnObject(monster.zombieTiny(), 29, 57),
      spawnObject(monster.zombieTiny(), 29, 58),
      spawnObject(monster.zombieTiny(), 29, 59),
      spawnObject(monster.zombieTiny(), 29, 60),
      spawnObject(monster.zombieBig(), 25, 61),
    ]));
    crates.forEach(c => c.destroy());
  },
  2: async () => {
    const crates = crateWall([56, 62]);
    await monsterWave(() => ([
      spawnObject(monster.zombiePlain(), 46, 57),
      spawnObject(monster.zombiePlain(), 47, 57),
      spawnObject(monster.zombiePlain(), 48, 57),
      spawnObject(monster.zombiePlain(), 49, 57),
    ]));
    await monsterWave(() => ([
      spawnObject(monster.zombiePlain(), 46, 62),
      spawnObject(monster.zombiePlain(), 47, 62),
      spawnObject(monster.zombiePlain(), 48, 62),
      spawnObject(monster.zombiePlain(), 49, 62),
    ]));
    await monsterWave(() => ([
      spawnObject(monster.zombieBig(), 46, 56),
      spawnObject(monster.zombieBig(), 48, 56),
    ]));
    crates.forEach(c => c.destroy());
  },
  3: async () => {
    let seek = 0;
    if (music.name() === bgMusic) seek = music.time();
    music.crossFade("battle-8");
    const crates = crateWall([34, 42], [23, 31], [34, 20], [45, 31]);
    const center = [34, 31];
    spawnObject(powerups.flask("big", "blue"), ...center);
    await monsterWaveCircle(monster.zombieTiny, 10, center, 5);
    await monsterWaveCircle(monster.zombiePlain, 8, center, 6);
    await Promise.all([
      monsterWaveCircle(monster.zombieBig, 5, center, 7),
      monsterWaveCircle(monster.skeleton, 12, center, 6),
    ]);
    spawnObject(powerups.flask("small", "red"));
    await Promise.all([
      monsterWaveCircle(monster.imp, 13, center, 7),
      monsterWaveCircle(monster.wogol, 7, center, 6),
    ]);
    spawnObject(powerups.flask("small", "green"), ...center);
    await monsterWaveCircle(monster.demonSmall, 7, center, 6);
    await monsterWaveCircle(monster.necromancer, 5, center, 7);
    coinRewardCircle(15, center, 4);
    coinRewardCircle(16, center, 5);
    coinRewardCircle(17, center, 6);
    spawnObject(powerups.flask("big", "red"), ...center);
    crates.forEach(c => c.destroy());
    music.crossFade(bgMusic, { seek });
  },
  4: async () => {
    const center = [34, 10];
    spawnObject(powerups.flask("small", "red"), ...center);
    await monsterWaveCircle(monster.zombiePlain, 6, center, 1);
  },
  5: async () => {
    let seek = 0;
    if (music.name() === bgMusic) seek = music.time();
    music.crossFade("battle-3");
    const center = [8, 6];
    const crates = [...crateWallHorizontal([1, 21], 4), ...crateWall([23, 1])];
    spawnObject(powerups.flask("small", "blue"), ...center);
    await monsterWaveCircle(monster.goblin, 7, center, 5);
    await monsterWaveCircle(monster.randomOrc, 9, center, 6);
    await Promise.all([
      monsterWaveCircle(monster.goblin, 9, center, 6),
      monsterWaveCircle(monster.ogre, 4, center, 5),
      monsterWaveCircle(monster.orcShaman, 3, center, 4),
    ]);
    crates.forEach(c => c.destroy());
    coinRewardCircle(3, center, 2);
    coinRewardCircle(7, center, 3);
    coinRewardCircle(9, center, 4);
    spawnObject(powerups.flask("small", "red"), ...center);
    music.crossFade(bgMusic, { seek });
  },
  6: () => {
    crateWallVertical([27, 3], 2);
    k.play("alarm-2", { volume: 0.5, detune: -300 });
  },
  7: async () => {
    crateWallVertical([41, 3], 2);
    k.play("alarm-2", { volume: 0.5, detune: -300 });
  },
  8: async () => {
    let seek = 0;
    if (music.name() === bgMusic) seek = music.time();
    music.crossFade("battle-8");
    const center = [56, 5];
    const crates = crateWallVertical([64, 1], 3);
    spawnObject(powerups.flask("small", "blue"), ...center);
    await Promise.all([
      monsterWaveCircle(monster.muddy, 4, center, 3),
      monsterWaveCircle(monster.swampy, 3, center, 3),
    ]);
    spawnObject(powerups.flask("small", "red"), ...center);
    await Promise.all([
      monsterWaveCircle(monster.demonSmall, 3, center, 4),
      monsterWaveCircle(monster.imp, 7, center, 4),
    ]);
    spawnObject(powerups.flask("small", "green"), ...center);
    await Promise.all([
      monsterWaveCircle(monster.skeleton, 13, center, 5),
      monsterWaveCircle(monster.necromancer, 4, center, 5),
    ]);
    coinRewardCircle(5, center, 1);
    coinRewardCircle(7, center, 2);
    coinRewardCircle(9, center, 3);

    crates.forEach(c => c.destroy());
    music.crossFade(bgMusic, { seek });
  }
};

export default map;