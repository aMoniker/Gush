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
  return sym === undefined || sym === " " || sym === "=";
}

export const isWallSymbol = (sym) => {
  return ["─", "│", "┌", "┐", "└", "┘", "/", "_", "`"].includes(sym);
}