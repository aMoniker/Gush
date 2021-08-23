import { k } from "/kaboom.js";
import { config } from "/config.js";
import state from "/state.js";

// heart objects for displaying the player's health
let heartScale = 2;
let hearts = [];

// shield meter
let shieldsScale = 2;
let shields = [];

// burp meter
let burpsScale = 2;
let burps = [];

// coin count
let coinsScale = 3;
let coinSprite = null;
let coinText = null;

export const uiUpdatePositions = () => {
  // adjust hearts
  let lastHeartX = 0;
  for (let i = 0; i < hearts.length; i++) {
    lastHeartX = 6 + (i * (17 * heartScale));
    hearts[i].pos.x = lastHeartX;
    hearts[i].pos.y = 6;
  }

  // adjust shields
  for (let i = 0; i < shields.length; i++) {
    shields[i].pos.x = lastHeartX + (42 + i * 17 * shieldsScale);
    shields[i].pos.y = 6;
  }

  // adjust burp meter
  for (let i = 0; i < burps.length; i++) {
    burps[i].pos.x = 5 + (i * 17 * burpsScale);
    burps[i].pos.y = 42;
  }

  // adjust coin count
  if (coinSprite) {
    coinSprite.pos.x = 12;
    coinSprite.pos.y = 77;
  }
  if (coinText) {
    coinText.pos.x = 42;
    coinText.pos.y = 82;
  }
};

// initialize all ui objects
export const initializeUi = () => {
  hearts = [];
  shields = [];
  burps = [];
  coinSprite = null;
  coinText = null;
  uiUpdatePositions();
};

export const uiUpdateHealth = (curHp, maxHp, curShields) => {
  const maxShields = 3;
  let updatePositions = false;
  if (!hearts.length || !hearts[0].exists()) {
    for (let heart of hearts) heart.destroy();
    hearts = [];
    const maxHearts = Math.ceil(maxHp / 2);
    for (let i = 0; i < maxHearts; i++) {
      hearts.push(k.add([
        k.sprite("ui_heart", { frame: 0 }),
        k.layer("ui"),
        k.pos(0, 0),
        k.scale(heartScale),
      ]));
    }
    updatePositions = true;
  }
  if (!shields.length || !shields[0].exists()) {
    for (let shield of shields) shield.destroy();
    shields = [];
    for (let i = 0; i < maxShields; i++) {
      shields.push(k.add([
        k.sprite("bars", { frame: i + 12 }),
        k.layer("ui"),
        k.pos(0, 0),
        k.scale(shieldsScale),
      ]));
    }
    updatePositions = true;
  }
  if (updatePositions) uiUpdatePositions();
  for (let heart of hearts) {
    if (curHp >= 2) {
      heart.frame = 1;
      curHp -= 2;
    } else if (curHp === 1) {
      heart.frame = 2;
      curHp -= 1;
    } else {
      heart.frame = 0;
    }
  }
  for (let i = 0; i < maxShields; i++) {
    shields[i].hidden = curShields <= i;
  }
};

export const uiUpdateBurps = (curBurps) => {
  const maxBurps = 3;
  if (!burps.length || !burps[0].exists) {
    for (const burp of burps) burp.destroy();
    burps = [];
    for (let i = 0; i < maxBurps; i++) {
      burps.push(k.add([
        k.sprite("bars", { frame: i }),
        k.layer("ui"),
        k.pos(0, 0),
        k.scale(burpsScale),
      ]));
    }
    uiUpdatePositions();
  }
  for (let i = 0; i < maxBurps; i++) {
    burps[i].frame = (curBurps > i) ? i + 6 : i;
  }
};

export const uiUpdateCoins = (numCoins) => {
  if (!coinSprite) {
    coinSprite = k.add([
      k.sprite("coin", { animSpeed: 0.3, noArea: true }),
      k.layer("ui"),
      k.pos(0, 0),
      k.scale(coinsScale),
    ]);
    coinSprite.play("spin");
  }
  if (!coinText) {
    coinText = k.add([
      k.text(""),
      k.layer("ui"),
      k.pos(0, 0),
      k.color(1, 1, 1, 1),
    ]);
  }
  coinText.text = numCoins.toString();
  uiUpdatePositions();
};

const container = document.getElementById("container");
const gameCanvas = document.getElementById("game")
const minimapCanvas = document.getElementById("minimap");

// update the minimap height/width based on the map size
export const autoResizeMinimap = () => {
  const rect = gameCanvas.getBoundingClientRect();
  const mapAspectRatio = state.mapWidth / state.mapHeight;
  let minimapWidth = 0;
  let minimapHeight = 0;
  if (mapAspectRatio >= 1) { // map is wider than it is tall
    minimapWidth = rect.width * config.minimapSize;
    minimapHeight = minimapWidth / mapAspectRatio;
  } else { // map is taller than it is wide
    minimapHeight = rect.height * config.minimapSize;
    minimapWidth = minimapHeight * mapAspectRatio;
  }
  minimapCanvas.style.width = `${minimapWidth}px`;
  minimapCanvas.style.height = `${minimapWidth / mapAspectRatio}px`;
};

// on window resize, scale the canvas while maintaining the aspect ratio.
let windowResizeTimeout = 0;
const handleResize = (container, gameCanvas, minimapCanvas) => {
  const { innerWidth,innerHeight } = window;
  const windowAspectRatio = innerWidth / innerHeight;
  const { gameAspectRatio } = config;
  if (windowAspectRatio > gameAspectRatio) {
    // if it got wider, then the height is the limiter
    container.style.width = `${gameAspectRatio * innerHeight}px`;
    container.style.height = `${innerHeight}px`;
  } else {
    // if it got taller, then the width is the limiter
    container.style.width = `${innerWidth}px`;
    container.style.height = `${innerWidth / gameAspectRatio}px`;
  }

  autoResizeMinimap();

  // finally, update the UI so it renders in the proper spot
  uiUpdatePositions();
}

export const watchWindowResizing = () => {
  // debounced resize
  window.addEventListener("resize", () => {
    window.clearTimeout(windowResizeTimeout);
    windowResizeTimeout = window.setTimeout(() => {
      handleResize(container, gameCanvas, minimapCanvas);
    }, 200);
  });

  // initial resize
  setTimeout(() => {
    handleResize(container, gameCanvas, minimapCanvas);
  }, 10);
};

// allow going fullscreen with F key
window.addEventListener("keypress", function(e) {
  if (e.key !== "f") return;
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
}, false);


// hide cursor after no mouse movement for two seconds; show after movement
let cursorHidden = false;
let hideCursorTimeoutId = null;
const hideCursor = n => n.style.setProperty("cursor", "none", "important");
const showCursor = n => n.style.setProperty("cursor", "default");
const hideCursorNodes = [
  document.body,
  document.getElementById("game"),
  document.getElementById("minimap"),
];
const handleCursorHide = () => {
  if (hideCursorTimeoutId) clearTimeout(hideCursorTimeoutId);
  if (cursorHidden) {
    hideCursorNodes.forEach(n => showCursor(n));
    cursorHidden = false;
  }
  hideCursorTimeoutId = setTimeout(() => {
    if (cursorHidden) return;
    hideCursorNodes.forEach(n => hideCursor(n));
    cursorHidden = true;
  }, 2000);
};
// Disabled since mouse cursor is being used to aim now
// window.addEventListener("mousemove", handleCursorHide);
// setTimeout(handleCursorHide, 2000);

export const clearMinimap = () => {
  const canvas = document.getElementById("minimap");
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
}