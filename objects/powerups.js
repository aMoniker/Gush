import { k } from "/kaboom.js";
import lifecycle from "/components/lifecycle.js"

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

// TODO - make some flasks more rare than others?
export const randomFlask = () => {
  return flask("big", "red"); // TODO - testing flasks
  const size = k.choose(["big", "small"]);
  const color = k.choose(["blue", "green", "red", "yellow"]);
  return flask(size, color);
};