import { Opcion } from './../opcion/opcion.module';

export class Pregunta {
  enunciado: string;
  opciones: Opcion[];

  constructor(enunciado: string, opciones: Opcion[]) {
    this.enunciado = enunciado;
    this.opciones = opciones;
  }
}
