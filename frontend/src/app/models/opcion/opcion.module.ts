/**
 * Representa una opción de respuesta para una pregunta en un cuestionario.
 */
export class Opcion {
  /**
   * El texto de la opción de respuesta.
   */
  texto: string;

  /**
   * Indica si la opción de respuesta es la correcta o no.
   */
  correcta: boolean;

  /**
   * Crea una nueva instancia de la clase Opcion.
   * @param texto - El texto de la opción de respuesta.
   * @param correcta - Indica si la opción de respuesta es la correcta (true) o no (false).
   */
  constructor(texto: string, correcta: boolean) {
    this.texto = texto;
    this.correcta = correcta;
  }
}
