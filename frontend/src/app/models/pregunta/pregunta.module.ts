import { Opcion } from './../opcion/opcion.module';

/**
 * Clase que representa una pregunta en un cuestionario.
 */
export class Pregunta {
  /**
   * Enunciado de la pregunta.
   */
  enunciado: string;

  /**
   * Opciones de respuesta para la pregunta.
   */
  opciones: Opcion[];

  /**
   * Crea una instancia de la clase Pregunta.
   * @param enunciado - El enunciado de la pregunta.
   * @param opciones - Las opciones de respuesta para la pregunta.
   */
  constructor(enunciado: string, opciones: Opcion[]) {
    this.enunciado = enunciado;
    this.opciones = opciones;
  }
}
