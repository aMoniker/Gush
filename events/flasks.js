import { k } from "/kaboom.js";
import { config } from "/config.js";
import { tween, easing } from "/utils.js";

const processRedFlaskEffects = (player, flask) => {
  const healAmt = flask.is("flask_size_big") ? 6 : 1;
  player.heal(healAmt, flask);
};

const processBlueFlaskEffects = (player, flask) => {
  const shieldAmt = flask.is("flask_size_big") ? 3 : 1;
  player.addShields(shieldAmt);
};

const processGreenFlaskEffects = (player, flask) => {
  const burpsAmt = flask.is("flask_size_big") ? 3 : 1;
  player.addBurps(burpsAmt);
};

const processYellowFlaskEffects = (player, flask) => {
  // yellow flask is currently used as end game prize
};

/**
 * Flasks make you big and strong.
 *  red flask: hp restore
 *  blue flask: temporary attack dmg boost
 *  green flask: SUPER BURP POWER
 *  yellow flask: temporary invincibility
 */
export const handleFlaskPickup = (player, flask) => {
  if (flask.pickedUp) return;
  flask.pickedUp = true;

  flask.trigger("picked-up");

  if (flask.is("flask_color_red")) {
    processRedFlaskEffects(player, flask);
  } else if (flask.is("flask_color_blue")) {
    processBlueFlaskEffects(player, flask);
  } else if (flask.is("flask_color_green")) {
    processGreenFlaskEffects(player, flask);
  } else if (flask.is("flask_color_yellow")) {
    processYellowFlaskEffects(player, flask);
  }

  const gulp = flask.is("flask_size_big") ? "bubbles-3" : "bubbles-1";
  k.play(gulp);

  // scale the flask, move it up, and fade it out
  if (!flask.color) flask.use(k.color(1,1,1,1));
  if (!flask.scale) flask.use(k.scale(1));
  tween(flask, 0.77, {
    "pos.y": flask.pos.y - config.tileHeight / 2,
    "scale.x": 1.5,
    "scale.y": 1.5,
  }, easing.easeOutQuart).then(() => {
    return tween(flask, 0.3, {
      "color.a": 0,
    });
  }).then(() => {
    flask.destroy();
  });
};

export default () => {
  k.overlaps("player", "flask", handleFlaskPickup);
}