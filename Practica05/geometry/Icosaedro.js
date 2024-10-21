class Icosaedro extends GenericGeometry{
  /**
   * Icosaedro
   * @param {Number} width el tamaño del icosaedro
   */
  constructor(gl, width=1, material = new FlatMaterial(gl), transform=Matrix4.identity()) {
    super(gl,material,transform);

    this.w = width;

    this.init(gl);
  }


  getVertices() {
    const goldenRatio = 1.6180339887;
    //width_m_goldenRatio
    let wmg = this.w*goldenRatio;

    return [
      0, this.w, wmg, 
      0, this.w,-wmg, 
      0,-this.w, wmg, 
      0,-this.w,-wmg, 
      this.w, wmg, 0, 
      this.w,-wmg, 0, 
     -this.w, wmg, 0, 
     -this.w,-wmg, 0, 
      wmg, 0, this.w, 
      wmg, 0,-this.w, 
     -wmg, 0, this.w, 
     -wmg, 0,-this.w 
    ];
  }

  getFaces() {
    return [
      0, 10, 2,  // Ajustado
      0, 2, 8,   // Ajustado
      8, 2, 5,   // Ajustado
      5, 2, 7,   // Ajustado
      7, 2, 10,  // Ajustado
      6, 10, 0,  // Ajustado
      11, 10, 6, // Ajustado
      7, 10, 11, // Ajustado
      7, 11, 3,  // Ajustado
      5, 7, 3,   // Ajustado
      9, 5, 3,   // Ajustado
      8, 5, 9,   // Ajustado
      4, 8, 9,   // Ajustado
      0, 8, 4,   // Ajustado
      6, 0, 4,   // Ajustado
      11, 1, 3,  // Ajustado
      6, 1, 11,  // Ajustado
      4, 1, 6,   // Ajustado
      9, 1, 4,   // Ajustado
      3, 1, 9    // Ajustado
    ];
  }
}