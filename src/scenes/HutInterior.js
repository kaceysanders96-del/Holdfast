/**
 * HutInterior Scene
 *
 * The player's starting space. First scene of the game.
 * Dawn, morning chores, personal lore objects.
 * Transitions to Village when the player opens the door.
 */

import Phaser from 'phaser';
import { DialogueSystem } from '../systems/DialogueSystem.js';
import { AmbientSystem } from '../systems/AmbientSystem.js';
import { questSystem } from '../systems/QuestSystem.js';
import hutDialogue from '../dialogue/hut.json';

const AMBIENT_LINES = [
  'Somewhere nearby, a child is asking why the old towers still stand...',
  'A rooster calls once, then goes quiet.',
  'The candle on the shrine gutters. Steadies.',
  'Someone is singing beyond the wall. Old words you half-know.',
  'Footsteps pass outside — quick, purposeful.',
  'The morning light shifts. A cloud, maybe. Or something larger moving.',
];

// Interactable zones: { id, x, y, w, h }
const ZONES = [
  { id: 'bed',     x: 28,  y: 200, w: 230, h: 130 },
  { id: 'bowl',    x: 258, y: 285, w: 70,  h: 60  },
  { id: 'shrine',  x: 598, y: 28,  w: 134, h: 110 },
  { id: 'chest',   x: 558, y: 208, w: 167, h: 107 },
  { id: 'shelf',   x: 28,  y: 148, w: 155, h: 55  },
  { id: 'pots',    x: 363, y: 415, w: 155, h: 55  },
  { id: 'window',  x: 160, y: 18,  w: 108, h: 90  },
  { id: 'lantern', x: 374, y: 18,  w: 58,  h: 80  },
  { id: 'door',    x: 330, y: 460, w: 145, h: 100 },
];

export class HutInterior extends Phaser.Scene {
  constructor() {
    super({ key: 'HutInterior' });
    this.dialogueSystem = null;
    this.ambientSystem = null;
    this.player = null;
    this.cursors = null;
    this.wasd = null;
    this.eKey = null;
    this.indicators = {};
    this.nearZone = null;
  }

  preload() {
    // Assets will be loaded here as they are created
    // For now the scene renders procedurally
  }

  create() {
    window.__currentScene = 'HutInterior';

    this._buildUI();
    this._buildPlayer();
    this._buildInput();
    this._buildSystems();

    // Quest UI hooks
    questSystem.onComplete('stretch', () => this._markTask('t-stretch'));
    questSystem.onComplete('bowl',    () => this._markTask('t-bowl'));
    questSystem.onComplete('shrine',  () => this._markTask('t-shrine'));
    questSystem.onComplete('door',    () => this._markTask('t-door'));

    // Fade in
    this.cameras.main.fadeIn(1500, 8, 4, 1);
  }

  update() {
    const locked = this.dialogueSystem.isActive();

    if (!locked) {
      this._movePlayer();
      this._checkZones();
    } else {
      this.player.setVelocity(0, 0);
    }
  }

  // ── PRIVATE ──────────────────────────────────────────────────────────────

  _buildPlayer() {
    // Placeholder texture — replace with sprite sheet when assets are ready
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xd4a870); g.fillCircle(8, 8, 8);
    g.fillStyle(0x4a6830); g.fillRect(3, 14, 10, 12);
    g.generateTexture('player_hut', 16, 28);
    g.destroy();

    this.player = this.physics.add.sprite(400, 350, 'player_hut');
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(10);
    this.player.body.setSize(12, 16);
    this.player.body.setOffset(2, 12);
  }

  _buildInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.eKey.on('down', () => this._handleInteract());
  }

  _buildSystems() {
    // Dialogue
    this.dialogueSystem = new DialogueSystem({
      box:     document.getElementById('dialogue'),
      speaker: document.getElementById('dlg-speaker'),
      text:    document.getElementById('dlg-text'),
      prompt:  document.getElementById('dlg-prompt'),
    });

    // Ambient
    this.ambientSystem = new AmbientSystem(AMBIENT_LINES, 11000);
    this.ambientSystem.start((line) => {
      const el = document.getElementById('ambient');
      if (!el) return;
      el.textContent = line;
      el.style.opacity = '1';
      setTimeout(() => { el.style.opacity = '0'; }, 5000);
    });
  }

  _buildUI() {
    // Zone indicators
    ZONES.forEach(zone => {
      const el = document.createElement('div');
      el.id = `ind-${zone.id}`;
      el.className = 'zone-indicator';
      el.textContent = `[ E ] ${this._zoneLabel(zone.id)}`;
      el.style.cssText = `
        position:absolute; opacity:0; transition:opacity 0.2s;
        font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.15em;
        color:#c4935a; background:rgba(8,5,2,0.82); border:1px solid rgba(196,147,90,0.35);
        padding:3px 8px; pointer-events:none; z-index:35; transform:translateX(-50%);
        white-space:nowrap;
      `;
      document.getElementById('game').appendChild(el);
      this.indicators[zone.id] = el;
    });
  }

  _zoneLabel(id) {
    const labels = {
      bed: 'Sleeping Mat', bowl: 'Morning Bowl', shrine: 'Shrine of the Mother',
      chest: 'Your Chest', shelf: 'Shelf', pots: 'Clay Pots',
      window: 'Window', lantern: 'Lantern', door: 'Door — Step Outside',
    };
    return labels[id] || id;
  }

  _movePlayer() {
    const speed = 130;
    let vx = 0, vy = 0;

    if (this.cursors.left.isDown  || this.wasd.left.isDown)  vx = -speed;
    else if (this.cursors.right.isDown || this.wasd.right.isDown) vx = speed;
    if (this.cursors.up.isDown    || this.wasd.up.isDown)    vy = -speed;
    else if (this.cursors.down.isDown  || this.wasd.down.isDown)  vy = speed;

    if (vx && vy) { vx *= 0.707; vy *= 0.707; }

    this.player.setVelocity(vx, vy);
    this.player.setDepth(10 + this.player.y * 0.001);
  }

  _checkZones() {
    const px = this.player.x, py = this.player.y;
    this.nearZone = null;

    ZONES.forEach(zone => {
      const near = px >= zone.x && px <= zone.x + zone.w
                && py >= zone.y && py <= zone.y + zone.h;
      const ind = this.indicators[zone.id];
      if (ind) {
        ind.style.opacity = near ? '1' : '0';
        if (near) {
          ind.style.left = `${zone.x + zone.w / 2}px`;
          ind.style.top  = `${zone.y - 24}px`;
        }
      }
      if (near) this.nearZone = zone;
    });
  }

  _handleInteract() {
    if (this.dialogueSystem.isActive()) {
      this.dialogueSystem.advance();
      return;
    }
    if (!this.nearZone) return;

    const entry = hutDialogue.find(d => d.id === this.nearZone.id);
    if (!entry) return;

    this.dialogueSystem.start(entry, (completedEntry) => {
      if (completedEntry?.onComplete?.sceneTransition) {
        this.cameras.main.fadeOut(1000, 8, 4, 1);
        this.time.delayedCall(1100, () => {
          this.scene.start(completedEntry.onComplete.sceneTransition);
        });
      }
    });
  }

  _markTask(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('done');
  }
}
