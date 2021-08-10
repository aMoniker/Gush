import { k } from "/kaboom.js";

export const config = {
  tileWidth: 16,
  tileHeight: 16,
  tilesPerScreen: 16,
  mapOrigin: k.vec2(0, 0),
  playerType: "knight", // select from menu screen
};

const aspectRatio = k.width() / k.height();
config.viewableWidth = config.tilesPerScreen * config.tileWidth;
config.viewableHeight = config.viewableWidth / aspectRatio;
config.viewableDiagonal = Math.sqrt(
  (config.viewableWidth)**2 + (config.viewableHeight)**2
);
// buffer of tileWidth is added to prevent missing tiles at corner edges
config.viewableDist = (config.viewableDiagonal / 2) + config.tileWidth;