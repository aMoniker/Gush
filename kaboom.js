import { config } from "/config.js";

export const kaboomOptions = {
  canvas: document.getElementById("game"),
  width: config.gameWidth,
  height: config.gameHeight,
  scale: 1,
  version: "0.6.0",
  global: false,
  clearColor: [0, 0, 0, 1],
  crisp: true,
  debug: false,
};

export const k = kaboom(kaboomOptions);