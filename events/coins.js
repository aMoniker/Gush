import { k } from "/kaboom.js";
import { config } from "/config.js";
import { tween, easing } from "/utils.js";
import state from "/state.js";
import { uiUpdateCoins } from "/ui.js";

// coins are saved between games and used to unlock new characters
export const handleCoinPickup = (player, coin, coinCount = 1) => {
  if (coin.pickedUp) return;
  coin.pickedUp = true;
  coin.isDestroying = true;

  const moveUpTime = 1;
  const fadeOutTime = 1.3;

  // save coins to the player's localStorage
  const curCoins = state.get("coins") + coinCount;
  state.set("coins", curCoins);

  k.play("coin-flung", {
    loop: false,
    volume: 0.33,
    speed: 1.33,
    detune: -100,
  });

  // move the coin up and fade it out
  if (!coin.color) coin.use(k.color(1,1,1,1));
  Promise.all([
    tween(coin, 1, { "pos.y": coin.pos.y - config.tileHeight }, easing.easeOutQuart),
    tween(coin, 1.3, { "color.a": 0 }),
  ]).then(() => {
    coin.destroy();
    coin.isDestroying = false;
  });

  uiUpdateCoins(curCoins);
};

export default () => {
  k.overlaps("player", "coin", handleCoinPickup);
}