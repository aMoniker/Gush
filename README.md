# Gush

**Gush** is a dungeon brawler game built with [Kaboom.js](https://kaboomjs.com/) on [Replit.com](https://replit.com/) for a [1729.com](https://1729.com/) [contest](https://1729.com/replit-kaboom).

You can [play it](https://replit.com/@aMoniker/Gush?v=1) on Replit, or fork the code and make your own version.

## Features
- Seven playable characters with unique weapons
- More than a dozen enemy types
- More than a dozen levels, large and small
- Scripted challenges within levels
- A scripted boss level
- Collectible coins, used to unlock characters
- Flasks that restore health, give shields or DEADLY BURPS
- Chests may have coins, flasks, nothing, or something else...

## How to play
Use a gamepad controller for the best experience.

Or, use keyboard & mouse, or keyboard alone.

Some characters can shoot: aim with right analog stick or mouse.

- *Gamepad:* Left analog stick to move, bottom button to attack, right side button to burp.
- *Keyboard & mouse:* WASD (or arrows) to move, SPACE to attack (or left click), B to burp (or right click).

## Tools used
- [Replit.com](https://replit.com/)
- [Kaboom.js v0.6.0](https://kaboomjs.com/)
- [Stitches (spritesheet generator)](https://draeton.github.io/stitches/)
- [Aseprite](https://www.aseprite.org/)
- [EZGif Sprite Cutter](https://ezgif.com/sprite-cutter)
- [FFMpeg](https://www.ffmpeg.org/)
- And of course, Google & Stack Overflow

## Graphics
- [Dungeon Tileset 2](https://0x72.itch.io/dungeontileset-ii)
- [Blood FX](https://jasontomlee.itch.io/blood-fx)
- [Assets Free Laser Bullets Pack 2020](https://wenrexa.itch.io/laser2020)
- [Pixel Art Effect - FX084 (+15 Effects)](https://kvsr.itch.io/fx084)
- [Pixel Effects Pack](https://codemanu.itch.io/pixelart-effect-pack)
- [Kenney.nl Pixel UI Pack](https://kenney.nl/assets/pixel-ui-pack)
- [Will's Pixel Explosions](https://untiedgames.itch.io/five-free-pixel-explosions)
- [Free Pixel Effects Pack #12 - Mini Magick Shoots 3](https://xyezawr.itch.io/gif-free-pixel-effects-pack-12-mini-magick-shoots-3)
- [Free Pixel Effects Pack #13 - Fireballs](https://xyezawr.itch.io/free-pixel-effects-pack-13-fireballs)

## Sound & Music
- [Shapeforms Audio Free Sounds](https://shapeforms.itch.io/shapeforms-audio-free-sfx)
- [Hypercasual Music Pack 1](https://www.void1gaming.com/hypercasual-music-pack-1)
- [Hypercasual Music Pack 4](https://www.void1gaming.com/hypercasual-music-pack-4)
- [Action RPG Music Free](https://vgcomposer.itch.io/action-rpg-music-free)
- [Sound Effect Starter Pack](https://simon13666.itch.io/sound-starter-pack)

## Feature Tracker

### Essential features
- [x] Red flask restores hp of course
- [x] HP is always in increments of 1, each 1 represents half a heart
- [x] Blue flask gives a shield on top of HP
- [x] Green flask gives charges of Power Belch, burp kills enemies around player, small one charge, large 3 charges
- [x] Chests can contain flasks or coins
 - [x] Show coin count on UI
- [x] Multiple characters with different health & weapons
  - [x] Coins can be collected through multiple game runs to unlock more characters
- [x] Current level can be reset when player dies.
- [x] Different levels
  - [x] Use more tiles: banners, fountains, slime, traps
  - [x] Load next level at ladder down
  - [x] Different level rotations for each character
- [x] Triggered events & boss fights
  - [x] Walking over trigger sets off scripted events for the map
  - [x] Rooms can be closed off with crates blocking exit until event finishes
  - [x] Music changes for certain events
- [x] Music for each level (simple music manager w/ crossfade)
- [x] Select/unlock character screen
- [x] Game over/reset level screen (YOU DIED)
- [x] All characters added with different weapons
- [x] Full map rotation for each character
  - [x] 2 full maps (designed for each char)
    - [x] sniper gallery with crevasses for shootie pie
    - [x] narrow hallways and big open areas to dash around for Pokey
    - [x] mix of the above two for lizzy's cleaverang
    - [x] huge waves of monsters to smash with crushy hammer
    - [x] big concentrated waves to explode with fireballs (floating platforms with lots of projectile enemies?)
    - [ ] lines of enemies for lazer wizard, narrow passages, maybe chase areas that close behind and let you run ahead of chasing enemies
  - [x] 2 random treasure rooms between them (3-5 small rooms like this are good, some with a mimic, some with flasks, interesting layouts)
  - [x] 1 boss fight (probably same one for every char - big demon, waves of enemies, bullet hell, need 3 big burps to win, announce to tell player what to do)
  - [x] golden flask treasure room for end game (with some announce flavor text, congrats etc)

#### Character classes:
- [x] Swordy Boi - starting char, all other are unlocks. decent sword, decent hp
- [x] Shootie Pie - decent bow, decent hp
- [x] Pokey Elf - killer spear, dash attack in one direction, mediocre hp
- [x] Smashy Dino - slow, powerful attack with big hammer, great hp
- [x] Lizzy Butch - throws meat cleavers, slow & powerful
- [x] Burny Mage - cast fireballs, heavy dmg, low hp
- [x] LAZER WIZARD - laser attack fires through enemies, good dmg, low hp

#### Monster AI
- [x] Basic monster movement AI
- [x] Necromancers raise armies of 1 hit skeletons
- [x] Orc Shaman can heal their friends
- [x] Mimics lie in wait, then bump you back and chase you
- [x] Demons cast fireballs at you

### Nice to have
- [x] Scooty Poke leaps backwards if he ends overlapping an enemy
- [x] save health/shields/burps between levels (except on boss - empty burps)
- [x] Meat Cleaverang for Lizzy
- [x] Force 1.5 aspect ratio no matter screens size
- [x] Better monster spawn/despawn (save position to objConfigs, improve framerate maybe)
- [x] Controller support
- [x] Minimap
- [x] Interim treasure levels
- [x] Add announce names to levels, some triggers
- [x] Main menu screen
  - [x] Logo intro animation
  - [ ] sound/music adjust
  - [ ] control remapping (maybe not worth it)
- [ ] Win screen & credits
  - [ ] Show stats: gold collected, flasks collected, monsters killed, damage taken/healed etc.
- [x] Simple tutorial messages on game start (only show once, turn off in localStorage)
- [x] Store player's last attack dir so attacking while stationary feels right
- [ ] More sound effects
  - [x] player footsteps
  - [x] more sword swings
  - [ ] monster noises on attack engaged
  - [ ] specific monster type noises when hit
  - [ ] arrows bounce off walls
  - [x] heartbeat when health is low
- [x] Some enemies drop a skull as a visual effect (non-interactive).
- [ ] Pause menu with options
- [x] hp bars on damaged enemies
- [ ] restart from last "checkpoint"? (last trigger point - hard to implement)
- [x] mouse aiming and click to fire