import { k } from "/kaboom.js";
import { getTileContext, getWorldPos } from "/levels/utils.js";
import * as powerups from "/objects/powerups.js";
import * as misc from "/objects/misc.js";
import * as monster from "/objects/monster.js";
import { createPlayer } from "/objects/player.js";
import { config } from "/config.js";
import { curry } from "/utils.js";

const centerObjectInTile = (obj) => {
  obj.pos.x += (config.tileWidth / 2) - (obj.width / 2);
  obj.pos.y += (config.tileHeight / 2) - (obj.height / 2);
}

const addObject = (objFn, ctx, extraAttrs) => {
  const obj = k.add([
    ...objFn(),
    getWorldPos(ctx.x,ctx.y),
    ...(extraAttrs ?? [])
  ]);
  centerObjectInTile(obj);
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
  const player = createPlayer("elf_m", [getWorldPos(ctx.x, ctx.y)]);
  centerObjectInTile(player);
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