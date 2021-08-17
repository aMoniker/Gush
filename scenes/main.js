import { k, kaboomOptions } from "/kaboom.js";
import { addEvents } from "/events/index.js";
import { addLayers } from "/layers.js";
import { generateLevel } from "/levels/index.js";
import { initializeUi } from "/ui.js";

import { showFps } from "/utils.js"

k.scene("main", (args = {}) => {
  addLayers();
  addEvents();
  initializeUi();
  generateLevel();
  if (kaboomOptions.debug) showFps();
});