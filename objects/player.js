import { k } from "/kaboom.js";
import { config } from "/config.js";
import { uiUpdateHealth, uiUpdateBurps, uiUpdateCoins } from "/ui.js";
import { createBow } from "/objects/weapons/bow.js";
import { createSword } from "/objects/weapons/sword.js";
import { createSpear } from "/objects/weapons/spear.js";
import { createCleaver } from "/objects/weapons/cleaver.js";
import { createHammer } from "/objects/weapons/hammer.js";
import { createFireStaff } from "/objects/weapons/fire-staff.js";
import { createLaserStaff } from "/objects/weapons/laser-staff.js";
import { fadeToScene, flashColor, tween, easing, rng } from "/utils.js";
import { coordsInBbox, getRenderedMapBbox } from "/levels/spatial.js";
import state from "/state.js";
import music from "/music.js";
import input, { vibrateGamepad } from "/input.js";

import hp from "/components/hp.js";
import burp from "/components/burp.js";

const playerType = {
  knight: {
    hp: 8,
    createWeapon: createSword,
    flipDuringAttack: false,
    attackWithStick: false,
    holdToAttack: false,
    hurtSound: "male-grunt-5",
  },
  elf_f: {
    hp: 6,
    createWeapon: createBow,
    flipDuringAttack: true,
    attackWithStick: true,
    holdToAttack: true,
    hurtSound: "female-grunt-7",
  },
  elf_m: {
    hp: 6,
    createWeapon: createSpear,
    flipDuringAttack: false,
    attackWithStick: false,
    holdToAttack: false,
    hurtSound: "male-grunt-5",
  },
  lizard_f: {
    hp: 6,
    createWeapon: createCleaver,
    flipDuringAttack: true,
    attackWithStick: true,
    holdToAttack: true,
    hurtSound: "female-grunt-7",
  },
  lizard_m: {
    hp: 8,
    createWeapon: createHammer,
    flipDuringAttack: false,
    attackWithStick: false,
    holdToAttack: false,
    hurtSound: "male-grunt-5",
  },
  wizard_f: {
    hp: 4,
    createWeapon: createFireStaff,
    flipDuringAttack: true,
    attackWithStick: true,
    holdToAttack: true,
    hurtSound: "female-grunt-7",
  },
  wizard_m: {
    hp: 2,
    createWeapon: createLaserStaff,
    flipDuringAttack: true,
    attackWithStick: true,
    holdToAttack: true,
    hurtSound: "male-grunt-5",
  }
};

/**
 * Add a new player to the game. There can only be one at a time.
 * types: elf_f, elf_m, knight, lizard_f, lizard_m, wizard_f, wizard_m
 */
export const createPlayer = (typeName, attrs, options) => {
  const type = playerType[typeName];

  const player = k.add([
    k.origin("center"),
    k.sprite(typeName, { animSpeed: 0.3, noArea: true }),
    k.area(k.vec2(-5, 0), k.vec2(5, 12)),
    k.layer("game"),
    k.scale(1),
    k.color(1, 1, 1, 1),
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
      hitFake: false,      // same animation, but no side-effects
      invulnerable: false, // player is temporarily invulnerable after being hit
    },
    hp({ 
      max: type.hp,
      current: options.hp ?? type.hp,
      currentShield: options.shields ?? 0,
      showHealthBar: false,
      heartbeat: true,
    }),
    burp({ current: options.burps ?? 0 }),
    ...(attrs ?? []),
  ]);

  const weapon = type.createWeapon(player);

  let timeoutZeroDirX = 0;
  let timeoutZeroDirY = 0;
  const diagonalGraceTime = 50;
  let lastInputX = 0;
  let lastInputY = 0;
  const handleMovementInput = () => {
    if (player.forcedMoving || player.dead) return;
    if (input.x === 0 && input.y === 0) timeSinceFootstep = 0;
    player.moving = input.x !== 0 || input.y !== 0;

    if (type.attackWithStick && (input.x2 || input.y2)) {
      // if the second stick is being used, then set the attackDir equal to it
      const aim = k.vec2(input.x2, input.y2).unit();
      player.dirAttack.x = aim.x;
      player.dirAttack.y = aim.y;
    } else if (input.y === 0 && input.x !== 0 && (lastInputY === 1 || lastInputY === -1)) {
      // allow player to release one key of a diagonal slightly before the other,
      // while remaining pointed in that direction for attacks
      window.clearTimeout(timeoutZeroDirY);
      timeoutZeroDirY = setTimeout(() => {
        if (player.moving && player.dir.x !== 0) player.dirAttack.y = 0;
      }, diagonalGraceTime);
    } else if (input.x === 0 && input.y !== 0 && (lastInputX === 1 || lastInputX === -1)) {
      // allow player to release one key of a diagonal slightly before the other,
      // while remaining pointed in that direction for attacks
      window.clearTimeout(timeoutZeroDirX);
      timeoutZeroDirX = setTimeout(() => {
        if (player.moving && player.dir.y !== 0) player.dirAttack.x = 0;
      }, diagonalGraceTime);
    } else if (player.moving) {
      // when moving, keep the attack dir updated
      player.dirAttack.x = input.x;
      player.dirAttack.y = input.y;
    }

    lastInputX = input.x;
    lastInputY = input.y;

    // scale keyboard diagonals to match gamepad stick
    let { x, y } = input;
    if (Math.abs(input.x) === 1 && Math.abs(input.y) === 1) {
      const scaled = k.vec2(input.x, input.y).unit();
      x = scaled.x;
      y = scaled.y;
    }

    player.dir.x = x;
    player.dir.y = y;
  };

  let canBurp = true;
  let canAttack = true;
  const handleAttack = () => {
    if (player.dead) return;
    // allow attacking with the attack button, or if the second stick is used
    // const shouldAttack = canAttack && (input.attack || (input.x2 || input.y2));
    const shouldAttack = canAttack && (
      input.attack || (type.attackWithStick && input.stickAttack)
    );
    if (shouldAttack) {
      if (!player.forcedMoving && type.flipDuringAttack) {
        player.xFlipped = player.dirAttack.x < 0;
        player.flipX(player.xFlipped);
      }
      weapon.attack();
      if (!type.holdToAttack) canAttack = false;
    } else if (!input.attack) {
      canAttack = true;
    }
    if (canBurp && input.burp) {
      player.burp();
      canBurp = false;
    } else if (!input.burp) {
      canBurp = true;
    }
  }

  const handleAnimation = () => {
    if (player.dead) {
      player.play("hit");
      return;
    }
    const anim = player.curAnim();
    if (player.hit || player.hitFake || player.burping) {
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

  const footstepTime = 0.39;
  let footstepFlip = false;
  let timeSinceFootstep = 0;
  const handleMoving = () => {
    if (player.dead) return;
    if (!player.moving && !player.forcedMoving) return;
    if (!player.forcedMoving && !(weapon.attacking && !type.flipDuringAttack)) {
      if (player.dirAttack.x !== 0) {
        player.xFlipped = player.dirAttack.x < 0;
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
    if (!state.forcedCam) {
      const scale = k.width() / config.viewableWidth;
      k.camScale(scale);
      k.camPos(player.pos);
    }
    // readd the player each frame, so it's always on top
    k.readd(player);
    k.readd(weapon);
  };
  
  // main player loop
  player.action(() => {
    handleMovementInput();
    handleMoving();
    handleAttack();
    handleAnimation();
    handleCamera();
    if (!player.dead) {
      weapon.updatePosition();
      player.pushOutAll();
    }
  });

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
    const invulnerbilityTime = 0.5;

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
    flashColor(player, [1, 0, 0, 1], hitReactionTime);
    flashColor(weapon, [1, 0, 0, 1], hitReactionTime);

    // oof
    k.play("punch-squelch-heavy", {
      loop: false,
      volume: 0.43,
      detune: -100,
    });
    k.play(type.hurtSound, {
      loop: false,
      volume: 0.53,
      detune: k.map(rng.gen(), 0, 1, -200, 100),
    });
    vibrateGamepad(444, 0, 1);


    // clear all the hit effects
    k.wait(hitReactionTime, () => {
      player.hit = false;
      player.forcedMoving = false;
      player.dir.x = 0;
      player.dir.y = 0;
    });

    k.wait(invulnerbilityTime, () => {
      player.invulnerable = false;
    });

    updatePlayerUI();
  });

  // womp womp
  player.on("death", (killedBy) => {
    let slapFromPos = null;
    if (killedBy && killedBy.pos) {
      slapFromPos = killedBy.pos
    } else {
      slapFromPos = player.pos.clone();
    }
    const playerSlapDir = player.pos.sub(slapFromPos).unit();
    const weaponSlapDir = weapon.pos.sub(slapFromPos).unit();

    k.play("punch-intense-heavy", { volume: 0.86 });
    k.wait(0.8, () => k.play("implode"));
    vibrateGamepad(1000, 1, 1);
    setTimeout(() => vibrateGamepad(1337, 1, 0), 1000);

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
        const clearRestart = k.action(() => {
          if (input.attack) {
            clearRestart();
            state.player = undefined; // don't carry over hp/shields/burps
            fadeToScene("main");
            vibrateGamepad(100, 1, 0);
          }
        });
        k.add([
          k.text("Press ATTACK to restart level", 24),
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

  state.player = player;
  return player;
};