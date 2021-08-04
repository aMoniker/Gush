import { k } from "/kaboom.js"
import { floorTileRandom, floorLadder, floorTrap } from "/objects/structure.js";

/**
 * To implement:
 * + door
 * > hole/down
 * < ladder/up
 * [ top-left corner wall
 * - top wall
 * ] top-right corner wall
 * | left/right wall
 * { bottom-left corner wall
 * _ bottom wall
 * } bottom-right corner wall
 * & red fountain (basin should render below? also top tile?)
 * % blue fountain (see above)
 * ! goo fountain (see above)
 * ; wall banner (maybe same color for whole level
 * 
 * Special handling:
 * probably have to render tiles underneath on first pass,
 * then on second pass spawn objects with level.getPos()
 * ? chest
 * $ coin
 * # crate
 * @ player spawn
 * d small demon
 * D big demon
 * f random flask
 * g goblin
 * i imp
 * m muddy
 * n necromancer
 * o ogre
 * O random orc
 * s skeleton
 * S swampy
 * w wogol
 * Z big zombie
 * z random zombie
 */

const unimplemented = {};

export const generateLevel = () => {

  let tileCounter = 0;

  const map = [
    "[-----;-&--%--!-;-----------------------------------------------]",
    "|....................?..........................................|",
    "|...>..............................................d............|",
    "|...........^...................f...............................|",
    "|.<...................$.......................Z.............w...|",
    "|....................$$$........................................|",
    "|.........#...........$.....................z......g............|",
    "|......................................i........................|",
    "|...............................................................|",
    "|..........................................S............o.......|",
    "|..............................m................................|",
    "|..............................................n................|",
    "|...@..............................O.....................s......|",
    "|...............................................................|",
    "{_______________________________________________________________}",
  ];

  const mapWidth = map[0].length;
  const mapHeight = map.length;

  // addLevel gives no context for tiles, so we use this trick
  // and pass everything through any() in order to see neighbors.
  const getNeighborTiles = (tileIndex) => {
    const x = tileIndex % mapWidth;
    const y = Math.floor(tileIndex / mapWidth);
    return {
      up: map ?.[y - 1] ?.[x],
      down: map ?.[y + 1] ?.[x],
      left: map ?.[y] ?.[x - 1],
      right: map ?.[y] ?.[x + 1],
    }
  };

  const level = k.addLevel(map, {
    width: 16,
    height: 16,
    pos: k.vec2(0, 0),
    // any is used for all tiles so we can keep count and find neighbors
    any(tile) {
      const neighbors = getNeighborTiles(tileCounter);
      tileCounter++;

      if (tile === ".") {
        return floorTileRandom();
      } else if (tile === "^") {
        return floorTrap();
      } else {
        if (!unimplemented[tile]) {
          unimplemented[tile] = [
            k.rect(16, 16),
            k.color(k.rand(0.1, 1), k.rand(0.1, 1), k.rand(0.1, 1)),
          ];
        }
        return unimplemented[tile];
      }
    },
  });

  console.log('generated level');

  return level;
}