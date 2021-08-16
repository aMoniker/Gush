import { k } from "/kaboom.js";

const defaultSavedState = {
  coins: 0,
};

const tileWidth = 16;
const tileHeight = 16;
const tilesPerScreen = 16;

const renderedAspectRatio = 1.5;
const viewableWidth = tilesPerScreen * tileWidth;
const viewableHeight = viewableWidth / renderedAspectRatio;


// buffer of is added to prevent tile pop-in at screen edges
const renderedBuffer = tileWidth * 4;
const renderedWidth = viewableWidth + renderedBuffer;
const renderedHeight = renderedWidth / renderedAspectRatio;

export const config = {
  tileWidth,
  tileHeight,
  tilesPerScreen,
  viewableWidth,
  viewableHeight,
  renderedWidth,
  renderedHeight,
  renderedAspectRatio,
  mapOrigin: k.vec2(0, 0),
  playerType: "knight", // TODO - select from menu screen
  get: (key) => k.getData(key, defaultSavedState[key] ?? undefined),
  set: (key, val) => k.setData(key, val),
};