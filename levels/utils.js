import { k } from "/kaboom.js";
import { config } from "/config.js";

export const getTileContext = (map, x, y) => ({
  x,
  y,
  u: map[y - 1] ?.[x],
  d: map[y + 1] ?.[x],
  l: map[y] ?.[x - 1],
  r: map[y] ?.[x + 1],
  self: map[y]?.[x],
});

export const getWorldPos = (mx, my) => {
  const x = (mx * config.tileWidth) + config.mapOrigin.x;
  const y = (my * config.tileHeight) + config.mapOrigin.y;
  return k.pos(x, y);
}

export const addBasicTile = (wallFunc, x, y, layer) => {
  const t = k.add([
    ...wallFunc(),
    getWorldPos(x, y),
    k.layer(layer ?? "floor"),
  ]);
  return t;
}

export const isEmptySymbol = (sym) => {
  return sym === undefined || sym === " ";
}

export const isWallSymbol = (sym) => {
  return ["─", "│", "┌", "┐", "└", "┘"].includes(sym);
}