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
  "│············z·····················g·g·······························│",
  "│·z·····z··z····z····z·····z·····g··o·g····························@·│",
  "│···z········z····z···············o··O··········#······#··#·#···#····│",
  "│·······z··z···m···z··z·z··zz······Oo·g··········##··#·#···##····#···│",
  "│··z··z········z··z···············o··O··········##····##···#···###···│",
  "│·····z···z·········z··z··z··z···g··o·g······························│",
  "│···z········z·····················g·g·······························│",
  "│·o·····┌────────────────────────────────────────────────────┐·······│",
  "│·z·····│                                                    │·······│",
  "│·······│ ┌────────────────────────────────────────────────┐ │··#····│",
  "│···o···│ │···············································>│ │·····#·│",
  "│····z··│ │················································│ │·······│",
  "│···o···│ │···············#······#··············#··········│ │···z···│",
  "│·······│ │········#·····················#··#··············│ │··##···│",
  "│··z····│ │··································#········f····│ │···###·│",
  "│····z··│ │····················#··#·····#··#········#······│ │··z····│",
  "│·······│ │·········###·····##·#·#·························│ │····z··│",
  "│·z·····│ │···········#····#·##·#··························│ │##·····│",
  "│·······│ │··········#·······#·#·······#·······#···········│ │···z···│",
  "│·····z·│ │········#······#·····#······##··················│ │··z····│",
  "│·······│ │···········#··········#·······#·················│ │·······│",
  "│····z··│ │·······#······················#·#···············│ │···#···│",
  "│·······│ │·····························#·#······#·········│ │·z$·#··│",
  "│······$│ │··········#··················#··#···············│ │···$#··│",
  "│··z···#│ │·······#···········#················#···········│ │···#···│",
  "│······#│ │······#···#·····························#·······│ │·z·····│",
  "│······#│ │·················3333333333333·········#·##·····│ │·······│",
  "│····z·#│ │···f·············3···········3········#···#·····│ │····z··│",
  "│······#│ │·········#·······3···········3··················│ │·#·····│",
  "│······#│ └───────────────(─(─┐·······┌─(─(────────────────┘ │··z··#·│",
  "│······#│                     │^^^^^^^│                      │·······│",
  "│·z····#└───────────────────┐ │·······│ ┌────────────────────┘··#·z··│",
  "│······#··$$·$·$···········#│ │·······│ │#·····$····$····z·········z·│",
  "│······##···##··##····z···$#│ │·······│ │###··$···$···#···##···z·····│",
  "│···z···#?··#$$####········#│ │·······│ │·####·····$····z·········#··│",
  "│·······#############····$·#│ │·o·o·o·│ │···?#·#·$···$···z···#···z···│",
  "│·z·····#···············z··#│ │o·o·o·o│ │···####···$#·······z········│",
  "│$··z·····z···············$#│ │·O·O·O·│ │··##·#··$·##··$··z·····z····│",
  "│$$$·············z·····##··#│ │o·o·o·o│ │··#·###··$##·············z··│",
  "└───────────────────┐···#$·#│ │ggggggg│ │····#·#┌────────────────────┘",
  "                    │··##·$#│ │·······│ │····#··│                    =",
  "┌─────────────────┐ │···#··#│ │·······│ │···z···│ ┌────────────────_!┐",
  "│f····?·····?····f│ │··##·##│ │·······│ │·······│ │··················│",
  "│·················│ │···###·│ │·z·····│ │·z····z│ │··················│",
  "│·················│ │·······│ │······z│ │·······│ │··f···············│",
  "│·················│ │·······│ │·······│ │···z·z·│ │··················│",
  "│·················│ │·······│ │·······│ │·······│ │··················│",
  "│·················│ │##··z··│ │···z···│ │··z····│ │··············m···│",
  "│·················│ │##·····│ │·······│ │······$│ │··················│",
  "│·················│ │###····│ │·······│ │··$····│ │··················│",
  "│·················│ │###··z·│ │·······│ │·····$·│ │··················│",
  "│·················│ │·?#····│ │·d·····│ │···$··$│ │··················│",
  "│·················│ │·##····│ │·······│ │·$·····│ │··················│",
  "│·················│ │$#·····│ │·····d·│ │·····$·│ │··················│",
  "│·················│ │$####··│ │·······│ │##·$···/ │··················│",
  "│·················│ │$####··│ │·······│ │·##···#│ │··················│",
  "│·················│ │··###··│ │·······│ │#·##?##│ │··················│",
  "│·················│ │··###··│ │··z····│ │#··###·│ │··················│",
  "│·················│ │·······│ │·······│ │##··#··│ │··················│",
  "│·················│ │·$·····│ │·······│ │·##·#··│ │··················│",
  "│···············11│ │·$·z···│ │·······│ │·······│ │222···············│",
  "│···············1·└(┘·······└(┘·······└(┘·······└(┘··2···············│",
  "│···············1······$········z···········z········2···f···········│",
  "│···············1··##···#····#·····$··z···········#··2···············│",
  "│··············#1·####·###·$##·#·········z·······##··2···············│",
  "│··············############·##··#····$········#####··2···············│",
  "│·············#·##·#####·###·##··#········z··##·#·#··2···············│",
  "│············#·····##·#····#··#·#·#··················2···············│",
  "└────────────────────────────────────────────────────────────────────┘",
];

const bgMusic = "cave-3";

map.onStart = () => {
  music.crossFade(bgMusic);
  announce("-- FORGOTTEN RUINS --", { silent: true });
};

map.triggers = {
  1: async () => {
    let seek = 0;
    if (music.name() === bgMusic) seek = music.time();
    music.crossFade("battle-8");

    const crates = crateWallHorizontal([19, 63], 1);
    const center = [9, 53];

    await Promise.all([
      monsterWaveCircle(monster.zombiePlain, 3, center, 2),
      monsterWaveCircle(monster.zombiePlain, 5, center, 3),
      monsterWaveCircle(monster.zombiePlain, 7, center, 4),
      monsterWaveCircle(monster.zombiePlain, 9, center, 5),
    ]);
    await Promise.all([
      monsterWaveCircle(monster.zombieBig, 4, center, 2),
      monsterWaveCircle(monster.wogol, 5, center, 3),
      monsterWaveCircle(monster.zombiePlain, 8, center, 4),
      monsterWaveCircle(monster.zombiePlain, 9, center, 5),
    ]);
    await Promise.all([
      monsterWaveCircle(monster.randomZombie, 4, center, 2),
      monsterWaveCircle(monster.randomZombie, 5, center, 3),
      monsterWaveCircle(monster.randomZombie, 8, center, 4),
      monsterWaveCircle(monster.randomZombie, 9, center, 5),
    ]);
    coinRewardCircle(11, center, 1);
    coinRewardCircle(13, center, 2);
    coinRewardCircle(14, center, 3);
    spawnObject(powerups.flask("big", "blue"), ...center);
    crates.forEach(c => c.destroy());
    music.crossFade(bgMusic, { seek });
  },
  2: async () => {
    let seek = 0;
    if (music.name() === bgMusic) seek = music.time();
    music.crossFade("battle-8");

    const crates = crateWallHorizontal([50, 63], 1);
    const center = [59, 53];

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
    spawnObject(powerups.flask("small", "red"), ...center);
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
    spawnObject(powerups.flask("big", "blue"), ...center);
    crates.forEach(c => c.destroy());
    music.crossFade(bgMusic, { seek });
  },
  3: async () => {
    let seek = 0;
    if (music.name() === bgMusic) seek = music.time();
    music.crossFade("battle-3");

    const crates = [
      ...crateWallHorizontal([57, 11], 1),
      ...crateWallHorizontal([57, 12], 2),
      ...crateWallHorizontal([31, 30], 7),
    ];
    const center = [34, 19];
    const center2 = [44, 19];
    const center3 = [20, 19];
    const potions = [34, 26];

    spawnObject(powerups.flask("big", "green"), potions[0], potions[1]);
    await Promise.all([
      monsterWaveCircle(monster.necromancer, 3, center, 2),
      monsterWaveCircle(monster.necromancer, 3, center, 2),
      monsterWaveCircle(monster.wogol, 5, center, 3),
      monsterWaveCircle(monster.imp, 5, center, 3),
    ]);
    spawnObject(powerups.flask("big", "red"), potions[0]-1, potions[1]);
    await Promise.all([
      monsterWaveCircle(monster.demonSmall, 4, center3, 3),
      monsterWaveCircle(monster.demonSmall, 4, center3, 3),
      monsterWaveCircle(monster.wogol, 5, center3, 3),
      monsterWaveCircle(monster.imp, 5, center3, 3),
    ]);
    spawnObject(powerups.flask("big", "blue"), potions[0]+1, potions[1]);
    await Promise.all([
      monsterWaveCircle(monster.necromancer, 4, center2, 3),
      monsterWaveCircle(monster.necromancer, 4, center2, 3),
      monsterWaveCircle(monster.demonSmall, 2, center2, 2),
      monsterWaveCircle(monster.demonSmall, 2, center2, 2),
    ]);
    spawnObject(powerups.flask("big", "red"), potions[0], potions[1]+1);
    await Promise.all([
      monsterWaveCircle(monster.necromancer, 2, center, 3),
      monsterWaveCircle(monster.necromancer, 2, center2, 3),
      monsterWaveCircle(monster.necromancer, 2, center3, 3),
      monsterWaveCircle(monster.demonSmall, 3, center2, 2),
      monsterWaveCircle(monster.demonSmall, 3, center2, 2),
      monsterWaveCircle(monster.demonSmall, 3, center2, 2),
      monsterWaveCircle(monster.wogol, 7, center, 4),
      monsterWaveCircle(monster.wogol, 7, center2, 4),
      monsterWaveCircle(monster.wogol, 7, center3, 4),
      monsterWaveCircle(monster.imp, 8, center, 5),
      monsterWaveCircle(monster.imp, 8, center2, 5),
      monsterWaveCircle(monster.imp, 8, center3, 5),
    ]);
    crates.forEach(c => c.destroy());
    music.crossFade(bgMusic, { seek });
  },
};

export default map;