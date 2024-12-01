class LuzPuntual {
  /**
   * Constructor de la clase LuzPuntual.
   * @param pos - Posición de la luz en coordenadas homogéneas (por defecto [0, 0, 0, 0]).
   * @param ambient - Color de la luz ambiental en formato RGB (por defecto [0.2, 0.2, 0.2]).
   * @param diffuse - Color de la luz difusa en formato RGB (por defecto [1, 1, 1]).
   * @param especular - Color de la luz especular en formato RGB (por defecto [1, 1, 1]).
   */
  constructor(pos=new Vector4(0,0,0,0), ambient=[0.2,0.2,0.2], diffuse=[1,1,1], especular=[1,1,1]) {
    this.position = pos;
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.especular = especular;
    this.position_transform = new Vector4(0,0,0,0);
  }

  /**
   * Actualiza la posición transformada de la luz aplicando la matriz de vista.
   * @param viewMatrix - Matriz de vista utilizada para transformar la posición de la luz.
   */
  update(viewMatrix) {
    this.position_transform = viewMatrix.multiplyVector(this.position);
  }

  /**
   * Obtiene la posición transformada de la luz en coordenadas 3D.
   * @returns Un arreglo con las coordenadas [x, y, z] de la luz transformada.
   */
  getPosition() {
    return [this.position_transform.x, this.position_transform.y, this.position_transform.z];
  }
}
