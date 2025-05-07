import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
  standalone: false
})
export class RankingPage implements OnInit {
  partidas: { id: number; nombre: string; puntos: number; fecha: string }[] = [];

  constructor() {}

  ngOnInit() {
    const data = localStorage.getItem('puntuaciones');
    if (data) {
      this.partidas = JSON.parse(data);
      this.partidas.sort((a, b) => b.puntos - a.puntos);
      this.partidas = this.partidas.slice(0, 5); 
    }
  }
}
