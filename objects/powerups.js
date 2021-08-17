import { k } from "/kaboom.js";
import lifecycle from "/components/lifecycle.js"
import { rng } from "/utils.js";

/**
 * Powerups - objects the player can pick up for a bonus effect
 * $ coin
 * f random flask
 */

export const coin = () => ([
  k.sprite("coin"),
  k.scale(1.33),
  "static",
  "coin",
  lifecycle({
    onAdd: (obj) => obj.play("spin"),
  }),
  {
    pickedUp: false,
    isDestroying: false,
  }
]);

const flaskFrames = {
  blue_big: 0,
  green_big: 1,
  red_big: 2,
  yellow_big: 3,
  blue_small: 4,
  green_small: 5,
  red_small: 6,
  yellow_small: 7,
};

// size = big|small
// color = blue|green|red|yellow
export const flask = (size, color) => ([
  k.sprite("flask", { frame: flaskFrames[`${color}_${size}`] }),
  "static",
  "flask",
  `flask_color_${color}`,
  `flask_size_${size}`,
  {
    pickedUp: false,
  }
]);

export const randomFlask = () => {
  const size = rng.gen() > 0.77 ? "big" : "small";
  const colorRoll = rng.gen();
  let color = "blue";
  if (colorRoll > 0.33 && colorRoll <= 0.55) {
    color = "green";
  } else if (colorRoll > 0.55 && colorRoll <= 0.95) {
    color = "red";
  } else if (colorRoll > 0.95) {
    // color = "yellow";
  }
  return flask(size, color);
};