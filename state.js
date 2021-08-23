import { k } from "/kaboom.js";

const defaultSavedState = {
  coins: 0,
  // musicVolume: 0.1,
  musicVolume: 0.77,
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

// running this repl in the replit.com iframe can result in
// errors when trying to access localStorage, since that can be
// blocked when cross-domain. So, if setData/getData throws an error,
// we use this object instead, which means you'll lose all your data
// when you refresh. Play the game in a new tab to avoid all this!
const fakeLocalStorage = {};

// test for LS error up front; if it fails once, use fake LS
let localStorageFailed = false;
try {
  k.setData("test-localstorage", true);
  localStorage.removeItem("test-localstorage");
} catch (e) {
  localStorageFailed = true;
}

// basic state variables
// - changing properties is ephemeral and only saved while the game is running
// - using get/set saves data to localStorage & persists between games
const state = {
  level: 0, // current level index
  player: null, // reference to player object for quick lookup
  playerType: "knight",
  forcedCam: false, // used for endgame camera effect
  // playerType: "lizard_f",
  mapWidth: 70, // used to recalculate minimap on window resize
  mapHeight: 70,
  get: (key) => {
    let data = null;
    if (localStorageFailed) {
      data = fakeLocalStorage[key];
    } else {
      data = k.getData(key);
      // localStorage can only store strings
      if (data === "true") return true;
      if (data === "false") return false;
    }
    return data ?? defaultSavedState[key] ?? undefined;
  },
  set: (key, val) => {
    if (localStorageFailed) {
      fakeLocalStorage[key] = val;
    } else {
      k.setData(key, val);
    }
  }
};

export const hasUnlockedAllCharacters = () => {
  if (!state.get("unlocked_knight")) return false;
  if (!state.get("unlocked_elf_f")) return false;
  if (!state.get("unlocked_elf_m")) return false;
  if (!state.get("unlocked_lizard_f")) return false;
  if (!state.get("unlocked_lizard_m")) return false;
  if (!state.get("unlocked_wizard_f")) return false;
  if (!state.get("unlocked_wizard_m")) return false;
  return true;
}

export default state;