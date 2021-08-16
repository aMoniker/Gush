import { k } from "/kaboom.js";
import { config } from "/config.js";

export class CoordinatesMap {
  map
  constructor() {
    this.map = new Map();
  }
  key(x, y) {
    return `${x}:${y}`;
  }
  coords(key) {
    const coords = key.split(':').map((v) => Number.parseInt(v));
    const [x, y] = coords;
    return { x, y };
  }
  get(x, y) {
    return this.map.get(this.key(x, y));
  }
  set(x, y, v) {
    this.map.set(this.key(x, y), v);
  }
  has(x, y) {
    return this.map.has(this.key(x, y));
  }
  delete(x, y) {
    this.map.delete(this.key(x, y));
  }
  clear() {
    this.map.clear();
  }
}

export class GameObjectsMap extends CoordinatesMap {
  set(x, y, ...newObjs) {
    newObjs = Array.isArray(newObjs) ? newObjs : [newObjs];
    this.map.set(this.key(x, y), newObjs);
  }
  has(x, y) {
    const key = this.key(x, y)
    if (!this.map.has(key)) return false;
    return !!this.map.get(key).length;
  }
  add(x, y, ...newObjs) {
    const key = this.key(x,y);
    const objs = this.map.get(key) ?? [];
    objs.push(...newObjs);
    this.map.set(key, objs);
  }
}

// simple map of where boundaries exist for fast lookup
export const boundaryMap = new CoordinatesMap();

// mark all the boundary objects from the given game object configs
export const regenerateBoundaryMap = (goMap) => {
  boundaryMap.clear();
  for (const [key, objs] of goMap.map) {
    if (!objs || !objs.length) continue;
    coordsLoop:
    for (const obj of objs) {
      if (!obj) continue;
      for (const p of obj) {
        if (p === "boundary") {
          const coords = goMap.coords(key);
          boundaryMap.set(coords.x, coords.y, true);
          break coordsLoop;
        }
      }
    }
  }
}

// map coords to world coords
export const getWorldPos = (mx, my) => {
  const x = (mx * config.tileWidth) + config.mapOrigin.x;
  const y = (my * config.tileHeight) + config.mapOrigin.y;
  return k.pos(x, y);
}

// get world coordinates visibility bbox based on center point wx/wy
export const getRenderedWorldBbox = (wx, wy) => {
  const hw = config.renderedWidth / 2;
  const hh = config.renderedHeight / 2;
  const x1 = wx - hw;
  const y1 = wy - hh;
  const x2 = wx + hw;
  const y2 = wy + hh;
  return [x1, y1, x2, y2];
};

// get rendered map bbox from centerpoint in world coordinates wx/wy
export const getRenderedMapBbox = (wx, wy) => {
  return translateWorldToMapBbox(getRenderedWorldBbox(wx, wy));
}

// translate world coords to map coords
export const translateWorldToMapCoords = (wx, wy) => {
  const x = Math.floor((wx - config.mapOrigin.x) / config.tileWidth);
  const y = Math.floor((wy - config.mapOrigin.y) / config.tileHeight);
  return {x,y};
}

// translate world coordinates bbox to map coordinates bbox
export const translateWorldToMapBbox = (worldBbox) => {
  const nw = translateWorldToMapCoords(worldBbox[0], worldBbox[1]);
  const se = translateWorldToMapCoords(worldBbox[2], worldBbox[3]);
  return [nw.x, nw.y, se.x, se.y];
};

// check if the given coordinates are in the given bbox
export const coordsInBbox = (x, y, bbox) => {
  return x >= bbox[0] && x <= bbox[2] && y >= bbox[1] && y <= bbox[3];
}