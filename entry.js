import { k } from "/kaboom.js"
import { loadAssets } from "/assets/loader.js"
import { watchWindowResizing } from "/ui.js";
import "/scenes/index.js"; // initializes all scenes

(async function() {
  watchWindowResizing();
  await loadAssets();
  k.go("intro");
})();

// pause the game (events are still being listened to)
// k.debug.paused = true;

// show the bounding box of objects with area() and hover to inspect properties
// k.debug.inspect = true;

// scale the time
// k.debug.timeScale = 0.5;

// if 'true' show on screen logs
// k.debug.showLog = true;

// log stack count max
// k.debug.logMax = 6;

// get current fps
// k.debug.fps();

// get object count in the current scene
// k.debug.objCount();

// step to the next frame
// k.debug.stepFrame();

// clear log
// k.debug.clearLog();

// log an on screen message
// k.debug.log("oh hi");

// log an on screen error message
// k.debug.error("oh no");