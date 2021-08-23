import { k } from "/kaboom.js";
import { announce } from "/utils.js";
import state from "/state.js";
import * as powerups from "/objects/powerups.js";
import * as monster from "/objects/monster.js";
import { monsterWave, monsterWaveCircle, monsterWaveLineVertical, monsterWaveLineHorizontal, coinReward, coinRewardCircle, crateWall, crateWallHorizontal, crateWallVertical, spawnObject } from "/levels/maps/utils.js";
import music from "/music.js";
import input from "/input.js";

const map = [
  "┌────┐ ┌────────┐ ┌──────────────(──(──────────────┐ ┌────────┐ ┌────┐",
  "│·m··│ │········│ │·········i·····66···············│ │········│ │··?·│",
  "│····│ │········│ │···············66···············│ │········│ │·oo·│",
  "│·S··└(┘····t···│ │··┌(┐··d·······66··········┌(┐··│ │·t······└{┘····│",
  "│···M···········│ │··│ │····i·##########······│ │·t│ │··········g·O··│",
  "│··········┌─┐·t│ │··│ │·····##^·^7·^·^##·····│ │··│ │t·┌─┐··········│",
  "│M···┌─┐···│ │··│ │··│ │····##····7·····##····│ │··│ │··│ │···┌─┐···g│",
  "│····│ │$$$│ │··│ │··│ │·i·##·····7······##···│ │··│ │··│ │$$$│ │····│",
  "│····│ └───┘ │t·│ │··│ │··##···########···##··│ │··│ │·t│ └───┘ │····│",
  "│····│       │··└─┘··│ │·##···##··8···##···##·│ │t·└─┘··│       │····│",
  "│····│ ┌───┐ │····p··└─┘##···##···8····##···##└─┘·······│ ┌───┐ │····│",
  "│····│ │$$$└─┘·········##···##···####···##···##·····t···└─┘$$$│ │····│",
  "│····│ │··············##···##···##H>##···##···##··············│ │····│",
  "│····└─┘p···t···Z·t··##···##···##····##···##···##··p··Z···t···└{┘····│",
  "│···················##···##·d·##······##···##···##···················│",
  "│····t·············##···##···##········##···##···##·t···p··p···t·····│",
  "│····┌─┐··Z···t···##···##···##··········##···##·d·##··········┌{┐····│",
  "│····│ │·········##·d·##···##············##···##···##·········│ │····│",
  "│····│ │········##···##···##··············##···##···##··t··Z··│ │····│",
  "│····│ │···t···##···##···##····^······^····##···##···##·······│ │····│",
  "│····│ │p·····##···##···##··················##···##···##···p··│ │····│",
  "│····│ └────┐##···##···##········^··^········##···##···##┌────┘ │··┌─┘",
  "│····│      │##·n·##··##··········$$··········##··##·n·##│      │··│  ",
  "│····└(─────┘##···##··##··········$$··········##··##···##└──────┘··└─┐",
  "│·S······5···##···##···##········^··^········##···##···##··········M·│",
  "│········5····##···##···##··················##···##···##··g··········│",
  "└─┐··┌(┐·5·····##···##···##····^······^····##···##···##·······┌─┐··┌─┘",
  "  │··│ │55······##···##···##··············##···##···##··O·····│ │··│  ",
  "  │··│ │·········##···##···##············##···##···##·········│ │··│  ",
  "  │··│ │··········##···##···##··········##···##···##···o···O··│ │··│  ",
  "  │··│ │···········##···##···##········##···##···##······o····│ │··│  ",
  "  │··│ │············##···##···##999999##···##···##··o······o·g│ │··│  ",
  "  │··│ │·············##···##···##····##···##···##·g···o·o·····│ │··│  ",
  "  │··│ │··············##···##···##h·##···##···##··············│ │··│  ",
  "  │··│ │···············##···##··##b·····##···##···g··g····o···│ │··│  ",
  "  │··│ │················##······##e·····##····················│ │··│  ",
  "  │··│ └────────────────────────((((((────────────────────────┘ │··│  ",
  "  │··│                                                          │··│  ",
  "┌─┘··└──────────────────────────────────────────────────────────┘··└─┐",
  "│m#··#$····S·····i···##···##################······$$#·······#?#?##··#│",
  "│·#··###·###########·#··#··t···#·····#$$$······######·##·#··#········│",
  "│·#······#·······^··i···#####····#·#·#?$$····#·#m·····?#·#··########·│",
  "│d####·#·#·##############S·····#·#·#·#########·#########·#··#···t····│",
  "│·#····#·#M·#···#···#···#?···###·#·#···#···d·····^·······#··#·#######│",
  "│·#·####·##·#·#p#·#·#i#·######···#·#·#···#############·#·#··#··t·····│",
  "│^#t···####·#·#·#t#·#·#·#····#·#·#·#·#####···#··d#···#·#·#··########·│",
  "│·####$#?···#?#···#···#···##···#t#·#···M···#···#···#···#·#·······t···│",
  "└_!───_──┐··┌────────────────────!_!─────────────────────┐··┌────────┘",
  "= ==== ==│··│                    = =                     │··│=========",
  "=        /··│                    = =                     │··/       ?=",
  "= =======│··│                    = =                     │··│=========",
  "┌_!────((┘··└((──────┐           = =          ┌──────────┘··└!───────┐",
  "│····##··4··4··##····│           = =          │······················│",
  "│····##··4444··##····│           = =          │······················│",
  "│····##········##·p··│          ┌!_!┐         │·····N····N·····N·····│",
  "│····##······d·##····│         ┌┘$·$└┐        │······················│",
  "│··d·##········##····│        ┌┘··?··└┐       │######################│",
  "│····##········##····│       ┌┘··$·$··└┐      │######################│",
  "│····##······N·##····│      ┌┘·········└┐     │······················│",
  "│··N·##········##····│     ┌┘···········└┐    │······················│",
  "│····##········##····└{───{┘·············└(──(┘33····················│",
  "│····##······d·##········t··················t···3····················│",
  "│··d·##········##······t···················t··t·3····················│",
  "│····##········##····┌{───{┐·············┌(!_(┐33····················│",
  "│····##········##····│     │·············│ =  │······················│",
  "│····##······N·##····│     │·············│ == │######################│",
  "│··d·##········##····│     │·············│  = │######################│",
  "│1111##········##····│     │······e······│  = │·················2····│",
  "│·$$·##······d·##··p·│     │·············│  = │······N··d···N···2·m··│",
  "│$$$$##········##····│     │······@······│  = │················?2····│",
  "│?$$?##········##····│     │·············│  = /·················2····│",
  "└────────────────────┘     └─}─}─────}─}─┘  ==└──────────────────────┘",
];






const bgMusic = "sunset-alleyway";

map.onStart = () => {
  music.crossFade(bgMusic);
  announce("-- RING OF DEATH --", { silent: true });
}

map.triggers = {
  1: async () => {
    monsterWaveLineVertical(monster.zombiePlain, [1, 58], 5);
    monsterWaveLineVertical(monster.zombiePlain, [4, 58], 5);
  },
  2: async () => {
    monsterWaveLineHorizontal(monster.zombiePlain, [55, 67], 5);
    monsterWaveLineHorizontal(monster.zombiePlain, [55, 70], 5);
  },
  3: async () => {
    let seek = 0;
    if (music.name() === bgMusic) seek = music.time();
    music.crossFade("battle-8");
    const crates = crateWall([46, 61], [46, 62]);
    await Promise.all([
      monsterWaveLineVertical(monster.zombiePlain, [56, 58], 7),
      monsterWaveLineVertical(monster.zombieTiny, [58, 58], 7),
      monsterWaveLineVertical(monster.zombiePlain, [60, 58], 7),
      monsterWaveLineVertical(monster.zombiePlain, [62, 58], 7),
      monsterWaveLineVertical(monster.zombieTiny, [64, 58], 7),
      monsterWaveLineVertical(monster.zombiePlain, [65, 58], 7),
    ]);
    crates.forEach(c => c.destroy());
    music.crossFade(bgMusic, { seek });
  },
  4: async () => {
    let seek = 0;
    if (music.name() === bgMusic) seek = music.time();
    music.crossFade("battle-8");
    const crates = crateWall([10, 51], [11, 51]);
    const center = [11, 57];
    await monsterWaveCircle(monster.imp, 6, [11, 60], 2);
    await monsterWaveCircle(monster.wogol, 9, [10, 63], 2);
    await monsterWaveCircle(monster.demonSmall, 4, [11, 66], 2);
    crates.forEach(c => c.destroy());
    music.crossFade(bgMusic, { seek });
  },
  5: async () => {
    let seek = 0;
    if (music.name() === bgMusic) seek = music.time();
    music.crossFade("battle-8");
    const crates = crateWall([7, 24], [7, 25]);
    const center = [14, 31];
    await Promise.all([
      monsterWaveCircle(monster.zombieTiny, 13, center, 3),
      monsterWaveCircle(monster.zombiePlain, 7, center, 2),
      monsterWaveCircle(monster.zombieBig, 1, center, 1),
    ]);
    await monsterWaveCircle(monster.zombieBig, 4, center, 3);
    coinRewardCircle(6, center, 1);
    coinRewardCircle(8, center, 2);
    coinRewardCircle(10, center, 3);
    spawnObject(powerups.flask("small", "red"), ...center);
    crates.forEach(c => c.destroy());
    music.crossFade(bgMusic, { seek });
  },
  6: async () => {
    const crates = [
      ...crateWallVertical([30, 1], 3),
      ...crateWallVertical([39, 1], 3),
    ];
    await monsterWave(() => ([
      spawnObject(monster.necromancer(), 32, 6),
      spawnObject(monster.necromancer(), 37, 6),
    ]));
    crates.forEach(c => c.destroy());
  },
  7: async () => {
    const crates = [
      ...crateWallVertical([38, 5], 3),
      ...crateWallVertical([31, 5], 3),
    ];
    await monsterWave(() => ([
      spawnObject(monster.necromancer(), 31, 2),
      spawnObject(monster.necromancer(), 35, 2),
      spawnObject(monster.necromancer(), 39, 2),
    ]));
    crates.forEach(c => c.destroy());
  },
  8: async () => {
    const crates = [
      ...crateWallHorizontal([30, 11], 3),
      ...crateWallHorizontal([37, 11], 3),
    ];
    await monsterWave(() => ([
      spawnObject(monster.demonSmall(), 37, 5),
      spawnObject(monster.demonSmall(), 34, 5),
      spawnObject(monster.demonSmall(), 31, 5),
    ]));
    crates.forEach(c => c.destroy());
  },
  9: async () => {
    let seek = 0;
    if (music.name() === bgMusic) seek = music.time();
    music.crossFade("battle-8");
    const crates = [
      ...crateWallHorizontal([34, 33], 2),
      ...crateWallHorizontal([33, 13], 4),
    ];

    const center = [36, 22];

    await Promise.all([
      monsterWaveCircle(monster.zombieTiny, 13, center, 3),
      monsterWaveCircle(monster.zombiePlain, 7, center, 2),
      monsterWaveCircle(monster.zombieBig, 1, center, 1),
    ]);
    spawnObject(powerups.flask("small", "red"), ...center);
    await Promise.all([
      monsterWaveCircle(monster.goblin, 11, center, 5),
      monsterWaveCircle(monster.orcWarrior, 7, center, 4),
      monsterWaveCircle(monster.orcMasked, 5, center, 3),
      monsterWaveCircle(monster.orcShaman, 3, center, 2),
      monsterWaveCircle(monster.ogre, 2, center, 1),
    ]);
    spawnObject(powerups.flask("small", "red"), ...center);
    spawnObject(powerups.flask("small", "green"), center[0], center[1] + 1);
    await Promise.all([
      monsterWaveCircle(monster.imp, 9, center, 4),
      monsterWaveCircle(monster.wogol, 7, center, 3),
      monsterWaveCircle(monster.demonSmall, 3, center, 2),
      monsterWaveCircle(monster.necromancer, 2, center, 1),
    ]);

    coinRewardCircle(13, center, 1);
    coinRewardCircle(19, center, 2);
    coinRewardCircle(29, center, 3);
    
    crates.forEach(c => c.destroy());
    music.crossFade(bgMusic, { seek });
  },
};

export default map;