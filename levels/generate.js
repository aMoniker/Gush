import { k } from "/kaboom.js";
import { config } from "/config.js";
import * as structure from "/objects/structure.js";
import * as misc from "/objects/misc.js";

/**
 * To implement:
 * + door
 * > hole/down
 * < ladder/up
 * [ top-left corner wall
 * - top wall
 * ] top-right corner wall
 * | left/right wall
 * { bottom-left corner wall
 * _ bottom wall
 * } bottom-right corner wall
 * & red fountain (basin should render below? also top tile?)
 * % blue fountain (see above)
 * ! goo fountain (see above)
 * ; wall banner (maybe same color for whole level
 * 
 * Special handling:
 * probably have to render tiles underneath on first pass,
 * then on second pass spawn objects with level.getPos()
 * ? chest
 * $ coin
 * # crate
 * @ player spawn
 * d small demon
 * D big demon
 * f random flask
 * g goblin
 * i imp
 * m muddy
 * n necromancer
 * o ogre
 * O random orc
 * s skeleton
 * S swampy
 * w wogol
 * Z big zombie
 * z random zombie
 */

const unimplemented = {};
const makeUnimplementedTile = () => ([
  k.solid(),
  k.layer("game"),
  k.rect(16, 16),
  k.color(k.rand(0.1, 1), k.rand(0.1, 1), k.rand(0.1, 1)),
]);

const tileGenerator = {
  ".": misc.floorTile,
  // TODO - decide if these are really needed or if corner pieces
  //        can be inferred from context, and just use `-`
  // "[": structure.w,
  "^": misc.floorTrap,
  "|": (context) => {
    // TODO - add these in the right spot using context.[x/y]
    if (!context.left || context.left === '|') {
      k.add(structure.wallSideMidLeft());
    } else if (!context.right || context.right === '|') {
      k.add(structure.wallSideMidRight());
    }
    return structure.invisibleWall();
  },
};

export const generateLevel = () => {

  const map = [
    "[-----;-&--%--!-;-----------------------------------------------]",
    "|....................?..........................................|",
    "|...>..............................................d............|",
    "|...........^...................f...............................|",
    "|.<...................$.......................Z.............w...|",
    "|....................$$$........................................|",
    "|.........#...........$.....................z......g............|",
    "|......................................i........................|",
    "|...............................................................|",
    "|..........................................S............o.......|",
    "|..............................m................................|",
    "|..............................................n................|",
    "|...@..............................O.....................s......|",
    "|...............................................................|",
    "{_______________________________________________________________}",
  ];

  const mapWidth = map[0].length;
  const mapHeight = map.length;

  // addLevel gives no context for tiles, so we use this trick
  // and pass everything through any() in order to see neighbors.
  const getTileContext = (x, y) => ({
    x,
    y,
    up: map[y - 1] ?.[x],
    down: map[y + 1] ?.[x],
    left: map[y] ?.[x - 1],
    right: map[y] ?.[x + 1],
    self: map[y]?.[x],
  });

  let tileCounter = 0;

  const level = k.addLevel(map, {
    width: config.tileWidth,
    height: config.tileHeight,
    pos: config.mapStart,
    // any is used for all tiles so we can keep count and find neighbors
    any(tile) {
      const mapX = tileCounter % mapWidth;
      const mapY = Math.floor(tileCounter / mapWidth);
      // const worldX = (mapX * config.tileWidth) + pos.x;
      // const worldY = (mapY * config.tileHeight) + pos.y;
      const context = getTileContext(mapX, mapY);
      tileCounter++;

      if (tileGenerator[tile]) {
        return tileGenerator[tile](context);
      } else {
        if (!unimplemented[tile]) {
          unimplemented[tile] = makeUnimplementedTile();
        }
        return unimplemented[tile];
      }
    },
  });

  return level;
}