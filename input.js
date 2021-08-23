import { k } from "/kaboom.js";
import state from "/state.js";

const input = {
  // first stick
  x: 0,
  y: 0,
  // second stick
  x2: 0,
  y2: 0,
  stickAttack: false,
  // actions
  burp: false,
  attack: false,
  // gamepad state
  gamepadConnected: false,  
};
export default input;

const handleGamepadConnected = (e) => {
  input.gamepadConnected = true;
  gamepadIndex = e.gamepad.index;
};
const handleGamepadDisconnected = (e) => {
  input.gamepadConnected = false;
  gamepadIndex = null;
};

let gamepadIndex = null;
window.addEventListener("gamepadconnected", handleGamepadConnected);
window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);

const getGamepad = () => {
  if (!input.gamepadConnected || gamepadIndex === null) return null;
  let gamepads = [];
  if (navigator.getGamepads) {
    gamepads = navigator.getGamepads();
  } else if (navigator.webkitGetGamepads) {
    gamepads = navigator.webkitGetGamepads();
  }
  return gamepads[gamepadIndex];
};

export const vibrateGamepad = (duration, weakMagnitude, strongMagnitude, startDelay = 0) => {
  const gp = getGamepad();
  if (!gp || !gp.vibrationActuator) return;
  const type = gp.vibrationActuator.type;
  if (!type) return;
  gp.vibrationActuator.playEffect(type, {
    startDelay,
    duration,
    weakMagnitude,
    strongMagnitude,
  });
}

let gamepadMoving = false;
let gamepadAiming = false;
let gamepadAttacking = false;
let gamepadBurping = false;
const gamepadDeadzone = 0.2;
const handleGamepad = () => {
  const gp = getGamepad();
  if (!gp) return;

  // left analog stick for moving
  let stickOneMagnitude = 0;
  if (gp.axes[0] || gp.axes[1]) {
    stickOneMagnitude = Math.sqrt(gp.axes[0]**2 + gp.axes[1]**2);
  }
  if (stickOneMagnitude >= gamepadDeadzone) {
    gamepadMoving = true;
    input.x = gp.axes[0];
    input.y = gp.axes[1];
  } else if (gamepadMoving) {
    gamepadMoving = false;
    input.x = 0;
    input.y = 0;
  }

  // attack and burp buttons
  if (gp.buttons[0] && gp.buttons[0].pressed) {
    input.attack = true;
    gamepadAttacking = true;
  } else if (gamepadAttacking) {
    input.attack = false;
    gamepadAttacking = false;
  }
  if (gp.buttons[1] && gp.buttons[1].pressed) {
    input.burp = true;
    gamepadBurping = true;
  } else if (gamepadBurping) {
    input.burp = false;
    gamepadBurping = false;
  }

  // right analog stick for aiming/shooting
  let stickTwoMagnitude = 0;
  if (gp.axes[2] || gp.axes[3]) {
    stickTwoMagnitude = Math.sqrt(gp.axes[2]**2 + gp.axes[3]**2);
  }
  if (stickTwoMagnitude >= gamepadDeadzone) {
    gamepadAiming = true;
    input.x2 = gp.axes[2];
    input.y2 = gp.axes[3];
    input.stickAttack = true;
  } else if (gamepadAiming) {
    gamepadAiming = false;
    input.x2 = 0;
    input.y2 = 0;
    input.stickAttack = false;
  }
};

const handleMouseDown = (e) => {
  if (e.button === 0) { // left click
    input.attack = true;
  } else if (e.button === 2) { // right click
    input.burp = true;
  }
}
const handleMouseUp = (e) => {
  if (e.button === 0) {
    input.attack = false;
  } else if (e.button === 2) {
    input.burp = false;
  }
}


let lastMouseX = null;
let lastMouseY = null;

let cancelMouseAimingTimeout = 0;
const cancelMouseAiming = () => {
  if (input.x2 === lastMouseX && input.y2 === lastMouseY) {
    input.x2 = 0;
    input.y2 = 0;
  }
};

const handleMouseMove = (e) => {
  clearTimeout(cancelMouseAimingTimeout);
  const center = k.vec2(document.body.offsetWidth / 2, document.body.offsetHeight / 2);
  const mouse = k.vec2(e.clientX, e.clientY);
  const aim = mouse.sub(center).unit();
  input.x2 = aim.x;
  input.y2 = aim.y;
  lastMouseX = aim.x;
  lastMouseY = aim.y;
  // if the mouse hasn't moved in a while, revert to keyboard aiming
  cancelMouseAimingTimeout = setTimeout(cancelMouseAiming, 5555);
};
const handleContextMenu = (e) => {
  e.preventDefault(); // prevent contextmenu so we can use right-click for burp
}
const handleMouseLeave = (e) => {
  // when the mouse leaves the page, revert to keyboard aiming
  input.x2 = 0;
  input.y2 = 0;
};


let cancelAll = null;
let listenerCancelers = [];
export const enableInputListeners = () => {
  // cancel all previous listeners before attaching new ones
  if (cancelAll) cancelAll();

  const keys = {
    keyUse: null,
    keyBurp: null,
    keyAttack: null,
    keyUp: null,
    keyDown: null,
    keyLeft: null,
    keyRight: null,
  };
  Object.keys(keys).forEach(k => keys[k] = state.get(k));

  // keyboard
  listenerCancelers.push(k.keyDown(keys.keyUp, () => input.y = -1));
  listenerCancelers.push(k.keyRelease(keys.keyUp, () => input.y = 0));
  listenerCancelers.push(k.keyDown("up", () => input.y = -1));
  listenerCancelers.push(k.keyRelease("up", () => input.y = 0));

  listenerCancelers.push(k.keyDown(keys.keyDown, () => input.y = 1));
  listenerCancelers.push(k.keyRelease(keys.keyDown, () => input.y = 0));
  listenerCancelers.push(k.keyDown("down", () => input.y = 1));
  listenerCancelers.push(k.keyRelease("down", () => input.y = 0));

  listenerCancelers.push(k.keyDown(keys.keyLeft, () => input.x = -1));
  listenerCancelers.push(k.keyRelease(keys.keyLeft, () => input.x = 0));
  listenerCancelers.push(k.keyDown("left", () => input.x = -1));
  listenerCancelers.push(k.keyRelease("left", () => input.x = 0));

  listenerCancelers.push(k.keyDown(keys.keyRight, () => input.x = 1));
  listenerCancelers.push(k.keyRelease(keys.keyRight, () => input.x = 0));
  listenerCancelers.push(k.keyDown("right", () => input.x = 1));
  listenerCancelers.push(k.keyRelease("right", () => input.x = 0));

  listenerCancelers.push(k.keyDown(keys.keyAttack, () => input.attack = true));
  listenerCancelers.push(k.keyRelease(keys.keyAttack, () => input.attack = false));

  listenerCancelers.push(k.keyDown(keys.keyBurp, () => input.burp = true));
  listenerCancelers.push(k.keyRelease(keys.keyBurp, () => input.burp = false));

  listenerCancelers.push(k.keyDown(keys.keyUse, () => input.use = true));
  listenerCancelers.push(k.keyRelease(keys.keyUse, () => input.use = false));

  // gamepad
  listenerCancelers.push(k.action(handleGamepad));
  window.addEventListener("gamepadconnected", handleGamepadConnected);
  window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);

  // mouse
  window.addEventListener("mousedown", handleMouseDown);
  window.addEventListener("mouseup", handleMouseUp);
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("contextmenu", handleContextMenu);
  document.addEventListener("mouseleave", handleMouseLeave);

  // cancel function
  cancelAll = () => {
    listenerCancelers.forEach(fn => fn());
    listenerCancelers = [];
    window.removeEventListener("gamepadconnected", handleGamepadConnected);
    window.removeEventListener("gamepaddisconnected", handleGamepadDisconnected);
    window.removeEventListener("mousedown", handleMouseDown);
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("contextmenu", handleContextMenu);
    document.removeEventListener("mouseleave", handleMouseLeave);
  };
};