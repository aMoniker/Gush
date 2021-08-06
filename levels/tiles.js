import { k } from "/kaboom.js";
import * as structure from "/objects/structure.js";
import * as misc from "/objects/misc.js";
import { config } from "/config.js";

const unimplemented = {};
const makeUnimplementedTile = () => ([
  k.solid(),
  k.layer("game"),
  k.rect(16, 16),
  k.color(k.rand(0.1, 1), k.rand(0.1, 1), k.rand(0.1, 1)),
]);

// convert x/y map tile coordinates to world coordinates
const getWorldPos = (mx, my) => {
  const x = (mx * config.tileWidth) + config.mapOrigin.x;
  const y = (my * config.tileHeight) + config.mapOrigin.y;
  return k.pos(x, y);
}

const isEmptySymbol = (sym) => sym === undefined || sym === " ";
const isWallSymbol = (sym) => ["─", "│", "┌", "┐", "└", "┘"].includes(sym);

const addBasicWall = (wallFunc, x, y, layer) => {
  k.add([
    ...wallFunc(),
    getWorldPos(x, y),
    k.layer(layer ?? "floor"),
  ]);
}

const horizontalWallTile = (ctx) => {
  const {x,y,u} = ctx;
  const layer = (isEmptySymbol(u) || isWallSymbol(u)) ? "floor" : "ceiling";
  addBasicWall(structure.wallMid, x, y, layer);
  addBasicWall(structure.wallTopMid, x, y - 1, layer);
  return structure.invisibleWall();
};

const verticalWallTile = (ctx) => {
  const {x,y} = ctx;
  if (isEmptySymbol(ctx.l) || isWallSymbol(ctx.l)) {
    addBasicWall(structure.wallSideMidLeft, x, y);
  } else if (isEmptySymbol(ctx.r) || isWallSymbol(ctx.r)) {
    addBasicWall(structure.wallSideMidRight, x, y);
  }
  return structure.invisibleWall();
};

const nwWallTile = (ctx) => {
  const {x,y,l} = ctx;
  if (isEmptySymbol(l)) {
    addBasicWall(structure.wallSideMidLeft, x, y);
    addBasicWall(structure.wallSideTopLeft, x, y - 1);
  } else {
    addBasicWall(structure.wallCornerLeft, x, y, "ceiling");
    addBasicWall(structure.wallCornerTopLeft, x, y - 1, "ceiling");
  }

  return structure.invisibleWall();
}

const neWallTile = (ctx) => {
  const {x,y,r} = ctx;
  if (isEmptySymbol(r)) {
    addBasicWall(structure.wallSideMidRight, x, y);
    addBasicWall(structure.wallSideTopRight, x, y - 1);
  } else {
    addBasicWall(structure.wallCornerRight, x, y, "ceiling");
    addBasicWall(structure.wallCornerTopRight, x, y - 1, "ceiling");
  }
  return structure.invisibleWall();
};

const swWallTile = (ctx) => {
  const {x,y,l} = ctx;
  if (isEmptySymbol(l)) {
    addBasicWall(structure.wallSideFrontLeft, x, y);
  } else {
    addBasicWall(structure.wallCornerFrontLeft, x, y);
    addBasicWall(structure.wallCornerTopLeft, x, y - 1);
  }
  return structure.invisibleWall();
};

const seWallTile = (ctx) => {
  const {x,y,r} = ctx;
  if (isEmptySymbol(r)) {
    addBasicWall(structure.wallSideFrontRight, x, y);
  } else {
    addBasicWall(structure.wallCornerFrontRight, x, y);
    addBasicWall(structure.wallCornerTopRight, x, y - 1);
  }
  return structure.invisibleWall();
};

const bannerTile = (color) => (ctx) => {
  const {x,y,u} = ctx;
  const bannerFn = structure[`wallBanner${color}`];
  const layer = (isEmptySymbol(u) || isWallSymbol(u)) ? "floor" : "ceiling";
  if (bannerFn) {
    addBasicWall(bannerFn, x, y);
    addBasicWall(structure.wallTopMid, x, y - 1, layer);
  }
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
    k.add([ ...tt(), getWorldPos(x, y)]);
    k.add([ k.text(count, 12), getWorldPos(x, y - 1) ]);
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
}

// * { wall banner (blue)
//  * } wall banner (green)
//  * ( wall banner (red)
//  * ) wall banner (yellow)

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