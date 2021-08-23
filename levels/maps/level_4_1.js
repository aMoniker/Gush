import { k } from "/kaboom.js";
import { announce } from "/utils.js";
import state from "/state.js";
import * as powerups from "/objects/powerups.js";
import * as monster from "/objects/monster.js";
import { monsterWave, monsterWaveCircle, monsterWaveLineVertical, monsterWaveLineHorizontal, coinReward, coinRewardCircle, crateWall, crateWallHorizontal, crateWallVertical, spawnObject } from "/levels/maps/utils.js";
import music from "/music.js";
import input from "/input.js";

const map = [
  "                ┌────────────────────────────────────┐                ",
  "               ┌┘####################################└┐               ",
  "              ┌┘######################################└┐              ",
  "             ┌┘########################################└┐             ",
  "            ┌┘##########################################└┐            ",
  "           ┌┘··#####···············>···············####··└┐           ",
  "          ┌┘····####·······························###····└┐          ",
  "         ┌┘··?···###·······························##···?··└┐         ",
  "        ┌┘········##····###########·##########·····##·······└┐        ",
  "       ┌┘·········##·············##·##·············##········└┐       ",
  "      ┌┘··········##·············##·##·············##·········└┐      ",
  "     ┌┘···········##·············##·##·············##··········└┐     ",
  "    ┌┘············##·············##·##·············##···········└┐    ",
  "   ┌┘·············##·············##·##·············##···z········└┐   ",
  "  ┌┘··f····i······##····###########·##########·····##·············└┐  ",
  " ┌┘···············##·······························##········z·····└┐ ",
  "┌┘················##·············33333·············##···············└┐",
  "│·····i···········##·············3···3·············##···z············│",
  "│·················#################·#################················│",
  "│·················#################·#################················│",
  "│··i·································································│",
  "│······························································z·····│",
  "│·····················z·················z················z···········│",
  "│····································································│",
  "│·········d········································z·················│",
  "│·················z···f··············································│",
  "│·z··························O··O··O··O········z·····················│",
  "│···┌──────┐··············g··············g··············z·····z······│",
  "│···│      │··············g·o·o·o··o·o·o·g···························│",
  "│···│ ┌──┐ │··············g··············g··········z················│",
  "│···│ │?m│ │···i···z······g··o·o·oo·o·o··g···························│",
  "│···│ │$$│ │··································f··┌─────────┐···┌─┐···│",
  "│···│ │$$│ │··················o·o·o·o·o··········│         │···│ │···│",
  "│··z│ │$$│ │·····································│      ┌──┘···│ │···│",
  "│···│ │··│ │··············g····g·g·g·g···g·······│     ┌┘······│ │###│",
  "│···│ │··│ │·····································│    ┌┘·······│ │###│",
  "│···└─┘··│ │······················O··············│   ┌┘········│ │··?│",
  "│·······f│ └─────────────────┐···················│  ┌┘222222222│ │···│",
  "└────────┘                   │···················│  │··········│ │···│",
  "                             │··················z│  │··········│=│···│",
  "                             │····z··············│  │··········/ /··?│",
  "┌────────────────────────────┘·······┌───────────┘  │··········│=└!──┘",
  "│·········z·····z··········z·········│              │··········└┐     ",
  "│·····z················z·········z···│   ┌──────────┘···········└┐    ",
  "│··········z·····z···················│   │·······················└┐   ",
  "│·z·┌───────────────────────────┐··z·│   │························└┐  ",
  "│···│              =            │····│   │·························└┐ ",
  "│···│             ┌!_────────┐= │·z··│   │··························│ ",
  "│···│=============│?$$$$$$$$m│  │····│   │··························│ ",
  "│·z·│=           =│$$$$$$$$$$│ =│····│   │··························│ ",
  "│···└!_────────┐ =│$$$####$$$│  │··t·│   │··························│ ",
  "│···z··········│ =│$$$####$$$│= │····│   │·f·······················┌┘ ",
  "│z·············│ =│$$$####$$$│  │·t··│  ┌┘··┌───┐·················┌┘  ",
  "│11111111111111│ =│$$$$$$$$$$│ =│····│  │··┌┘   └┐···············┌┘   ",
  "│··············│ =│?$$$$$$$$?│  │··p·│  │?┌┘     └┐·············┌┘    ",
  "│··············│ =└──────────┘= │····│  └─┘       └┐···········┌┘     ",
  "│··············│ =   =   =   =  │·p··│             └───────────┘      ",
  "│··············│ = =   =   =   =│····│                                ",
  "│··············│ = ┌────────────┘····└───────────────────────────────┐",
  "│··············│ = │·················································│",
  "│··············│ = │·····t·······N··········d······················?·│",
  "│··············│ = │··t·····t··········N········d···············f··?·│",
  "│··············│ = │·················································│",
  "│··············│ = │····#############################################│",
  "│··············│ = │····#############################################│",
  "│··············│ = │·······o················g························│",
  "│······f·······│ = │···O········o··g····g···················f········│",
  "│··············│ = │··········o············g·······················@·│",
  "│··············│ $ │·O····o··········g········g······················│",
  "└──────────────┘===└─────────────────────────────────────────────────┘",
];








const bgMusic = "stark-nuances";

map.onStart = () => {
  music.crossFade(bgMusic);
}

map.triggers = {
  1: async () => {
    let seek = 0;
    if (music.name() === bgMusic) seek = music.time();
    music.crossFade("battle-8");

    const crates = crateWallHorizontal([1, 50], 3);
    const center = [7, 60];

    await Promise.all([
      monsterWaveCircle(monster.zombieTiny, 3, center, 2),
      monsterWaveCircle(monster.zombieTiny, 5, center, 3),
      monsterWaveCircle(monster.zombieTiny, 7, center, 4),
      monsterWaveCircle(monster.zombieTiny, 9, center, 5),
    ]);
    await Promise.all([
      monsterWaveCircle(monster.zombiePlain, 4, center, 2),
      monsterWaveCircle(monster.zombiePlain, 5, center, 3),
      monsterWaveCircle(monster.zombiePlain, 8, center, 4),
      monsterWaveCircle(monster.zombiePlain, 9, center, 5),
    ]);
    await Promise.all([
      monsterWaveCircle(monster.randomZombie, 4, center, 2),
      monsterWaveCircle(monster.randomZombie, 5, center, 3),
      monsterWaveCircle(monster.randomZombie, 8, center, 4),
      monsterWaveCircle(monster.randomZombie, 9, center, 5),
    ]);
    coinRewardCircle(10, center, 1);
    coinRewardCircle(11, center, 2);
    coinRewardCircle(13, center, 3);
    spawnObject(powerups.flask("big", "blue"), ...center);
    crates.forEach(c => c.destroy());
    music.crossFade(bgMusic, { seek });
  },
  2: async () => {
    let seek = 0;
    if (music.name() === bgMusic) seek = music.time();
    music.crossFade("battle-8");

    const crates = crateWallHorizontal([60, 33], 3);
    const center = [58, 49];

    spawnObject(powerups.flask("small", "green"), ...center);
    await Promise.all([
      monsterWaveCircle(monster.orcWarrior, 3, center, 2),
      monsterWaveCircle(monster.goblin, 5, center, 3),
      monsterWaveCircle(monster.goblin, 7, center, 4),
      monsterWaveCircle(monster.goblin, 9, center, 5),
    ]);
    await Promise.all([
      monsterWaveCircle(monster.ogre, 4, center, 2),
      monsterWaveCircle(monster.randomOrc, 5, center, 3),
      monsterWaveCircle(monster.randomOrc, 8, center, 4),
      monsterWaveCircle(monster.randomOrc, 9, center, 5),
    ]);
    await Promise.all([
      monsterWaveCircle(monster.ogre, 4, center, 3),
      monsterWaveCircle(monster.randomOrc, 6, center, 3),
      monsterWaveCircle(monster.randomOrc, 7, center, 4),
      monsterWaveCircle(monster.goblin, 11, center, 5),
    ]);
    coinRewardCircle(10, center, 1);
    coinRewardCircle(11, center, 2);
    coinRewardCircle(13, center, 3);
    coinRewardCircle(17, center, 3);
    spawnObject(powerups.flask("big", "red"), ...center);
    crates.forEach(c => c.destroy());
    music.crossFade(bgMusic, { seek });
  },
  3: async () => {
    let seek = 0;
    if (music.name() === bgMusic) seek = music.time();
    music.crossFade("battle-3");

    const crates = [
      ...crateWallHorizontal([35, 18], 1),
      ...crateWallHorizontal([34, 5], 1),
      ...crateWallHorizontal([34, 6], 3),
      ...crateWallHorizontal([36, 5], 1),
    ];
    const center = [29, 11];
    const center2 = [41, 11];

    spawnObject(powerups.flask("small", "green"), ...center);
    await Promise.all([
      monsterWaveCircle(monster.necromancer, 3, center, 2),
      monsterWaveCircle(monster.necromancer, 3, center2, 2),
      monsterWaveCircle(monster.imp, 5, center, 3),
      monsterWaveCircle(monster.imp, 5, center2, 3),
    ]);
    await Promise.all([
      monsterWaveCircle(monster.demonSmall, 4, center, 3),
      monsterWaveCircle(monster.demonSmall, 4, center2, 3),
    ]);
    await Promise.all([
      monsterWaveCircle(monster.necromancer, 4, center, 3),
      monsterWaveCircle(monster.necromancer, 4, center2, 3),
      monsterWaveCircle(monster.demonSmall, 2, center, 2),
      monsterWaveCircle(monster.demonSmall, 2, center2, 2),
    ]);
    // coinRewardCircle(10, center, 1);
    // coinRewardCircle(11, center, 2);
    // coinRewardCircle(13, center, 3);
    // coinRewardCircle(17, center, 3);
    // spawnObject(powerups.flask("big", "red"), ...center);
    crates.forEach(c => c.destroy());
    music.crossFade(bgMusic, { seek });
  },
  // 4: async () => {
  //   let seek = 0;
  //   if (music.name() === bgMusic) seek = music.time();
  //   music.crossFade("battle-3");
  //   const crates = [
  //     ...crateWallVertical([12, 31], 1),
  //     ...crateWallVertical([41, 41], 1),
  //   ];
  //   await monsterWaveLineHorizontal(monster.goblin, [17, 32], 5),
  //   await monsterWaveLineHorizontal(monster.goblin, [25, 32], 5),
  //   await monsterWaveLineHorizontal(monster.goblin, [32, 32], 5),
  //   await monsterWaveLineVertical(monster.goblin, [38, 35], 5),
  //   await monsterWaveLineHorizontal(monster.goblin, [32, 38], 5),
  //   await monsterWaveLineHorizontal(monster.goblin, [25, 38], 5),
  //   await monsterWaveLineHorizontal(monster.goblin, [17, 38], 5),
  //   await Promise.all([
  //     monsterWaveLineHorizontal(monster.goblin, [20, 35], 5),
  //     monsterWaveLineHorizontal(monster.goblin, [20, 36], 5),
  //   ]);
  //   await Promise.all([
  //     monsterWaveLineHorizontal(monster.goblin, [27, 35], 5),
  //     monsterWaveLineHorizontal(monster.goblin, [27, 36], 5),
  //   ]);
  //   const center = [36, 35];

  //   await Promise.all([
  //     monsterWaveCircle(monster.goblin, 4, center, 2),
  //     monsterWaveCircle(monster.goblin, 7, center, 3),
  //     monsterWaveCircle(monster.goblin, 8, center, 4),
  //     monsterWaveCircle(monster.goblin, 11, center, 5),
  //   ]);
  //   coinRewardCircle(8, center, 1);
  //   coinRewardCircle(10, center, 2);
  //   coinRewardCircle(12, center, 3);
  //   spawnObject(powerups.flask("small", "red"), ...center);
  //   crates.forEach(c => c.destroy());
  //   music.crossFade(bgMusic, { seek });
  // },
  // 5: async () => {
  //   let seek = 0;
  //   if (music.name() === bgMusic) seek = music.time();
  //   music.crossFade("battle-8");
  //   const crates = [
  //     ...crateWallVertical([41, 43], 1),
  //     ...crateWallVertical([40, 56], 1),
  //   ];
  //   await Promise.all([
  //     monsterWaveLineVertical(monster.goblin, [42, 47], 5),
  //     monsterWaveLineHorizontal(monster.goblin, [44, 45], 5),
  //   ]);
  //   const center = [49, 50];
  //   await Promise.all([
  //     monsterWaveCircle(monster.goblin, 5, center, 2),
  //     monsterWaveCircle(monster.goblin, 9, center, 3),
  //     monsterWaveCircle(monster.goblin, 11, center, 4),
  //     monsterWaveCircle(monster.goblin, 13, center, 5),
  //   ]);
  //   await Promise.all([
  //     monsterWaveCircle(monster.orcShaman, 4, center, 2),
  //     monsterWaveCircle(monster.orcWarrior, 5, center, 3),
  //     monsterWaveCircle(monster.orcWarrior, 8, center, 4),
  //     monsterWaveCircle(monster.orcWarrior, 11, center, 5),
  //   ]);
  //   coinRewardCircle(8, center, 1);
  //   coinRewardCircle(10, center, 2);
  //   coinRewardCircle(12, center, 3);
  //   spawnObject(powerups.flask("big", "red"), ...center);
  //   crates.forEach(c => c.destroy());
  //   music.crossFade(bgMusic, { seek });
  // },
  // 6: async () => {
  //   let seek = 0;
  //   if (music.name() === bgMusic) seek = music.time();
  //   music.crossFade("battle-8");
  //   const crates = [
  //     ...crateWallVertical([36, 44], 2),
  //     ...crateWallVertical([37, 45], 1),
  //     ...crateWallVertical([38, 56], 1),
  //   ];
  //   await monsterWaveLineVertical(monster.goblin, [36, 49], 5);
  //   await monsterWaveLineHorizontal(monster.goblin, [27, 48], 5);
  //   await monsterWaveLineHorizontal(monster.goblin, [19, 48], 5);
  //   await monsterWaveLineVertical(monster.goblin, [16, 50], 5);
  //   await monsterWaveLineHorizontal(monster.goblin, [18, 54], 5);
  //   await monsterWaveLineHorizontal(monster.goblin, [30, 54], 5);
  //   const center = [24, 49];
  //   await Promise.all([
  //     monsterWaveCircle(monster.goblin, 12, center, 2),
  //     monsterWaveCircle(monster.goblin, 13, center, 3),
  //     monsterWaveCircle(monster.goblin, 14, center, 4),
  //     monsterWaveCircle(monster.goblin, 15, center, 5),
  //   ]);
  //   spawnObject(powerups.flask("small", "blue"), ...center);
  //   await Promise.all([
  //     monsterWaveCircle(monster.ogre, 4, center, 2),
  //     monsterWaveCircle(monster.orcShaman, 5, center, 3),
  //     monsterWaveCircle(monster.orcWarrior, 8, center, 4),
  //     monsterWaveCircle(monster.orcMasked, 11, center, 5),
  //   ]);
  //   spawnObject(powerups.flask("small", "blue"), ...center);
  //   await Promise.all([
  //     monsterWaveCircle(monster.randomOrc, 4, center, 2),
  //     monsterWaveCircle(monster.randomOrc, 5, center, 3),
  //     monsterWaveCircle(monster.randomOrc, 8, center, 4),
  //     monsterWaveCircle(monster.randomOrc, 11, center, 5),
  //   ]);
  //   spawnObject(powerups.flask("small", "blue"), ...center);
  //   await Promise.all([
  //     monsterWaveCircle(monster.ogre, 3, center, 2),
  //     monsterWaveCircle(monster.ogre, 4, center, 3),
  //     monsterWaveCircle(monster.ogre, 7, center, 4),
  //     monsterWaveCircle(monster.ogre, 8, center, 5),
  //   ]);
  //   coinRewardCircle(12, center, 1);
  //   coinRewardCircle(13, center, 2);
  //   coinRewardCircle(14, center, 3);
  //   coinRewardCircle(15, center, 4);
  //   coinRewardCircle(16, center, 5);
  //   crates.forEach(c => c.destroy());
  //   music.crossFade(bgMusic, { seek });
  // },
};

export default map;