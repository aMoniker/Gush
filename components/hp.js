export default (options) => {
  let currentHp = options.current;
  const maxHp = options.max ?? currentHp;
  if (currentHp > maxHp) currentHp = maxHp;

  return {
    id: "hp",
    require: ["killable"],
    dead: false,
    hurt(x, hurtBy) {
      const amt = x ?? 1;
      currentHp -= amt;
      if (currentHp <= 0) {
        this.dead = true;
        this.trigger("death", hurtBy);
      } else {
        this.trigger("hurt", amt, hurtBy);
      }
    },
    heal(x, healedBy) {
      const amt = x ?? 1;
      currentHp = Math.min(currentHp + amt, maxHp);
      this.trigger("heal", amt, healedBy);
    },
    hp() { return currentHp; },
    maxHp() { return maxHp; },
  };
}