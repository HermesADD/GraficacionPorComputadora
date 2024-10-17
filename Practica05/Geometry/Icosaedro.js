class Icosaedro extends GenericGeometry{
  /**
   * Icosaedro
   * @param {Number} width el tamaño del icosaedro
   */
  constructor(gl, width=1, color="#ffffff", transform=Matrix4.identity()) {
    super(gl,color,transform);

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
      0, 0, 2, 
      0, 8, 2, 
      8, 5, 2, 
      5, 7, 2, 
      7, 10, 2, 
      6, 0, 10, 
      11, 6, 10, 
      7, 11, 10, 
      7, 3, 11, 
      5, 3, 7, 
      9, 3, 5, 
      8, 9, 5, 
      4, 9, 8, 
      0, 4, 8, 
      6, 4, 0, 
      11, 3, 1, 
      6, 11, 1, 
      4, 6, 1, 
      9, 4, 1, 
      3, 9, 1,
    ]
  }
}