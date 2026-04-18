/**
 * Village Scene
 *
 * The starting village — player's first experience of the wider world.
 * Dawn morning, chores, ambient overheard conversations, first NPCs.
 * This is where the mythology begins to surface.
 */

import Phaser from 'phaser';
import { DialogueSystem } from '../systems/DialogueSystem.js';
import { AmbientSystem } from '../systems/AmbientSystem.js';
import { questSystem } from '../systems/QuestSystem.js';
import villageDialogue from '../dialogue/village.json';

const AMBIENT_LINES = [
  'Somewhere nearby, a child asks why the old towers still stand...',
  'Two voices argue softly about the eastern trade route...',
  'An old song drifts from behind the granary. You don\'t know all the words.',
  'Someone is repairing something metal. The rhythm is almost musical.',
  'The morning bell sounds. Low, warm, unhurried.',
  'A dog barks once in the direction of the eastern woods, then goes quiet.',
];

export class Village extends Phaser.Scene {
  constructor() {
    super({ key: 'Village' });
  }

  preload() {}

  create() {
    window.__currentScene = 'Village';

    this.add.text(400, 280, 'Village — Coming Soon', {
      fontFamily: 'Cinzel, serif',
      fontSize: '18px',
      color: '#c4935a',
    }).setOrigin(0.5);

    this.add.text(400, 320, 'The morning is waiting outside your door.', {
      fontFamily: 'Crimson Pro, serif',
      fontSize: '14px',
      color: 'rgba(200,175,110,0.6)',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // TODO: Build village scene using same patterns as HutInterior
    // - NPC zones with villageDialogue entries
    // - Grandmother Soel at fire pit
    // - Maret at the well
    // - Elder Voss at the gathering circle
    // - The Stranger near the village edge
    // - Ambient overheard lines
    // - World map door to the wider world

    this.cameras.main.fadeIn(1500, 8, 4, 1);

    // Placeholder: dialogue and ambient systems
    this.dialogueSystem = new DialogueSystem({
      box:     document.getElementById('dialogue'),
      speaker: document.getElementById('dlg-speaker'),
      text:    document.getElementById('dlg-text'),
    });

    this.ambientSystem = new AmbientSystem(AMBIENT_LINES, 10000);
    this.ambientSystem.start((line) => {
      const el = document.getElementById('ambient');
      if (!el) return;
      el.textContent = line;
      el.style.opacity = '1';
      setTimeout(() => { el.style.opacity = '0'; }, 5000);
    });
  }

  update() {}
}
