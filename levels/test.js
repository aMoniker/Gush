import { k } from "/kaboom.js"
import { floorTileRandom, floorLadder, floorTrap } from "/objects/floor.js";

// const characters = {
//     "a": {
//         sprite: ,
//         msg: "ohhi how are you",
//     },
// };

export const loadLevel = () => {

  let tileCounter = 0;

  const map = [
    "[------------------]",
    "|..................|",
    "|..................|",
    "|...........^......|",
    "|..................|",
    "{__________________}",
  ];

  const mapWidth = map[0].length;
  const mapHeight = map.length;

  // addLevel gives no context for tiles, so we use this trick
  // and pass everything through any() in order to see neighbors.
  const getNeighborTiles = (tileIndex) => {
    const x = tileIndex % mapWidth;
    const y = Math.floor(tileIndex / mapWidth);
    return {
      up: map?.[y-1]?.[x],
      down: map?.[y+1]?.[x],
      left: map?.[y]?.[x-1],
      right: map?.[y]?.[x+1],
    }
  };

  const level = k.addLevel(map, {
      width: 16,
      height: 16,
      pos: k.vec2(0, 0),
      // ".": floorTileRandom,
      // "*": [
      //   k.sprite("dungeon", { frame: 34 }),
      //   k.solid(),
      //   k.layer("game"),
      //   "block",
      // ],
      // use a callback for dynamic evauations per block
      // "?": () => { // chest
      //   return [
      //     k.sprite("dungeon", { frame: 35 }),
      //     k.color(0, 1, k.rand(0, 1)),
      //     k.layer("game"),
      //     "block",
      //   ];
      // },
      // "<": floorLadder,
      // ">": hole?,
      // "^": floorTrap,
      // any catches anything that's not defined by the mappings above, good for more dynamic stuff like this
      any(tile) {
        // console.log("tile", tileCounter, tile);
        

        const neighbors = getNeighborTiles(tileCounter);
        // console.log("neighbors", neighbors);

        tileCounter++;


        // let tileObject = [];
        if (tile === ".") {
          return floorTileRandom();
        } else if (tile === "^") {
          return floorTrap();
        }


        // return [];
        // if (characters[ch]) {
        //     return [
        //         sprite(char.sprite),
        //         solid(),
        //         "character",
        //         {
        //             msg: characters[ch],
        //         },
        //     ];
        // }
        // tileCounter++;
        // return tileObject;
      },
    });
    return level;
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