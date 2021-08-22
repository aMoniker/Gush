import { k } from "/kaboom.js";
import level_1_1 from "/levels/maps/level_1_1.js";
import level_1_2 from "/levels/maps/level_1_2.js";
import level_2_1 from "/levels/maps/level_2_1.js";
import level_3_1 from "/levels/maps/level_3_1.js";
import level_treasure_1 from "/levels/maps/level_treasure_1.js";
import { monsterTestMap } from "/levels/maps/utils.js";
import state from "/state.js";
import { fadeToScene } from "/utils.js";

const mapOrders = {
  knight: [level_1_1, level_treasure_1, level_1_2],
  elf_f: [level_2_1],
  elf_m: [level_3_1],
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