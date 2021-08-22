import { k } from "/kaboom.js";
import { config } from "/config.js"
import { translateWorldToMapCoords } from "/levels/spatial.js";
import state from "/state.js"

const debugShowFps = () => {
  const fpsText = k.add([
    k.text("", 8),
    k.pos(0, 0),
    k.layer("ui"),
  ]);
  fpsText.action(() => {
    fpsText.text = `${k.debug.fps()} fps`;
  });
};

const canvas = document.getElementById("game");

const debugShowPlayerMapCoords = () => {
  const mapCoordsText = k.add([
    k.text("", 8),
    k.pos(60, 0),
    k.layer("ui"),
  ]);
  mapCoordsText.action(() => {
    if (!state.player) return;
    const {x,y} = translateWorldToMapCoords(state.player.pos.x, state.player.pos.y);
    mapCoordsText.text = `tile ${x}, ${y}`;
  });
};

export const enableDebugDisplay = () => {
  debugShowFps();
  debugShowPlayerMapCoords();
}