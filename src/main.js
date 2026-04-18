import Phaser from 'phaser';
import { HutInterior } from './scenes/HutInterior.js';
import { Village } from './scenes/Village.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 560,
  parent: 'game',
  backgroundColor: '#080401',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false },
  },
  scene: [HutInterior, Village],
};

const game = new Phaser.Game(config); // eslint-disable-line no-unused-vars

export default game;
