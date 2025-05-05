import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  nave!: Phaser.Physics.Arcade.Sprite;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  balas!: Phaser.Physics.Arcade.Group;
  naveIndex: number = 1; // Cambia esto para elegir otra nave (1, 3, 5, ...)

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.spritesheet('naves', 'assets/images/naves.png', {
      frameWidth: 64,  // Ajusta si el tamaño es diferente
      frameHeight: 64, // Estimado de cada celda
    });
  }

  create() {
    const width = this.sys.game.canvas.width;
    const height = this.sys.game.canvas.height;

    this.nave = this.physics.add.sprite(width / 2, height - 100, 'naves', this.naveIndex);
    this.nave.setCollideWorldBounds(true);
    this.nave.setScale(1);

    this.cursors = this.input.keyboard!.createCursorKeys();

    // Grupo de balas
    this.balas = this.physics.add.group();

    // Evento: disparar al pulsar barra espaciadora
    this.input.keyboard!.on('keydown-SPACE', () => {
      this.dispararBala();
    });
  }

  dispararBala() {
    // Calcula el frame de la bala: siempre está justo a la derecha de la nave
    const balaFrame = this.naveIndex + 1;

    const bala = this.balas.create(this.nave.x, this.nave.y - 20, 'naves', balaFrame);
    bala.setVelocityY(-400);
    bala.setScale(0.6);
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

    this.balas.getChildren().forEach((bala) => {
      if ((bala as Phaser.Physics.Arcade.Sprite).y < -50) {
        bala.destroy();
      }
    });
  }
}
