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
  "│···························································g·o··#·#·│",
  "│#·#········o··············o·····················o·········o··g··O###│",
  "│···························································go····#·#│",
  "│·##┌─┐···┌─────────────────────────────┐···┌────────────────────┐#··│",
  "│···│ │···│                             │···│                    │·#·│",
  "│···│ │···│ ┌─────────────────────────┐ │···└────────────────}─┐ │·?#│",
  "│···│ │···│ │·························│ │······················│ │···│",
  "│···│ │···│ │·························│ │···················@··│ │···│",
  "│···│ │···│ │111·····················?│ │#·····················│ │···│",
  "│···└─┘···│ │··1······················│ │·#····················│ │···│",
  "│og·###···│ │^┌(──────────────────────┘ │··#┌────────────────}─┘ │···│",
  "│go·###···│ │^│                         │#·#│                    │···│",
  "│ogo┌─┐···│ │^└(───────────────────────{┘##·└────────────────────┘···│",
  "│···│ │···│ │···O··························#·························│",
  "│···│ │···│ │························································│",
  "│···│ │···│ │···O················································o···│",
  "│···└─┘···│ │^┌(───────────────────────{┐···┌────────────────────┐···│",
  "│···###···│ │^│                         │···│                    │···│",
  "│···###gog│ │^└(──────────────────────┐ │···│ ┌────────────────┐ │···│",
  "│···┌─┐gog│ │··2······················│ │···│ │$·$·?·$·$·?·$·$·│ │···│",
  "│···│ │ogo│ │222·····················?│ │···│ │·$·$·$·$·$·$·$·f│ │···│",
  "│···│ │···│ │·························│ │···│ │f·$·$·$·$·$·$·$·│ │·o·│",
  "│···│ │···│ │·························│ │···│ │···$·$·?·$·$·?·$│ │···│",
  "│···│ │···│ └─────────────────────────┘ │···│ └!_!─────────────┘ │···│",
  "│·g·│ │···│                             │···│     =              │···│",
  "│o·g└─┘···└─────────────────────────────┘···│=┌────_─!─────────┐=│···│",
  "│·oog·······································│ │················│ │···│",
  "│·oo·g··········O···························│ │················│ │···│",
  "│o··o·······································│ │················│ │···│",
  "└─────┐···┌(┐^┌(────────────────────────┐·#·│ │················│ │···│",
  "      │···│ │^│                         │·##│ │················│ │···│",
  "┌───┐ │···│ │^└───────────────────────┐ │··#│ │················│ │···│",
  "│?·?│ │···│ │··3······················│ │#·#│ │················│ │o·o│",
  "│·?·│ │···│ │333······················│ │·##│ │················│ │···│",
  "│···│ │···│ │·························│ │··#│ │················│ │·o·│",
  "│···│ │···│ │·························│ │·#·│ │················│ │···│",
  "│m··│ │#··│ │·························│ │···│ │················│ │···│",
  "│···│ │··#│ │·························│ │···│ │················│ │···│",
  "│···│ │##·│ │·························│ │··O│ │44··············│ │···│",
  "│·o·│ │#·#│ │·························│ │···└(┘·4··············│ │···│",
  "│o·o│ │·#·│ │·························│ │···^^^·4··············│ │···│",
  "│···│ │···│ └─────────────────────────┘ │···┌(─────────────────┘ │···│",
  "│···│ │···│                             │···│                    │···│",
  "│^^^└(┘···└─────────────────────────────┘···└────────────────────┘···│",
  "│····························o·g·····································│",
  "│·····················O·····o·o·o··········g············g············│",
  "│····························o·g·····································│",
  "│···┌────────────────────────────────────────────────────────────┐···│",
  "│···│                                                            │g·g│",
  "│···│ ┌─────────────(─────────────┐ ┌─────────────(────────────┐ │·o·│",
  "│···│ │············^^^·6··········│ │············^^^·8········>│ │o·o│",
  "│···│ │············┌(┐·6··········│ │············┌(┐·8·········│ │···│",
  "│···│ │············│ │66··········│ │············│ │88·········│ │···│",
  "│···│ │············│ │············│ │············│ │···········│ │···│",
  "│···│ │············│ │············│ │············│ │···········│ │···│",
  "│···│ │············│ │············│ │············│ │···········│ │···│",
  "│···│ │············│ │············│ │············│ │···········│ │···│",
  "│···│ │············│ │············│ │············│ │···········│ │···│",
  "│···│ │············│ │············│ │············│ │···········│ │···│",
  "│··O│ │55··········│ │············│ │77··········│ │···········│ │···│",
  "│···└(┘·5··········│ │············└(┘·7··········│ │···········│ │···│",
  "│···^^^·5··········│ │············^^^·7··········│ │···········│ │#··│",
  "│···┌(─────────────┘ └─────────────(─────────────┘ └───────────┘ │·#·│",
  "│··O│                                                            │###│",
  "│···└────────────────────────────────────────────────────────────┘·#·│",
  "│··················o························#·············##·i··$##·#│",
  "│····················o···········#··················##·····#··d·?#··#│",
  "│··················o··········#··········#·········#·#·······i··$··#·│",
  "└────────────────────────────────────────────────────────────────────┘",
];

const bgMusic = "sunset-alleyway";

map.onStart = () => {
  music.crossFade(bgMusic);
  announce("-- PRISONER'S DILEMMA --", { silent: true });
};

map.triggers = {
  1: async () => {
    const crates = crateWallHorizontal([13, 11], 1);
    await Promise.all([
      monsterWaveLineVertical(monster.zombieTiny, [22, 7], 4),
      monsterWaveLineVertical(monster.zombieTiny, [23, 7], 4),
      monsterWaveLineVertical(monster.zombieTiny, [24, 7], 4),
    ]);
    await Promise.all([
      monsterWaveLineVertical(monster.zombiePlain, [27, 7], 4),
      monsterWaveLineVertical(monster.zombiePlain, [28, 7], 4),
      monsterWaveLineVertical(monster.zombiePlain, [29, 7], 4),
    ]);
    await Promise.all([
      monsterWaveLineVertical(monster.randomZombie, [31, 7], 4),
      monsterWaveLineVertical(monster.randomZombie, [32, 7], 4),
      monsterWaveLineVertical(monster.randomZombie, [33, 7], 4),
    ]);
    coinRewardCircle(7, [25, 8], 1);
    coinRewardCircle(8, [25, 8], 1.5);
    spawnObject(powerups.flask("small", "blue"), 25, 8);
    crates.forEach(c => c.destroy());
  },
  2: async () => {
    const crates = crateWallHorizontal([13, 19], 1);
    await Promise.all([
      monsterWaveLineVertical(monster.muddy, [22, 20], 4),
      monsterWaveLineVertical(monster.muddy, [23, 20], 4),
      monsterWaveLineVertical(monster.muddy, [24, 20], 4),
    ]);
    await Promise.all([
      monsterWaveLineVertical(monster.muddy, [27, 20], 4),
      monsterWaveLineVertical(monster.swampy, [28, 20], 4),
      monsterWaveLineVertical(monster.muddy, [29, 20], 4),
    ]);
    await Promise.all([
      monsterWaveLineVertical(monster.muddy, [31, 20], 4),
      monsterWaveLineVertical(monster.swampy, [32, 20], 4),
      monsterWaveLineVertical(monster.demonSmall, [33, 20], 4),
    ]);
    coinRewardCircle(7, [25, 22], 1);
    coinRewardCircle(8, [25, 22], 1.5);
    spawnObject(powerups.flask("small", "blue"), 25, 22);
    crates.forEach(c => c.destroy());
  },
  3: async () => {
    const crates = crateWallHorizontal([13, 32], 1);
    const center = [21, 37];
    const center2 = [27, 36];
    const center3 = [32, 36];

    spawnObject(powerups.flask("small", "green"), ...center);
    await Promise.all([
      monsterWaveCircle(monster.imp, 5, center, 2),
      monsterWaveCircle(monster.imp, 5, center, 2),
      monsterWaveCircle(monster.wogol, 5, center, 3),
    ]);
    await Promise.all([
      monsterWaveCircle(monster.imp, 4, center2, 3),
      monsterWaveCircle(monster.imp, 4, center2, 3),
      monsterWaveCircle(monster.wogol, 5, center2, 3),
      monsterWaveCircle(monster.demonSmall, 5, center2, 3),
    ]);
    spawnObject(powerups.flask("small", "blue"), ...center2);
    await Promise.all([
      monsterWaveCircle(monster.wogol, 4, center3, 3),
      monsterWaveCircle(monster.wogol, 4, center3, 4),
      monsterWaveCircle(monster.demonSmall, 3, center3, 2),
      monsterWaveCircle(monster.demonSmall, 3, center3, 3),
    ]);
    spawnObject(powerups.flask("small", "red"), ...center3);
    coinRewardCircle(10, center3, 1);
    coinRewardCircle(11, center3, 2);
    coinRewardCircle(12, center3, 3);
    crates.forEach(c => c.destroy());
  },
  4: async () => {
    const crates = crateWallHorizontal([46, 41], 1);
    const center = [55, 33];

    spawnObject(powerups.flask("small", "green"), ...center);
    await Promise.all([
      monsterWaveCircle(monster.goblin, 5, center, 2),
      monsterWaveCircle(monster.goblin, 6, center, 2),
      monsterWaveCircle(monster.goblin, 7, center, 3),
    ]);
    await Promise.all([
      monsterWaveCircle(monster.goblin, 4, center, 3),
      monsterWaveCircle(monster.goblin, 4, center, 3),
      monsterWaveCircle(monster.randomOrc, 5, center, 3),
      monsterWaveCircle(monster.randomOrc, 5, center, 3),
    ]);
    spawnObject(powerups.flask("big", "blue"), ...center);
    await Promise.all([
      monsterWaveCircle(monster.ogre, 3, center, 1),
      monsterWaveCircle(monster.orcShaman, 4, center, 2),
      monsterWaveCircle(monster.randomOrc, 5, center, 3),
      monsterWaveCircle(monster.randomOrc, 7, center, 4),
    ]);
    spawnObject(powerups.flask("big", "red"), ...center);
    coinRewardCircle(11, center, 1);
    coinRewardCircle(12, center, 2);
    coinRewardCircle(13, center, 3);
    crates.forEach(c => c.destroy());
  },
  5: async () => {
    const crates = crateWallHorizontal([6, 62], 1);
    const center = [13, 55];
    await Promise.all([
      monsterWaveCircle(monster.zombiePlain, 5, center, 2),
      monsterWaveCircle(monster.muddy, 6, center, 2),
      monsterWaveCircle(monster.zombieTiny, 7, center, 3),
    ]);
    await Promise.all([
      monsterWaveCircle(monster.zombiePlain, 4, center, 3),
      monsterWaveCircle(monster.swampy, 4, center, 3),
      monsterWaveCircle(monster.muddy, 5, center, 3),
      monsterWaveCircle(monster.zombieTiny, 5, center, 3),
    ]);
    spawnObject(powerups.flask("small", "blue"), ...center);
    await Promise.all([
      monsterWaveCircle(monster.zombieBig, 3, center, 1),
      monsterWaveCircle(monster.zombiePlain, 4, center, 2),
      monsterWaveCircle(monster.swampy, 5, center, 3),
      monsterWaveCircle(monster.zombieTiny, 7, center, 4),
    ]);
    spawnObject(powerups.flask("small", "red"), ...center);
    coinRewardCircle(11, center, 1);
    coinRewardCircle(12, center, 2);
    coinRewardCircle(13, center, 3);
    crates.forEach(c => c.destroy());
  },
  6: async () => {
    const crates = crateWallHorizontal([21, 51], 1);
    const center = [28, 57];
    await Promise.all([
      monsterWaveCircle(monster.randomOrc, 5, center, 2),
      monsterWaveCircle(monster.goblin, 6, center, 2),
      monsterWaveCircle(monster.goblin, 7, center, 3),
    ]);
    await Promise.all([
      monsterWaveCircle(monster.orcShaman, 4, center, 3),
      monsterWaveCircle(monster.randomOrc, 4, center, 3),
      monsterWaveCircle(monster.randomOrc, 5, center, 3),
      monsterWaveCircle(monster.goblin, 5, center, 3),
    ]);
    spawnObject(powerups.flask("small", "green"), ...center);
    await Promise.all([
      monsterWaveCircle(monster.ogre, 3, center, 1),
      monsterWaveCircle(monster.randomOrc, 4, center, 2),
      monsterWaveCircle(monster.randomOrc, 5, center, 3),
      monsterWaveCircle(monster.randomOrc, 7, center, 4),
    ]);
    spawnObject(powerups.flask("small", "red"), ...center);
    coinRewardCircle(12, center, 1);
    coinRewardCircle(13, center, 2);
    coinRewardCircle(14, center, 3);
    crates.forEach(c => c.destroy());
  },
  7: async () => {
    const crates = crateWallHorizontal([36, 62], 1);
    const center = [43, 55];
    await Promise.all([
      monsterWaveCircle(monster.demonSmall, 4, center, 2),
      monsterWaveCircle(monster.muddy, 6, center, 2),
      monsterWaveCircle(monster.imp, 7, center, 3),
    ]);
    await Promise.all([
      monsterWaveCircle(monster.demonSmall, 5, center, 2),
      monsterWaveCircle(monster.swampy, 4, center, 3),
      monsterWaveCircle(monster.muddy, 5, center, 3),
      monsterWaveCircle(monster.imp, 5, center, 4),
    ]);
    spawnObject(powerups.flask("big", "blue"), ...center);
    await Promise.all([
      monsterWaveCircle(monster.demonSmall, 3, center, 1),
      monsterWaveCircle(monster.demonSmall, 4, center, 2),
      monsterWaveCircle(monster.swampy, 5, center, 3),
      monsterWaveCircle(monster.muddy, 7, center, 4),
    ]);
    spawnObject(powerups.flask("big", "red"), ...center);
    coinRewardCircle(13, center, 1);
    coinRewardCircle(14, center, 2);
    coinRewardCircle(15, center, 3);
    crates.forEach(c => c.destroy());
  },
  8: async () => {
    const crates = [
      ...crateWallHorizontal([51, 51], 1),
      ...crateWallHorizontal([61, 51], 1),
      ...crateWallHorizontal([61, 52], 2),
    ];
    const center = [57, 57];
    spawnObject(powerups.flask("small", "green"), ...center);
    await Promise.all([
      monsterWaveCircle(monster.necromancer, 1, center, 2),
      monsterWaveCircle(monster.demonSmall, 3, center, 2),
      monsterWaveCircle(monster.swampy, 5, center, 3),
    ]);
    spawnObject(powerups.flask("big", "blue"), ...center);
    await Promise.all([
      monsterWaveCircle(monster.necromancer, 2, center, 2),
      monsterWaveCircle(monster.demonSmall, 3, center, 3),
      monsterWaveCircle(monster.swampy, 5, center, 3),
      monsterWaveCircle(monster.muddy, 7, center, 4),
    ]);
    await Promise.all([
      monsterWaveCircle(monster.necromancer, 3, center, 1),
      monsterWaveCircle(monster.demonSmall, 4, center, 2),
      monsterWaveCircle(monster.swampy, 7, center, 3),
      monsterWaveCircle(monster.muddy, 9, center, 4),
    ]);
    spawnObject(powerups.flask("big", "red"), ...center);
    coinRewardCircle(17, center, 1);
    coinRewardCircle(18, center, 2);
    coinRewardCircle(19, center, 3);
    crates.forEach(c => c.destroy());
  }
};

export default map;