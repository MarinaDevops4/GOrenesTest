export class Opcion {
  texto: string;
  correcta: boolean;

  constructor(texto: string, correcta: boolean) {
    this.texto = texto;
    this.correcta = correcta;
  }
}