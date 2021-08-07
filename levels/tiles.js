import { k } from "/kaboom.js";
import * as structure from "/objects/structure.js";
import * as misc from "/objects/misc.js";
import { config } from "/config.js";
import { getWorldPos, addBasicTile, isEmptySymbol, isWallSymbol } from "/levels/utils.js";

const unimplemented = {};
const makeUnimplementedTile = () => ([
  k.solid(),
  k.layer("game"),
  k.rect(16, 16),
  k.color(k.rand(0.1, 1), k.rand(0.1, 1), k.rand(0.1, 1)),
]);

const horizontalWallTile = (ctx) => {
  const { x, y, u } = ctx;
  const layer = (isEmptySymbol(u) || isWallSymbol(u)) ? "floor" : "ceiling";
  addBasicTile(structure.wallMid, x, y, layer);
  addBasicTile(structure.wallTopMid, x, y - 1, layer);
  return structure.invisibleWall();
};

const verticalWallTile = (ctx) => {
  const { x, y } = ctx;
  if (isEmptySymbol(ctx.l) || isWallSymbol(ctx.l)) {
    addBasicTile(structure.wallSideMidLeft, x, y);
  } else if (isEmptySymbol(ctx.r) || isWallSymbol(ctx.r)) {
    addBasicTile(structure.wallSideMidRight, x, y);
  }
  return structure.invisibleWall();
};

const nwWallTile = (ctx) => {
  const { x, y, l } = ctx;
  if (isEmptySymbol(l)) {
    addBasicTile(structure.wallSideMidLeft, x, y);
    addBasicTile(structure.wallSideTopLeft, x, y - 1);
  } else {
    addBasicTile(structure.wallCornerLeft, x, y, "ceiling");
    addBasicTile(structure.wallCornerTopLeft, x, y - 1, "ceiling");
  }

  return structure.invisibleWall();
}

const neWallTile = (ctx) => {
  const { x, y, r } = ctx;
  if (isEmptySymbol(r)) {
    addBasicTile(structure.wallSideMidRight, x, y);
    addBasicTile(structure.wallSideTopRight, x, y - 1);
  } else {
    addBasicTile(structure.wallCornerRight, x, y, "ceiling");
    addBasicTile(structure.wallCornerTopRight, x, y - 1, "ceiling");
  }
  return structure.invisibleWall();
};

const swWallTile = (ctx) => {
  const { x, y, l } = ctx;
  if (isEmptySymbol(l)) {
    addBasicTile(structure.wallSideFrontLeft, x, y);
  } else {
    addBasicTile(structure.wallCornerFrontLeft, x, y);
    addBasicTile(structure.wallCornerTopLeft, x, y - 1);
  }
  return structure.invisibleWall();
};

const seWallTile = (ctx) => {
  const { x, y, r } = ctx;
  if (isEmptySymbol(r)) {
    addBasicTile(structure.wallSideFrontRight, x, y);
  } else {
    addBasicTile(structure.wallCornerFrontRight, x, y);
    addBasicTile(structure.wallCornerTopRight, x, y - 1);
  }
  return structure.invisibleWall();
};

const bannerTile = (color) => (ctx) => {
  const { x, y, u } = ctx;
  const bannerFn = structure[`wallBanner${color}`];
  const layer = (isEmptySymbol(u) || isWallSymbol(u)) ? "floor" : "ceiling";
  if (bannerFn) {
    addBasicTile(bannerFn, x, y, layer);
    addBasicTile(structure.wallTopMid, x, y - 1, layer);
  }
  return structure.invisibleWall();
};

const fountainTile = (color) => (ctx) => {
  const { x, y, u } = ctx;
  const fountainMidFn = structure[`wallFountainMid${color}`];
  const layer = (isEmptySymbol(u) || isWallSymbol(u)) ? "floor" : "ceiling";
  if (fountainMidFn) {
    const fountainMid = addBasicTile(fountainMidFn, x, y);
    fountainMid.play(`fountain_${color.toLowerCase()}`);
    addBasicTile(structure.wallFountainTop, x, y - 1, layer);
  }
  return structure.invisibleWall();
};

const wallGooTile = (ctx) => {
  const { x, y, u } = ctx;
  const layer = (isEmptySymbol(u) || isWallSymbol(u)) ? "floor" : "ceiling";
  addBasicTile(structure.wallGooMid, x, y, layer);
  addBasicTile(structure.wallTopMid, x, y - 1, layer);
  // TODO - there's a goo "basin" tile to be added in second pass
  // addBasicTile(structure.wallGooBasin, x, y, layer);
  return structure.invisibleWall();
};

const crevasseTile = (ctx) => {
  const { x, y, u } = ctx;
  if (u !== "#") addBasicTile(misc.edgeTile, x, y);
  return structure.invisibleWall();
}

let testTilesMade = false;
const makeTestTiles = () => {
  if (testTilesMade) return;
  const testTiles = [
    structure.wallCornerBottomLeft,
    structure.wallCornerBottomRight,
    structure.wallCornerFrontLeft,
    structure.wallCornerFrontRight,
    structure.wallCornerLeft,
    structure.wallCornerRight,
    structure.wallCornerTopLeft,
    structure.wallCornerTopRight,
    structure.wallInnerCornerTopLeftL,
    structure.wallInnerCornerTopRightL,
    structure.wallInnerCornerMidLeft,
    structure.wallInnerCornerMidRight,
    structure.wallInnerCornerTopLeftT,
    structure.wallInnerCornerTopRightT,
    structure.wallLeft,
    structure.wallMid,
    structure.wallRight,
    structure.wallSideFrontLeft,
    structure.wallSideFrontRight,
    structure.wallSideMidLeft,
    structure.wallSideMidRight,
    structure.wallSideTopLeft,
    structure.wallSideTopRight,
    structure.wallTopLeft,
    structure.wallTopMid,
    structure.wallTopRight
  ];

  let count = 1;
  let x = 0;
  const y = -2;

  for (const tt of testTiles) {
    k.add([...tt(), getWorldPos(x, y)]);
    k.add([k.text(count, 12), getWorldPos(x, y - 1)]);
    x += 2;
    count++;
  }

  testTilesMade = true;
};

const symbolToTile = {
  " ": misc.emptyTile,
  ".": misc.floorTile,
  "^": misc.floorTrap,
  "─": horizontalWallTile,
  "│": verticalWallTile,
  "┌": nwWallTile,
  "┐": neWallTile,
  "┘": seWallTile,
  "└": swWallTile,
  "{": bannerTile("Blue"),
  "}": bannerTile("Green"),
  "(": bannerTile("Red"),
  ")": bannerTile("Yellow"),
  "&": fountainTile("Red"),
  "%": fountainTile("Blue"),
  "!": wallGooTile,
  ">": misc.floorLadderDown,
  "#": crevasseTile,

  // these are all floor tiles in the first pass
  // and will be added as objects in the second pass
  "?": misc.floorTile,
  "$": misc.floorTile,
  "c": misc.floorTile,
  "#": misc.floorTile,
  "@": misc.floorTile,
  "d": misc.floorTile,
  "D": misc.floorTile,
  "f": misc.floorTile,
  "g": misc.floorTile,
  "i": misc.floorTile,
  "m": misc.floorTile,
  "M": misc.floorTile,
  "n": misc.floorTile,
  "o": misc.floorTile,
  "O": misc.floorTile,
  "s": misc.floorTile,
  "S": misc.floorTile,
  "w": misc.floorTile,
  "Z": misc.floorTile,
  "z": misc.floorTile,
};

export const makeTile = (sym, context) => {
  // makeTestTiles();
  if (symbolToTile[sym]) {
    return symbolToTile[sym](context);
  } else {
    if (!unimplemented[sym]) {
      unimplemented[sym] = makeUnimplementedTile();
    }
    return unimplemented[sym];
  }
};