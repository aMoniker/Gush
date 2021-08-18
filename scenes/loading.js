import { k } from "/kaboom.js"

// TODO - show loading intro with percentage
k.scene("loading", (args = {}) => {
  const text = k.addText("Loading...", 23, {
    pos: k.vec2(k.width() / 2, k.height() / 2),
  });

  // center text
  setTimeout(() => {
    text.pos = k.vec2(
      text.pos.x - (text.width / 2),
      text.pos.y - (text.height / 2),
    );
  });
});