import { k } from "/kaboom.js";
import { config } from "/config.js";
import { rng, tween, easing, fadeToScene } from "/utils.js";
import lifecycle from "/components/lifecycle.js";
import input, { enableInputListeners } from "/input.js";
import music from "/music.js";

const logoTimer = 1;
const inputTimer = 5;

const topLogoY = 66.6;
const logoTrails = 47;

const hw = config.gameWidth / 2;
const hh = config.gameHeight / 2;

const animateLogos = () => {
  const logos = [];

  for (let i = 0; i < logoTrails; i++) {
    const percent = (i / logoTrails);
    logos.push(k.add([
      k.sprite(i === 0 ? "gush-logo-outlined" : "gush-logo"),
      k.pos(hw, config.gameHeight + 99.9),
      k.origin("top"),
      k.scale(2.23),
      k.color(rng.gen(), rng.gen(), rng.gen(), 1 - percent),
    ]));
  }

  for (let i = logos.length - 1; i >= 0; i--) {
    k.readd(logos[i]);
  }

  const animateTime = 6.66;
  const logoThickness = 17;

  const promises = [];
  for (let i = 0; i < logos.length; i++) {
    const time = (i / logoTrails) * animateTime;
    promises.push(new Promise(resolve => {
      k.wait(time, () => {
        const pct = (i / logoTrails);
        logos[i].restingPosY = topLogoY + pct * logoThickness;
        tween(logos[i], animateTime, {
          "pos.y": logos[i].restingPosY,
          "color.r": 0.666,
          "color.g": 0,
          "color.b": 0,
          "color.a": 1 - pct,
        }, easing.easeInOutBack).then(resolve);
      })
    }));
  }

  Promise.all(promises).then(() => {
    let t = 0;
    const endVal = 17.7;
    // const timeToEndVal = 17.77;
    // const timeToEndVal = 13.37;
    const timeToEndVal = 1.337;
    k.action(() => {
      t += k.dt();
      const pct = Math.min(1, t / timeToEndVal);
      logos.forEach((logo, i) => {
        const sin = Math.sin(t + i / logos.length);
        logo.pos.y = logo.restingPosY - sin * pct * (endVal + i * 1);
        if (i !== 0) {
          const pi = i / logoTrails;
          const r = Math.sin(t + pi);
          const g = Math.cos(t + pi);
          const b = Math.tan(t + pi);
          logo.color.r = k.map(r * pct, -1, 1, 0.334, 1);
          logo.color.g = k.map(g, -1, 1, 0, 0.69420) * pct;
          logo.color.b = k.map(b, -1, 1, 0, 0.7784) * pct;
        }
      });
    });
  });
}

const charConfig = (spriteName, xPos) => ([
  k.sprite(spriteName, { flipX: xPos > 0 }),
  k.origin("center"),
  k.pos(xPos, hh),
  k.scale(3.33),
  lifecycle({
    onAdd: (c) => c.play("idle"),
  }),
]);

const animateCharacters = () => {
  const fromLeft = -33;
  const fromRight = config.gameWidth + 33;

  const knight = k.add(charConfig("knight", fromLeft));
  tween(knight, 5, { "pos.x": hw }, easing.linear);

  const widthSlice = config.gameWidth / 9;

  const shootiePie = k.add(charConfig("elf_f", fromLeft));
  k.wait(6, () => {
    knight.flipX(true);
    tween(shootiePie, 5, { "pos.x": hw - widthSlice });
  });

  const pokeyElf = k.add(charConfig("elf_m", fromRight));
  k.wait(7, () => {
    knight.flipX(false);
    tween(pokeyElf, 5, { "pos.x": hw + widthSlice });
  });

  const lizzyButch = k.add(charConfig("lizard_f", fromLeft));
  k.wait(8, () => {
    knight.flipX(true);
    tween(lizzyButch, 4, { "pos.x": hw - (widthSlice * 2) }, easing.easeOutQuint);
  });

  const smashyDino = k.add(charConfig("lizard_m", fromRight));
  k.wait(9, () => {
    knight.flipX(false);
    tween(smashyDino, 4, { "pos.x": hw + (widthSlice * 2) }, easing.easeOutQuint);
  });

  const burnyMage = k.add(charConfig("wizard_f", fromLeft));
  burnyMage.play("run");
  k.wait(9, () => {
    k.wait(1, () => {
      knight.flipX(true);
      knight.play("hit");
    });
    k.wait(1.5, () => knight.play("run"));
    tween(burnyMage, 4, { "pos.x": hw - (widthSlice * 3) }, easing.easeOutQuint)
      .then(() => burnyMage.play("idle"));
  });

  const lazerWizard = k.add(charConfig("wizard_m", fromRight));
  k.wait(10, () => {
    k.wait(1, () => {
      knight.flipX(false);
      knight.play("hit");
    });
    k.wait(1.5, () => knight.play("idle"));
    tween(lazerWizard, 4, { "pos.x": hw + (widthSlice * 3) }, easing.easeOutQuint)
      .then(() => lazerWizard.play("idle"));
  });

  const characters = [
    knight, shootiePie, pokeyElf, lizzyButch, smashyDino, burnyMage, lazerWizard
  ];

  k.wait(logoTimer * 1.1, () => {
    characters.forEach(c => k.readd(c));
  });

  k.wait(14, () => {
    k.loop(0.25, () => {
      const c = k.choose(characters);
      c.flipX(k.choose([true, false]));
      const r = rng.gen();
      if (r < 0.1) {
        c.play("hit");
        k.wait(1, () => c.play("idle"));
      } else if (r >= 0.1 && r < 0.2) {
        c.play("run");
        k.wait(2, () => c.play("idle"));
      }
    });
  });
};

const showInputText = () => {
  const py = config.gameHeight * 0.77;
  const textObj = k.add([
    k.text("Press SPACE to Begin", 16),
    k.origin("center"),
    k.pos(hw, py),
  ]);
  let t = 0;
  k.action(() => {
    t += k.dt();
    textObj.pos.y = py + Math.sin(t) * 3.33;
  });
};

let gameStarting = false;
const startGame = () => {
  if (gameStarting) return;
  gameStarting = true;
  k.play("spell-14", { detune: -200 });
  fadeToScene("character-select").then(() => gameStarting = false);
}

const enableStartGame = () => {
  k.action(() => {
    if (input.attack || input.burp) startGame();
  });
};

k.scene("title-screen", () => {
  enableInputListeners();
  music.crossFade("neon-synth");
  k.wait(logoTimer, animateLogos);
  animateCharacters();
  setTimeout(() => {
    enableStartGame();
    showInputText();
  }, inputTimer * 1000);
});