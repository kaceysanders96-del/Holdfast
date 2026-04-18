/**
 * PlayerController
 *
 * Handles player movement, interaction detection, and depth sorting.
 * Designed to be instantiated once per scene.
 */

export class PlayerController {
  constructor(scene, x, y, textureKey) {
    this.scene = scene;
    this.speed = 130;

    // Physics sprite
    this.sprite = scene.physics.add.sprite(x, y, textureKey);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(10);

    // Input
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    this.eKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // Interaction callback — set by scene
    this.onInteract = null;
  }

  /**
   * Call in scene's update().
   * @param {boolean} locked - if true, player cannot move (e.g. during dialogue)
   */
  update(locked = false) {
    if (locked) {
      this.sprite.setVelocity(0, 0);
      return;
    }

    const { cursors, wasd, speed } = this;
    let vx = 0, vy = 0;

    if (cursors.left.isDown  || wasd.left.isDown)  vx = -speed;
    else if (cursors.right.isDown || wasd.right.isDown) vx = speed;

    if (cursors.up.isDown    || wasd.up.isDown)    vy = -speed;
    else if (cursors.down.isDown  || wasd.down.isDown)  vy = speed;

    // Normalize diagonal
    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }

    this.sprite.setVelocity(vx, vy);

    // Depth sort by Y — makes player appear behind/in-front correctly
    this.sprite.setDepth(10 + this.sprite.y * 0.001);
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }

  destroy() {
    this.sprite.destroy();
  }
}
