import { k } from "/kaboom.js";

export const getTileContext = (map, x, y) => ({
  x,
  y,
  u: map[y - 1] ?.[x],
  d: map[y + 1] ?.[x],
  l: map[y] ?.[x - 1],
  r: map[y] ?.[x + 1],
  self: map[y]?.[x],
});

export const isEmptySymbol = (sym) => {
  return [undefined, " ", "="].includes(sym);
};

export const isWallSymbol = (sym) => {
  return ["─", "│", "┌", "┐", "└", "┘", "/", "_", "`"].includes(sym);
};

// helper to get map width, in case you leave one line longer than others
export const getMapWidth = (map) => map.reduce(
  (a, s) => a = a > s.length ? a : s.length, 0
);