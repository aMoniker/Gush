import { k } from "/kaboom.js";

export const config = {
  tileWidth: 16,
  tileHeight: 16,
  tilesPerScreen: 11,
  mapOrigin: k.vec2(0, 0),
  playerType: "knight", // select from menu screen
};

const aspectRatio = k.width() / k.height();
config.viewableWidth = config.tilesPerScreen * config.tileWidth;
config.viewableHeight = config.viewableWidth / aspectRatio;
config.viewableDist = Math.sqrt(
  (config.viewableWidth)**2 + (config.viewableHeight)**2
);