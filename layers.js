import { k } from "/kaboom.js"

export const addLayers = () => {
  k.layers([
    "bg",
    "floor",
    "game",
    "effect",
    "ui",
  ], "game");
  k.camIgnore(["bg", "ui"]);
};