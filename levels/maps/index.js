import { k } from "/kaboom.js";
import level_1_1 from "/levels/maps/level_1_1.js";
import { testSecretsMap, smallTestMap } from "/levels/maps/utils.js";
import state from "/state.js";
import { fadeToScene } from "/utils.js";

const mapOrders = {
  knight: [level_1_1, smallTestMap],
  elf_f: [level_1_1],
  elf_m: [level_1_1],
  lizard_f: [level_1_1],
  lizard_m: [level_1_1],
  wizard_f: [level_1_1],
  wizard_m: [level_1_1],
};

export const loadNextLevel = () => {
  // make sure all existing scene objects are destroyed
  k.every((obj) => obj.destroy());

  state.level++;
  const maps = mapOrders[state.playerType];
  if (state.level < 0) state.level = 0; // should never happen™
  if (state.level >= maps.length) {
    fadeToScene("gameover");
  } else {
    fadeToScene("main");
  }
}

export const generateMap = () => {
  return mapOrders[state.playerType][state.level];
};