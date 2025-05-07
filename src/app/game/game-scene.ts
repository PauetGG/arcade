import Phaser from 'phaser';
import { Router } from '@angular/router';

export class GameScene extends Phaser.Scene {
  nave!: Phaser.Physics.Arcade.Sprite;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  balas!: Phaser.Physics.Arcade.Group;
  asteroides!: Phaser.Physics.Arcade.Group;
  puntos: number = 0;
  textoPuntuacion!: Phaser.GameObjects.Text;
  eventoAsteroides!: Phaser.Time.TimerEvent;

  nivelDificultad: number = 1;
  velocidadNaveBase: number = 300;
  partidaTerminada: boolean = false;

  delayAsteroides: number = 1500;
  reduccionDelay: number = 100;

  constructor(private router: Router) {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('nave', 'assets/images/nave.png');
    this.load.image('bala', 'assets/images/bala.png');
    this.load.image('asteroide', 'assets/images/asteroide.png');
    this.load.image('pause', 'assets/images/pause.png');
    this.load.image('bg', 'assets/images/background.png');
  }

  create() {
    const width = this.sys.game.canvas.width;
    const height = this.sys.game.canvas.height;

    const estadoGuardado = localStorage.getItem('estadoPartida');
    let estado: any = null;
    if (estadoGuardado) {
      estado = JSON.parse(estadoGuardado);
      this.puntos = estado.puntos || 0;
    }

    this.add.image(0, 0, 'bg')
      .setOrigin(0)
      .setDisplaySize(width, height)
      .setDepth(-1);

    const naveX = estado?.nave?.x ?? width / 2;
    const naveY = estado?.nave?.y ?? height - 100;
    this.nave = this.physics.add.sprite(naveX, naveY, 'nave');
    this.nave.setCollideWorldBounds(true);
    this.nave.displayWidth = 100;
    this.nave.displayHeight = 100;

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.balas = this.physics.add.group();
    this.asteroides = this.physics.add.group();

    this.textoPuntuacion = this.add.text(width - 20, 20, `Puntos: ${this.puntos}`, {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(1, 0);

    if (estado?.balas) {
      estado.balas.forEach((b: any) => {
        const bala = this.balas.create(b.x, b.y, 'bala');
        bala.setVelocityY(-400);
        bala.displayWidth = 10;
        bala.displayHeight = 30;
        bala.setCollideWorldBounds(false);
      });
    }

    if (estado?.asteroides) {
      estado.asteroides.forEach((a: any) => {
        const asteroide = this.asteroides.create(a.x, a.y, 'asteroide');
        asteroide.setVelocityY(a.velocityY);
        asteroide.displayWidth = 50;
        asteroide.displayHeight = 50;
        asteroide.setCollideWorldBounds(false);
      });
    }

    localStorage.removeItem('estadoPartida');

    const pauseButton = this.add.image(20, 20, 'pause')
      .setOrigin(0)
      .setInteractive()
      .setDisplaySize(40, 40)
      .setScrollFactor(0);

    pauseButton.on('pointerdown', () => this.pausarJuego());

    this.input.keyboard!.on('keydown-SPACE', () => {
      this.dispararBala();
    });

    this.crearEventoAsteroides();

    this.time.addEvent({
      delay: 10000,
      callback: () => {
        this.nivelDificultad++;
        this.delayAsteroides = Math.max(300, this.delayAsteroides - this.reduccionDelay);
        this.eventoAsteroides.remove(false);
        this.crearEventoAsteroides();
      },
      loop: true
    });

    this.physics.add.overlap(
      this.balas,
      this.asteroides,
      (bala, asteroide) => {
        (bala as Phaser.Physics.Arcade.Sprite).destroy();
        (asteroide as Phaser.Physics.Arcade.Sprite).destroy();
        this.puntos += 10;
        this.textoPuntuacion.setText(`Puntos: ${this.puntos}`);
      },
      undefined,
      this
    );

    this.physics.add.overlap(
      this.nave,
      this.asteroides,
      () => this.gameOver(),
      undefined,
      this
    );
  }

  crearEventoAsteroides() {
    const width = this.sys.game.canvas.width;
    this.eventoAsteroides = this.time.addEvent({
      delay: this.delayAsteroides,
      callback: () => {
        const x = Phaser.Math.Between(50, width - 50);
        const velocidad = Phaser.Math.Between(100, 200) + this.nivelDificultad * 20;
        const asteroide = this.asteroides.create(x, -50, 'asteroide');
        asteroide.setVelocityY(velocidad);
        asteroide.displayWidth = 50;
        asteroide.displayHeight = 50;
        asteroide.setCollideWorldBounds(false);
      },
      loop: true
    });
  }

  dispararBala() {
    const bala = this.balas.create(this.nave.x, this.nave.y - 20, 'bala');
    bala.setVelocityY(-400);
    bala.displayWidth = 10;
    bala.displayHeight = 30;
    bala.setCollideWorldBounds(false);
  }

  guardarPuntuacion() {
    const puntuaciones = JSON.parse(localStorage.getItem('puntuaciones') || '[]');
    const ultimoId = puntuaciones.length > 0 ? puntuaciones[puntuaciones.length - 1].id : 0;
    const nombre = localStorage.getItem('nombreJugador') || 'Anónimo';

    const nuevaPuntuacion = {
      id: ultimoId + 1,
      nombre: nombre,
      puntos: this.puntos,
      fecha: new Date().toISOString()
    };

    puntuaciones.push(nuevaPuntuacion);
    localStorage.setItem('puntuaciones', JSON.stringify(puntuaciones));
  }

  pausarJuego() {
    this.physics.pause();
    this.eventoAsteroides.paused = true;

    const width = this.sys.game.canvas.width;
    const height = this.sys.game.canvas.height;

    const fondo = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6).setAlpha(0);
    const texto = this.add.text(width / 2, height / 2 - 60, 'PAUSA', {
      fontSize: '48px',
      color: '#ffffff'
    }).setOrigin(0.5).setAlpha(0);

    const continuar = this.add.text(width / 2, height / 2, 'Continuar', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#008000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive().setAlpha(0);

    const volverMenu = this.add.text(width / 2, height / 2 + 60, 'Volver al Menú', {
      fontSize: '28px',
      color: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive().setAlpha(0);

    this.tweens.add({
      targets: [fondo, texto, continuar, volverMenu],
      alpha: 1,
      duration: 500,
      ease: 'Power2'
    });

    continuar.on('pointerdown', () => {
      fondo.destroy();
      texto.destroy();
      continuar.destroy();
      volverMenu.destroy();
      this.eventoAsteroides.paused = false;
      this.physics.resume();
    });

    volverMenu.on('pointerdown', () => {
      const estado = {
        puntos: this.puntos,
        nave: { x: this.nave.x, y: this.nave.y },
        balas: this.balas.getChildren().map((b: any) => ({ x: b.x, y: b.y })),
        asteroides: this.asteroides.getChildren().map((a: any) => ({
          x: a.x,
          y: a.y,
          velocityY: a.body.velocity.y
        }))
      };

      localStorage.setItem('estadoPartida', JSON.stringify(estado));
      localStorage.setItem('partidaEnCurso', 'true');

      this.router.navigateByUrl('/menu').then(() => {
        location.reload();
      });
    });
  }

  gameOver() {
    if (this.partidaTerminada) return;
    this.partidaTerminada = true;

    this.physics.pause();
    this.eventoAsteroides.paused = true;
    this.nave.setTint(0xff0000);

    const width = this.sys.game.canvas.width;
    const height = this.sys.game.canvas.height;

    const fondo = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6).setAlpha(0);

    const textoGameOver = this.add.text(width / 2, height / 2 - 100, 'GAME OVER', {
      fontSize: '48px',
      color: '#ff0000'
    }).setOrigin(0.5).setAlpha(0);

    const textoPuntuacion = this.add.text(width / 2, height / 2 - 40, `Puntuación: ${this.puntos}`, {
      fontSize: '36px',
      color: '#ffffff'
    }).setOrigin(0.5).setAlpha(0);

    const reintentar = this.add.text(width / 2, height / 2 + 20, 'Reintentar', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive().setAlpha(0);

    const volverMenu = this.add.text(width / 2, height / 2 + 80, 'Volver al Menú', {
      fontSize: '28px',
      color: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive().setAlpha(0);

    this.tweens.add({
      targets: [fondo, textoGameOver, textoPuntuacion, reintentar, volverMenu],
      alpha: 1,
      duration: 500,
      ease: 'Power2'
    });

    reintentar.on('pointerdown', () => {
      this.guardarPuntuacion();
      this.puntos = 0;
      this.nivelDificultad = 1;
      this.delayAsteroides = 1500;
      this.partidaTerminada = false;
      this.scene.restart();
    });

    volverMenu.on('pointerdown', () => {
      localStorage.removeItem('partidaEnCurso');
      this.guardarPuntuacion();
      this.router.navigateByUrl('/menu').then(() => {
        location.reload();
      });
    });
  }

  override update() {
    const velocidad = this.velocidadNaveBase + this.nivelDificultad * 20;

    if (this.cursors?.left?.isDown) {
      this.nave.setVelocityX(-velocidad);
    } else if (this.cursors?.right?.isDown) {
      this.nave.setVelocityX(velocidad);
    } else {
      this.nave.setVelocityX(0);
    }

    this.balas.getChildren().forEach((bala) => {
      if ((bala as Phaser.Physics.Arcade.Sprite).y < -50) {
        bala.destroy();
      }
    });

    this.asteroides.getChildren().forEach((asteroide) => {
      if ((asteroide as Phaser.Physics.Arcade.Sprite).y > this.sys.game.canvas.height + 50) {
        this.gameOver();
      }
    });
  }
}

