import { k } from "/kaboom.js";
import { config } from "/config.js";
import input, { enableInputListeners } from "/input.js";
import { addLayers } from "/layers.js";
import { fadeToScene } from "/utils.js";

// Intro scene forces player to interact with the page,
// which allows audio to run
k.scene("intro", () => {
  addLayers();
  enableInputListeners();

  k.add([
    k.text("Click to Start", 34),
    k.origin("center"),
    k.pos(config.gameWidth / 2, config.gameHeight / 2),
    k.layer("ui"),
  ]);

  let gameStarting = false;
  const startGame = () => {
    if (gameStarting) return;
    gameStarting = true;
    window.removeEventListener("keydown", startGame);
    fadeToScene("title-screen");
  }

  window.addEventListener("keydown", startGame);
  k.action(() => {
    if (input.attack || input.burp) startGame();
  });
  k.mouseClick(startGame);
});