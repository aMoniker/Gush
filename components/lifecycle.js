import { k } from "/kaboom.js";

// options may contain `onAdd`/`onUpdate`/`onDestroy`
// functions which will be called during those events
// and passed the game object
export default (options) => {
  const component = {
    id: "lifecycle",
    require: [],
  };

  // add lifecycle methods conditionally so empty ones
  // don't get called unnecessarily
  // setTimeout is necessary to avoid an infinite loop,
  // which happens for direct calls for some reason...
  if (options.onAdd) {
    // called when object added to scene.
    component.add = function() {
      setTimeout(() => options.onAdd(this), 0);
    };
  }
  if (options.onUpdate) {
    // called every frame
    component.update = function() {
      setTimeout(() => options.onUpdate(this), 0);
    }
  }
  if (options.onDestroy) {
    // called when the object is destroyed
    component.destroy = function() {
      setTimeout(() => options.onDestroy(this), 0);
    }
  }

  return component;
}