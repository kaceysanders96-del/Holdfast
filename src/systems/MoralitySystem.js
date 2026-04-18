/**
 * MoralitySystem
 *
 * Tracks the player's moral character across five dimensions.
 * Never shown as a score — only reflected back through how the world responds.
 *
 * Dimensions:
 *   restraint    — taking only what you need vs extracting everything
 *   trust        — sharing information vs hoarding it
 *   preservation — protecting old things vs using them pragmatically
 *   inclusion    — how you treat outsiders, aliens, the strange
 *   memory       — honoring the past vs bulldozing it
 *
 * Scale: -100 (low) to +100 (high) per dimension, starting at 0.
 */

export class MoralitySystem {
  constructor() {
    this.values = {
      restraint: 0,
      trust: 0,
      preservation: 0,
      inclusion: 0,
      memory: 0,
    };

    // Event log — the world remembers specific actions, not just numbers
    this.actionLog = [];
  }

  /**
   * Record a moral action.
   * @param {string} dimension - which dimension this affects
   * @param {number} delta     - positive or negative shift (-10 to +10 recommended)
   * @param {string} event     - human-readable description of what happened
   */
  record(dimension, delta, event) {
    if (!(dimension in this.values)) {
      console.warn(`[MoralitySystem] Unknown dimension: ${dimension}`);
      return;
    }

    this.values[dimension] = Math.max(-100, Math.min(100, this.values[dimension] + delta));

    this.actionLog.push({
      dimension,
      delta,
      event,
      timestamp: Date.now(),
      scene: window.__currentScene || 'unknown',
    });

    console.log(`[Morality] ${dimension} ${delta > 0 ? '+' : ''}${delta} — "${event}"`);
  }

  /**
   * Get a character profile — what kind of person is this player?
   * Used by NPCs and eventually the AI to describe the player back to themselves.
   */
  getProfile() {
    const { restraint, trust, preservation, inclusion, memory } = this.values;

    return {
      isRestrained: restraint > 20,
      isExtractor: restraint < -20,
      isTrusting: trust > 20,
      isGuarded: trust < -20,
      isPreserver: preservation > 20,
      isPragmatist: preservation < -20,
      isInclusive: inclusion > 20,
      isIsolationist: inclusion < -20,
      honorsPast: memory > 20,
      facesForward: memory < -20,
      raw: { ...this.values },
    };
  }

  /**
   * Get the specific actions the AI might reference when it finally speaks.
   * Returns the 5 most morally significant moments.
   */
  getMemorableActions(count = 5) {
    return [...this.actionLog]
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
      .slice(0, count);
  }

  /**
   * Serialize for save state.
   */
  serialize() {
    return {
      values: { ...this.values },
      actionLog: [...this.actionLog],
    };
  }

  /**
   * Restore from save state.
   */
  deserialize(data) {
    this.values = { ...data.values };
    this.actionLog = [...data.actionLog];
  }
}

// Singleton — one morality system for the whole game
export const morality = new MoralitySystem();
