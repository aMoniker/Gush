import { k } from "/kaboom.js"

// TODO - add support for game-wide seed
export const rng = k.makeRng(Date.now());

export const randInt = (min, max) => {
  return min + Math.floor(rng.gen() * ((max - min) + 1));
}