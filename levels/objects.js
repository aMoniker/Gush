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
  // "@": addPlayer, // special-handling, see createObjectsOnMap
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
  const playerCoords = k.vec2(0, 0);
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const sym = map[y][x];
      if (sym === "@") {
        playerCoords.x = x;
        playerCoords.y = y;
      } else if (symbolToObject[sym]) {
        const context = getTileContext(map, x, y);
        symbolToObject[sym](context);
      }
    }
  }

  // we wait until all objects are added before adding the player
  // to ensure that the player sprite is painted above everything else.
  addPlayer(getTileContext(map, playerCoords.x, playerCoords.y));
}