import { k } from "/kaboom.js"
import { config } from "/config.js";

/**
 * Static structures:
 * [ top-left corner wall
 * - top wall
 * ] top-right corner wall
 * | left/right wall
 * { bottom-left corner wall
 * _ bottom wall
 * } bottom-right corner wall
 * ; wall banner (maybe same color for whole level
 * * & red fountain (basin should render below? also top tile?)
 * % blue fountain (see above)
 * ! goo fountain (see above)
 */

const wallAttributes = (frame) => ([
  k.sprite("walls", { frame, noArea: true }),
  "wall",
]);

// generate an invisible wall for collision detection
// all other wall sprites are decorative
export const invisibleWall = () => ([
  k.rect(config.tileWidth, config.tileHeight),
  k.solid(),
  k.color(1, 0, 0), // TODO - remove this
  "wall",
]);

/**
 * walls do not conform to 16x16 tiles only, and are meant to overlap
 * with floor, be stacked in multiple pieces, occlude the player, etc.
 * 
 * so, the best thing to do is probably add invisible solid game objects
 * to keep the player inside the bounds, while adding the wall pieces
 * depending on position & neighbors as basic sprites with noArea,
 * on separate layers. Most go beneath the player, but some go on a layer
 * above so the player can walk behind them. See the test image.
 * 
 * It might even be possible to optimize by creating a single long solid
 * invisible barrier instead of lots of small ones.
 */

export const wallBannerBlue = () => wallAttributes(0);
export const wallBannerGreen = () => wallAttributes(1);
export const wallBannerRed = () => wallAttributes(2);
export const wallBannerYellow = () => wallAttributes(3);
export const wallColumnMid = () => wallAttributes(4);
export const wallColumnTop = () => wallAttributes(5);
export const wallCornerBottomLeft = () => wallAttributes(6);
export const wallCornerBottomRight = () => wallAttributes(7);
export const wallCornerFrontLeft = () => wallAttributes(8);
export const wallCornerFrontRight = () => wallAttributes(9);
export const wallCornerLeft = () => wallAttributes(10);
export const wallCornerRight = () => wallAttributes(11);
export const wallCornerTopLeft = () => wallAttributes(12);
export const wallCornerTopRight = () => wallAttributes(13);
export const wallColumnBase = () => wallAttributes(14);
export const wallFountainBasinBlue = () => wallAttributes(15); // 15-17
export const wallFountainBasinRed = () => wallAttributes(18); // 18-20
export const wallFountainMidBlue = () => wallAttributes(21); // 21-23
export const wallFountainMidRed = () => wallAttributes(24); // 24-26
export const wallFountainTop = () => wallAttributes(27);
export const wallGooBase = () => wallAttributes(28);
export const wallGoo = () => wallAttributes(29);
export const wallHole1 = () => wallAttributes(30);
export const wallHole2 = () => wallAttributes(31);
export const wallInnerCornerTopLeftL = () => wallAttributes(32);
export const wallInnerCornerTopRightL = () => wallAttributes(33);
export const wallInnerCornerMidLeft = () => wallAttributes(34);
export const wallInnerCornerMidRight = () => wallAttributes(35);
export const wallInnerCornerTopLeftT = () => wallAttributes(36);
export const wallInnerCornerTopRightT = () => wallAttributes(37);
export const wallLeft = () => wallAttributes(38);
export const wallMid = () => wallAttributes(39);
export const wallRight = () => wallAttributes(40);
export const wallSideFrontLeft = () => wallAttributes(41);
export const wallSideFrontRight = () => wallAttributes(42);
export const wallSideMidLeft = () => wallAttributes(43);
export const wallSideMidRight = () => wallAttributes(44);
export const wallSideTopLeft = () => wallAttributes(45);
export const wallSideTopRight = () => wallAttributes(46);
export const wallTopLeft = () => wallAttributes(47);
export const wallTopMid = () => wallAttributes(48);
export const wallTopRight = () => wallAttributes(49);