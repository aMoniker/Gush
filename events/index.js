import addTrapsEvents from "/events/traps.js";
import addMonstersEvents from "/events/monsters.js";
import addCoinsEvents from "/events/coins.js";
import addFlasksEvents from "/events/flasks.js";
import addChestsEvents from "/events/chests.js";
import addLadderEvents from "/events/ladder.js";

export const addEvents = () => {
  addTrapsEvents();
  addMonstersEvents();
  addCoinsEvents();
  addFlasksEvents();
  addChestsEvents();
  addLadderEvents();
};