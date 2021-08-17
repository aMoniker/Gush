import { k } from "/kaboom.js";

const handleFloorTrap = (player, trap) => {
  const trapDmg = 1;
  const springDelay = 0.5;
  const retractDelay = 2;
  const rearmDelay = 1;

  if (trap.sprung) { // player walked into already sprung trap
    player.hurt(trapDmg, trap);
    return;
  }

  if (!trap.canSpring) return; // trap hasn't finished re-spring timeout yet
  if (player.dead) return;
  
  // spring the trap, then retract, then rearm
  trap.sprung = true;
  trap.canSpring = false;
  k.wait(springDelay, () => {
    trap.play("trap_sprung", false);
    if (!trap.hidden) {
      k.play("trap-spring", {
        loop: false,
        volume: 0.33,
      });
    }
    if (trap.isOverlapped(player)) player.hurt(trapDmg, trap);
    k.wait(retractDelay, () => {
      trap.play("trap_reset", false);
      if (!trap.hidden) {
        k.play("trap-spring", {
          loop: false,
          volume: 0.22,
          detune: 500,
        });
      }
      trap.sprung = false;
      k.wait(rearmDelay, () => {
        trap.canSpring = true;
        if (trap.isOverlapped(player)) setTimeout(() => handleFloorTrap(player, trap));
      });
    });
  });
};

export default () => {
  k.overlaps("player", "floor_trap", handleFloorTrap);
}