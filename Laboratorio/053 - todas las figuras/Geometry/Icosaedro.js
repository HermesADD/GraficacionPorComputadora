class Icosaedro {
  /**
   * Icosaedro
   * @param {Number} width el tamaño del icosaedro
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
    let width_m_goldenRatio = this.w*goldenRatio;

    return [
      { x: 0, y:  this.w, z:  width_m_goldenRatio }, 
      { x: 0, y:  this.w, z: -width_m_goldenRatio }, 
      { x: 0, y: -this.w, z:  width_m_goldenRatio }, 
      { x: 0, y: -this.w, z: -width_m_goldenRatio }, 
      { x:  this.w, y:  width_m_goldenRatio, z: 0 }, 
      { x:  this.w, y: -width_m_goldenRatio, z: 0 }, 
      { x: -this.w, y:  width_m_goldenRatio, z: 0 }, 
      { x: -this.w, y: -width_m_goldenRatio, z: 0 }, 
      { x:  width_m_goldenRatio, y: 0, z:  this.w }, 
      { x:  width_m_goldenRatio, y: 0, z: -this.w }, 
      { x: -width_m_goldenRatio, y: 0, z:  this.w }, 
      { x: -width_m_goldenRatio, y: 0, z: -this.w }
    ];
  }

  getFaces() {
    return [
      [10, 0, 2], 
      [0, 8, 2], 
      [8, 5, 2], 
      [5, 7, 2], 
      [7, 10, 2], 
      [6, 0, 10], 
      [11, 6, 10], 
      [7, 11, 10], 
      [7, 3, 11], 
      [5, 3, 7], 
      [9, 3, 5], 
      [8, 9, 5], 
      [4, 9, 8], 
      [0, 4, 8], 
      [6, 4, 0], 
      [11, 3, 1], 
      [6, 11, 1], 
      [4, 6, 1], 
      [9, 4, 1], 
      [3, 9, 1]
    ]
  }
}