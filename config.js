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
  mapOrigin: { x: 0, y: 0 },
};