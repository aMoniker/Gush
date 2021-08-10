import { k } from "/kaboom.js";
import { config } from "/config.js";
import { changeOverTime, easing } from "/utils.js";

const handleCoinPickup = (player, coin) => {
  if (coin.pickedUp) return;
  coin.pickedUp = true;

  const moveUpTime = 1;
  const fadeOutTime = 1.3;

  // TODO - add coin value to permanent bank value in config (using k.getData/setData)

  k.play("coin-flung", {
    loop: false,
    volume: 0.33,
    speed: 1.33,
    detune: -100,
  })

  changeOverTime(coin, 1, {
    "pos.y": coin.pos.y - config.tileHeight,
  }, easing.easeOutQuart);
  coin.use(k.color(1,1,1,1));
  changeOverTime(coin, 1.3, { "color.a": 0});

  const destroyTime = Math.max(moveUpTime, fadeOutTime);
  k.wait(destroyTime, () => coin.destroy());
};

export default () => {
  k.overlaps("player", "coin", handleCoinPickup);
}