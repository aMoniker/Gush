import { k } from "/kaboom.js"

// due to browser policies you'll need a static file server to load local files, e.g.
// - (with python) $ python3 -m http.server $PORT
// - (with caddy) $ caddy file-server --browse --listen $PORT
// - https://github.com/vercel/serve
// - https://github.com/http-party/http-server
// loadSprite("froggy", "froggy.png");
// loadSprite("froggy", "https://kaboomjs.com/assets/sprites/mark.png");

// const dungeon = {
//   src: "/assets/sprites/dungeon-tileset.png",
//   conf: {
//     gridWidth: 16,
//     gridHeight: 512,
//   }
// };

const dungeonTile = (x, y) => {
  return (y * 32) + x;
}

// slice the image into 12 x 3 = 36 frames with equal sizes
k.loadSprite("dungeon-tileset", "/assets/sprites/dungeon-tileset.png", {
  gridWidth: 16,
  gridHeight: 16,
  anims: {
    wizard_idle: {
      from: dungeonTile(11, 9),
      to: dungeonTile(13, 9),
    }
  }
});

k.loadSprite("wizard_m", "/assets/sprites/wizard_m.png", {
  sliceX: 4,
  sliceY: 3,
  animSpeed: 3,
  anims: {
    idle: {
      from: 1,
      to: 4,
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

// later in code...

// add([
//     sprite("tileset", { frame: 12, }),
// ]);

// slice a spritesheet and add anims manually
// k.addSprite("wizard", dungeon.src, {
//   frame: 4,
// });
