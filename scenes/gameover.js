import { k } from "/kaboom.js";

k.scene("gameover", () => {
  k.add([
    k.text("Game Over", 34),
    k.layer("ui"),
    k.origin("center"),
    k.pos(k.width() / 2, k.height() / 2)
  ])
});