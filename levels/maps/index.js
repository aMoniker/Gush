import { k } from "/kaboom.js";
import level_1_1 from "/levels/maps/level_1_1.js";
import level_1_2 from "/levels/maps/level_1_2.js";
import level_2_1 from "/levels/maps/level_2_1.js";
import level_3_1 from "/levels/maps/level_3_1.js";
import level_4_1 from "/levels/maps/level_4_1.js";
import level_5_1 from "/levels/maps/level_5_1.js";
import level_6_1 from "/levels/maps/level_6_1.js";
import level_boss from "/levels/maps/level_boss.js";
import level_treasure_1 from "/levels/maps/level_treasure_1.js";
import level_treasure_2 from "/levels/maps/level_treasure_2.js";
import level_treasure_3 from "/levels/maps/level_treasure_3.js";
import level_treasure_4 from "/levels/maps/level_treasure_4.js";
import level_treasure_5 from "/levels/maps/level_treasure_5.js";
import state from "/state.js";
import { fadeToScene } from "/utils.js";

const randomTreasure = () => k.choose([
  level_treasure_1,
  level_treasure_2,
  level_treasure_3,
  level_treasure_4,
  level_treasure_5,
]);

const randomLevel = (doNotInclude = []) => {
  const allChoices = [level_1_2, level_2_1, level_3_1, level_4_1, level_5_1, level_6_1];
  const choices = allChoices.filter(l => !doNotInclude.includes(l));
  return k.choose(choices);
};

let mapOrders = {};
export const regenerateMapOrders = () => {
  mapOrders = {};
  mapOrders.knight = [
    level_1_1, randomTreasure(), level_1_2, randomTreasure(), level_boss
  ];
  mapOrders.elf_f = [
    level_2_1, randomTreasure(), randomLevel([level_2_1]), randomTreasure(), level_boss
  ];
  mapOrders.elf_m = [
    level_3_1, randomTreasure(), randomLevel([level_3_1]), randomTreasure(), level_boss
  ];
  mapOrders.lizard_f = [
    level_4_1, randomTreasure(), randomLevel([level_4_1]), randomTreasure(), level_boss
  ];
  mapOrders.lizard_m = [
    level_5_1, randomTreasure(), randomLevel([level_5_1]), randomTreasure(), level_boss
  ];
  mapOrders.wizard_f = [
    level_6_1, randomTreasure(), randomLevel([level_6_1]), randomTreasure(), level_boss
  ];
  const wizMap1 = randomLevel();
  const wizMap2 = randomLevel([wizMap1]);
  mapOrders.wizard_m = [
    wizMap1, randomTreasure(), wizMap2, randomTreasure(), level_boss
  ];
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
  if (!mapOrders[state.playerType]) regenerateMapOrders();
  const level = mapOrders[state.playerType][state.level];
  if (typeof level === "function") return level();
  return level;
};