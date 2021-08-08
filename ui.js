import { k } from "/kaboom.js";

let hearts = [];
export const uiUpdateHealth = (curHp, maxHp) => {
  if (!hearts.length || !hearts[0].exists()) {
    for (let heart of hearts) {
      heart.destroy();
    }
    hearts = [];
    const scale = 2;
    const maxHearts = Math.ceil(maxHp / 2);
    for (let i = 0; i < maxHearts; i++) {
      hearts.push(k.add([
        k.sprite("ui_heart", { frame: 0 }),
        k.layer("ui"),
        k.pos(k.vec2(5 + (i * (17 * scale)), 5)),
        k.scale(scale),
      ]));
    }
  }
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
};