import { k } from "/kaboom.js";
import { config } from "/config.js";
import state from "/state.js";
import input, { enableInputListeners, vibrateGamepad } from "/input.js";
import music from "/music.js";
import { addLayers } from "/layers.js";
import { fadeIn, fadeToScene } from "/utils.js";
import { regenerateMapOrders } from "/levels/maps/index.js";

const types = [
  {
    key: "knight",
    name: "Swordy Boi",
    description: "Hack & Slash",
    hearts: 4,
    difficulty: "ez pz",
    difficultyColor: [0.4, 1, 0.4],
    cost: 0,
  },
  {
    key: "elf_f",
    name: "Shootie Pie",
    description: "Bow & Arrows",
    hearts: 3,
    difficulty: "sneaky peeky",
    difficultyColor: [0.87, 0.5, 0.83],
    cost: 255,
  },
  {
    key: "elf_m",
    name: "Scooty Poke",
    description: "Spear Dash",
    hearts: 3,
    difficulty: "yololo",
    difficultyColor: [1, 0.2, 0.2],
    cost: 321,
  },
  {
    key: "lizard_f",
    name: "Lizzy Butch",
    description: "Meat Cleaverang",
    hearts: 4,
    difficulty: "doubly deadly",
    difficultyColor: [1, 0.3, 0.3],
    cost: 144,
  },
  {
    key: "lizard_m",
    name: "Smashosaur",
    description: "GIANT. HAMMER.",
    hearts: 4,
    difficulty: "PIECE OF CAKE",
    difficultyColor: [0.08, 0.58, 0.777],
    cost: 101,
  },
  {
    key: "wizard_f",
    name: "Burny Mage",
    description: "No Refunds.",
    hearts: 2,
    difficulty: "medium rare",
    difficultyColor: [0.54, 0.285, 0.18],
    cost: 451,
  },
  {
    key: "wizard_m",
    name: "LAZER WIZARD",
    description: "Wait, what?!",
    hearts: 1,
    difficulty: "is this a joke?",
    difficultyColor: [0.746, 0.25, 0.746],
    cost: 555,
  },
];

let curIdx = 0;

const basicAttributes = () => ([
  k.pos(0, 0),
  k.color(1, 1, 1, 0),
  k.origin("center"),
]);

k.scene("character-select", (args = {}) => {
  addLayers();
  fadeIn();
  regenerateMapOrders();

  // prevent held input from entry screen immediately selecting character
  setTimeout(() => {
    enableInputListeners();
  }, 500);

  music.crossFade("peek-a-boo-2", { fadeTime: 1 });

  // CHARACTER SELECT
  const charSelectText = k.add([
    ...basicAttributes(),
    k.text("SELECT CHARACTER", 33),
  ]);

  // (wasd or arrows)
  const instructionOneText = k.add([
    ...basicAttributes(),
    k.text("WASD (or ANALOG STICK) to view", 16),
  ]);

  // (space to select/unlock)
  const instructionTwoText = k.add([
    ...basicAttributes(),
    k.text("SPACE (or BOTTOM BUTTON) to choose", 16),
  ]);

  // <    sprite    >
  const leftArrowText = k.add([
    ...basicAttributes(),
    k.text("<", 48),
  ]);
  const rightArrowText = k.add([
    ...basicAttributes(),
    k.text(">", 48),
  ]);
  const characterSprite = k.add([
    ...basicAttributes(),
    k.sprite("knight", { noArea: true }),
    k.scale(5),
  ]);

  // rendered heart sprites
  let hearts = [];

  // name
  const nameText = k.add([
    ...basicAttributes(),
    k.text("", 36),
  ]);

  // description
  const descText = k.add([
    ...basicAttributes(),
    k.text("", 24),
  ]);

  // difficulty
  const difficultyText = k.add([
    ...basicAttributes(),
    k.text("", 22),
  ]);

  // cost
  const costText = k.add([
    ...basicAttributes(),
    k.text("", 18),
  ]);

  // your money
  const bankText = k.add([
    ...basicAttributes(),
    k.text("", 18),
  ]);

  // LOCKED
  const lockedText = k.add([
    ...basicAttributes(),
    k.text("LOCKED", 42),
  ]);

  const {gameWidth: w, gameHeight: h} = config;
  const hw = w / 2;

  const updateScreen = () => {
    const curType = types[curIdx];
    const unlocked = state.get(`unlocked_${curType.key}`)
    let dy = 0;

    charSelectText.pos.y = (dy += 37);
    charSelectText.pos.x = hw;
    charSelectText.color.a = 1;

    instructionOneText.pos.y = (dy += 40);
    instructionOneText.pos.x = hw;
    instructionOneText.color.r = 0.6875;
    instructionOneText.color.g = 0.765625;
    instructionOneText.color.b = 0.8671875;
    instructionOneText.color.a = 1;

    instructionTwoText.pos.y = (dy += 30);
    instructionTwoText.pos.x = hw;
    instructionTwoText.color.r = 0.6875;
    instructionTwoText.color.g = 0.765625;
    instructionTwoText.color.b = 0.8671875;
    instructionTwoText.color.a = 1;

    characterSprite.changeSprite(curType.key);
    characterSprite.pos.y = (dy += 80);
    characterSprite.pos.x = hw;
    characterSprite.color.a = 1;
    const curAnim = characterSprite.curAnim();
    if (unlocked && (curAnim !== "run" || curAnim !== "hit")) {
      characterSprite.play("run");
    } else if (curAnim !== "idle") {
      characterSprite.play("idle");
    }

    leftArrowText.pos.y = dy + 28;
    leftArrowText.pos.x = hw - 147;
    leftArrowText.color.a = curIdx === 0 ? 0.3 : 1;

    rightArrowText.pos.y = dy + 28;
    rightArrowText.pos.x = hw + 147;
    rightArrowText.color.a = curIdx === types.length - 1 ? 0.5 : 1;

    dy += 108;
    hearts.forEach(h => h.destroy());
    hearts = [];
    for (let i = 0; i < curType.hearts; i++) {
      hearts.push(k.add([
        ...basicAttributes(),
        k.sprite("ui_heart", { frame: 1 }),
        k.scale(3),
      ]));

      const hy = dy;
      setTimeout(() => {
        const len = curType.hearts
        const pos = i - (len / 2) + (len % 2 === 0 ? 0.5 : 0.5);
        hearts[i].pos.y = hy;
        hearts[i].pos.x = (w / 2) + (pos * 47);
        hearts[i].color.a = 1;
      }, 0);
    }

    nameText.text = curType.name;
    nameText.pos.y = (dy += 63);
    nameText.pos.x = hw;
    nameText.color.a = 1;

    descText.text = curType.description;
    descText.pos.y = (dy += 53);
    descText.pos.x = hw;
    descText.color.r = 0.6875;
    descText.color.g = 0.765625;
    descText.color.b = 0.8671875;
    descText.color.a = 1;

    difficultyText.text = curType.difficulty;
    difficultyText.pos.y = (dy += 47);
    difficultyText.pos.x = hw;
    difficultyText.color.a = 0.8;
    ["r", "g", "b"].forEach((x,i) => {
      difficultyText.color[x] = curType.difficultyColor[i];
    });

    costText.text = `Cost: ${curType.cost} coins`;
    costText.pos.y = (dy += 40);
    costText.pos.x = hw;
    costText.color.a = unlocked ? 0 : 1;
    costText.color.r = 1;
    costText.color.g = 0.84;
    costText.color.b = 0;

    const curCoins = state.get("coins");
    bankText.text = `You have: ${curCoins} coins`;
    bankText.pos.y = (dy += 30);
    bankText.pos.x = hw;
    bankText.color.a = unlocked ? 0 : 1;

    setTimeout(() => {
      lockedText.color.a = unlocked ? 0 : 0.9;
      lockedText.color.r = 1;
      lockedText.color.g = 0;
      lockedText.color.b = 0;
      lockedText.pos.x = hw;
      lockedText.pos.y = (h / 2) - 63;
    }, 1);
  };

  const prev = () => {
    const n = Math.max(0, curIdx - 1);
    if (n !== curIdx) {
      curIdx = n;
      updateScreen();
      vibrateGamepad(50, 0.1, 0);
    }
  }
  const next = () => {
    const p = Math.min(types.length - 1, curIdx + 1);
    if (p !== curIdx) {
      curIdx = p
      updateScreen();
      vibrateGamepad(50, 0.1, 0);
    }
  }

  const delay = 500;
  let canNavLeft = true;
  let canNavRight = true;
  let cancelLeftTimeout = null;
  let cancelRightTimeout = null;
  k.action(() => {
    if (input.x < 0 && canNavLeft) {
      prev();
      canNavLeft = false;
      if (cancelLeftTimeout) clearTimeout(cancelLeftTimeout);
      cancelLeftTimeout = setTimeout(() => canNavLeft = true, delay);
    } else if (input.x > 0 && canNavRight) {
      next();
      canNavRight = false;
      if (cancelRightTimeout) clearTimeout(cancelRightTimeout);
      cancelRightTimeout = setTimeout(() => canNavRight = true, delay);
    } else if (input.x === 0) {
      canNavLeft = true;
      canNavRight = true;
    }

    handleSelect();
  });

  let canSelect = true;
  const handleSelect = () => {
    if (!input.attack) {
      canSelect = true;
      return;
    }
    if (!canSelect) return;
    canSelect = false;
    const curType = types[curIdx];
    const unlocked = state.get(`unlocked_${curType.key}`);
    if (unlocked) {
      state.playerType = curType.key;
      k.play("spell-1", { volume: 0.77, detune: -666 });
      fadeToScene("main");
    } else {
      const curCoins = Number.parseInt(state.get("coins"));
      if (curCoins >= curType.cost) {
        state.set("coins", curCoins - curType.cost);
        state.set(`unlocked_${curType.key}`, true);
        k.play("coin-5", { loop: false });
        k.wait(0.5, () => { k.play("spell-7"); });
        updateScreen();
        vibrateGamepad(1000, 1, 1);
        characterSprite.play("hit");
        k.wait(1, () => characterSprite.play("run"));
      } else {
        k.play("alarm-2", {
          loop: false,
          speed: 1.5,
          volume: 0.666,
          detune: -200,
        });
        k.camShake(10);
        vibrateGamepad(444, 1, 0.5);
      }
    }
  };

  setTimeout(updateScreen, 0);
});