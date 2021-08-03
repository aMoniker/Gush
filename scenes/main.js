import { k } from "/kaboom.js"
import { addPlayer } from "/objects/player.js"

import { loadLevel } from "/levels/test.js"

k.scene("main", (args = {}) => {
  loadLevel();
  addPlayer("elf_f");
});