import { k } from "/kaboom.js";
import { tween, easing } from "/utils.js";

export default (options) => {
  return {
    id: "skull-dropper",
    require: ["monster"],
    add() { // called on component activation
      this.on("death", (killedBy) => {
        this.handleSkullDrop(killedBy);
      });
    },
    handleSkullDrop(killedBy) {
      let flipX = killedBy.pos.x - this.pos.x >= 0;
      const theSkull = k.add([
        k.sprite("skull", { noArea: true }),
        k.origin("center"),
        k.layer("game"),
        k.color(1,1,1,1),
        k.pos(this.pos.x, this.pos.y - (this.height / 2) + 5),
      ]);
      tween(theSkull, 0.66, { "pos.y": this.pos.y + (this.height / 2) - 5 }, easing.easeInBack)
        .then(() => k.wait(5))
        .then(() => tween(theSkull, 3, { "color.a": 0 }))
        .then(() => theSkull.destroy())
        ;
    },
  };
}