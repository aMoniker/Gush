const tileWidth = 16;
const tileHeight = 16;
const tilesPerScreen = 16;

// the actual screen dimensions, used to initialize kaboom
const gameWidth = 834;
const gameHeight = 557;
const gameAspectRatio = gameWidth / gameHeight;

// these control how much of the screen is covered by the camera
const viewableWidth = tilesPerScreen * tileWidth;
const viewableHeight = viewableWidth / gameAspectRatio;

// these control the far game objects render around the player
const renderedBuffer = tileWidth * 3;
const renderedWidth = viewableWidth + renderedBuffer;
const renderedHeight = renderedWidth / gameAspectRatio;

export const config = {
  gameWidth,
  gameHeight,
  gameAspectRatio,
  tileWidth,
  tileHeight,
  tilesPerScreen,
  viewableWidth,
  viewableHeight,
  renderedWidth,
  renderedHeight,
  minimapSize: 0.15, // minimap size as percent of game width
  mapOrigin: { x: 0, y: 0 },
};