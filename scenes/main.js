import { k } from "/kaboom.js"
import { addPlayer } from "/objects/player.js"
import { addEvents } from "/events.js"
import { addLayers } from "/layers.js"
import { generateLevel } from "/levels/index.js"

import {showFps} from "/utils.js"

k.scene("main", (args = {}) => {
  addLayers();
  addEvents();
  generateLevel();
  const player = addPlayer("wizard_m");

  k.action("wall_boundary", (obj) => {
    obj.solid = player.pos.dist(obj.pos) <= 20;
  });

  showFps();
});