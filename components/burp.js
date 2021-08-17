import { k } from "/kaboom.js";
import { config } from "/config.js";

export default (options) => {
  const maxBurps = 3; // magic number
  let currentBurps = options.current;
  if (currentBurps > maxBurps) currentBurps = maxBurps;
  const burpRange = config.tileWidth * 7;

  return {
    id: "burps",
    require: ["player"],
    burping: false,

    burp() {
      if (this.burping || this.dead) return;

      const usingDeadlyBurp = currentBurps > 0;
      this.burping = true;
      k.burp({ // the most important kaboom.js function
        volume: usingDeadlyBurp ? 1 : 0.33,
        detune: usingDeadlyBurp ? -200 : 500,
      });
      k.camShake(usingDeadlyBurp ? 17 : 1);
      k.wait(0.5, () => this.burping = false);

      if (usingDeadlyBurp) {
        currentBurps--;
        k.every("monster", (m) => {
          if (m.pos.dist(this.pos) <= burpRange) m.hurt(666, this);
        });
        this.trigger("burped");
      }
    },

    addBurps(numBurps) {
      currentBurps = Math.max(0, Math.min(maxBurps, currentBurps + numBurps));
      this.trigger("burps-added", numBurps);
    },

    burps() { return currentBurps; },
    maxBurps() { return maxBurps; },
  };
}