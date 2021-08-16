import level_1_1 from "/levels/maps/level_1_1.js";
import { testSecretsMap } from "/levels/maps/utils.js";

/**
 * --- Symbol Legend ---
 * · floor tile
 * ─ horizontal wall
 * │ vertical wall
 * ┌ top-left wall (nw)
 * ┐ top-right wall (ne)
 * └ bottom-left wall (sw)
 * ┘ bottom-right wall (se)
 * & red fountain
 * % blue fountain
 * ! goo wall
 * { wall banner (blue)
 * } wall banner (green)
 * ( wall banner (red)
 * ) wall banner (yellow)
 * + door
 * > ladder down
 * ? chest
 * $ coin
 * c crate
 * # crevasse
 * @ player spawn
 * d small demon
 * D big demon
 * f random flask
 * g goblin
 * i imp
 * M muddy
 * m mimic
 * n necromancer
 * O ogre
 * o random orc
 * s skeleton
 * S swampy
 * w wogol
 * Z big zombie
 * z random zombie
 */

// TODO - generate random map here
export const generateMap = () => {
  // return testSecretsMap;
  return level_1_1;
};