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
      const isCrevasse = obj.some(p => p === "crevasse");
      for (const p of obj) {
        if (p === "boundary") {
          const coords = goMap.coords(key);
          // crevasses are marked as false, which is useful for finding LOS
          boundaryMap.set(coords.x, coords.y, !isCrevasse);
          break coordsLoop;
        }
      }
    }
  }
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
  const x = Math.round((wx - config.mapOrigin.x) / config.tileWidth);
  const y = Math.round((wy - config.mapOrigin.y) / config.tileHeight);
  return {x,y};
}

// translate world coordinates bbox to map coordinates bbox
export const translateWorldToMapBbox = (worldBbox) => {
  const nw = translateWorldToMapCoords(worldBbox[0], worldBbox[1]);
  const se = translateWorldToMapCoords(worldBbox[2], worldBbox[3]);
  return [nw.x, nw.y, se.x, se.y];
};

// translate map to world coords
export const translateMapToWorldCoords = (mx, my) => {
  const x = (mx * config.tileWidth) + config.mapOrigin.x;
  const y = (my * config.tileHeight) + config.mapOrigin.y;
  return {x, y};
};

// map coords to world coords
export const getWorldPos = (mx, my) => {
  // const x = (mx * config.tileWidth) + config.mapOrigin.x;
  // const y = (my * config.tileHeight) + config.mapOrigin.y;
  // return k.pos(x, y);
  const {x, y} = translateMapToWorldCoords(mx, my);
  return k.pos(x, y);
}

// check if the given coordinates are in the given bbox
export const coordsInBbox = (x, y, bbox) => {
  return x >= bbox[0] && x <= bbox[2] && y >= bbox[1] && y <= bbox[3];
}

/**
 * Get all map grid cells between the two given map coords.
 * Copied from http://playtechs.blogspot.com/2007/03/raytracing-on-grid.html
 * 
 * `visit` is a boolean function passed the coordinates of each cell as it's visited.
 * if `visit` returns true, the algorithm exits early and the function returns true,
 * otherwise it returns false.
 */
export const checkSupercover = (x0, y0, x1, y1, visit) => {
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  let x = x0;
  let y = y0;
  let n = dx + dy + 1;
  let xInc = x1 > x0 ? 1 : -1;
  let yInc = y1 > y0 ? 1 : -1;
  let error = dx - dy;
  dx *= 2;
  dy *= 2;

  // const cells = [];
  for (; n > 0; --n) {
    if (visit(x, y)) return true;
    if (error > 0) {
      x += xInc;
      error -= dy;
    } else {
      y += yInc;
      error += dx
    }
  }

  return false;
};

// Check if two line segments intersect
// Adapted from https://www.reddit.com/r/gamedev/comments/4qmfkh/whats_the_most_efficient_way_of_checking_if_a/d4u86ok/
export const lineSegmentsIntersect = (segmentOne, segmentTwo) => {
  const [p0x, p0y, p1x, p1y] = segmentOne;
  const [p2x, p2y, p3x, p3y] = segmentTwo;
  const s1x = p1x - p0x;
  const s1y = p1y - p0y;
  const s2x = p3x - p2x;
  const s2y = p3y - p2y;
  const s = (-s1y * (p0x - p2x) + s1x * (p0y - p2y)) / (-s2x * s1y + s1x * s2y);
  const t = (s2x * (p0y - p2y) - s2y * (p0x - p2x)) / (-s2x * s1y + s1x * s2y);
  return (s >= 0 && s <= 1 && t >= 0 && t <= 1);
};

