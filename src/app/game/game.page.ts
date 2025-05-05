import { Component, AfterViewInit } from '@angular/core';
import Phaser from 'phaser';
import { GameScene } from './game-scene';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: false,
})
export class GamePage implements AfterViewInit {
  phaserGame!: Phaser.Game;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    const gameScene = new GameScene(this.router);

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 650,
      height: window.innerHeight,
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
        },
      },
      scene: [gameScene], 
      parent: 'game-container',
    };

    this.phaserGame = new Phaser.Game(config);
  }
}
