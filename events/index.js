import addTrapsEvents from "/events/traps.js";
import addMonstersEvents from "/events/monsters.js";
import addCoinsEvents from "/events/coins.js";
import addFlasksEvents from "/events/flasks.js";

export const addEvents = () => {
  addTrapsEvents();
  addMonstersEvents();
  addCoinsEvents();
  addFlasksEvents();
};