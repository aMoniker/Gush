import { k } from "/kaboom.js";
import { announce } from "/utils.js";
import state from "/state.js";
import * as monster from "/objects/monster.js";
import { monsterWave, coinReward, crateWall, spawnObject } from "/levels/maps/utils.js";
import music from "/music.js";
import input from "/input.js";

const map = [
  "┌{─{─{┐     ┌──)────)──┐     ┌───────┐            ┌──────────────────┐",
  "│·····└─────┘··········└─────┘·······│            │··············w···│",
  "│··········1···············t·2·······│            │pp················│",
  "│··@·······1···········t·····2·······└───}}───────┘pp┌────────────┐··│",
  "│··········1···············t·2···········b········ppp│            │··│",
  "│·····┌─────┐··········┌─────┐············b·······ppp│ ┌────────┐ │··│",
  "└{─{─{┘     └──)────)──┘     └───────────}}───────┐pp│ │g·······│ │··│",
  "                                                  │pp│ │········│ │··│",
  " ┌───┐                                ┌───────────┘33│ │··┌──┐··│ │··│",
  "┌┘$·$└┐====┌─!───────────────────┐    │······e·······│ │··│  │^^│ │^^│",
  "│··?··/    /·······g·············│    │····e·········│ │··│  │··│ │··│",
  "└┐$·$┌┘====└──────────────────┐··│    │··┌───────────┘ │··│  │··└─┘··│",
  " └───┘                        │··│    │00│            ┌┘··└┐ │·······│",
  "                          ┌───┘··└────┘··└──────────┐ │$··$│ │··g····│",
  "┌─────────────────────────┘········i·········i······│ │·$$·│ └───────┘",
  "│·p···············································$·│ │$··$│          ",
  "│·················································$·│ └────┘          ",
  "│··┌──────────────────────┐········i····i····i······│                 ",
  "│··│                      └───┐··┌────┐··┌──────────┘                 ",
  "│·t│            ┌(─(──(─(┐    │··│    │··│            ┌──────────────┐",
  "│··│           ┌┘········└┐   │··│    │··│     ┌──────┘··············│",
  "│··│========== │·^······^·│   │··│    │··│     │·····················│",
  "│^·│         = │··········│   │··│    │··│     │··┌───────────────┐··│",
  "│··│ ┌─────!_┐ │···^··^·88└───┘··└┐  ┌┘··└┐    │··│               │··│",
  "│··│ │$·$·$·$│ │····##·88·········│==│····└────┘··└─────────────┐ │··│",
  "│··│ │·$·$·$·│ │·^·####8^·········/  /············4·············│ │··│",
  "│··│ │$·$?$·$│ │····##·88·········│==│····┌────┐444·············│ │··│",
  "│··│ │·$·$·$·│ │···^··^·88┌───┐··┌┘  └┐··┌┘    │················│ │··│",
  "│··│ │$·$·$·$│ │··········│   │··│====│··│     │················│ │··│",
  "│··│ │·$·$·$·│ │·^······^·│   │··│=$$=│··│     │················│ │··│",
  "│t^│ └───────┘ └┐········┌┘   │··│=$$=│··│     │················│ │··│",
  "│··│ ===========└(─(──(─(┘    │··│=  =│··│     │················│ │··│",
  "│··│                  =       │··│=  =│··│     │················│ │··│",
  "│t·│================= =       │··│=  =│··│     │················│ │··│",
  "│··│                = =       │··│=  =│··│     └────────────────┘ │··│",
  "│··│                = =       │··│=  =│··│                        │··│",
  "│··│ ┌─────────────┐= =┌──────┘··└!__─┘··└─────────────┐  ┌───────┘··│",
  "│·t│ │·······i·i··$│= =│·······················w·······│  │······p···│",
  "│··│ │········d···$│= =│w······························│  │···p······│",
  "│··│ │··┌──────────┘= =└────────────────────────────┐··│  │··········│",
  "│··│ │··│           =                       =       │··└──┘····┌─────┘",
  "│^·│ │··│           ======================= =       │··········│      ",
  "│t·│ │··└──────────────────────────┐      ┌_┐       │··········│ ┌───┐",
  "│··│ │·····························│     ┌┘$└┐      │··┌──┐····│ │·o·│",
  "│··│ │·····························│    ┌┘···└┐     │··│  │····└─┘··o│",
  "│··│ └─┐·┌──┐······················│   ┌┘·····└┐    │··│  │·········?│",
  "│··│   │·│  │······················│  ┌┘··$·$··└┐   │··│  │··········│",
  "│·t│   │·│  │······················│  │$···?···$│   │··│  │····┌─┐··o│",
  "│··│   │·│  │······················│  └┐··$·$··┌┘   │··│  │····│ │·o·│",
  "│··│   │·│  │······················│   └┐·····┌┘    │··│  │····│ └───┘",
  "│··│   │·│  │······················│    └┐···┌┘     │··│  │····│      ",
  "│··│   │·│  │······················│     └┐$┌┘      │··│  │····└─────┐",
  "│t·│   │·│  │······················│      └_┘       │··│  │··········│",
  "│··│   │·│  │····················55│      = =       │··│  │··········│",
  "│··│  ┌┘·└┐ │····················5·└───────_────!───┘··│  │·t··┌──┐··│",
  "│··│  │···│ │····················5·····················│  │····│  │··│",
  "│··│  │·?·│ │····················5·····················│  │····│  │··│",
  "│··│  │···│ └──────────────────────────────────────────┘  │····│  │··│",
  "│·^│  └───┘                                               │····│  │··│",
  "│··│               ┌──────────────────────────────────────┘····│  │··│",
  "│··└───────────────┘·········o············o····················│  │i·│",
  "│·z························o·····Z··········o··················│  │··│",
  "│··························o·········Z······o··················│  │··│",
  "└_──────────────────┐········o············o·················o··│  │··│",
  "= =                 └─────────────────────────────────┐··┌─────┘  │·w│",
  "┌_─!┐                                                 │··│        │··│",
  "│···└─────────────────────────────────────────────────┘··└────────┘··│",
  "│·>························6·········································│",
  "│··························6·········································│",
  "└────────────────────────────────────────────────────────────────────┘",
];


let showTutorial = true;
const tutorialKey = "level-1-1-tutorials";

const bgMusic = "stark-nuances";

map.onStart = () => {
  showTutorial = state.get(tutorialKey) ?? true;
  if (showTutorial) {
    announce(input.gamepadConnected ? "ANALOG STICK to move" : "WASD to move");
  }
  music.crossFade(bgMusic);
}

map.triggers = {
  0: () => {
    state.set(tutorialKey, false);
  },
  1: () => {
    if (showTutorial) {
      announce(input.gamepadConnected ? "BOTTOM BUTTON to attack" : "SPACE to attack");
    }
  },
  2: () => {
    if (showTutorial) {
      announce("GREEN potions charge BURP meter");
      announce(
        input.gamepadConnected ? "RIGHT BUTTON for DEADLY BURP" : "Press B for DEADLY BURP"
      );
    }
  },
  3: () => {
    if (showTutorial) announce("BLUE potions charge SHIELDS");
  },
  4: () => {
    monsterWave(() => ([
      spawnObject(monster.imp(), 46, 25),
      spawnObject(monster.imp(), 49, 24),
      spawnObject(monster.imp(), 49, 32),
      spawnObject(monster.imp(), 55, 28),
    ]));
  },
  5: async () => {
    let seek = 0;
    if (music.name() === bgMusic) seek = music.time();

    music.crossFade("battle-3");
    const crates = crateWall([35, 55], [35, 56], [12, 43], [12, 44]);
    
    await monsterWave(() => ([
      spawnObject(monster.imp(), 23, 44),
      spawnObject(monster.imp(), 23, 54),
      spawnObject(monster.imp(), 18, 49),
      spawnObject(monster.imp(), 28, 49),
      spawnObject(monster.imp(), 26, 46),
      spawnObject(monster.imp(), 26, 52),
      spawnObject(monster.imp(), 20, 46),
      spawnObject(monster.imp(), 20, 52),
    ]));

    await monsterWave(() => ([
      spawnObject(monster.goblin(), 23, 44),
      spawnObject(monster.goblin(), 23, 54),
      spawnObject(monster.goblin(), 18, 49),
      spawnObject(monster.goblin(), 28, 49),
      spawnObject(monster.goblin(), 26, 46),
      spawnObject(monster.goblin(), 26, 52),
      spawnObject(monster.goblin(), 20, 46),
      spawnObject(monster.goblin(), 20, 52),
    ]));

    await monsterWave(() => ([
      spawnObject(monster.wogol(), 23, 44),
      spawnObject(monster.wogol(), 23, 54),
      spawnObject(monster.wogol(), 18, 49),
      spawnObject(monster.wogol(), 28, 49),
      spawnObject(monster.wogol(), 26, 46),
      spawnObject(monster.wogol(), 26, 52),
      spawnObject(monster.wogol(), 20, 46),
      spawnObject(monster.wogol(), 20, 52),
    ]));

    coinReward(
      [23, 44], [23, 54], [18, 49], [28, 49],
      [26, 46], [26, 52], [20, 46], [20, 52]
    );

    crates.forEach(c => c.destroy());
    music.crossFade(bgMusic, { seek });
  },
  6: () => {
    monsterWave(() => ([
      spawnObject(monster.imp(), 22, 67),
      spawnObject(monster.imp(), 22, 68),
      spawnObject(monster.imp(), 23, 67),
      spawnObject(monster.imp(), 23, 68),
      spawnObject(monster.imp(), 29, 67),
      spawnObject(monster.imp(), 29, 68),
      spawnObject(monster.imp(), 30, 67),
      spawnObject(monster.imp(), 30, 68),
    ]));
  },
  8: async () => {
    let seek = 0;
    if (music.name() === bgMusic) seek = music.time();
    music.crossFade("battle-3");

    // block off exit with crates
    const crates = crateWall([26, 24], [26, 25], [26, 26]);

    // wave 1
    await monsterWave(() => ([
      spawnObject(monster.wogol(), 18, 22),
      spawnObject(monster.wogol(), 18, 28),
    ]));

    // wave 2
    await monsterWave(() => ([
      spawnObject(monster.imp(), 18, 22),
      spawnObject(monster.imp(), 18, 28),
      spawnObject(monster.imp(), 24, 22),
      spawnObject(monster.imp(), 24, 28),
    ]));

    // wave 3
    await monsterWave(() => ([
      spawnObject(monster.demonSmall(), 16, 21),
      spawnObject(monster.demonSmall(), 16, 29),
    ]));

    // reward
    coinReward(
      [16, 21], [16, 25], [16, 29], [18, 22], [18, 25], [18, 28],
      [20, 23], [21, 23], [20, 27], [21, 27],
      [25, 21], [25, 25], [25, 29], [23, 22], [23, 25], [23, 28],
    );

    // remove wall of crates
    crates.forEach(c => c.destroy());
    music.crossFade(bgMusic, { seek });
  }
};

export default map;