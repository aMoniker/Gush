import { k } from "/kaboom.js";
import { config } from "/config.js";
import * as structure from "/objects/structure.js";
import * as misc from "/objects/misc.js";
import { getTileContext } from "/levels/utils.js";
import { generateMap } from "/levels/maps/index.js";
import {
  GameObjectsMap,
  boundaryMap,
  coordsInBbox,
  getRenderedMapBbox,
  getWorldPos,
  regenerateBoundaryMap,
  translateWorldToMapCoords,
} from "/levels/spatial.js";
import { getObjectConfigsForSymbol } from "/levels/legend.js";
import { createPlayer } from "/objects/player.js";

// store references to all object configs on the map
const objectConfigs = new GameObjectsMap();

// store references to all game objects currently in the scene
const extantObjects = new GameObjectsMap();

// helper to get map width, in case you leave one line longer than others
const getMapWidth = (map) => map.reduce(
  (a, s) => a = a > s.length ? a : s.length, 0
);

// pre-generate all the configs for objects in the given map,
// so they can be rendered/destroyed on the fly by drawVisibleObjects
const regenerateObjectConfigs = (map) => {
  objectConfigs.clear();
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < getMapWidth(map); x++) {
      const context = getTileContext(map, x, y);
      const configs = getObjectConfigsForSymbol(context);
      if (configs) objectConfigs.add(x, y, ...configs);
    }
  }
};

// store the previously rendered bbox so the objects no longer visible
// within it can be destroyed
let prevMapBbox = null;

// some objects are in the middle of a destroy animation and shouldn't
// be destroyed immediately. Objects added to this array are checked
// every draw cycle, and destroyed if their `isDestroying` flag is false.
const deferredDestroy = [];

// Add only the objects that are visible to the player on the screen,
// and destroy any that are now off-screen. This is necessary because
// the kaboom engine absolutely tanks with any serious number of objects.
// TODO - optimize by calculating only the bbox indexes that must change.
export const drawVisibleObjects = (x, y) => {
  // iterate current visible bbox, render in-view items
  const nextMapBbox = getRenderedMapBbox(x, y);
  for (let x = nextMapBbox[0]; x <= nextMapBbox[2]; x++) {
    for (let y = nextMapBbox[1]; y <= nextMapBbox[3]; y++) {
      // if there's nothing nothing at these coords, skip
      if (!objectConfigs.has(x, y)) continue;

      // if coordinates are in prev bbox, skip (since already rendered)
      if (prevMapBbox && coordsInBbox(x, y, prevMapBbox)) continue;

      // create all objects in objectConfigs for these coords
      for (let objConfig of objectConfigs.get(x, y)) {
        // object configs can be set to undefined to no longer render
        if (!objConfig) continue;

        const obj = k.add(objConfig);

        // cache the object's id on the objConfig & the object,
        // so it can be matched against when removeed, in case the 
        // objConfig should be removed permanently. 
        // _cachedId is stored on both the config array & game object, 
        // since destroying a game object removes its _id property.
        obj._cachedId = obj._id;
        objConfig._cachedId = obj._cachedId;

        // add the object to the map of existing objects
        extantObjects.add(x, y, obj);
      }
    }
  }

  // iterate prevVisibleBbox coordinates, remove out-of-view items
  if (prevMapBbox) {
    for (let x = prevMapBbox[0]; x <= prevMapBbox[2]; x++) {
      for (let y = prevMapBbox[1]; y <= prevMapBbox[3]; y++) {
        // if nothing at these coords, skip
        if (!extantObjects.has(x, y)) continue;

        // if coords in nextVisibleBbox, skip (objects remain rendered)
        if (coordsInBbox(x, y, nextMapBbox)) continue;

        // else get all objects in extantMap for coords, and destroy them
        const extant = extantObjects.get(x, y);

        // if an object was destroyed itself, or is in the process,
        // remove it from objectConfigs so it won't re-render next time.
        // also remove non-static objects that have rendered once, like monsters
        // so they don't render again when the tile is shown.
        // TODO - better handling for monsters
        for (const obj of extant) {
          if (obj.isDestroying || !obj.exists() || !obj.is("static")) {
            const confs = objectConfigs.get(x, y);
            for (let i = 0; i < (confs ?? []).length; i++) {
              if (confs[i]._cachedId === obj._cachedId) {
                confs[i] = undefined;
              }
            }
          }
        }

        // destroy all unrendered objects that are ready to be destroyed
        // don't destroy any non-static object, like monsters, for now...
        // TODO - handle monsters better...
        for (let obj of extant) {
          // if an object is marked as `isDestroying` then it's in the
          // middle of its own destroy process, so let it handle that.
          if (!obj.isDestroying && obj.is("static")) {
            obj.destroy();
          }
        }

        // remove the reference to the rendered objects
        extantObjects.delete(x, y);
      }
    }
  }

  // store the current bbox to be checked against next time
  prevMapBbox = nextMapBbox;
}

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
export const generateLevel = () => {
  if (cancelDrawLoop) cancelDrawLoop();

  const map = generateMap();
  regenerateObjectConfigs(map);
  regenerateBoundaryMap(objectConfigs);

  // add the player directly since it's more complex
  // than a typical object config
  const player = createPlayerOnMap(map);

  // draw only the visibile objects around the player for performance
  cancelDrawLoop = k.action(() => {
    drawVisibleObjects(player.pos.x, player.pos.y);
  });
}