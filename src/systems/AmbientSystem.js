/**
 * AmbientSystem
 *
 * Manages ambient environmental storytelling.
 * Periodically surfaces overheard lines, environmental observations,
 * and subtle world-state hints to the player.
 *
 * This is also where the AI's quest prompt intrusions will eventually live.
 */

export class AmbientSystem {
  constructor(lines = [], intervalMs = 10000) {
    this.lines = lines;
    this.intervalMs = intervalMs;
    this.index = 0;
    this.timer = null;
    this.onLine = null; // callback(text) — UI layer renders it
  }

  /**
   * Start the ambient loop.
   * @param {Function} onLine - callback that receives each ambient line
   */
  start(onLine) {
    this.onLine = onLine;
    // First line after a short delay
    setTimeout(() => this._emit(), 4000);
    this.timer = setInterval(() => this._emit(), this.intervalMs);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  /**
   * Inject a line immediately — used for scripted moments,
   * and eventually for AI quest prompt intrusions.
   */
  inject(text) {
    if (this.onLine) this.onLine(text);
  }

  /**
   * Add new lines at runtime — used when the live world updates.
   */
  addLines(newLines) {
    this.lines.push(...newLines);
  }

  _emit() {
    if (!this.lines.length || !this.onLine) return;
    this.onLine(this.lines[this.index % this.lines.length]);
    this.index++;
  }
}
