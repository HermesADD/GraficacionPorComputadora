class Dodecaedro extends GenericGeometry{
  /**
   * Dodecaedro
   * @param {Number} width el tamaño del dodecaedro
   */
  constructor(gl, width=1, material = new FlatMaterial(gl), transform=Matrix4.identity()) {
    super(gl, material ,transform);
    this.w = width;
    

    this.init(gl);
  }

  getVertices() {
    const goldenRatio = 1.6180339887;
    let width_d_goldenRatio = this.w/goldenRatio;
    let width_m_goldenRatio = this.w*goldenRatio;

    return [
      this.w, this.w, this.w , 
      this.w, this.w,-this.w , 
      this.w,-this.w, this.w , 
      this.w,-this.w,-this.w , 
     -this.w, this.w, this.w , 
     -this.w, this.w,-this.w , 
     -this.w,-this.w, this.w , 
     -this.w,-this.w,-this.w , 
      0, width_d_goldenRatio, width_m_goldenRatio,
      0, width_d_goldenRatio,-width_m_goldenRatio, 
      0,-width_d_goldenRatio, width_m_goldenRatio, 
      0,-width_d_goldenRatio,-width_m_goldenRatio, 
      width_d_goldenRatio, width_m_goldenRatio, 0, 
      width_d_goldenRatio,-width_m_goldenRatio, 0, 
     -width_d_goldenRatio, width_m_goldenRatio, 0, 
     -width_d_goldenRatio,-width_m_goldenRatio, 0, 
      width_m_goldenRatio, 0, width_d_goldenRatio, 
      width_m_goldenRatio, 0, -width_d_goldenRatio, 
     -width_m_goldenRatio, 0, width_d_goldenRatio, 
     -width_m_goldenRatio, 0,-width_d_goldenRatio 
    ];
  }

  getFaces() {
    const pentagonalFaces = [
      [0, 16, 2, 10, 8],   // Cara 1 - Ajustado (sentido antihorario)
      [0, 12, 16, 17, 1],  // Cara 2 - Ajustado (sentido antihorario)
      [0, 8, 4, 14, 12],   // Cara 3 - Ajustado (sentido antihorario)
      [2, 13, 17, 16, 3],  // Cara 4 - Ajustado (sentido antihorario)
      [2, 10, 6, 15, 13],  // Cara 5 - Ajustado (sentido antihorario)
      [6, 18, 4, 8, 10],   // Cara 6 - Ajustado (sentido antihorario)
      [3, 17, 11, 9, 1],   // Cara 7 - Ajustado (sentido antihorario)
      [3, 13, 15, 7, 11],  // Cara 8 - Ajustado (sentido antihorario)
      [1, 12, 14, 5, 9],   // Cara 9 - Ajustado (sentido antihorario)
      [5, 19, 7, 11, 9],   // Cara 10 - Ajustado (sentido antihorario)
      [5, 14, 4, 18, 19],  // Cara 11 - Ajustado (sentido antihorario)
      [6, 15, 7, 19, 18]   // Cara 12 - Ajustado (sentido antihorario)
  ];
    let triangles = [];

    // Dividir cada pentágono en 3 triángulos con el orden correcto de vértices
    for (let i = 0; i < pentagonalFaces.length; i++) {
        let face = pentagonalFaces[i];
        triangles.push(face[0], face[2], face[1]);
        triangles.push(face[0], face[3], face[2]);
        triangles.push(face[0], face[4], face[3]);
    }

    return triangles;
  }
  
}