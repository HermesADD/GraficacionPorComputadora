class Dodecaedro {
  /**
   * Dodecaedro
   * @param {Number} width el tamaño del dodecaedro
   */
  constructor(width=1, color="#ffffff", transform=identity()) {
    this.w = width;
    this.color = color;

    this.transform = transform;
    this.vertices = this.getVertices();
    this.faces = this.getFaces();
  }

  getVertices() {
    const goldenRatio = 1.6180339887;
    let width_d_goldenRatio = this.w/goldenRatio;
    let width_m_goldenRatio = this.w*goldenRatio;

    return [
      { x:  this.w, y:  this.w, z:  this.w }, 
      { x:  this.w, y:  this.w, z: -this.w }, 
      { x:  this.w, y: -this.w, z:  this.w }, 
      { x:  this.w, y: -this.w, z: -this.w }, 
      { x: -this.w, y:  this.w, z:  this.w }, 
      { x: -this.w, y:  this.w, z: -this.w }, 
      { x: -this.w, y: -this.w, z:  this.w }, 
      { x: -this.w, y: -this.w, z: -this.w }, 
      { x: 0, y:  width_d_goldenRatio, z:  width_m_goldenRatio },
      { x: 0, y:  width_d_goldenRatio, z: -width_m_goldenRatio }, 
      { x: 0, y: -width_d_goldenRatio, z:  width_m_goldenRatio }, 
      { x: 0, y: -width_d_goldenRatio, z: -width_m_goldenRatio }, 
      { x:  width_d_goldenRatio, y:  width_m_goldenRatio, z: 0 }, 
      { x:  width_d_goldenRatio, y: -width_m_goldenRatio, z: 0 }, 
      { x: -width_d_goldenRatio, y:  width_m_goldenRatio, z: 0 }, 
      { x: -width_d_goldenRatio, y: -width_m_goldenRatio, z: 0 }, 
      { x:  width_m_goldenRatio, y: 0, z:  width_d_goldenRatio }, 
      { x:  width_m_goldenRatio, y: 0, z: -width_d_goldenRatio }, 
      { x: -width_m_goldenRatio, y: 0, z:  width_d_goldenRatio }, 
      { x: -width_m_goldenRatio, y: 0, z: -width_d_goldenRatio }
    ];
  }

  getFaces() {
    return [
      [0, 16, 2, 10, 8],
      [12, 1, 17, 16, 0],
      [8, 4, 14, 12, 0],
      [2, 16, 17, 3, 13],
      [13, 15, 6, 10, 2],
      [6, 18, 4, 8, 10],
      [3, 17, 1, 9, 11],
      [13, 3, 11, 7, 15],
      [1, 12, 14, 5, 9],
      [11, 9, 5, 19, 7],
      [5, 14, 4, 18, 19],
      [6, 15, 7, 19, 18]
    ]
  }
}