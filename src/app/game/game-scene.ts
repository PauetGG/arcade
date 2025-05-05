import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  nave!: Phaser.Physics.Arcade.Sprite;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  balas!: Phaser.Physics.Arcade.Group;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('nave', 'assets/images/nave.png');
    this.load.image('bala', 'assets/images/bala.png');
  }

  create() {
    const width = this.sys.game.canvas.width;
    const height = this.sys.game.canvas.height;

    // Crear la nave
    this.nave = this.physics.add.sprite(width / 2, height - 100, 'nave');
    this.nave.setCollideWorldBounds(true);
    this.nave.setScale(0.4); // Ajusta si es muy grande

    // Controles
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Grupo de balas
    this.balas = this.physics.add.group();

    // Evento: disparar al presionar barra espaciadora
    this.input.keyboard!.on('keydown-SPACE', () => {
      this.dispararBala();
    });
  }

  dispararBala() {
    const bala = this.balas.create(this.nave.x, this.nave.y - 20, 'bala');
    bala.setVelocityY(-400);
    bala.setScale(0.5);
    bala.setCollideWorldBounds(false);
  }

  override update() {
    if (this.cursors.left?.isDown) {
      this.nave.setVelocityX(-300);
    } else if (this.cursors.right?.isDown) {
      this.nave.setVelocityX(300);
    } else {
      this.nave.setVelocityX(0);
    }

    // Eliminar balas fuera de pantalla
    this.balas.getChildren().forEach((bala) => {
      if ((bala as Phaser.Physics.Arcade.Sprite).y < -50) {
        bala.destroy();
      }
    });
  }
}
