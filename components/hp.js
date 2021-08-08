export default (options) => {
  let currentHp = options.current;
  const maxHp = options.max ?? currentHp;
  if (currentHp > maxHp) currentHp = maxHp;

  return {
    id: "hp",
    require: ["killable"],
    hurt(x, hurtBy) {
      const amt = x ?? 1;
      currentHp -= amt;
      this.trigger("hurt", amt, hurtBy);
      if (currentHp <= 0) this.trigger("death");
    },
    heal(x, healedBy) {
      const amt = x ?? 1;
      currentHp = Math.min(currentHp + amt, maxHp);
      this.trigger("heal", amt);
    },
    hp() { return currentHp; },
    maxHp() { return maxHp; },
  };
}