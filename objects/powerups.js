import { k } from "/kaboom.js";
// import { rng } from "/utils.js";

/**
 * Powerups - objects the player can pick up for a bonus effect
 * $ coin
 * f random flask
 */

export const coin = () => ([
  k.sprite("coin"),
  "non-player",
  "interactive",
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
  "non-player",
  "interactive",
  `flask_${color}_${size}`,
]);

// TODO - make some flasks more rare than others?
export const randomFlask = () => {
  const size = k.choose(["big", "small"]);
  const color = k.choose(["blue", "green", "red", "yellow"]);
  return flask(size, color);
};