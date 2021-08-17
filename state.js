import { k } from "/kaboom.js";

const defaultSavedState = {
  coins: 0,
};

// basic state variables
// - changing properties is ephemeral and only saved while the game is running
// - using get/set saves data to localStorage & persists between games
export default {
  playerType: "knight", // TODO - select from menu screen
  get: (key) => k.getData(key, defaultSavedState[key] ?? undefined),
  set: (key, val) => k.setData(key, val),
};