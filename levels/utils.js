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

// map coords to world coords
export const getWorldPos = (mx, my) => {
  const x = (mx * config.tileWidth) + config.mapOrigin.x;
  const y = (my * config.tileHeight) + config.mapOrigin.y;
  return k.pos(x, y);
}

// world coords to map coords
export const getMapCoordsFromWorld = (wx, wy) => {
  const x = Math.floor((wx - config.mapOrigin.x) / config.tileWidth);
  const y = Math.floor((wy - config.mapOrigin.y) / config.tileHeight);
  return {x,y};
}

export const addBasicTile = (tileFunc, x, y, layer) => {
  return k.add([
    ...tileFunc(),
    getWorldPos(x, y),
    k.layer(layer ?? "floor"),
    "static",
  ]);
}

export const isEmptySymbol = (sym) => {
  return sym === undefined || sym === " ";
}

export const isWallSymbol = (sym) => {
  return ["─", "│", "┌", "┐", "└", "┘", "/", "_", "`"].includes(sym);
}