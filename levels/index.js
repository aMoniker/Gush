import { k } from "/kaboom.js";
import { config } from "/config.js";
import * as structure from "/objects/structure.js";
import * as misc from "/objects/misc.js";
import { makeTile } from "/levels/tiles.js";
import { generateMap } from "/levels/map.js";

export const generateLevel = () => {
  const map = generateMap();
  const mapWidth = map[0].length;
  const mapHeight = map.length;

  // addLevel gives no context for tiles, so we use this trick
  // and pass everything through any() in order to see neighbors.
  const getTileContext = (x, y) => ({
    x,
    y,
    u: map[y - 1] ?.[x],
    d: map[y + 1] ?.[x],
    l: map[y] ?.[x - 1],
    r: map[y] ?.[x + 1],
    self: map[y]?.[x],
  });

  let tileCounter = 0;

  const level = k.addLevel(map, {
    width: config.tileWidth,
    height: config.tileHeight,
    pos: config.mapOrigin,
    // any is used for all tiles so we can keep count and find neighbors
    any(tile) {
      const mapX = tileCounter % mapWidth;
      const mapY = Math.floor(tileCounter / mapWidth);
      const context = getTileContext(mapX, mapY);
      tileCounter++;
      return makeTile(tile, context);
    },
  });

  return level;
}