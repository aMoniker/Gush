import { k } from "/kaboom.js";

const handleFloorTrap = (player, trap) => {
  const trapDmg = 1;
  const springDelay = 1;
  const retractDelay = 3;
  const rearmDelay = 2;

  if (trap.sprung) { // player walked into already sprung trap
    player.hurt(trapDmg, trap);
    return;
  }

  if (!trap.canSpring) return; // trap hasn't finished re-spring timeout yet
  
  // spring the trap, then retract, then rearm
  trap.sprung = true;
  trap.canSpring = false;
  k.wait(springDelay, () => {
    trap.play("trap_sprung", false);
    if (trap.isOverlapped(player)) player.hurt(trapDmg, trap);
    k.wait(retractDelay, () => {
      trap.play("trap_reset", false);
      trap.sprung = false;
      k.wait(rearmDelay, () => {
        trap.canSpring = true;
        if (trap.isOverlapped(player)) setTimeout(() => handleFloorTrap(player, trap));
      });
    });
  });
};

const handleMonsterCollision = (player, monster) => {
  player.hurt(1, monster); // TODO - make this depend on monster?
};

export const addEvents = () => {
  k.overlaps("player", "floor_trap", handleFloorTrap);
  k.collides("player", "monster", handleMonsterCollision);
};