import { k } from "/kaboom.js";
import { config } from "/config.js";
import { tween, easing } from "/utils.js";

const processRedFlaskEffects = (player, flask) => {
  const healAmt = flask.is("flask_size_big") ? 6 : 1;
  player.heal(healAmt, flask);
};

const processBlueFlaskEffects = (player, flask) => {
  // add shield charges (add this to hp component)
  // shield shows blue dots or bar after hearts
  // when hit, shield dies first
  // shield cannot be healed, that still affects hp
};

const processGreenFlaskEffects = (player, flask) => {
  // add charges of BURP
  // add this to the UI somewhere
};

const processYellowFlaskEffects = (player, flask) => {
  // temp attack dmg boost (maybe scale player size?)
  // dont want to use color for everything or it will interfere with each other...
};

/**
 * Flasks make you big and strong.
 *  red flask: hp restore
 *  blue flask: temporary attack dmg boost
 *  green flask: SUPER BURP POWER
 *  yellow flask: temporary invincibility
 */
const handleFlaskPickup = (player, flask) => {
  if (flask.pickedUp) return;
  flask.pickedUp = true;

  if (flask.is("flask_color_red")) {
    processRedFlaskEffects(player, flask);
  } else if (flask.is("flask_color_blue")) {
    processBlueFlaskEffects(player, flask);
  } else if (flask.is("flask_color_green")) {
    processGreenFlaskEffects(player, flask);
  } else if (flask.is("flask_color_yellow")) {
    processYellowFlaskEffects(player, flask);
  }

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