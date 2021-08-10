import { k } from "/kaboom.js";
import { getTileContext, getWorldPos, addBasicTile, isEmptySymbol } from "/levels/utils.js";
import * as structure from "/objects/structure.js";
import * as powerups from "/objects/powerups.js";
import * as misc from "/objects/misc.js";
import * as monster from "/objects/monster.js";
import { createPlayer } from "/objects/player.js";
import { config } from "/config.js";
import { curry } from "/utils.js";

const addObject = (objFn, ctx, extraAttrs) => {
  const obj = k.add([
    k.origin("center"),
    ...objFn(),
    getWorldPos(ctx.x, ctx.y),
    ...(extraAttrs ?? [])
  ]);
  return obj;
};

const addMonster = (objFn, ctx, extraAttrs) => {
  const m = addObject(objFn, ctx, extraAttrs);
  m.play("idle");
  m.on("death", () => {
    m.solid = undefined;
    m.use(k.color(1, 0, 0, 1));
    const deathEffectTimer = 1;
    let time = 0;
    const cancelDeathEffect = m.action(() => {
      time += k.dt();
      m.color.a = Math.max(0, 1 - (time / deathEffectTimer));
      if (time >= deathEffectTimer) {
        cancelDeathEffect();
        m.destroy();
      }
    });
  });
}

const addCoin = (ctx) => {
  const coin = addObject(powerups.coin, ctx);
  coin.play("spin");
};

const addChest = (ctx) => addObject(misc.chest, ctx, [k.solid()]);
const addFlask = (ctx) => addObject(powerups.randomFlask, ctx);
const addCrate = (ctx) => addObject(misc.crate, ctx, [k.solid()]);

const addMimic = (ctx) => addObject(monster.mimic, ctx);

const addPlayer = (ctx) => {
  const player = createPlayer(config.playerType, [getWorldPos(ctx.x, ctx.y)]);
}

const addFountainBasin = (color) => (ctx) => {
  if (isEmptySymbol(ctx.d)) return;
  const basinFn = structure[`wallFountainBasin${color}`];
  const basin = addBasicTile(basinFn, ctx.x, ctx.y + 1);
  basin.play(`basin_${color.toLowerCase()}`);
}

const symbolToObject = {
  "@": addPlayer,
  "$": addCoin,
  "?": addChest,
  "c": addCrate,
  "f": addFlask, // random flask
  "d": curry(addMonster, monster.demonSmall),
  "D": curry(addMonster, monster.demonBig),
  "g": curry(addMonster, monster.goblin),
  "i": curry(addMonster, monster.imp),
  "M": curry(addMonster, monster.muddy),
  "S": curry(addMonster, monster.swampy),
  "m": addMimic,
  "o": curry(addMonster, monster.randomOrc),
  "O": curry(addMonster, monster.ogre),
  "n": curry(addMonster, monster.necromancer),
  "s": curry(addMonster, monster.skeleton),
  "w": curry(addMonster, monster.wogol),
  "Z": curry(addMonster, monster.zombieBig),
  "z": curry(addMonster, monster.randomZombie),
  "&": addFountainBasin("Red"),
  "%": addFountainBasin("Blue"),
}

export const createObjectsOnMap = (map) => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const sym = map[y][x];
      if (symbolToObject[sym]) {
        const context = getTileContext(map, x, y);
        symbolToObject[sym](context);
      }
    }
  }
}