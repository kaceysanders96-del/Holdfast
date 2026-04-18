/**
 * QuestSystem
 *
 * Tracks quest and task state across the game.
 * Quests are simple flags — completed or not.
 * The UI layer reads from this to update task logs.
 */

export class QuestSystem {
  constructor() {
    this.completed = new Set();
    this.listeners = {}; // questId -> [callbacks]
  }

  complete(questId) {
    if (this.completed.has(questId)) return;
    this.completed.add(questId);
    console.log(`[Quest] Completed: ${questId}`);
    this._notify(questId);
  }

  isComplete(questId) {
    return this.completed.has(questId);
  }

  /**
   * Register a callback for when a quest is completed.
   * Useful for UI elements that need to react.
   */
  onComplete(questId, callback) {
    if (!this.listeners[questId]) this.listeners[questId] = [];
    this.listeners[questId].push(callback);
  }

  _notify(questId) {
    (this.listeners[questId] || []).forEach(cb => cb(questId));
  }

  serialize() {
    return { completed: [...this.completed] };
  }

  deserialize(data) {
    this.completed = new Set(data.completed || []);
  }
}

export const questSystem = new QuestSystem();
