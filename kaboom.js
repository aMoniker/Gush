// TODO - ensure the canvas starts with the largest size possible
//        while maintaining the renderedAspectRatio

export const kaboomOptions = {
  fullscreen: true,
  canvas: document.getElementById("game"),
  // width: 240,
  // height: 240,
  scale: 1,
  version: "0.6.0",
  global: false,
  clearColor: [0, 0, 0, 1],
  crisp: true,
  debug: true,
};

export const k = kaboom(kaboomOptions);