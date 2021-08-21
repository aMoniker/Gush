import { k } from "/kaboom.js"
import { config } from "/config.js";
import lifecycle from "/components/lifecycle.js";

const wallAttributes = (frame, attrs) => ([
  k.sprite("walls", { frame, noArea: true, ...(attrs ?? {}) }),
  "static",
  "wall_tile",
]);

// generate an invisible wall for collision detection
// all other wall sprites are decorative
export const invisibleWall = () => ([
  // add 1 px overlap to make it harder to slip between cracks.
  // this is definitely a bug in kaboom.js
  k.rect(config.tileWidth + 1, config.tileHeight + 1),
  k.solid(),
  k.color(0, 0, 0, 0),
  "solid",
  "static",
  "boundary",
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

export const wallFountainBasinBlue = () => ([
  ...wallAttributes(15),
  lifecycle({ onAdd: (f) => f.play("basin_blue") }),
]); // 15-17
export const wallFountainBasinRed = () => ([
  ...wallAttributes(18),
  lifecycle({ onAdd: (f) => f.play("basin_red") }),
]); // 18-20
export const wallFountainMidBlue = () => ([
  ...wallAttributes(21),
  lifecycle({ onAdd: (f) => f.play("fountain_blue") }),
]); // 21-23
export const wallFountainMidRed = () => ([
  ...wallAttributes(24),
  lifecycle({ onAdd: (f) => f.play("fountain_red") }),
]); // 24-26
export const wallFountainTop = () => wallAttributes(27);
export const wallGooMid = () => wallAttributes(28);
export const wallGooBasin = () => wallAttributes(29);

export const wallHole1 = () => wallAttributes(30);
export const wallHole2 = () => wallAttributes(31);

export const wallColumnTop = () => wallAttributes(5);
export const wallColumnMid = () => wallAttributes(4);
export const wallColumnBase = () => wallAttributes(14);

// number indicates position on test tiles
export const wallCornerBottomLeft = () => wallAttributes(6);        // 1
export const wallCornerBottomRight = () => wallAttributes(7);       // 2
export const wallCornerFrontLeft = () => wallAttributes(8);         // 3
export const wallCornerFrontRight = () => wallAttributes(9);        // 4
export const wallCornerLeft = () => wallAttributes(10);             // 5
export const wallCornerRight = () => wallAttributes(11);            // 6
export const wallCornerTopLeft = () => wallAttributes(12);          // 7
export const wallCornerTopRight = () => wallAttributes(13);         // 8
export const wallInnerCornerTopLeftL = () => wallAttributes(32);    // 9
export const wallInnerCornerTopRightL = () => wallAttributes(33);   // 10
export const wallInnerCornerMidLeft = () => wallAttributes(34);     // 11
export const wallInnerCornerMidRight = () => wallAttributes(35);    // 12
export const wallInnerCornerTopLeftT = () => wallAttributes(36);    // 13
export const wallInnerCornerTopRightT = () => wallAttributes(37);   // 14
export const wallLeft = () => wallAttributes(38);                   // 15
export const wallMid = () => wallAttributes(39);                    // 16
export const wallRight = () => wallAttributes(40);                  // 17
export const wallSideFrontLeft = () => wallAttributes(41);          // 18
export const wallSideFrontRight = () => wallAttributes(42);         // 19
export const wallSideMidLeft = () => wallAttributes(43);            // 20
export const wallSideMidRight = () => wallAttributes(44);           // 21
export const wallSideTopLeft = () => wallAttributes(45);            // 22
export const wallSideTopRight = () => wallAttributes(46);           // 23
export const wallTopLeft = () => wallAttributes(47);                // 24
export const wallTopMid = () => wallAttributes(48);                 // 25
export const wallTopRight = () => wallAttributes(49);               // 26