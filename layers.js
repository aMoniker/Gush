import { k } from "/kaboom.js"

export const addLayers = () => {
  k.layers([
    "bg",
    "game",
    "effect",
    "ui",
  ], "game");
  k.camIgnore(["bg", "ui"]);
};