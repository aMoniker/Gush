import { k } from "/kaboom.js";
import { announce } from "/utils.js";
import state from "/state.js";
import { loadNextLevel } from "/levels/maps/index.js";

let canAnnounce = true;
let cancelKeypress = null;
let cancelLeaveListener = null;
const handleLadderDown = (player, ladder) => {
  if (canAnnounce) {
    canAnnounce = false;
    announce("Press E to go to next level").finally(
      () => canAnnounce = true
    );
  }

  if (cancelKeypress) cancelKeypress();
  cancelKeypress = k.keyPress("e", () => {
    if (cancelKeypress) cancelKeypress();
    loadNextLevel();
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