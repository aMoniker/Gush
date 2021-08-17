import level_1_1 from "/levels/maps/level_1_1.js";
import { testSecretsMap, smallTestMap } from "/levels/maps/utils.js";
import state from "/state.js";

const mapOrder = [
  level_1_1,
];

export const generateMap = () => {
  return mapOrder[state.level];
};