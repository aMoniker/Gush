import { k } from "/kaboom.js"

// const dungeonTile = (x, y) => {
//   return (y * 32) + x;
// }

// slice the image into 12 x 3 = 36 frames with equal sizes
// k.loadSprite("dungeon-tileset", "/assets/sprites/dungeon-tileset.png", {
//   gridWidth: 16,
//   gridHeight: 16,
//   anims: {
//     // wizard_idle: {
//     //   from: dungeonTile(11, 9),
//     //   to: dungeonTile(13, 9),
//     // }
//   }
// });

k.loadSprite("wizard_m", "/assets/sprites/wizard_m.png", {
  sliceX: 4,
  sliceY: 3,
  animSpeed: 3,
  anims: {
    idle: {
      from: 2,
      to: 3,
    },
    run: {
      from: 5,
      to: 8,
    },
    hit: {
      from: 0,
      to: 0,
    }
  }
});