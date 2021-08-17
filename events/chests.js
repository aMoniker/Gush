import { k } from "/kaboom.js";
import { rng, tween, easing } from "/utils.js";
import { handleCoinPickup } from "/events/coins.js";
import { handleFlaskPickup } from "/events/flasks.js";
import { coin, randomFlask } from "/objects/powerups.js";

const processChestOpen = (player, chest) => {
  k.play("chest-opening", { volume: 0.8 });

  const isEmpty = rng.gen() < 0.1;
  chest.play(isEmpty ? "empty_open" : "full_open", false);

  if (isEmpty) {
    k.wait(0.5, () => {
      k.play("chest-empty", { volume: 1 });
    });
    return;
  }

  const prizeConfig = [
    k.origin("center"),
    k.pos(chest.pos),
  ];
  let prize = null;
  const prizeRoll = rng.gen();
  if (prizeRoll <= 0.666) {
    prize = k.add([ ...coin(), ...prizeConfig ]);
    handleCoinPickup(player, prize);
  } else {
    prize = k.add([ ...randomFlask(), ...prizeConfig ]);
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
