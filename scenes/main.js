import { k, kaboomOptions } from "/kaboom.js"
import { addEvents } from "/events.js"
import { addLayers } from "/layers.js"
import { generateLevel } from "/levels/index.js"

import { showFps } from "/utils.js"

k.scene("main", (args = {}) => {
  addLayers();
  addEvents();
  generateLevel();
  if (kaboomOptions.debug) showFps();

  // k.play("stark-nuances", {
  //   loop: true,
  //   volume: 1,
  //   speed: 0.88,
  //   detune: -333,
  // });
});