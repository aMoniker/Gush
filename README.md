# Gush

Gush is a dungeon brawler game built with [Kaboom.js](https://kaboomjs.com/) on [Replit.com](https://replit.com/) for a [1729.com](https://1729.com/) [contest](https://1729.com/replit-kaboom).

## Tools used
- [Replit.com](https://replit.com/)
- [Kaboom.js v0.6.0](https://kaboomjs.com/)
- [Stitches (spritesheet generator)](https://draeton.github.io/stitches/)
- [Aseprite](https://www.aseprite.org/)
- [EZGif Sprite Cutter](https://ezgif.com/sprite-cutter)
- And of course, Google & Stack Overflow

## Graphics
- [Dungeon Tileset 2](https://0x72.itch.io/dungeontileset-ii)
- [Blood FX](https://jasontomlee.itch.io/blood-fx)
- [Assets Free Laser Bullets Pack 2020](https://wenrexa.itch.io/laser2020)
- [Pixel Art Effect - FX084 (+15 Effects)](https://kvsr.itch.io/fx084)
- [Pixel Effects Pack](https://codemanu.itch.io/pixelart-effect-pack)
- [Kenney.nl Pixel UI Pack](https://kenney.nl/assets/pixel-ui-pack)

## Sound
- [Shapeforms Audio Free Sounds](https://shapeforms.itch.io/shapeforms-audio-free-sfx)
- [Hypercasual Music Pack 1](https://www.void1gaming.com/hypercasual-music-pack-1)
- [Hypercasual Music Pack 4](https://www.void1gaming.com/hypercasual-music-pack-4)
- [Action RPG Music Free](https://vgcomposer.itch.io/action-rpg-music-free)
- [Sound Effect Starter Pack](https://simon13666.itch.io/sound-starter-pack)

## Maybe will use (not implemented yet)
- [Magical Animation Effects](https://pimen.itch.io/magical-animation-effects)
- [Free Pixel Effects Pack #12 - Mini Magick Shoots 3](https://xyezawr.itch.io/gif-free-pixel-effects-pack-12-mini-magick-shoots-3)
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
 - [x] Show coint count on UI
- [ ] Multiple characters with different health & weapons
  - [ ] Coins can be collected through multiple game runs to unlock more characters
- [ ] Current level can be reset if a player really messes things up.
  - [ ] Pause menu with options

### Essential features
- [ ] Different levels
  - [x] Use more tiles: banners, fountains, slime, traps
  - [ ] Load next level at ladder down
- [x] Triggered events & boss fights
  - [x] Walking over trigger sets off scripted events for the map
  - [x] Rooms can be closed off with crates blocking exit until event finishes
  - [x] Music changes for certain events
- [x] Music for each level (simple music manager w/ crossfade)
- [ ] Loading screen
- [ ] Main menu screen
- [ ] Select/unlock character screen
- [x] Game over/reset level screen (YOU DIED)
- [ ] Win screen & credits

### Monster AI
- [x] Basic monster movement AI
- [ ] Necromancers raise armies of 1 hit skeletons
- [ ] Orc Shaman can heal their friends
- [ ] Mimics lie in wait, then bump you back and chase you
- [ ] Demons cast fireballs at you

### Nice to have
- [ ] Controller support
- [x] Simple tutorial messages on game start (only show once, turn off in localStorage)
- [x] Store player's last attack dir so attacking while stationary feels right
- [ ] More sound effects
  - [ ] player footsteps
  - [x] more sword swings
  - [ ] monster noises
- [ ] Orc shaman can heal his orc friends
- [ ] Some enemies drop a skull as a visual effect (non-interactive).
- [ ] Column tiles
- [ ] Yellow flask gives charges of resurrect, allowing player to come back to life

### Potential game mechanics
- [ ] Certain weapons can be picked up for a limited time, more powerful, replaces normal weapon
- [ ] You only get to keep coins if you beat the level

### Character classes:
- [x] Swordy Boi - starting char, all other are unlocks. decent sword, decent hp
- [ ] Pokey Elf - killer spear, mediocre hp
- [ ] Shootie Pie - decent bow, decent hp
- [ ] Crushy Lizard - slow, powerful attack, good hp
- [ ] Smashy Dino - fast attack in all directions, good hp
- [ ] Burny Mage - ranged fire attack, heavy dmg, low hp
- [ ] LASER WIZARD - laser attack fires through enemies, lower dmg than fire, low hp