import { k } from "/kaboom.js";
import { rng, tween, easing } from "/utils.js";

// TODO - some of these may need slight adjustments
const bloodSpriteConfigs = {
  "vfx-blood-1": (obj, flip) => ([k.pos(obj.pos)]),
  "vfx-blood-2": (obj, flip) => ([k.pos(obj.pos.add(flip * 33, 10))]),
  "vfx-blood-3": (obj, flip) => ([k.pos(obj.pos.add(flip * 40, 20))]),
  "vfx-blood-4": (obj, flip) => ([k.pos(obj.pos.add(flip * 17, 20))]),
  "vfx-blood-5": (obj, flip) => ([k.pos(obj.pos.add(flip * 20, 17))]),
  "vfx-blood-6": (obj, flip) => ([k.pos(obj.pos.add(flip * 5, 10))]),
  "vfx-blood-7": (obj, flip) => ([k.pos(obj.pos.add(flip * 30, 12))]),
  "vfx-blood-8": (obj, flip) => ([k.pos(obj.pos.add(flip * 40, 17))]),
};

export default (options) => {
  options = options ?? {};
  const size = options.size ?? "medium";

  const spritesBySize = {
    small: [4, 6, 7],
    medium: [1, 2, 5, 7],
    large: [3, 8],
  };
  const enabledBloodSprites = spritesBySize[size];

  const detuneRangeBySize = {
    small: [0, 200],
    medium: [-400, 0],
    large: [ -700, -400]
  };
  const detuneRange = detuneRangeBySize[size];

  return {
    id: "gusher",
    require: ["monster"],
    add() { // called on component activation
      this.on("death", (killedBy) => {
        this.handleDeathGush(killedBy);
      });
    },
    handleDeathGush(killedBy) {
      const bloodSpriteName = `vfx-blood-${k.choose(enabledBloodSprites)}`;

      let flipX = killedBy.pos.x - this.pos.x >= 0;
      const flipDir = flipX ? -1 : 1;

      if (bloodSpriteName === "vfx-blood-4") flipX = !flipX; // this one is backwards
      const bloodSprite = k.sprite(bloodSpriteName, {
        noArea: true, animSpeed: 0.1, flipX
      });
      const bloodFrames = bloodSprite.numFrames();
      const blood = k.add([
        bloodSprite,
        k.layer("fx"),
        k.origin("bot"),
        k.color(1, 1, 1, 0.88),
        ...bloodSpriteConfigs[bloodSpriteName](this, flipDir),
      ]);
      blood.play("main", false);
      k.wait(bloodSprite.animSpeed * bloodSprite.numFrames(), () => {
        blood.destroy();
      });

      // GUSH
      k.play("giblet-splatter", {
        loop: false,
        volume: 0.93,
        speed: 1.3,
        detune: k.map(rng.gen(), 0, 1, ...detuneRange),
      });
    },
  };
}