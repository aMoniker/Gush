import { k } from "/kaboom.js";
import { announce } from "/utils.js";
import state from "/state.js";
import { loadNextLevel } from "/levels/maps/index.js";
import input from "/input.js";

let canAnnounce = true;
let cancelListener = null;
let cancelLeaveListener = null;
const handleLadderDown = (player, ladder) => {
  if (canAnnounce) {
    canAnnounce = false;
    announce("Press ATTACK to go to next level").finally(
      () => canAnnounce = true
    );
  }

  if (cancelListener) cancelListener();
  cancelListener = k.action(() => {
    if (input.attack) {
      cancelListener();
      loadNextLevel();
    }
  });

  if (cancelLeaveListener) cancelLeaveListener();
  cancelLeaveListener = player.action(() => {
    if (player.isOverlapped(ladder)) return;
    if (cancelLeaveListener) cancelLeaveListener();
    if (cancelKeypress) cancelKeypress();
  });
};

export default () => {
  k.overlaps("player", "ladder_down", handleLadderDown);
};