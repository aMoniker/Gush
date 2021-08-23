import { k } from "/kaboom.js"
import { config } from "/config.js";

export const rng = k.makeRng(Date.now());

export const randInt = (min, max) => {
  return min + Math.floor(rng.gen() * ((max - min) + 1));
};

export const curry = (fn, ...curriedArgs) => {
  return (...moreArgs) => fn(...curriedArgs, ...moreArgs);
};

export const easing = {
  linear: (x) => x,
  easeInSine: (x) => 1 - Math.cos((x * Math.PI) / 2),
  easeOutSine: (x) => Math.sin((x * Math.PI) / 2),
  easeInQuart: (x) => x**4,
  easeOutQuart: (x) => 1 - (1-x)**4,
  easeInOutQuint: (x) => x < 0.5 ? 16 * x**5 : 1 - (-2 * x + 2)**5 / 2,
  easeInBack: (x) => 2.70158 * x**3 - 1.70158 * x**2,
  easeInOutBack: (x) => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return x < 0.5
      ? ((2*x)**2 * ((c2 + 1) * 2 * x - c2)) / 2
      : ((2*x-2)**2 * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
  },
};

// function easeInOutBack(x: number): number {
// const c1 = 1.70158;
// const c2 = c1 * 1.525;

// return x < 0.5
//   ? (pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
//   : (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
// }

/**
 * Change the given numeric properties of `obj` over `time`.
 *  obj: the game object to be changed
 *  time: the time in seconds over which the change will occur.
 *  changes: an object of { [path]: endVal }, where path is a
 *           dot-delimited string to the value, consumable by lodash,
 *           and endVal is the value that should result after `time`
 *  ease: optional easing function; defaults to linear. See easing above.
 *  cb: optional callback to run every frame during the tween
 */
export const tween = (obj, time, changes, ease, cb) => {
  let spent = 0;
  const orig = {};
  if (!ease) ease = easing.linear;
  for (const [path, endVal] of Object.entries(changes)) {
    const val = _.get(obj, path);
    const diff = endVal - val;
    orig[path] = { val, diff };
  }
  return new Promise((resolve, reject) => {
    // we use window.requestAnimationFrame here instead of
    // k.action because scene changes cause k.action callbacks
    // to stop, leaving this promise pending.
    const stepTween = () => {
      if (!obj.exists()) return resolve();
      spent = Math.min(spent + k.dt(), time);
      const percent = spent / time;
      for (const path of Object.keys(changes)) {
        const updated = orig[path].val + (ease(percent) * orig[path].diff);
        _.set(obj, path, updated);
      }
      let shouldCancel = false;
      if (cb) shouldCancel = !!cb();
      if (shouldCancel || spent >= time) return resolve();
      window.requestAnimationFrame(stepTween);
    };
    window.requestAnimationFrame(stepTween);
  });
};

// assumes the original color is 1,1,1,1
export const flashColor = (obj, rgba, time) => {
  if (!obj.color) return;
  obj.color.r = rgba[0];
  obj.color.g = rgba[1];
  obj.color.b = rgba[2];
  obj.color.a = rgba[3];
  return k.wait(time, () => {
    obj.color.r = 1;
    obj.color.g = 1;
    obj.color.b = 1;
    obj.color.a = 1;
  });
};

let cachedPromise = Promise.resolve();

export const clearAllAnnouncements = () => {
  cachedPromise = Promise.resolve();
};

export const announce = (announcement, options = {}) => {
  cachedPromise = cachedPromise.then(() => {
    const text = k.add([
      k.text(announcement, 23),
      k.pos(0, 0),
      k.color(0.77, 0.77, 0.77, 0),
      k.origin("center"),
      k.layer("ui"),
    ]);
    text.pos.x = (k.width() / 2);
    text.pos.y = (k.height() / 2) - 77;
    if (!options.silent) {
      k.play("pop-1", { loop: false, volume: 0.37, speed: 1.33, detune: -300 });
    }
    return tween(text, 0.5, { "color.a": 1 })
      .then(() => k.wait(1.5))
      .then(() => tween(text, 0.5, { "color.a": 0 }))
      .then(() => text.destroy())
      ;
  });
  return cachedPromise;
};

const addFade = () => {
  return k.add([
    k.rect(config.gameWidth, config.gameHeight),
    k.pos(0, 0),
    k.layer("fade"),
    k.color(0, 0, 0, 0),
  ]);
}

export const fadeToScene = (sceneName, options = {}) => {
  const time = options.time ?? 1;
  const fade = addFade();
  return tween(fade, time, { "color.a": 1 }, easing.easeOutQuart)
    .then(() => { k.go(sceneName) });
};

export const fadeIn = () => {
  const fade = addFade();
  fade.color.a = 1;
  tween(fade, 1, { "color.a": 0 }, easing.easeOutQuart)
    .then(() => fade.destroy());
}