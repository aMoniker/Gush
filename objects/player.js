import { k } from "/kaboom.js";
import { config } from "/config.js";
import { uiUpdateHealth, uiUpdateBurps, uiUpdateCoins } from "/ui.js";
import { createBow } from "/objects/weapons/bow.js";
import { createSword } from "/objects/weapons/sword.js";
import { tween, easing, rng } from "/utils.js";
import { coordsInBbox, getRenderedMapBbox } from "/levels/spatial.js";
import state from "/state.js";
import music from "/music.js";

import hp from "/components/hp.js";
import burp from "/components/burp.js";

// https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API

// TODO - make these configurable
const burpKey = "b";
const weaponKey = "space";
const moveUpKey = "w";
const moveDownKey = "s";
const moveLeftKey = "a";
const moveRightKey = "d";

const playerType = {
  knight: {
    hp: 6,
    createWeapon: createSword,
    flipDuringAttack: false,
    holdToAttack: false,
  },
  elf_f: {
    hp: 4,
    createWeapon: createBow,
    flipDuringAttack: true,
    holdToAttack: true,
  }
};

/**
 * Add a new player to the game. There can only be one at a time.
 * types: elf_f, elf_m, knight, lizard_f, lizard_m, wizard_f, wizard_m
 */
export const createPlayer = (typeName, attrs) => {
  const type = playerType[typeName];

  const player = k.add([
    k.origin("center"),
    k.sprite(typeName, { animSpeed: 0.3, noArea: true }),
    k.area(k.vec2(-5, 0), k.vec2(5, 12)),
    k.layer("game"),
    "player",
    "killable",
    {
      dir: k.vec2(0, 0),   // which direction the player is moving
      dirAttack: k.vec2(1, 0), // which direction the player is attacking
      speed: 77,           // how fast the player moves
      xFlipped: false,     // determines which way the player/weapon are facing
      moving: false,       // when true, move player in dir by speed
      forcedMoving: false, // when true, ignore input and move player in dir
      hit: false,          // animation for hit & temporary loss of control
      invulnerable: false, // player is temporarily invulnerable after being hit
    },
    hp({ 
      max: type.hp,
      current: type.hp,
    }),
    burp({ current: 0 }),
    ...(attrs ?? []),
  ]);

  // attack keys
  // const weapon = createSword(player);
  const weapon = type.createWeapon(player);

  const attackKeyEvent = type.holdToAttack ? k.keyDown : k.keyPress;
  attackKeyEvent(weaponKey, () => {
    if (player.dead) return;
    weapon.attack();
  });
  k.keyPress(burpKey, player.burp);

  const handleAnimation = () => {
    if (player.dead) {
      player.play("hit");
      return;
    }
    const anim = player.curAnim();
    if (player.hit || player.burping) {
      if (anim !== "hit") {
        const hitTime = 0.5;
        player.play("hit");
        player.animSpeed = hitTime;
        k.wait(hitTime, () => player.hit = false);
      }
    } else if (player.moving) {
      if (anim !== "run") {
        player.play("run");
        player.animSpeed = 0.1;
      }
    } else if (anim !== "idle") {
      player.play("idle");
      player.animSpeed = 0.3;
    }
  };

  const footstepTime = 0.38;
  let footstepFlip = false;
  let timeSinceFootstep = 0;
  const handleMoving = () => {
    if (player.dead) return;
    if (!player.moving && !player.forcedMoving) return;
    if (!player.forcedMoving
     && !(!type.flipDuringAttack && weapon.attacking)
    ) {
      if (player.dir.x !== 0) {
        player.xFlipped = player.dir.x < 0;
      }
      player.flipX(player.xFlipped);
    }
    player.pos = player.pos.add(player.dir.scale(player.speed * k.dt()));
    timeSinceFootstep += k.dt();
    if (timeSinceFootstep > footstepTime) {
      timeSinceFootstep = 0;
      const footstepSound = `footstep-armor-${footstepFlip ? 1 : 2}`
      k.play(footstepSound, {
        speed: 2.5,
        volume: footstepFlip ? 0.05 : 0.1,
        detune: k.map(rng.gen(), 0, 1, -250, 250),
      });
      footstepFlip = !footstepFlip;
    }
  };

  const handleCamera = () => {
    const scale = k.width() / config.viewableWidth;
    k.camScale(scale);
    k.camPos(player.pos);
    // readd the player each frame, so it's always on top
    k.readd(player);
    k.readd(weapon);
  };

  player.action(() => {
    handleMoving();
    handleAnimation();
    handleCamera();
    if (!player.dead) {
      weapon.updatePosition();
      player.pushOutAll();
    }
  });


  let timeoutZeroDirX = 0;
  let timeoutZeroDirY = 0;
  const diagonalGraceTime = 50;
  const controlMoving = (dir, moving) => {
    if (player.forcedMoving) return;
    player.dir.x = dir.x ?? player.dir.x;
    player.dir.y = dir.y ?? player.dir.y;
    if (player.dir.x === 0 && player.dir.y === 0) timeSinceFootstep = 0;

    if (moving) {
      if (player.dir.x !== 0) player.dirAttack.x = player.dir.x;
      if (player.dir.y !== 0) player.dirAttack.y = player.dir.y;
    } else {
      // special handling for diagonal movement - don't zero out
      // immediately when player releases one key of a diagonal
      // this allow dirAttack to remain diagonal when releasing
      // both keys within diagonalGraceTime of each other
      if (player.dir.x === 0) {
        window.clearTimeout(timeoutZeroDirX);
        timeoutZeroDirX = setTimeout(() => {
          if (player.moving && player.dir.y !== 0) player.dirAttack.x = 0
        }, diagonalGraceTime);
      }
      if (player.dir.y === 0) {
        window.clearTimeout(timeoutZeroDirY);
        timeoutZeroDirY = setTimeout(() => {
          if (player.moving && player.dir.x !== 0) player.dirAttack.y = 0;
        }, diagonalGraceTime);
      }
    }

    player.moving = moving;
  };
  

  // movement keys
  k.keyDown(moveUpKey, () => controlMoving({ y: -1 }, true));
  k.keyRelease(moveUpKey, () => controlMoving({ y: 0 }, false));
  k.keyDown(moveDownKey, () => controlMoving({ y: 1 }, true));
  k.keyRelease(moveDownKey, () => controlMoving({ y: 0 }, false));
  k.keyDown(moveLeftKey, () => controlMoving({ x: -1 }, true));
  k.keyRelease(moveLeftKey, () => controlMoving({ x: 0 }, false));
  k.keyDown(moveRightKey, () => controlMoving({ x: 1 }, true));
  k.keyRelease(moveRightKey, () => controlMoving({ x: 0 }, false));

  const updatePlayerUI = () => {
    uiUpdateBurps(player.burps());
    uiUpdateHealth(player.hp(), player.maxHp(), player.shields());
    uiUpdateCoins(state.get("coins"));
  };

  player.on("burped", updatePlayerUI);
  player.on("burps-added", updatePlayerUI);
  player.on("shielded", () => updatePlayerUI());
  player.on("heal", updatePlayerUI);

  player.on("hurt", (amt, hurtBy) => {
    if (player.invulnerable) return;

    const hitReactionTime = 0.33;
    const invulnerbilityTime = 1;

    // push the player in the opposite direction if they ran into something solid
    if (hurtBy.solid) {
      player.moving = false;
      player.forcedMoving = true;
      player.dir = player.pos.sub(hurtBy.pos).unit();
    }

    // temporary invulnerability on hit
    player.hit = true;
    player.invulnerable = true;

    // paint the player & weapon red if any dmg was taken
    if (!player.color) player.use(k.color(1, 0, 0, 1));
    if (!weapon.color) weapon.use(k.color(1, 0, 0, 1));

    // oof
    k.play("punch-squelch-heavy", {
      loop: false,
      volume: 0.53,
      detune: -100,
    });

    // clear all the hit effects
    k.wait(hitReactionTime, () => {
      player.hit = false;
      player.forcedMoving = false;
      player.dir.x = 0;
      player.dir.y = 0;
      player.color = undefined;
      weapon.color = undefined;
    });

    k.wait(invulnerbilityTime, () => {
      player.invulnerable = false;
    });

    updatePlayerUI();
  });

  // womp womp
  player.on("death", (killedBy) => {
    const playerSlapDir = player.pos.sub(killedBy.pos).unit();
    const weaponSlapDir = weapon.pos.sub(killedBy.pos).unit();

    k.play("punch-intense-heavy", { volume: 0.86 });
    k.wait(0.8, () => k.play("implode"));

    music.fadeOut();

    player.angle ?? player.use(k.rotate(0));
    Promise.all([
      tween(player, 1, {
        "pos.x": player.pos.x + playerSlapDir.x * config.tileWidth,
        "pos.y": player.pos.y + playerSlapDir.y * config.tileHeight,
        "angle": Math.PI / 2,
      }, easing.easeOutQuart),
      tween(weapon, 1, {
        "pos.x": weapon.pos.x + weaponSlapDir.x * (config.tileWidth * 4.44),
        "pos.y": weapon.pos.y + weaponSlapDir.y * (config.tileHeight * 4.44),
        "angle": weapon.angle + Math.PI * 3,
      }, easing.easeOutQuart),
    ]).then(() => {
      const youDied = k.add([
        k.text("YOU DIED", 32),
        k.origin("center"),
        k.pos(k.width() / 2, k.height() / 2),
        k.layer("ui"),
        k.scale(1),
        k.color(1, 0, 0, 0),
      ]);
      tween(youDied, 4, {
        "scale.x": 2.5,
        "scale.y": 2.5,
        "color.a": 1,
      }, easing.easeOutQuart).then(() => {
        k.keyPress("r", () => {
          k.go("main");
        });
        k.add([
          k.text("Press R to restart level", 24),
          k.origin("center"),
          k.pos(k.width() / 2, k.height() / 2 + 60),
          k.layer("ui"),
        ]);
      });
    });

    updatePlayerUI();
  });

  // initialize UI
  updatePlayerUI();

  return player;
};