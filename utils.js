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