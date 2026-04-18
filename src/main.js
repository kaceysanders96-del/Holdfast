import Phaser from 'phaser';
import { CharacterCreation } from './scenes/CharacterCreation.js';
import { HutInterior } from './scenes/HutInterior.js';
import { Village } from './scenes/Village.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 560,
  parent: 'game',
  transparent: true,
  backgroundColor: 'rgba(0,0,0,0)',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false },
  },
  scene: [CharacterCreation, HutInterior, Village],
};

const game = new Phaser.Game(config);

export default game;
