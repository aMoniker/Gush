import { k } from "/kaboom.js";
import * as misc from "/objects/misc.js";
import * as structure from "/objects/structure.js";
import * as monster from "/objects/monster.js";
import * as powerups from "/objects/powerups.js";
import lifecycle from "/components/lifecycle.js";
import { config } from "/config.js";
import { isEmptySymbol, isWallSymbol } from "/levels/utils.js";
import { boundaryMap, getWorldPos } from "/levels/spatial.js";

// helper for unrecognized tiles, useful for designing new ones
const unimplemented = {};
const unimplementedTile = () => ([[
  k.solid(),
  k.layer("game"),
  k.rect(16, 16),
  k.color(k.rand(0.1, 1), k.rand(0.1, 1), k.rand(0.1, 1)),
  k.origin("center"),
  "static",
]]);

// Wrap the given objFn in an array - useful for single objects
const arrayWrap = (objFn) => (ctx) => ([objFn(ctx)]);

// basic object config with positioning
const objectConfig = (objFn, extraAttrs) => (ctx) => ([
  ...objFn(ctx),
  k.origin("center"),
  getWorldPos(ctx.x, ctx.y),
  ...(extraAttrs ?? []),
]);

// helper for structural tiles
const tileConfig = (tileFn, ctx, layer, extraAttrs) => {
  return objectConfig(tileFn, [
    k.layer(layer ?? "floor"),
    ...(extraAttrs ?? []),
  ])(ctx);
}

// commonly used tiles
const floorTile = objectConfig(misc.floorTile);
const invisibleWall = (ctx, extraAttrs) => {
  return objectConfig(structure.invisibleWall, extraAttrs)(ctx);
}

// this is re-used for secret walls
const horizontalWallGraphics = (ctx, layerOverride, extraAttrs) => {
  const { x, y, u } = ctx;
  let layer = (isEmptySymbol(u) || isWallSymbol(u)) ? "floor" : "ceiling";
  if (layerOverride) layer = layerOverride;
  return [
    tileConfig(structure.wallMid, ctx, layer, extraAttrs),
    tileConfig(structure.wallTopMid, { ...ctx, y: ctx.y - 1 }, "ceiling", extraAttrs),
  ];
};

// also re-used for secret walls
const verticalWallGraphic = (ctx) => {
  if (isEmptySymbol(ctx.l) || isWallSymbol(ctx.l)) {
    return tileConfig(structure.wallSideMidLeft, ctx);
  } else if (isEmptySymbol(ctx.r) || isWallSymbol(ctx.r)) {
    return tileConfig(structure.wallSideMidRight, ctx);
  }
};

// various banner wall tiles
const bannerTile = (color) => (ctx) => {
  const bannerFn = structure[`wallBanner${color}`];
  const layer = (isEmptySymbol(ctx.u) || isWallSymbol(ctx.u)) ? "floor" : "ceiling";
  const ret = [];
  if (bannerFn) {
    ret.push(tileConfig(bannerFn, ctx, layer));
    ret.push(tileConfig(structure.wallTopMid, { ...ctx, y: ctx.y - 1 }, layer));
  }
  ret.push(invisibleWall(ctx));
  return ret;
};

// Red/Blue fountain tiles
const fountainTile = (color) => (ctx) => {
  const fountainMidFn = structure[`wallFountainMid${color}`];
  const layer = (isEmptySymbol(ctx.u) || isWallSymbol(ctx.u)) ? "floor" : "ceiling";
  const ret = [];
  if (fountainMidFn) {
    ret.push(tileConfig(fountainMidFn, ctx, layer));
    ret.push(tileConfig(structure.wallFountainTop, { ...ctx, y: ctx.y - 1 }, layer));
  }
  ret.push(invisibleWall(ctx));
  return ret;
};

// render the given object config on top of a floor tile
const withFloorConfig = (configFn) => (ctx) => ([
  configFn(ctx),
  floorTile(ctx),
]);

// special trigger tiles
const trigger = (ctx) => ([
  ...floorTile(ctx),
  "trigger",
  `trigger_${ctx.self}`,
  k.layer("game"),
  {
    triggerKey: ctx.self,
    triggered: false,
  }
]);

/**
 * --- Symbol Legend ---
 * 
 * @ player start
 * 
 *   empty tile (space)
 * 
 * · floor tile
 * ─ horizontal wall
 * │ vertical wall
 * ┌ top-left wall (nw)
 * ┐ top-right wall (ne)
 * └ bottom-left wall (sw)
 * ┘ bottom-right wall (se)
 * / secret vertical wall
 * _ secret horizontal wall
 * = invisible wall
 * 
 * & red fountain
 * % blue fountain
 * ! goo wall
 * { wall banner (blue)
 * } wall banner (green)
 * ( wall banner (red)
 * ) wall banner (yellow)
 * # crevasse
 * 
 * > ladder down
 * ? chest
 * c crate
 *
 * $ coin
 * f random flask
 * h/H health flask
 * b/B burp flask
 * e/E shield flask
 * y/Y yellow flask (only used as endgame trophy)
 * 
 * d small demon
 * D big demon
 * g goblin
 * i imp
 * m mimic
 * n necromancer
 * s skeleton
 * o random orc
 * w orc warrior
 * j orc masked
 * n orc shaman
 * M muddy
 * S swampy
 * w wogol
 * O ogre
 * Z big zombie
 * p plain zombie
 * t tiny zombie
 * x ice zombie
 * z random zombie
 */

/**
 * Map of symbols to functions which return an array of configs.
 *
 * Each function should take a context and return an array of object configs,
 * even if the symbol only renders a single object (for consistency).
 * 
 * Object configs should be rendered in the order they appear in the array,
 * meaning the last item in the array will be rendered last (on top of the others).
 */
const legend = {

  // empty tile
  " ": null,

  // player
  // - the actual player is added during last step of level generation
  //   to ensure that the player sprite renders above all other game layer sprites.
  "@": arrayWrap(floorTile),
  
  // structural tiles
  "·": arrayWrap(floorTile),
  "─": (ctx) => ([
    ...horizontalWallGraphics(ctx),
    invisibleWall(ctx),
  ]),
  "│": (ctx) => ([
    verticalWallGraphic(ctx),
    invisibleWall(ctx),
  ]),
  "┌": (ctx) => {
    const ret = [];
    if (isEmptySymbol(ctx.l)) {
      ret.push(tileConfig(structure.wallSideMidLeft, ctx));
      ret.push(tileConfig(structure.wallSideTopLeft, { ...ctx, y: ctx.y - 1 }));
    } else {
      ret.push(tileConfig(structure.wallCornerLeft, ctx, "ceiling"));
      ret.push(tileConfig(structure.wallCornerTopLeft, { ...ctx, y: ctx.y - 1 }, "ceiling"));
    }
    ret.push(invisibleWall(ctx));
    return ret;
  },
  "┐": (ctx) => {
    const ret = [];
    if (isEmptySymbol(ctx.r)) {
      ret.push(tileConfig(structure.wallSideMidRight, ctx));
      ret.push(tileConfig(structure.wallSideTopRight, { ...ctx, y: ctx.y - 1 }));
    } else {
      ret.push(tileConfig(structure.wallCornerRight, ctx, "ceiling"));
      ret.push(tileConfig(structure.wallCornerTopRight, { ...ctx, y: ctx.y - 1 }, "ceiling"));
    }
    ret.push(invisibleWall(ctx));
    return ret;
  },
  "┘": (ctx) => {
    const ret = [];
    if (isEmptySymbol(ctx.r)) {
      ret.push(tileConfig(structure.wallSideFrontRight, ctx));
    } else {
      ret.push(tileConfig(structure.wallCornerFrontRight, ctx));
      ret.push(tileConfig(structure.wallCornerTopRight, { ...ctx, y: ctx.y - 1 }));
    }
    ret.push(invisibleWall(ctx));
    return ret;
  },
  "└": (ctx) => {
    const ret = [];
    if (isEmptySymbol(ctx.l)) {
      ret.push(tileConfig(structure.wallSideFrontLeft, ctx));
    } else {
      ret.push(tileConfig(structure.wallCornerFrontLeft, ctx));
      ret.push(tileConfig(structure.wallCornerTopLeft, { ...ctx, y: ctx.y - 1 }));
    }
    ret.push(invisibleWall(ctx));
    return ret;
  },
  "{": bannerTile("Blue"),
  "}": bannerTile("Green"),
  "(": bannerTile("Red"),
  ")": bannerTile("Yellow"),
  "&": fountainTile("Red"),
  "%": fountainTile("Blue"),
  "!": (ctx) => {
    const layer = (isEmptySymbol(ctx.u) || isWallSymbol(ctx.u)) ? "floor" : "ceiling";
    return [
      tileConfig(structure.wallGooMid, ctx, layer),
      tileConfig(structure.wallTopMid, { ...ctx, y: ctx.y - 1 }, layer),
      invisibleWall(ctx),
    ];
  },
  "#": (ctx) => {
    const ret = [];
    if (ctx.u !== "#") ret.push(tileConfig(misc.edgeTile, ctx));
    ret.push(invisibleWall(ctx, ["crevasse"]));
    return ret;
  },
  "/": arrayWrap(objectConfig(verticalWallGraphic, [k.color(0.88, 0.88, 0.88, 1)])),
  "_": (ctx) => horizontalWallGraphics(ctx, "ceiling", [k.color(0.88, 0.88, 0.88, 1)]),
  "=": arrayWrap(invisibleWall),

  // powerups
  "$": withFloorConfig(objectConfig(powerups.coin)),
  "f": withFloorConfig(objectConfig(powerups.randomFlask)),
  "h": withFloorConfig(objectConfig(() => powerups.flask("small", "red"))),
  "H": withFloorConfig(objectConfig(() => powerups.flask("big", "red"))),
  "b": withFloorConfig(objectConfig(() => powerups.flask("small", "green"))),
  "B": withFloorConfig(objectConfig(() => powerups.flask("big", "green"))),
  "e": withFloorConfig(objectConfig(() => powerups.flask("small", "blue"))),
  "E": withFloorConfig(objectConfig(() => powerups.flask("big", "blue"))),
  "y": withFloorConfig(objectConfig(() => powerups.flask("small", "yellow"))),
  "Y": withFloorConfig(objectConfig(() => powerups.flask("big", "yellow"))),

  // misc objects
  "?": withFloorConfig(objectConfig(misc.chest)),
  "c": withFloorConfig(objectConfig(misc.crate)),
  "^": arrayWrap(objectConfig(misc.floorTrap)),
  // ">": arrayWrap(misc.floorLadderDown),
  ">": arrayWrap(objectConfig(misc.floorLadderDown)),

  // monsters
  "d": withFloorConfig(objectConfig(monster.demonSmall)),
  "D": withFloorConfig(objectConfig(monster.demonBig)),
  "g": withFloorConfig(objectConfig(monster.goblin)),
  "i": withFloorConfig(objectConfig(monster.imp)),
  "m": withFloorConfig(objectConfig(monster.mimic)),
  "M": withFloorConfig(objectConfig(monster.muddy)),
  "N": withFloorConfig(objectConfig(monster.necromancer)),
  "o": withFloorConfig(objectConfig(monster.randomOrc)),
  "w": withFloorConfig(objectConfig(monster.orcWarrior)),
  "j": withFloorConfig(objectConfig(monster.orcMasked)),
  "n": withFloorConfig(objectConfig(monster.orcShaman)),
  "O": withFloorConfig(objectConfig(monster.ogre)),
  "s": withFloorConfig(objectConfig(monster.skeleton)),
  "S": withFloorConfig(objectConfig(monster.swampy)),
  "W": withFloorConfig(objectConfig(monster.wogol)),
  "Z": withFloorConfig(objectConfig(monster.zombieBig)),
  "p": withFloorConfig(objectConfig(monster.zombiePlain)),
  "t": withFloorConfig(objectConfig(monster.zombieTiny)),
  "x": withFloorConfig(objectConfig(monster.zombieIce)),
  "z": withFloorConfig(objectConfig(monster.randomZombie)),

  // triggers for custom events, rendered as floor tiles
  "1": arrayWrap(trigger),
  "2": arrayWrap(trigger),
  "3": arrayWrap(trigger),
  "4": arrayWrap(trigger),
  "5": arrayWrap(trigger),
  "6": arrayWrap(trigger),
  "7": arrayWrap(trigger),
  "8": arrayWrap(trigger),
  "9": arrayWrap(trigger),
  "0": arrayWrap(trigger),
};

export const getObjectConfigsForSymbol = (ctx) => {
  return legend[ctx.self] ? legend[ctx.self](ctx) : null;
}