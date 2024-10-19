class Octaedro extends GenericGeometry{
  /**
   * Octaedro
   * @param {Number} width el tamaño del octaedro
   */
  constructor(gl, width=1, color="#ffffff", transform=identity()) {
    super(gl,color,transform);

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
      3, 1, 0, 
      2, 3, 0, 
      1, 4, 0, 
      4, 2, 0, 
      1, 3, 5, 
      3, 2, 5, 
      4, 1, 5, 
      2, 4, 5,
    ]
  }
}