import { k } from "/kaboom.js"

export const addLayers = () => {
  k.layers([
    "bg",
    "floor",
    "game",
    "ceiling",
    "fx",
    "ui",
    "fade",
  ], "game");
  k.camIgnore(["bg", "ui", "fade"]);
};