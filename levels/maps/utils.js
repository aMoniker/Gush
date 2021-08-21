import { k } from "/kaboom.js";
import { tween } from "/utils.js";
import * as misc from "/objects/misc.js";
import * as powerups from "/objects/powerups.js";
import { spawnObject } from "/levels/spatial.js";

export const monsterWave = (spawner) => {
  return new Promise((resolve) => {
    let killed = 0;
    const wave = spawner();
    const effects = [];

    // grace period before attacking player, also entrance effect
    const gracePeriod = 1;
    wave.forEach(m => {
      m.spawning = true;
      m.aiEnabled = false;
      if (!m.color) m.use(k.color(1, 1, 1, 0));
      tween(m, gracePeriod, { "color.a": 0.5 }).then(() => {
        m.color.a = 1;
        m.spawning = false;
        m.aiEnabled = true;
      });
      const effect = k.add([
        k.sprite("explosion-vertical-small", { noArea: true, animSpeed: 0.1 }),
        k.color(1, 1, 1, 0.33),
        k.origin("center"),
        k.layer("fx"),
        k.pos(m.pos),
      ]);
      effect.play("main");
      effects.push(effect);
    });
    k.wait(1, () => {
      effects.forEach(eff => eff.destroy());
    });
    k.play("poof", { loop: false });
    const handleDeath = () => {
      killed++;
      if (killed === wave.length) resolve();
    };
    wave.forEach(obj => obj.on("death", handleDeath));
  });
};

export const coinReward = (...locations) => {
  return locations.map(loc => spawnObject(powerups.coin(), ...loc));
};

export const crateWall = (...locations) => {
  return locations.map(loc => spawnObject(misc.crate(), ...loc));
}

export const nullMap = [
  "@",
];

export const testSecretsMap = [
  "┌─_──_──_──┐",
  "│..........│",
  "│.^^^^^^^^./",
  "/.^......^.│",
  "│.^......^.│",
  "│.^.@..m.^.│",
  "/.^......^./",
  "│.^......^.│",
  "│.^>.....^.│",
  "│.^^^^^^^^.│",
  "│..........│",
  "└────_──_──┘",
];

export const smallTestMap = [
  "┌──────────┐",
  "│··········│",
  "│·^^^^^^^^·│",
  "│·^····?·^·│",
  "│·^·@····^·│",
  "│·^·····?^·│",
  "│·^······^·│",
  "│·^···?··^·│",
  "│·^>·····^·│",
  "│·^^^^^^^^·│",
  "│··········│",
  "└──────────┘",
];

export const fullTestMap = [
  "         ┌───────┐                                               ",
  "         │.......│                                               ",
  " ┌───────┘...c...│                                               ",
  "┌┘...............└─────)─(─}─{─&──%──!─{─}─(─)──────────────────┐",
  "│....................?..........................................│",
  "│...>............M..................o..i..z..g..D..d..w..s......│",
  "│...........^...................f...............................│",
  "│.......f.............$.......................Z.............w...│",
  "│....................$$$........................................│",
  "│...f.....###.........$.....................z......g............│",
  "│.........#?#..................@.......i........................│",
  "│.....f...#.#...................................................│",
  "│.............┌─┐..........................S............o.......│",
  "│.......f....┌┘ └┐.............m................................│",
  "│...........┌┘   └┐............................n................│",
  "│..........┌┘     └┐...............O.....................s......│",
  "│..........│       │............................................│",
  "└──────────┘       └─┐..........................................│",
  "                     └────────┐...┌─)─(─}─{─&──%──!─{─}─(─)─────┘",
  "                              │...│                              ",
  "                             ┌┘...│    ┌──────────────────────┐  ",
  "                         ┌───┘..┌─┘    │......................│  ",
  "                         │......│     ┌┘......................│  ",
  "                         │.┌────┘    ┌┘.......................│  ",
  "                         │.│        ┌┘........................│  ",
  "                         │.└────────┘.........................│  ",
  "                         │....................................│  ",
  "                         └────────────────────────────────────┘  ",
];