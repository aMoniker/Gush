import { k } from "/kaboom.js"

// convenience wrapper to load a sprite in the standard filmstrip format
// animations are an object mapping of { name: [from, to] }
const loadBasicSprite = (name, slices, animations) => {
  const anims = {};
  for (let [key, frames] of Object.entries(animations ?? {})) {
    anims[key] = {
      from: frames[0],
      to: frames[1],
    }
  }
  return k.loadSprite(name, `/assets/sprites/${name}.png`, {
    sliceX: slices ?? 1,
    sliceY: 1,
    anims,
  })
};

export const loadAssets = () => {
  const promises = [];

  promises.push(loadBasicSprite("chest", 9, {
    empty_closed: [0, 0],
    empty_open: [0, 2],
    full_closed: [3, 3],
    full_open: [3, 5],
    mimic_closed: [6, 6],
    mimic_open: [6, 8],
  }));

  promises.push(loadBasicSprite("coin", 4, {
    spin: [0, 3],
  }));

  promises.push(loadBasicSprite("column", 3));

  promises.push(loadBasicSprite("crate"));

  promises.push(loadBasicSprite("demon_big", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));

  promises.push(loadBasicSprite("demon_small", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));

  promises.push(loadBasicSprite("door"));
  
  promises.push(loadBasicSprite("edge"));

  promises.push(loadBasicSprite("elf_f", 9, {
    idle: [1, 4],
    run: [5, 8],
    hit: [0, 0],
  }));

  promises.push(loadBasicSprite("elf_m", 9, {
    idle: [1, 4],
    run: [5, 8],
    hit: [0, 0],
  }));

  promises.push(loadBasicSprite("flask", 8));

  promises.push(loadBasicSprite("floor", 16, {
    ladder: [8, 8],
    trap_set: [9, 9],
    trap_sprung: [10, 12],
    trap_reset: [13, 15],
  }));

  promises.push(loadBasicSprite("goblin", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));

  promises.push(loadBasicSprite("hole"));

  promises.push(loadBasicSprite("imp", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));

  promises.push(loadBasicSprite("knight", 9, {
    idle: [1, 4],
    run: [5, 8],
    hit: [0, 0],
  }));

  promises.push(loadBasicSprite("lizard_f", 9, {
    idle: [1, 4],
    run: [5, 8],
    hit: [0, 0],
  }));
  
  promises.push(loadBasicSprite("lizard_m", 9, {
    idle: [1, 4],
    run: [5, 8],
    hit: [0, 0],
  }));

  promises.push(loadBasicSprite("muddy", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));

  promises.push(loadBasicSprite("necromancer", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));

  promises.push(loadBasicSprite("ogre", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));

  promises.push(loadBasicSprite("orc_masked", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));

  promises.push(loadBasicSprite("orc_shaman", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));

  promises.push(loadBasicSprite("orc_warrior", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));

  promises.push(loadBasicSprite("skeleton", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));

  promises.push(loadBasicSprite("skull"));

  promises.push(loadBasicSprite("swampy", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));

  promises.push(loadBasicSprite("ui_heart", 3, {
    empty: [0, 0],
    full: [1, 1],
    half: [2, 2],
  }));

  promises.push(loadBasicSprite("walls", 51, {
    basin_blue: [15, 17],
    basin_red: [18, 20],
    fountain_blue: [21, 23],
    fountain_red: [24, 26],
  }));

  promises.push(loadBasicSprite("weapon"));

  promises.push(loadBasicSprite("wizard_f", 9, {
    idle: [1, 4],
    run: [5, 8],
    hit: [0, 0],
  }));

  promises.push(loadBasicSprite("wizard_m", 9, {
    idle: [1, 4],
    run: [5, 8],
    hit: [0, 0],
  }));

  promises.push(loadBasicSprite("wogol", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));

  promises.push(loadBasicSprite("zombie_big", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));

  promises.push(loadBasicSprite("zombie_ice", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));

  promises.push(loadBasicSprite("zombie_tiny", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));

  promises.push(loadBasicSprite("zombie", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));

  return Promise.all(promises);
}