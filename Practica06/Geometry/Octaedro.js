class Octaedro extends GenericGeometry{
  /**
   * Octaedro
   * @param {Number} width el tamaño del octaedro
   */
  constructor(gl, width=1, material = new FlatMaterial(gl), transform=Matrix4.identity()) {
    super(gl,material,transform);

    this.w = width;

    this.init(gl);
  }

  getVertices() {
    return [
      0     , 0     ,  this.w,
      this.w, 0     ,  0,
     -this.w, 0     ,  0,
      0     , this.w,  0,
      0     ,-this.w,  0,
      0     , 0     , -this.w,
    ];
  }

  getFaces() {
    return [
      0, 1, 3,  // Ajustado
      0, 3, 2,  // Ajustado
      0, 4, 1,  // Ajustado
      0, 2, 4,  // Ajustado
      5, 3, 1,  // Ajustado
      5, 2, 3,  // Ajustado
      5, 1, 4,  // Ajustado
      5, 4, 2   // Ajustado
    ];
  }
}