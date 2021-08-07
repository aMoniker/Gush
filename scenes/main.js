import { k } from "/kaboom.js"
import { addEvents } from "/events.js"
import { addLayers } from "/layers.js"
import { generateLevel } from "/levels/index.js"

import { showFps } from "/utils.js"

k.scene("main", (args = {}) => {
  addLayers();
  addEvents();
  generateLevel();
  showFps();
});