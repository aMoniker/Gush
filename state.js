import { k } from "/kaboom.js";

const defaultSavedState = {
  coins: 0,
  musicVolume: 0.33,
  unlocked_knight: true,
  unlocked_elf_f: false,
  unlocked_elf_m: false,
  unlocked_lizard_f: false,
  unlocked_lizard_m: false,
  unlocked_wizard_f: false,
  unlocked_wizard_m: false,
  keyUse: "e",
  keyBurp: "b",
  keyAttack: "space",
  keyUp: "w",
  keyDown: "s",
  keyLeft: "a",
  keyRight: "d",
};

// basic state variables
// - changing properties is ephemeral and only saved while the game is running
// - using get/set saves data to localStorage & persists between games
export default {
  level: 0, // current level index
  player: null, // reference to player object for quick lookup
  playerType: "knight",
  mapWidth: 70, // used to recalculate minimap on window resize
  mapHeight: 70,
  get: (key) => {
    const data = k.getData(key) ?? defaultSavedState[key] ?? undefined;
    // localStorage can only store strings
    if (data === "true") return true;
    if (data === "false") return false;
    return data;
  },
  set: (key, val) => k.setData(key, val),
};