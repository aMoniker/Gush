import { k } from "/kaboom.js";
import { tween } from "/utils.js";
import * as misc from "/objects/misc.js";
import * as powerups from "/objects/powerups.js";
import { getWorldPos, translateMapToWorldCoords } from "/levels/spatial.js";

// helper for spawning objects at map coordinates
export const spawnObject = (conf, x, y) => {
  return k.add([
    ...conf,
    k.origin("center"),
    getWorldPos(x, y),
  ]);
}

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
      m.color.r = 1;
      m.color.g = 1;
      m.color.b = 1;
      m.color.a = 0;
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

const circleSpawner = (objFn, count, center, radius) => () => {
  const [cx, cy] = center;
  const slice = (Math.PI * 2) / count;
  const objs = [];
  for (let i = 0; i < count; i++) {
    const angle = slice * i;
    const x = cx + (radius * Math.sin(angle));
    const y = cy + (radius * Math.cos(angle));
    objs.push(spawnObject(objFn(), x, y));
  }
  return objs;
};

// expects center coordinates and radius in map units
export const monsterWaveCircle = (monsterFn, count, center, radius) => {
  return monsterWave(circleSpawner(monsterFn, count, center, radius));
};

export const monsterWaveLineHorizontal = (monsterFn, leftPoint, length) => {
  const [x, y] = leftPoint;
  return monsterWave(() => {
    return Array.from({ length }).map((_, i) => spawnObject(monsterFn(), x + i, y))
  });
};

export const monsterWaveLineVertical = (monsterFn, topPoint, length) => {
  const [x, y] = topPoint;
  return monsterWave(() => {
    return Array.from({ length }).map((_, i) => spawnObject(monsterFn(), x, y + i))
  });
};

export const coinRewardCircle = (count, center, radius) => {
  return circleSpawner(powerups.coin, count, center, radius)();
};

export const coinReward = (...locations) => {
  return locations.map(loc => spawnObject(powerups.coin(), ...loc));
};

export const crateWall = (...locations) => {
  return locations.map(loc => spawnObject(misc.crate(), ...loc));
};

export const crateWallHorizontal = (leftCratePoint, length) => {
  const [x, y] = leftCratePoint;
  return Array.from({ length }).map((_, i) => spawnObject(misc.crate(), x + i, y));
};

export const crateWallVertical = (topCratePoint, length) => {
  const [x, y] = topCratePoint;
  return Array.from({ length }).map((_, i) => spawnObject(misc.crate(), x, y + i));
};

export const nullMap = [
  "@",
];

export const monsterTestMap = [
  "┌──────────┐",
  "│··········│",
  "│········Z·│",
  "│··········│",
  "│··········│",
  "│··········│",
  "│··········│",
  "···········│",
  "···········│",
  "··@········│",
  "···········│",
  "···········┘",
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