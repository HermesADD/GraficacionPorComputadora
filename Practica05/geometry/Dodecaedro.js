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
      [0, 8, 10, 2, 16],   // Cara 1 - Ajustado
      [1, 17, 16, 12, 0],  // Cara 2 - Ajustado (invertido)
      [0, 12, 14, 4, 8],   // Cara 3 - Ajustado
      [2, 16, 17, 13, 3],  // Cara 4 - Ajustado (invertido)
      [2, 10, 6, 15, 13],  // Cara 5 - Ajustado
      [6, 18, 4, 8, 10],   // Cara 6 - Ajustado
      [3, 17, 11, 9, 1],   // Cara 7 - Ajustado (invertido)
      [3, 13, 15, 7, 11],  // Cara 8 - Ajustado
      [1, 9, 5, 14, 12],   // Cara 9 - Ajustado
      [5, 19, 7, 11, 9],   // Cara 10 - Ajustado
      [5, 14, 4, 18, 19],  // Cara 11 - Ajustado
      [6, 18, 19, 7, 15]   // Cara 12 - Ajustado
    ];
    let triangles = [];

    // Dividir cada pentágono en 3 triángulos con el orden correcto de vértices
    for (let i = 0; i < pentagonalFaces.length; i++) {
        let face = pentagonalFaces[i];
        triangles.push(face[0], face[1], face[2]);
        triangles.push(face[0], face[2], face[3]);
        triangles.push(face[0], face[3], face[4]);
    }

    return triangles;
  }
  
}