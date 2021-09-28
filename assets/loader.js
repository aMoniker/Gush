import { k } from "/kaboom.js";
import { curry } from "/utils.js";

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

  slices = slices ?? 1;
  return k.loadSprite(name, `/assets/sprites/${name}.png`, {
    sliceX: slices.x ?? slices,
    sliceY: slices.y ?? 1,
    anims,
  })
};

const loadAudio = (dir, name) => {
  return k.loadSound(name, `/assets/${dir}/${name}.mp3`);
}

const loadBasicSound = curry(loadAudio, "sounds");
const loadBasicMusic = curry(loadAudio, "music");

const loader = (loadFn, ...args) => {
  return () => new Promise((res, rej) => {
    let count = 0;
    const load = () => loadFn.apply(null, args)
      .then(res)
      .catch(() => {
        count++;
        if (count >= 100) return rej(); // fail after 100 tries
        setTimeout(load, 100); // retry
      });
    load();
  });
}

const generateLoaders = () => {
  const loaders = [];

  // tiles
  loaders.push(loader(loadBasicSprite, "column", 3));
  loaders.push(loader(loadBasicSprite, "door"));
  loaders.push(loader(loadBasicSprite, "edge"));
  loaders.push(loader(loadBasicSprite, "hole"));
  loaders.push(loader(loadBasicSprite, "floor", 16, {
    ladder: [8, 8],
    trap_sprung: [10, 12],
    trap_reset: [13, 15],
  }));
  loaders.push(loader(loadBasicSprite, "walls", 50, {
    basin_blue: [15, 17],
    basin_red: [18, 20],
    fountain_blue: [21, 23],
    fountain_red: [24, 26],
  }));


  // powerups/objects
  loaders.push(loader(loadBasicSprite, "chest", 9, {
    empty_open: [0, 2],
    full_open: [3, 5],
    mimic_open: [6, 8],
  }));
  loaders.push(loader(loadBasicSprite, "coin", 4, {
    spin: [0, 3],
  }));
  loaders.push(loader(loadBasicSprite, "crate"));
  loaders.push(loader(loadBasicSprite, "flask", 8));


  // player characters
  loaders.push(loader(loadBasicSprite, "elf_f", 9, {
    idle: [1, 4],
    run: [5, 8],
    hit: [0, 0],
  }));
  loaders.push(loader(loadBasicSprite, "elf_m", 9, {
    idle: [1, 4],
    run: [5, 8],
    hit: [0, 0],
  }));
  loaders.push(loader(loadBasicSprite, "knight", 9, {
    idle: [1, 4],
    run: [5, 8],
    hit: [0, 0],
  }));
  loaders.push(loader(loadBasicSprite, "lizard_f", 9, {
    idle: [1, 4],
    run: [5, 8],
    hit: [0, 0],
  }));
  loaders.push(loader(loadBasicSprite, "lizard_m", 9, {
    idle: [1, 4],
    run: [5, 8],
    hit: [0, 0],
  }));
  loaders.push(loader(loadBasicSprite, "wizard_f", 9, {
    idle: [1, 4],
    run: [5, 8],
    hit: [0, 0],
  }));
  loaders.push(loader(loadBasicSprite, "wizard_m", 9, {
    idle: [1, 4],
    run: [5, 8],
    hit: [0, 0],
  }));


  // weapons
  loaders.push(loader(loadBasicSprite, "weapon_knight_sword"));
  loaders.push(loader(loadBasicSprite, "weapon_bow"));
  loaders.push(loader(loadBasicSprite, "weapon_arrow"));
  loaders.push(loader(loadBasicSprite, "weapon_spear"));
  loaders.push(loader(loadBasicSprite, "weapon_cleaver"));
  loaders.push(loader(loadBasicSprite, "weapon_hammer"));
  loaders.push(loader(loadBasicSprite, "weapon_red_magic_staff"));
  loaders.push(loader(loadBasicSprite, "weapon_green_magic_staff"));


  // monsters
  loaders.push(loader(loadBasicSprite, "demon_big", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));
  loaders.push(loader(loadBasicSprite, "demon_small", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));
  loaders.push(loader(loadBasicSprite, "goblin", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));
  loaders.push(loader(loadBasicSprite, "imp", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));
  loaders.push(loader(loadBasicSprite, "muddy", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));
  loaders.push(loader(loadBasicSprite, "necromancer", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));
  loaders.push(loader(loadBasicSprite, "ogre", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));
  loaders.push(loader(loadBasicSprite, "orc_masked", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));
  loaders.push(loader(loadBasicSprite, "orc_shaman", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));
  loaders.push(loader(loadBasicSprite, "orc_warrior", 7, {
    idle: [0, 3],
    run: [4, 6],
  }));
  loaders.push(loader(loadBasicSprite, "skeleton", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));
  loaders.push(loader(loadBasicSprite, "swampy", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));
  loaders.push(loader(loadBasicSprite, "wogol", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));
  loaders.push(loader(loadBasicSprite, "zombie_big", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));
  loaders.push(loader(loadBasicSprite, "zombie_ice", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));
  loaders.push(loader(loadBasicSprite, "zombie_tiny", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));
  loaders.push(loader(loadBasicSprite, "zombie", 8, {
    idle: [0, 3],
    run: [4, 7],
  }));


  // misc
  loaders.push(loader(loadBasicSprite, "gush-logo"));
  loaders.push(loader(loadBasicSprite, "gush-logo-outlined"));
  loaders.push(loader(loadBasicSprite, "skull"));
  loaders.push(loader(loadBasicSprite, "finger-pointer"));
  


  // ui
  loaders.push(loader(loadBasicSprite, "bars", 15));
  loaders.push(loader(loadBasicSprite, "ui_heart", 3, {
    empty: [0, 0],
    full: [1, 1],
    half: [2, 2],
  }));


  // visual effects
  loaders.push(loader(loadBasicSprite, "vfx-blood-1", 9, {
    main: [0, 8],
  }));
  loaders.push(loader(loadBasicSprite, "vfx-blood-2", 10, {
    main: [0, 9],
  }));
  loaders.push(loader(loadBasicSprite, "vfx-blood-3", 14, {
    main: [0, 13],
  }));
  loaders.push(loader(loadBasicSprite, "vfx-blood-4", 7, {
    main: [0, 6],
  }));
  loaders.push(loader(loadBasicSprite, "vfx-blood-5", 10, {
    main: [0, 9],
  }));
  loaders.push(loader(loadBasicSprite, "vfx-blood-6", 9, {
    main: [0, 8],
  }));
  loaders.push(loader(loadBasicSprite, "vfx-blood-7", 10, {
    main: [0, 9],
  }));
  loaders.push(loader(loadBasicSprite, "vfx-blood-8", 12, {
    main: [0, 11],
  }));
  loaders.push(loader(loadBasicSprite, "vfx-slash", 5, {
    main: [0, 4],
  }));
  loaders.push(loader(loadBasicSprite, "vfx-healing", { x: 10, y: 10 }, {
    main: [0, 90],
  }));
  loaders.push(loader(loadBasicSprite, "explosion-vertical-small", { x: 10, y: 7 }, {
    main: [0, 64]
  }));
  loaders.push(loader(loadBasicSprite, "explosion-round", { x: 10, y: 8 }, {
    main: [0, 70]
  }));
  loaders.push(loader(loadBasicSprite, "vfx-thrust", 5, {
    main: [0, 4],
  }));
  loaders.push(loader(loadBasicSprite, "fireball-magic", 60, {
    main: [0, 59],
  }));
  loaders.push(loader(loadBasicSprite, "necro-spell", 30, {
    main: [0, 29],
  }));
  loaders.push(loader(loadBasicSprite, "magic-bubbles", { x: 8, y: 8 }, {
    main: [0, 60],
  }));
  loaders.push(loader(loadBasicSprite, "tank_explosion3"));


  // sound effects
  loaders.push(loader(loadBasicSound, "whoosh-flutter"));
  loaders.push(loader(loadBasicSound, "slash-1"));
  loaders.push(loader(loadBasicSound, "slash-2"));
  loaders.push(loader(loadBasicSound, "slash-5"));
  loaders.push(loader(loadBasicSound, "metal-slash-1"));
  loaders.push(loader(loadBasicSound, "metal-slash-2"));
  loaders.push(loader(loadBasicSound, "metal-slash-3"));
  loaders.push(loader(loadBasicSound, "punch-clean-heavy"));
  loaders.push(loader(loadBasicSound, "trap-spring"));
  loaders.push(loader(loadBasicSound, "coin-flung"));
  loaders.push(loader(loadBasicSound, "giblet-splatter"));
  loaders.push(loader(loadBasicSound, "glyph-activation"));
  loaders.push(loader(loadBasicSound, "punch-squelch-heavy"));
  loaders.push(loader(loadBasicSound, "punch-squelch-heavy-1"));
  loaders.push(loader(loadBasicSound, "punch-designed-heavy"));
  loaders.push(loader(loadBasicSound, "punch-intense-heavy"));
  loaders.push(loader(loadBasicSound, "implode"));
  loaders.push(loader(loadBasicSound, "drinking-gulp"));
  loaders.push(loader(loadBasicSound, "lock"));
  loaders.push(loader(loadBasicSound, "chest-opening"));
  loaders.push(loader(loadBasicSound, "chest-empty"));
  loaders.push(loader(loadBasicSound, "poof"));
  loaders.push(loader(loadBasicSound, "bubbles-1"));
  loaders.push(loader(loadBasicSound, "bubbles-3"));
  loaders.push(loader(loadBasicSound, "footstep-armor-1"));
  loaders.push(loader(loadBasicSound, "footstep-armor-2"));
  loaders.push(loader(loadBasicSound, "bow-release-2"));
  loaders.push(loader(loadBasicSound, "female-grunt-7"));
  loaders.push(loader(loadBasicSound, "male-grunt-5"));
  loaders.push(loader(loadBasicSound, "pop-1"));
  loaders.push(loader(loadBasicSound, "alarm-2"));
  loaders.push(loader(loadBasicSound, "spell-7"));
  loaders.push(loader(loadBasicSound, "coin-5"));
  loaders.push(loader(loadBasicSound, "punch-2"));
  loaders.push(loader(loadBasicSound, "punch-5"));
  loaders.push(loader(loadBasicSound, "punch-7"));
  loaders.push(loader(loadBasicSound, "explosion-2"));
  loaders.push(loader(loadBasicSound, "explosion-4"));
  loaders.push(loader(loadBasicSound, "explosion-5"));
  loaders.push(loader(loadBasicSound, "explosion-9"));
  loaders.push(loader(loadBasicSound, "fire-big-lit-1"));
  loaders.push(loader(loadBasicSound, "fire-big-lit-2"));
  loaders.push(loader(loadBasicSound, "alien-weapon-6"));
  loaders.push(loader(loadBasicSound, "laser-beam-plasma-loop"));
  loaders.push(loader(loadBasicSound, "heartbeat-slow-2"));
  loaders.push(loader(loadBasicSound, "spell-20"));
  loaders.push(loader(loadBasicSound, "spell-1"));
  loaders.push(loader(loadBasicSound, "spell-4"));
  loaders.push(loader(loadBasicSound, "spell-14"));
  loaders.push(loader(loadBasicSound, "bone-hit-1"));
  loaders.push(loader(loadBasicSound, "monster-4"));
  loaders.push(loader(loadBasicSound, "monster-14"));
  loaders.push(loader(loadBasicSound, "monster-12"));
  loaders.push(loader(loadBasicSound, "monster-16"));
  loaders.push(loader(loadBasicSound, "wood-4"));
  loaders.push(loader(loadBasicSound, "fire-1"));
  loaders.push(loader(loadBasicSound, "laser-plasma-rifle-fire"));
  loaders.push(loader(loadBasicSound, "arcane-wind-chimes"));


  // music
  loaders.push(loader(loadBasicMusic, "stark-nuances"));
  loaders.push(loader(loadBasicMusic, "battle-3"));
  loaders.push(loader(loadBasicMusic, "battle-8"));
  loaders.push(loader(loadBasicMusic, "cave-3"));
  loaders.push(loader(loadBasicMusic, "neon-synth"));
  loaders.push(loader(loadBasicMusic, "party-on-1"));
  // loaders.push(loader(loadBasicMusic, "peek-a-boo-1"));
  loaders.push(loader(loadBasicMusic, "peek-a-boo-2"));
  loaders.push(loader(loadBasicMusic, "sunset-alleyway"));

  return loaders;
}

export const loadAssets = async () => {
  const loaders = generateLoaders();
  for (const loader of loaders) {
    await loader();
  }
}