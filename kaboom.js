export const kaboomOptions = {
  fullscreen: true,
  width: 240,
  height: 240,
  scale: 1,
  version: "0.6.0",
  global: false,
  clearColor: [0, 0, 0, 1],
  crisp: true,
  debug: true,
};

export const k = kaboom(kaboomOptions);

// when kaboom starts, the aspect ratio is locked to the screen size at that moment.
// if the window resizes, the best we can do is to scale while maintaining that ratio.
const c = document.getElementsByTagName("canvas");
if (c && c.length && c[0]) {
  const canvas = c[0];
  const ratio = canvas.clientWidth / canvas.clientHeight;

  // keep the canvas centered in its container
  canvas.parentNode.style.display = "flex";
  canvas.parentNode.style.alignItems = "center";
  canvas.parentNode.style.justifyContent = "center";

  // debounced resize
  let timeout = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      const {innerWidth,innerHeight} = window;
      const newRatio = innerWidth / innerHeight;
      if (newRatio > ratio) {
        // if it got wider, then the height is the limiter
        canvas.style.width = `${ratio * innerHeight}px`;
        canvas.style.height = `${innerHeight}px`;
      } else {
        // if it got taller, then the width is the limiter
        canvas.style.width = `${innerWidth}px`;
        canvas.style.height = `${innerWidth / ratio}px`;
      }
    }, 200);
  });
}