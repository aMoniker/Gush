import { k, kaboomOptions } from "/kaboom.js";
import { addEvents } from "/events/index.js";
import { addLayers } from "/layers.js";
import { generateLevel } from "/levels/index.js";
import { initializeUi } from "/ui.js";
import { enableInputListeners } from "/input.js";
import { fadeIn } from "/utils.js"
import { enableDebugDisplay } from "/debug.js";

k.scene("main", (args = {}) => {
  addLayers();
  addEvents();
  initializeUi();
  generateLevel();
  fadeIn();
  setTimeout(() => {
    enableInputListeners();
  }, 200);
  if (kaboomOptions.debug) enableDebugDisplay();
});