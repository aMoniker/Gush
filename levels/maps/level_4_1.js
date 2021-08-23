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
  "        ┌┘········##···^###########·##########^····##·······└┐        ",
  "       ┌┘·········##·············##^##·············##········└┐       ",
  "      ┌┘··········##·············##·##·············##·········└┐      ",
  "     ┌┘···········##·············##^##·············##··········└┐     ",
  "    ┌┘············##·············##·##·············##···········└┐    ",
  "   ┌┘·············##·············##^##·············##···z········└┐   ",
  "  ┌┘··f····i······##···^###########·##########^····##·············└┐  ",
  " ┌┘···············##·······························##········z·····└┐ ",
  "┌┘················##·············33333·············##···············└┐",
  "│·····i···········##·············3···3·············##···z············│",
  "│·················#################·#################················│",
  "│·················#################·#################················│",
  "│··i·····························^^^^^·······························│",
  "│·································^^^··························z·····│",
  "│·····················z············^····z················z···········│",
  "│····································································│",
  "│·········d········································z·················│",
  "│·················z···f··············································│",
  "│·z··························O··O··O··O········z·····················│",
  "│···┌──────┐··············g··············g··············z·····z······│",
  "│···│      │··············g·o·o·o··o·o·o·g···························│",
  "│···│ ┌──┐ │··············g··············g··········z················│",
  "│···│ │?m│ │···i···z······g··o·o·oo·o·o··g···························│",
  "│···│ │$$│ │··································f··┌────────(┐···┌(┐···│",
  "│···│ │$$│ │··················o·o·o·o·o··········│         │···│ │···│",
  "│··z│ │$$│ │·····································│      ┌──┘···│ │···│",
  "│···│ │··│ │··············g····g·g·g·g···g·······│     ┌┘······│ │###│",
  "│···│ │··│ │·····································│    ┌┘·······│ │###│",
  "│···└{┘··│ │······················O··············│   ┌┘········│ │··?│",
  "│·······f│ └─────────────────┐···················│  ┌┘222222222│ │···│",
  "└────{───┘                   │···················│  │··········│ │···│",
  "                             │··················z│  │··········│=│···│",
  "                             │····z··············│  │··········/ /··?│",
  "┌────((──────────────────────┘·······┌───────────┘  │··········│=└!──┘",
  "│·········z·····z··········z·········│              │··········└┐     ",
  "│·····z················z·········z···│   ┌──────────┘···········└┐    ",
  "│··········z·····z···················│   │·······················└┐   ",
  "│·z·┌((─────────────────────────┐··z·│   │························└┐  ",
  "│···│              =            │····│   │·························└┐ ",
  "│···│             ┌!_────────┐= │·z··│   │··························│ ",
  "│···│=============│?$$$$$$$$m│  │····│   │··························│ ",
  "│·z·│=           =│$$$$$$$$$$│ =│····│   │··························│ ",
  "│^^^└!_────────┐ =│$$$####$$$│  │··t·│   │··························│ ",
  "│···z··········│ =│$$$####$$$│= │····│   │·f·······················┌┘ ",
  "│z·············│ =│$$$####$$$│  │·t··│  ┌┘··┌───┐·················┌┘  ",
  "│11111111111111│ =│$$$$$$$$$$│ =│····│  │··┌┘   └┐···············┌┘   ",
  "│··············│ =│?$$$$$$$$?│  │··p·│  │?┌┘     └┐·············┌┘    ",
  "│··············│ =└──────────┘= │····│  └─┘       └┐···········┌┘     ",
  "│··············│ =   =   =   =  │·p··│             └───────────┘      ",
  "│··············│ = =   =   =   =│····│                                ",
  "│··············│ = ┌───────────{┘····└{──────────────────────}──%──}─┐",
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
  announce("-- ANCIENT ALTAR --", { silent: true });
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
    crates.forEach(c => c.destroy());
    music.crossFade(bgMusic, { seek });
  },
};

export default map;