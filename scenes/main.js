import { k } from "/kaboom.js"
import { initPlayer } from "/objects/player.js"

k.scene("main", (args = {}) => {
  initPlayer();
});