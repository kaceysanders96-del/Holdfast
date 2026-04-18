/**
 * DialogueSystem
 *
 * Manages all dialogue in the game.
 * Dialogue is defined in JSON files per scene.
 * Supports linear sequences, morality triggers, and quest completion hooks.
 *
 * A dialogue entry looks like:
 * {
 *   "id": "shrine",
 *   "lines": [
 *     { "speaker": "The Shrine of the Mother", "text": "..." },
 *     { "speaker": "", "text": "..." }
 *   ],
 *   "onComplete": {
 *     "quest": "shrine",
 *     "morality": { "dimension": "memory", "delta": 5, "event": "Offered thanks at the shrine" }
 *   }
 * }
 */

import { morality } from './MoralitySystem.js';
import { questSystem } from './QuestSystem.js';

export class DialogueSystem {
  constructor(uiElements) {
    // uiElements: { box, speaker, text, prompt }
    this.ui = uiElements;
    this.active = false;
    this.queue = [];
    this.index = 0;
    this.currentEntry = null;
    this.onCompleteCallback = null;
  }

  /**
   * Start a dialogue from a loaded dialogue entry object.
   * @param {Object} entry - dialogue entry from JSON
   * @param {Function} onComplete - optional callback when dialogue ends
   */
  start(entry, onComplete = null) {
    if (!entry || !entry.lines || entry.lines.length === 0) return;

    this.queue = entry.lines;
    this.index = 0;
    this.currentEntry = entry;
    this.onCompleteCallback = onComplete;
    this.active = true;

    this._showLine();
  }

  /**
   * Advance to next line or close dialogue.
   */
  advance() {
    if (!this.active) return;

    this.index++;
    if (this.index >= this.queue.length) {
      this._complete();
    } else {
      this._showLine();
    }
  }

  _showLine() {
    const line = this.queue[this.index];
    if (this.ui.speaker) this.ui.speaker.textContent = line.speaker || '';
    if (this.ui.text)    this.ui.text.textContent    = line.text || '';
    if (this.ui.box)     this.ui.box.style.display   = 'block';
  }

  _complete() {
    if (this.ui.box) this.ui.box.style.display = 'none';
    this.active = false;

    const hooks = this.currentEntry?.onComplete;
    if (hooks) {
      // Quest hook
      if (hooks.quest) {
        questSystem.complete(hooks.quest);
      }
      // Morality hook
      if (hooks.morality) {
        const { dimension, delta, event } = hooks.morality;
        morality.record(dimension, delta, event);
      }
    }

    if (this.onCompleteCallback) {
      this.onCompleteCallback(this.currentEntry);
    }

    this.currentEntry = null;
  }

  isActive() {
    return this.active;
  }
}
