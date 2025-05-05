import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: false
})
export class MenuPage implements OnInit {
  partidaEnCurso: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.partidaEnCurso = localStorage.getItem('partidaEnCurso') === 'true';
  }

  nuevaPartida() {
    if (this.partidaEnCurso) {
      const confirmar = confirm('Ya tienes una partida en curso. ¿Quieres empezar una nueva?');
      if (!confirmar) return;
    }
  
    const nombre = prompt('¿Cuál es tu nombre?');
    if (!nombre || nombre.trim() === '') {
      alert('Debes introducir un nombre para empezar.');
      return;
    }
  
    localStorage.setItem('nombreJugador', nombre.trim());
    localStorage.removeItem('partidaEnCurso'); 
    this.router.navigate(['/game']);
  }

  continuarPartida() {
    this.router.navigate(['/game']);
  }

  verRanking() {
    this.router.navigate(['/ranking']); 
  }

  salir() {
    alert('Gracias por jugar. ¡Hasta la próxima!');
  }
}
