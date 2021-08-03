import { k } from "/kaboom.js"

// https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API

export const player = k.add([
  k.sprite("wizard_m", { animSpeed: 0.3 }),
  k.pos(100, 100),
  "player",
  "killable",
  {
    dir: k.vec2(0,0),
    speed: 100,
    moving: false,
    hit: false,
    canBurp: true,
  }
]);

const handleAnimation = () => {
  const anim = player.curAnim();
  if (player.hit) {
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

const handleMoving = () => {
  if (player.moving) {
    player.flipX(player.dir.x < 0);
    player.move(player.dir.scale(player.speed));
  }
};

export const addPlayerActions = () => {
  player.action(() => {
    handleMoving();
    handleAnimation();
  });
};

export const addPlayerControls = () => {
  k.keyPress("b", () => {
    if (!player.canBurp) return;
    player.canBurp = false;
    player.hit = true;
    k.burp();
    k.camShake(1);
    k.wait(0.5, () => player.canBurp = true);
  });

  k.keyDown("w", () => {
    player.dir.y = -1;
    player.moving = true;
  });
  k.keyRelease("w", () => {
    player.dir.y = 0;
    player.moving = false;
  });

  k.keyDown("a", () => {
    player.dir.x = -1;
    player.moving = true;
  });
  k.keyRelease("a", () => {
    player.dir.x = 0;
    player.moving = false;
  });

  k.keyDown("s", () => {
    player.dir.y = 1;
    player.moving = true;
  });
  k.keyRelease("s", () => {
    player.dir.y = 0;
    player.moving = false;
  });

  k.keyDown("d", () => {
    player.dir.x = 1;
    player.moving = true;
  });
  k.keyRelease("d", () => {
    player.dir.x = 0;
    player.moving = false;
  });
};

export const initPlayer = () => {
  addPlayerControls();
  addPlayerActions();
  k.readd(player);
}