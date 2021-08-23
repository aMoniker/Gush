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
import state from "/state.js";
import { autoResizeMinimap, clearMinimap } from "/ui.js";

// store references to all object configs on the map
export const objectConfigs = new GameObjectsMap();

// store references to all game objects currently in the scene
export const extantObjects = new GameObjectsMap();

// store which floor tiles have been seen to generate minimap
export const minimapSeen = new GameObjectsMap();

const minimapCanvas = document.getElementById("minimap");
let minimapQueue = [];
let minimapPrevPlayer = null;
const minimapFloorTags = ["floor", "floor_trap", "ladder_down"];
const minimapWallTags = ["wall_tile"];

// draw a single object on the minimap, or pass null to clear a square
const drawMinimapObject = (x, y, obj) => {
  const tileWidth = minimapCanvas.width / state.mapWidth;
  const tileHeight = minimapCanvas.height / state.mapHeight;
  const context = minimapCanvas.getContext("2d");
  const tx = x * tileWidth;
  const ty = y * tileHeight;

  let color = null;
  if (obj === null) {
    context.clearRect(tx, ty, tileWidth, tileHeight);
  } else if (obj.is("player")) {
    color = "#00FF7F";
  } else if (minimapWallTags.some(t => obj.is(t))) {
    color = "#DADADA";
  } else if (minimapFloorTags.some(t => obj.is(t))) {
    color = "#696969";
  }

  if (color) {
    context.fillStyle = color;
    context.fillRect(tx, ty, tileWidth, tileHeight);
  }
};

// draw all minimap tiles waiting in minimapQueue, and update the player location
const drawMinimap = () => {
  // draw new tiles on minimap
  for (const { x, y, obj } of minimapQueue) {
    drawMinimapObject(x, y, obj);
  }
  minimapQueue = [];

  // fill in the player's previous position on the minimap
  if (minimapPrevPlayer) {
    const objs = extantObjects.get(minimapPrevPlayer.x, minimapPrevPlayer.y);
    // if there were no objects, pass null so the tile is cleared
    // this is useful for when the player is going into a secret area
    for (const obj of (objs ?? [null])) {
      drawMinimapObject(minimapPrevPlayer.x, minimapPrevPlayer.y, obj);
    }
  }

  // draw the player on the minimap
  if (state.player) {
    const { x, y } = translateWorldToMapCoords(
      state.player.pos.x, state.player.pos.y
    );
    drawMinimapObject(x, y, state.player);
    minimapPrevPlayer = { x, y };
  }
};

// clear the minimap and reset params for a new level
export const initializeMinimap = (map, player) => {
  clearMinimap();
  minimapQueue = [];
  minimapSeen.clear();
  state.mapWidth = getMapWidth(map);
  state.mapHeight = map.length;
  minimapCanvas.width = state.mapWidth * 100;
  minimapCanvas.height = state.mapHeight * 100;
  autoResizeMinimap();
}

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

let lastDrawX = null;
let lastDrawY = null;

// Add only the objects that are visible to the player on the screen,
// and destroy any that are now off-screen. This is necessary because
// the kaboom engine absolutely tanks with any serious number of objects.
export const drawVisibleObjects = (pwx, pwy) => {
  const { x: px, y: py } = translateWorldToMapCoords(pwx, pwy);

  // skip drawing if player's map x/y position hasn't changed
  if (px === lastDrawX && py === lastDrawY) return;
  lastDrawX = px;
  lastDrawY = py;

  // iterate current visible bbox, render in-view items
  const nextMapBbox = getRenderedMapBbox(pwx, pwy);
  for (let x = nextMapBbox[0]; x <= nextMapBbox[2]; x++) {
    for (let y = nextMapBbox[1]; y <= nextMapBbox[3]; y++) {
      // if coordinates are in prev bbox, skip (since already rendered)
      if (prevMapBbox && coordsInBbox(x, y, prevMapBbox)) continue;

      // if there's nothing at these coords, skip
      if (!objectConfigs.has(x, y)) continue;

      // create all objects in objectConfigs for these coords
      for (let objConfig of objectConfigs.get(x, y)) {
        // object configs can be set to undefined to no longer render
        if (!objConfig) continue;

        const obj = k.add(objConfig);

        // if this is a newly seen tile, add to the queue for minimap rendering
        if (!minimapSeen.has(x, y)) minimapQueue.push({ x, y, obj });

        // cache the object's id on the objConfig & the object,
        // so it can be matched against when removeed, in case the 
        // objConfig should be removed permanently. 
        // _cachedId is stored on both the config array & game object, 
        // since destroying a game object removes its _id property.
        obj._cachedId = obj._id;
        objConfig._cachedId = obj._cachedId;

        // if this is a monster, store its config so it can be despawned/spawned later
        if (obj.is("monster")) obj._cachedConfig = objConfig;

        // add the object to the map of existing objects
        extantObjects.add(x, y, obj);
      }

      // mark this map coordinate as having been seen
      minimapSeen.set(x, y, true);
    }
  }

  // iterate prevVisibleBbox coordinates, remove out-of-view items
  if (prevMapBbox) {
    for (let x = prevMapBbox[0]; x <= prevMapBbox[2]; x++) {
      for (let y = prevMapBbox[1]; y <= prevMapBbox[3]; y++) {
        // if coords in nextVisibleBbox, skip (objects remain rendered)
        if (coordsInBbox(x, y, nextMapBbox)) continue;

        // if nothing at these coords, skip
        if (!extantObjects.has(x, y)) continue;

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
              if (!confs[i]) continue;
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

          // make sure triggers stay triggered
          if (obj.is("trigger") && obj.triggered) {
            const confs = objectConfigs.get(x, y)
            for (let i = 0; i < (confs ?? []).length; i++) {
              if (confs[i]._cachedId === obj._cachedId) {
                for (const c of confs[i]) {
                  if (c.triggered === false) {
                    c.triggered = true;
                    break;
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

  // draw any newly seen tiles to the minimap
  drawMinimap();

  // store the current bbox to be checked against next time
  prevMapBbox = nextMapBbox;
}

export const resetDrawLoop = () => {
  prevMapBbox = null;
};

// update every monster as to whether it can see the player
const maxDist = config.renderedWidth / 2;
export const startMonsterLOSLoop = (player) => {
  return k.loop(0.5, () => {
    k.every("monster", (m) => {
      // if the monster isn't nearby, don't recalculate
      if (m.pos.dist(player.pos) > maxDist) return;

      const { x: mx, y: my } = translateWorldToMapCoords(m.pos.x, m.pos.y);
      const { x: px, y: py } = translateWorldToMapCoords(player.pos.x, player.pos.y);
      const blockedLOS = checkSupercover(mx, my, px, py, (x, y) => {
        return boundaryMap.has(x, y) && boundaryMap.get(x, y);
      });
      m.playerLOS = !blockedLOS;
    });
  });
}

// despawn monsters that are far away, saving their config in objectConfigs
// so they can be respawned again with stats/hp/etc preserved when in view
// this helps a lot with performance
const maxSpawnDist = config.renderedWidth;
export const startMonsterDespawnLoop = (player) => {
  return k.loop(1, () => {
    k.every("monster", (m) => {
      if (m.dead || m.isDestroying || !m.pos || !m._cachedConfig) return;
      if (m.pos.dist(player.pos) < maxSpawnDist) return;
      const { x, y } = translateWorldToMapCoords(m.pos.x, m.pos.y);
      // only save the array members, and not anything tagged onto it, like _cachedId
      const savedConfig = [ ...m._cachedConfig ];
      objectConfigs.add(x, y, savedConfig);
      m.destroy();
    });
  });
};