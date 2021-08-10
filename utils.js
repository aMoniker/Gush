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
  easeOutQuart: (x) => 1 - Math.pow(1 - x, 4),
};

export const changeOverTime = (obj, time, changes, ease) => {
  let spent = 0;
  const orig = {};
  if (!ease) ease = easing.linear;
  for (const [path, endVal] of Object.entries(changes)) {
    const val = _.get(obj, path);
    const diff = endVal - val;
    orig[path] = { val, diff };
  }
  const cancelAction = obj.action(() => {
    spent = Math.min(spent + k.dt(), time);
    const percent = spent / time;
    for (const path of Object.keys(changes)) {
      const updated = orig[path].val + (ease(percent) * orig[path].diff);
      _.set(obj, path, updated);
    }
    if (spent >= time) return cancelAction();
  });
};