class Octaedro {
  /**
   * Octaedro
   * @param {Number} width el tamaño del octaedro
   */
  constructor(width=1, color="#ffffff", transform=identity()) {
    this.w = width;
    this.color = color;

    this.transform = transform;
    this.vertices = this.getVertices();
    this.faces = this.getFaces();
  }

  getVertices() {
    return [
      { x:  0,      y:  0,      z:  this.w },
      { x:  this.w, y:  0,      z:  0 },
      { x: -this.w, y:  0,      z:  0 },
      { x:  0,      y:  this.w, z:  0 },
      { x:  0,      y: -this.w, z:  0 },
      { x:  0,      y:  0,      z: -this.w },
    ];
  }

  getFaces() {
    return [
      [3, 1, 0], 
      [2, 3, 0], 
      [1, 4, 0], 
      [4, 2, 0], 
      [1, 3, 5], 
      [3, 2, 5], 
      [4, 1, 5], 
      [2, 4, 5]
    ]
  }
}