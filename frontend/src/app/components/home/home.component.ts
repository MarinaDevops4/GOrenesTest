import { Component, OnInit } from '@angular/core';
import { Opcion } from './../../models/opcion/opcion.module';
import { Pregunta } from './../../models/pregunta/pregunta.module';

import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../services/Auth/authentication.service';
import jsonData from './../../../assets/storageData/info.json';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
// Clase del componente
export class HomeComponent implements OnInit { 
  userName: string = '';
  userToken: any;
  jsonData: any = jsonData;
  preguntas: Pregunta[] = [];
  preguntaActual: Pregunta | null = null;
  respuestaSeleccionada: Opcion | null = null;
  intentosRestantes: number = 3;
  aciertos: number = 0;
  fallos: number = 0;
  juegoTerminado: boolean = false;
  mostrarQuiz: boolean = false;
  preguntasMostradas: Pregunta[] = [];

  constructor(private authService: AuthenticationService) {}

  
  // Método que se ejecuta cuando el componente se inicializa
  ngOnInit(): void {
    this.userToken = this.authService.getAccessToken(); 
    this.authService.getUserByToken(this.userToken).subscribe(
      (userData) => {
          this.userName = userData.username; 
      },
      (error) => {
          console.error('Error al obtener los detalles del usuario:', error);
      }
    );
    // Cargar preguntas al iniciar el componente
    this.cargarPreguntas();
  }

  // Función para cargar las preguntas y mostrar el quiz
  cargarPreguntasYMostrarQuiz() {
    this.cargarPreguntas();
    this.mostrarQuiz = true;
  }

  // Cargar preguntas desde el JSON
  cargarPreguntas() {
    this.preguntas = this.jsonData.preguntas;
    this.mostrarPreguntaAleatoria();
  }


  // Mostrar una pregunta aleatoria
  mostrarPreguntaAleatoria() {
    // Filtrar las preguntas que aún no han sido mostradas
    const preguntasDisponibles = this.preguntas.filter(pregunta => !this.preguntasMostradas.includes(pregunta));
  
    // Verificar si quedan preguntas disponibles para mostrar
    if (preguntasDisponibles.length === 0) {
      // Si ya se mostraron todas las preguntas, reiniciar el conjunto de preguntas mostradas
      this.preguntasMostradas = [];
      // Y volver a obtener las preguntas disponibles
      this.mostrarPreguntaAleatoria();
      return;
    }
  
    // Seleccionar aleatoriamente una pregunta de las disponibles
    const randomIndex = Math.floor(Math.random() * preguntasDisponibles.length);
    const preguntaSeleccionada = preguntasDisponibles[randomIndex];
  
    // Actualizar la pregunta actual y agregarla al conjunto de preguntas mostradas
    this.preguntaActual = preguntaSeleccionada;
    this.respuestaSeleccionada = null;
    this.preguntasMostradas.push(preguntaSeleccionada);
  }
  
  // Selección de respuesta por el usuario
  seleccionarRespuesta(respuesta: Opcion) {
    if (respuesta.correcta) {
      this.aciertos++;
    } else {
      this.fallos++;
      this.intentosRestantes--;
    }
    this.actualizarEstadoJuego();
  }


   // Actualizar estado del juego
   actualizarEstadoJuego() {
    if (this.aciertos === 5 || this.fallos === 3) {
      this.juegoTerminado = true;
    } else {
      this.mostrarPreguntaAleatoria();
    }
  }
  // Mostrar mensaje al usuario
  mostrarMensaje(mensaje: string) {
    this.juegoTerminado = true;
    this.preguntaActual = null;
    this.respuestaSeleccionada = null;
    alert(mensaje); // Mostrar mensaje mediante alerta, puedes personalizar esto según tus preferencias de UI
  }

   // Reiniciar el juego
   reiniciarJuego() {
    this.aciertos = 0;
    this.fallos = 0;
    this.intentosRestantes = 3;
    this.juegoTerminado = false;
    this.mostrarQuiz = false; // Ocultar el quiz al reiniciar el juego
  }
}