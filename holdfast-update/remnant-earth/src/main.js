import Phaser from 'phaser';
import { HutInterior } from './scenes/HutInterior.js';
import { Village } from './scenes/Village.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 560,
  parent: 'game',
  transparent: true,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false },
  },
  scene: [HutInterior, Village],
};

const game = new Phaser.Game(config);

export default game;
