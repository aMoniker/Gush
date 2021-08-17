import { k } from "/kaboom.js";
import { config } from "/config.js";
import { generateMap } from "/levels/maps/index.js";
import { getWorldPos, regenerateBoundaryMap } from "/levels/spatial.js";
import { drawVisibleObjects, objectConfigs, regenerateObjectConfigs, startMinimapDrawLoop, startMonsterLOSLoop } from "/levels/visibility.js";
import { createPlayer } from "/objects/player.js";
import { getMapWidth } from "/levels/utils.js";

// add the player at the appropriate position on the map
// this should be done last so the player sprite is above others.
const createPlayerOnMap = (map) => {
  let player = null;
  createPlayerLoop:
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < getMapWidth(map); x++) {
      if (map[y][x] !== '@') continue;
      player = createPlayer(config.playerType, [getWorldPos(x, y)]);
      break createPlayerLoop;
    }
  }
  return player;
}

let cancelDrawLoop = null;
let cancelMinimapLoop = null;
let cancelMonsterLOSLoop = null;

// main level generation function
export const generateLevel = () => {
  // cancel all existing loops started during the last level
  if (cancelDrawLoop) cancelDrawLoop();
  if (cancelMinimapLoop) cancelMinimapLoop();
  if (cancelMonsterLOSLoop) cancelMonsterLOSLoop();

  // get the new map for the level
  const map = generateMap();

  // regenerate all the objects and boundaries
  regenerateObjectConfigs(map);
  regenerateBoundaryMap(objectConfigs);

  // add the player directly since it's more complex than a typical object config
  const player = createPlayerOnMap(map);

  // draw only the visibile objects around the player for performance
  cancelDrawLoop = k.action(() => {
    drawVisibleObjects(player.pos.x, player.pos.y);
  });

  // cancelMinimapLoop = startMinimapDrawLoop(map, player);
  cancelMonsterLOSLoop = startMonsterLOSLoop(player);
}