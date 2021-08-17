import { k } from "/kaboom.js"

// TODO - add support for game-wide seed
export const rng = k.makeRng(Date.now());

export const randInt = (min, max) => {
  return min + Math.floor(rng.gen() * ((max - min) + 1));
}

export const showFps = () => {
  const fpsText = k.add([
    k.text("", 8),
    k.pos(0, 0),
    k.layer("ui"),
  ]);
  fpsText.action(() => {
    fpsText.text = k.debug.fps();
  });
}

export const curry = (fn, ...curriedArgs) => {
  return (...moreArgs) => fn(...curriedArgs, ...moreArgs);
};

export const easing = {
  linear: (x) => x,
  easeInQuart: (x) => x**4,
  easeOutQuart: (x) => 1 - (1-x)**4,
  easeInOutQuint: (x) => x < 0.5 ? 16 * x**5 : 1 - (-2 * x + 2)**5 / 2,
};

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
    const cancelAction = obj.action(() => {
      spent = Math.min(spent + k.dt(), time);
      const percent = spent / time;
      for (const path of Object.keys(changes)) {
        const updated = orig[path].val + (ease(percent) * orig[path].diff);
        _.set(obj, path, updated);
      }
      let shouldCancel = false;
      if (cb) shouldCancel = !!cb();
      if (shouldCancel || spent >= time) {
        cancelAction();
        resolve();
      }
    });
  });
};

let cachedPromise = Promise.resolve();
export const announce = (announcement) => {
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
    return tween(text, 1, { "color.a": 1 })
      .then(() => k.wait(3))
      .then(() => tween(text, 1, { "color.a": 0 }))
      .then(() => text.destroy())
      ;
  });
  return cachedPromise;
};
