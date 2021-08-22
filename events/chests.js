import { k } from "/kaboom.js";
import { rng, randInt, tween, easing } from "/utils.js";
import { handleCoinPickup } from "/events/coins.js";
import { handleFlaskPickup } from "/events/flasks.js";
import { coin, flask } from "/objects/powerups.js";
import { config } from "/config.js";

const processChestOpen = (player, chest) => {
  k.play("chest-opening", { volume: 0.8 });

  const isEmpty = rng.gen() < 0.05;
  chest.play(isEmpty ? "empty_open" : "full_open", false);

  if (isEmpty) {
    chest.wasEmpty = true;
    k.wait(0.5, () => {
      k.play("chest-empty", { volume: 1 });
    });
    return;
  }

  // only give player useful flasks
  const flaskColors = [];
  if (player.hp() < player.maxHp()) flaskColors.push("red");
  if (player.shields() < 3) flaskColors.push("blue");
  if (player.burps() < player.maxBurps()) flaskColors.push("green");

  const prizeConfig = () => ([
    k.origin("center"),
    k.pos(chest.pos),
  ]);
  let prize = null;
  const prizeRoll = rng.gen();
  if (!flaskColors.length || prizeRoll <= 0.6) {
    prize = k.add([ ...coin(), ...prizeConfig() ]);
    const coinCount = randInt(2, 11);
    handleCoinPickup(player, prize, coinCount);
    const coinsText = k.add([
      k.text(`${coinCount}`, 8),
      k.color(1,1,1,1),
      ...prizeConfig(),
    ]);
    tween(coinsText, 1, {
      "pos.y": coinsText.pos.y - config.tileWidth
    }, easing.easeInOutBack)
      .then(() => tween(coinsText, 1, { "color.a": 0 }))
      .then(() => coinsText.destroy());
  } else {
    const color = k.choose(flaskColors);
    const size = k.choose(["big", "small"]);
    prize = k.add([ ...flask(size, color), ...prizeConfig() ]);
    handleFlaskPickup(player, prize);
  }
};

const handleChestOpen = (player, chest) => {
  if (chest.opened) return;
  chest.opened = true;

  k.play("lock", { volume: 0.8, detune: -200 });
  k.wait(0.5, () => {
    processChestOpen(player, chest);
  });
}

export default () => {
  k.collides("player", "chest", handleChestOpen);
}
