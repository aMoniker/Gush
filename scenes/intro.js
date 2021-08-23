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

  const finger = k.add([
    k.sprite("finger-pointer"),
    k.origin("center"),
    k.pos(config.gameWidth / 2 + 177, config.gameHeight / 2 + 24),
    k.rotate(Math.PI / 5),
    k.color(0.875, 1, 1, 1),
    k.scale(5),
  ]);

  k.add([
    k.text("Click to Play", 24),
    k.origin("center"),
    k.pos(config.gameWidth / 2, config.gameHeight / 2 - 20),
    k.layer("ui"),
  ]);

  let t = 0;
  const posY = finger.pos.y;
  k.action(() => {
    t += k.dt();
    finger.pos.y = posY + Math.sin(t) * 5;
  });

  let gameStarting = false;
  const startGame = () => {
    if (gameStarting) return;
    gameStarting = true;
    fadeToScene("title-screen");
  }

  k.action(() => {
    if (input.attack || input.burp) startGame();
  });
});