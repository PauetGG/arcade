import { Component, AfterViewInit } from '@angular/core';
import Phaser from 'phaser';
import { GameScene } from './game-scene';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: false,
})
export class GamePage implements AfterViewInit {
  phaserGame!: Phaser.Game;

  constructor() {}

  ngAfterViewInit() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 700,
      height: window.innerHeight,
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
        },
      },
      scene: [GameScene],
      parent: 'game-container',
    };

    this.phaserGame = new Phaser.Game(config);
  }
}