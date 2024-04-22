import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/Auth/authentication.service';
import { Opcion } from './../../models/opcion/opcion.module';
import { Pregunta } from './../../models/pregunta/pregunta.module';

import { CommonModule } from '@angular/common';
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
  jsonData: any = jsonData; // Usar 'any' para el tipo de dato
  preguntas: Pregunta[] = [];
  preguntaActual: Pregunta | null = null;
  respuestaSeleccionada: Opcion | null = null;
  intentosRestantes: number = 3;
  puntaje: number = 0;
  mostrarMensaje: boolean = false;
  mensaje: string = '';

  maxIntentos: number = 3; // Definir el máximo de intentos
  preguntasPorJuego: number = 5;
  fallos: number = 0; // Contador de fallos
  aciertos: number = 0; // Contador de aciertos
  juegoTerminado: boolean = false;

  // Constructor del componente, inyecta el servicio de autenticación
  constructor(private authService: AuthenticationService, private http:HttpClient) {}

  // Método que se ejecuta cuando el componente se inicializa
  ngOnInit(): void {
   
    this.userToken = this.authService.getAccessToken(); 
    // Llamada al servicio para obtener los detalles del usuario utilizando el token
    this.authService.getUserByToken(this.userToken).subscribe(
        (userData) => {
            this.userName = userData.username; 
       
        },
        // Manejo de errores en la respuesta del servicio
        (error) => {
            console.error('Error al obtener los detalles del usuario:', error);
        }
    );

    this.cargarPreguntas();
  }

//    QUIZ
cargarPreguntas() {
  this.preguntas = this.jsonData.preguntas; // Asignar las preguntas del JSON directamente
  this.mostrarPreguntaAleatoria();
}

mostrarPreguntaAleatoria() {
  const randomIndex = Math.floor(Math.random() * this.preguntas.length);
  this.preguntaActual = this.preguntas[randomIndex];
  this.respuestaSeleccionada = null;
}

seleccionarRespuesta(respuesta: Opcion) {
  // Lógica para evaluar la respuesta seleccionada y actualizar el estado del juego
  if (respuesta.correcta) {
    this.aciertos++;
  } else {
    this.fallos++;
  }

  // Verificar si se alcanzaron los límites de fallos o aciertos
  if (this.aciertos === this.preguntasPorJuego) {
    this.mostrarMensaje = true;
    this.mensaje = '¡Enhorabuena! Has acertado todas las preguntas.';
    this.juegoTerminado = true;
  } else if (this.fallos === this.maxIntentos) {
    this.mostrarMensaje = true;
    this.mensaje = 'Lo siento, has agotado tus intentos. Repasa la documentación de Angular.';
    this.juegoTerminado = true;
  } else {
    this.mostrarPreguntaAleatoria();
  }
}
//    FIN QUIZ

reiniciarJuego() {
  this.puntaje = 0;
  this.intentosRestantes = 3;
  this.mostrarMensaje = false;
  this.mostrarPreguntaAleatoria();
}


}
