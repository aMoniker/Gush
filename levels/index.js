import { k } from "/kaboom.js";
import { generateMap } from "/levels/maps/index.js";
import { getWorldPos, regenerateBoundaryMap } from "/levels/spatial.js";
import { drawVisibleObjects, objectConfigs, regenerateObjectConfigs, startMinimapDrawLoop, startMonsterLOSLoop } from "/levels/visibility.js";
import { createPlayer } from "/objects/player.js";
import { getMapWidth } from "/levels/utils.js";
import state from "/state.js";

// add the player at the appropriate position on the map
// this should be done last so the player sprite is above others.
const createPlayerOnMap = (map) => {
  let player = null;
  createPlayerLoop:
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < getMapWidth(map); x++) {
      if (map[y][x] !== '@') continue;
      player = createPlayer(state.playerType, [getWorldPos(x, y)]);
      break createPlayerLoop;
    }
  }
  return player;
}

let cancelTriggers = null;
const enableTriggers = (map) => {
  if (cancelTriggers) cancelTriggers();
  cancelTriggers = k.overlaps("player", "trigger", (p, t) => {
    if (t.triggered || !t.triggerKey) return;
    k.every(`trigger_${t.triggerKey}`, t => t.triggered = true);
    if (map.triggers && map.triggers[t.triggerKey]) {
      setTimeout(() => map.triggers[t.triggerKey](), 0);
    }
  });
};

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

  // draw only the visible objects around the player for performance
  setTimeout(() => {
    cancelDrawLoop = k.action(() => {
      drawVisibleObjects(player.pos.x, player.pos.y);
    });
  }, 0);

  // cancelMinimapLoop = startMinimapDrawLoop(map, player);
  cancelMonsterLOSLoop = startMonsterLOSLoop(player);

  enableTriggers(map);

  if (map.onStart) map.onStart();
}