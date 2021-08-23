import { k } from "/kaboom.js";
import { announce } from "/utils.js";
import state from "/state.js";
import { loadNextLevel } from "/levels/maps/index.js";
import input from "/input.js";

let canAnnounce = true;
let cancelDescentListener = null;
let cancelLeaveListener = null;
const handleLadderDown = (player, ladder) => {
  if (canAnnounce) {
    canAnnounce = false;
    announce("Press ATTACK to go to next level").finally(
      () => canAnnounce = true
    );
    setTimeout(() => canAnnounce = true, 10000); // hacky force
  }

  if (cancelDescentListener) cancelDescentListener();
  cancelDescentListener = k.action(() => {
    if (input.attack) {
      cancelDescentListener();
      loadNextLevel();
    }
  });

  if (cancelLeaveListener) cancelLeaveListener();
  cancelLeaveListener = player.action(() => {
    if (!player.isOverlapped(ladder)) {
      if (cancelDescentListener) cancelDescentListener();
      if (cancelLeaveListener) cancelLeaveListener();
    }
  });
};

export default () => {
  k.overlaps("player", "ladder_down", handleLadderDown);
};