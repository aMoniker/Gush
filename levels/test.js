import { k } from "/kaboom.js"

// const characters = {
//     "a": {
//         sprite: ,
//         msg: "ohhi how are you",
//     },
// };

export const loadLevel = () => {
  const map = k.addLevel([
    "[------------------]",
    "|..................|",
    "|..................|",
    "|..................|",
    "|..................|",
    "{__________________}",
  ], {
      width: 16,
      height: 16,
      pos: k.vec2(0, 0),
      ".": [
        k.sprite("dungeon", { frame: 33 }),
        k.solid(),
        k.layer("game"),
        "block",
      ],
      "*": [
        k.sprite("dungeon", { frame: 34 }),
        k.solid(),
        k.layer("game"),
        "block",
      ],
      // use a callback for dynamic evauations per block
      "?": () => {
        return [
          k.sprite("dungeon", { frame: 35 }),
          k.color(0, 1, k.rand(0, 1)),
          k.layer("game"),
          "block",
        ];
      },
      "^": [
        k.sprite("dungeon", { frame: 36 }),
        k.solid(),
        k.layer("game"),
        "spike",
        "block",
      ],
      // any catches anything that's not defined by the mappings above, good for more dynamic stuff like this
      // any(ch) {
      //     if (characters[ch]) {
      //         return [
      //             sprite(char.sprite),
      //             solid(),
      //             "character",
      //             {
      //                 msg: characters[ch],
      //             },
      //         ];
      //     }
      // },
    });
}

// query size
// map.width();
// map.height();

// get screen pos through map index
// map.getPos(x, y);

// destroy all
// map.destroy();

// there's no spatial hashing yet, if too many blocks causing lag, consider hard disabling collision resolution from blocks far away by turning off 'solid'
// action("block", (b) => {
//     b.solid = player.pos.dist(b.pos) <= 20;
// });