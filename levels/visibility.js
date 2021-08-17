import { k } from "/kaboom.js";
import { config } from "/config.js";
import { getMapWidth, getTileContext } from "/levels/utils.js";
import { generateMap } from "/levels/maps/index.js";
import {
  GameObjectsMap,
  boundaryMap,
  checkSupercover,
  coordsInBbox,
  getRenderedMapBbox,
  getWorldPos,
  translateWorldToMapCoords,
} from "/levels/spatial.js";
import { getObjectConfigsForSymbol } from "/levels/legend.js";
import { createPlayer } from "/objects/player.js";

// store references to all object configs on the map
export const objectConfigs = new GameObjectsMap();

// store references to all game objects currently in the scene
export const extantObjects = new GameObjectsMap();

// store which floor tiles have been seen to generate minimap
export const minimapSeen = new GameObjectsMap();

const addToMinimap = (x, y, obj) => {
  if (obj.is("floor")) minimapSeen.set(x, y, true);
};

let gameCanvas = null;
let minimapCanvas = null;

const mmPctSize = 0.25; // mm should take up this much of screen width
const drawMinimap = (mapW, mapH, player) => {
  const mmTileWidth = minimapCanvas.width / mapW;
  const mmTileHeight = minimapCanvas.height / mapH;
  const mmContext = minimapCanvas.getContext("2d");

  // draw floor tiles on minimap
  mmContext.fillStyle = "silver";
  for (const [key, val] of minimapSeen.map) {
    let { x, y } = minimapSeen.coords(key);
    const cx = x * mmTileWidth;
    const cy = y * mmTileHeight;
    mmContext.fillRect(cx, cy, mmTileWidth, mmTileHeight);
  }

  // show player on minimap
  const { x, y } = translateWorldToMapCoords(player.pos.x, player.pos.y);
  const screenX = x * mmTileWidth;
  const screenY = y * mmTileHeight;
  mmContext.fillStyle = "green";
  mmContext.fillRect(screenX, screenY, mmTileWidth, mmTileHeight);
};

export const startMinimapDrawLoop = (map, player) => {
  if (!gameCanvas) {
    gameCanvas = document.getElementById("game");
  }
  if (!minimapCanvas) minimapCanvas = document.getElementById("minimap");
  const mapW = getMapWidth(map);
  const mapH = map.length;
  return k.loop(0.1, () => {
    drawMinimap(mapW, mapW, player);
  });
};



// pre-generate all the configs for objects in the given map,
// so they can be rendered/destroyed on the fly by drawVisibleObjects
export const regenerateObjectConfigs = (map) => {
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
export const drawVisibleObjects = (pwx, pwy) => {
  // iterate current visible bbox, render in-view items
  const nextMapBbox = getRenderedMapBbox(pwx, pwy);
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

        if (!minimapSeen.has(x, y)) addToMinimap(x, y, obj);

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

        // check if any objects need their configs permanently changed
        for (const obj of extant) {
          // if an object was destroyed itself, or is in the process,
          // remove it from objectConfigs so it won't re-render next time.
          // also remove non-static objects that have rendered once, like monsters
          // so they don't render again when the tile is shown.
          // TODO - better handling for monsters
          if (obj.isDestroying || !obj.exists() || !obj.is("static")) {
            const confs = objectConfigs.get(x, y);
            for (let i = 0; i < (confs ?? []).length; i++) {
              if (confs[i]._cachedId === obj._cachedId) {
                confs[i] = undefined;
              }
            }
          }

          // make sure that chests can't be opened multiple times
          if (obj.is("chest") && obj.opened) {
            const confs = objectConfigs.get(x, y)
            for (let i = 0; i < (confs ?? []).length; i++) {
              if (confs[i]._cachedId === obj._cachedId) {
                for (const c of confs[i]) {
                  if (c.opened === false) {
                    c.opened = true;
                    c.wasEmpty = obj.wasEmpty;
                    continue;
                  }
                  if (c.id === "sprite") {
                    c.frame = obj.wasEmpty ? 2 : 5;
                    continue;
                  }
                }
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

// update every monster as to whether it can see the player
export const startMonsterLOSLoop = (player) => {
  return k.loop(0.1, () => {
    k.every("monster", (m) => {
      const { x: mx, y: my } = translateWorldToMapCoords(m.pos.x, m.pos.y);
      const { x: px, y: py } = translateWorldToMapCoords(player.pos.x, player.pos.y);
      const blockedLOS = checkSupercover(mx, my, px, py, (x, y) => {
        return boundaryMap.has(x, y) && boundaryMap.get(x, y);
      });
      m.playerLOS = !blockedLOS;
    });
  });
}