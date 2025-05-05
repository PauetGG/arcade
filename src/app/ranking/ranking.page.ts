import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
  standalone: false
})
export class RankingPage implements OnInit {
  partidas: { puntuacion: number; fecha: string; nave: string }[] = [];

  constructor() {}

  ngOnInit() {
    const data = localStorage.getItem('ranking');
    if (data) {
      this.partidas = JSON.parse(data);

      // Ordenar de mayor a menor puntuación
      this.partidas.sort((a, b) => b.puntuacion - a.puntuacion);
    }
  }
}
