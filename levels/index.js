import { k } from "/kaboom.js";
import { config } from "/config.js";
import * as structure from "/objects/structure.js";
import * as misc from "/objects/misc.js";
import { getTileContext } from "/levels/utils.js";
import { makeTile } from "/levels/tiles.js";
import { generateMap } from "/levels/maps/index.js";
import { createObjectsOnMap } from "/levels/objects.js";

export const generateLevel = () => {
  const map = generateMap();
  const mapWidth = map[0].length;
  const mapHeight = map.length;

  let tileCounter = 0;

  const level = k.addLevel(map, {
    width: config.tileWidth,
    height: config.tileHeight,
    pos: config.mapOrigin,
    // any is used for all tiles so we can keep count and find neighbors
    any(tile) {
      const mapX = tileCounter % mapWidth;
      const mapY = Math.floor(tileCounter / mapWidth);
      const context = getTileContext(map, mapX, mapY);
      tileCounter++;
      return makeTile(tile, context);
    },
  });

  // second pass, add interactive objects here
  createObjectsOnMap(map);

  return level;
}