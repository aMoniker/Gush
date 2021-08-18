import { k } from "/kaboom.js";

const defaultSavedState = {
  coins: 0,
  musicVolume: 0,
};

// basic state variables
// - changing properties is ephemeral and only saved while the game is running
// - using get/set saves data to localStorage & persists between games
export default {
  level: 0,
  playerType: "elf_f", // TODO - select from menu screen
  get: (key) => {
    const data = k.getData(key, defaultSavedState[key] ?? undefined);
    // localStorage can only store strings
    if (data === "true") return true;
    if (data === "false") return false;
    return data;
  },
  set: (key, val) => k.setData(key, val),
};