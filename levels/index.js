import { k } from "/kaboom.js";
import { generateMap } from "/levels/maps/index.js";
import { getWorldPos, regenerateBoundaryMap } from "/levels/spatial.js";
import { extantObjects, drawVisibleObjects, resetDrawLoop, objectConfigs, regenerateObjectConfigs, initializeMinimap, startMonsterLOSLoop, startMonsterDespawnLoop } from "/levels/visibility.js";
import { createPlayer } from "/objects/player.js";
import { getMapWidth } from "/levels/utils.js";
import state from "/state.js";
import music from "/music.js";
import { clearAllAnnouncements } from "/utils.js";

// add the player at the appropriate position on the map
// this should be done last so the player sprite is above others.
const createPlayerOnMap = (map, options) => {
  let player = null;
  createPlayerLoop:
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < getMapWidth(map); x++) {
      if (map[y][x] !== '@') continue;
      player = createPlayer(state.playerType, [getWorldPos(x, y)], options);
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
let cancelMonsterDespawnLoop = null;

const resetLevel = () => {
  music.stop();
  clearAllAnnouncements();
  // state.player = undefined;
  
  // cancel all existing loops started during the last level
  if (cancelDrawLoop) cancelDrawLoop();
  if (cancelMinimapLoop) cancelMinimapLoop();
  if (cancelMonsterLOSLoop) cancelMonsterLOSLoop();
  if (cancelMonsterDespawnLoop) cancelMonsterDespawnLoop();
  resetDrawLoop();

  // destroy any existing game objects
  k.every((obj) => obj.destroy());
  extantObjects.clear();
};

// main level generation function
export const generateLevel = () => {
  // carry over player status from previous level
  let playerOptions = {};
  if (state.player) {
    playerOptions.hp = state.player.hp();
    playerOptions.burps = state.player.burps();
    playerOptions.shields = state.player.shields();
  }

  // reset all settings from any previous levels
  resetLevel();

  // get the new map for the level
  const map = generateMap();
  if (map.clearBurps) playerOptions.burps = 0; // boss level clears burps

  // regenerate all the objects and boundaries
  regenerateObjectConfigs(map);
  regenerateBoundaryMap(objectConfigs);

  // add the player directly since it's more complex than a typical object config
  const player = createPlayerOnMap(map, playerOptions);

  // there were some intermittent freezing issues when calling this
  // synchronously that I wasn't able to track down, so use setTimeout.
  setTimeout(() => {
    // reinitialize the minimap
    initializeMinimap(map, player);

    // draw only the visible objects around the player for performance
    cancelDrawLoop = k.action(() => {
      drawVisibleObjects(player.pos.x, player.pos.y);
    });

    // calculate LOS for monsters
    cancelMonsterLOSLoop = startMonsterLOSLoop(player);

    // handle despawning of distant monsters
    cancelMonsterDespawnLoop = startMonsterDespawnLoop(player);

    // listen for any triggers on the map
    enableTriggers(map);
  }, 0);

  if (map.onStart) map.onStart();
}