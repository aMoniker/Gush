import { k } from "/kaboom.js"

export const addEvents = () => {
  k.overlaps("player", "floor_trap", (p, ft) => {
    if (ft.sprung) {
      // hp damage here
      console.log('player walked into trap');
    } else if (ft.canSpring) {
      ft.sprung = true;
      ft.canSpring = false;
      k.wait(1, () => {
        ft.animSpeed = 0.1;
        ft.play("trap_sprung", false);
        if (ft.isOverlapped(p)) {
          // hp damage here
          console.log('player stood on trap');
        }
        k.wait(3, () => {
          ft.animSpeed = 0.3;
          ft.play("trap_reset", false);
          ft.sprung = false;
          k.wait(2, () => ft.canSpring = true);
        });
      });
    }
  });
};