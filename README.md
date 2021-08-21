# Gush

Gush is a dungeon brawler game built with [Kaboom.js](https://kaboomjs.com/) on [Replit.com](https://replit.com/) for a [1729.com](https://1729.com/) [contest](https://1729.com/replit-kaboom).

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

## Sound
- [Shapeforms Audio Free Sounds](https://shapeforms.itch.io/shapeforms-audio-free-sfx)
- [Hypercasual Music Pack 1](https://www.void1gaming.com/hypercasual-music-pack-1)
- [Hypercasual Music Pack 4](https://www.void1gaming.com/hypercasual-music-pack-4)
- [Action RPG Music Free](https://vgcomposer.itch.io/action-rpg-music-free)
- [Sound Effect Starter Pack](https://simon13666.itch.io/sound-starter-pack)

## Maybe will use (not implemented yet)
- [Magical Animation Effects](https://pimen.itch.io/magical-animation-effects)
- [GIF Free Pixel Effects Pack #6 - forks of flame](https://xyezawr.itch.io/gif-free-pixel-effects-pack-6-forks-of-flame)

## Lots more cool assets (not implemented in this game)
- [https://xyezawr.itch.io/](https://xyezawr.itch.io/)
- [https://kvsr.itch.io/](https://kvsr.itch.io/)

## Feature Tracker

### Basic game mechanics
- [x] Red flask restores hp of course
- [x] HP is always in increments of 1, each 1 represents half a heart
- [x] Blue flask gives a shield on top of HP
- [x] Green flask gives charges of Power Belch, burp kills enemies around player, small one charge, large 3 charges
- [x] Chests can contain flasks or coins
 - [x] Show coin count on UI
- [x] Multiple characters with different health & weapons
  - [x] Coins can be collected through multiple game runs to unlock more characters
- [x] Current level can be reset when player dies.
- [x] Force 1.5 aspect ratio no matter screens size

### Essential features
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
- [ ] Full map rotation for each character
  - [ ] 3 full maps (designed for each char)
  - [ ] 2 random treasure rooms between them
  - [ ] 1 boss fight (probably same one)
  - [ ] golden flask treasure room for end game

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
- [ ] Better monster spawn/despawn (save position to objConfigs)
- [x] Controller support
- [x] Minimap
- [x] Interim treasure levels
- [x] Main menu screen
  - [x] Logo intro animation
  - [ ] sound/music adjust
  - [ ] control remapping (maybe not worth it)
- [ ] Win screen & credits
  - [ ] Show gold collected, flasks collected, monsters killed, damage taken/healed etc.
- [x] Simple tutorial messages on game start (only show once, turn off in localStorage)
- [x] Store player's last attack dir so attacking while stationary feels right
- [ ] More sound effects
  - [x] player footsteps
  - [x] more sword swings
  - [ ] monster noises on attack engaged
  - [ ] arrows bounce off walls
  - [x] heartbeat when health is low
- [x] Some enemies drop a skull as a visual effect (non-interactive).
- [ ] Pause menu with options
- [ ] hp bars on damaged enemies