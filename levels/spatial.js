class CoordinatesMap {
  #map
  constructor() {
    this.map = new Map();
  }
  key(x, y) {
    return `${x}:${y}`;
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
  reset() {
    this.map.clear();
  }
}

class GameObjectsMap extends CoordinatesMap {
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

export const boundaryMap = new CoordinatesMap();
export const staticMap = new GameObjectsMap();