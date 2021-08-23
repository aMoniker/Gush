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
  // saving the existing* functions and call()ing them
  // allows us to stack lifecycle components when assembling configs
  if (options.onAdd) {
    // called when object added to scene.
    const existingAdd = component.add; // this might not be necessary
    component.add = function() {
      setTimeout(() => {
        if (existingAdd) existingAdd.call(this);
        options.onAdd(this);
      }, 0);
    };
  }
  if (options.onUpdate) {
    // called every frame
    const existingUpdate = component.update;
    component.update = function() {
      setTimeout(() => {
        if (existingUpdate) existingUpdate.call(this);
        options.onUpdate(this);
      }, 0);
    }
  }
  if (options.onDestroy) {
    // called when the object is destroyed
    const existingDestroy = component.destroy;
    component.destroy = function() {
      setTimeout(() => {
        if (existingDestroy) existingDestroy.call(this);
        options.onDestroy(this);
      }, 0);
    }
  }

  return component;
}