class Tetraedro {
  /**
   * Tetraedro
   * @param {Number} width el tamaño del tetraedro
   */
  constructor(width=1, color="#ffffff", transform=identity()) {
    this.w = width;
    this.color = color;

    this.transform = transform;
    this.vertices = this.getVertices();
    this.faces = this.getFaces();
  }

  getVertices() {
    let angle = 2*Math.PI/3;
    let x = this.w*2*Math.sqrt(2)/3;
    let y = -this.w/3;
    let z = 0;
    let x0 =  x*Math.cos(angle);
    let z0 = -x*Math.sin(angle);

    return [
      { x:  0, y: this.w, z:  0 },
      { x: x0, y: y,      z:  z0 },
      { x: x0, y: y,      z: -z0 },
      { x:  x, y: y,      z:  z },
    ];
  }

  getFaces() {
    return [
      [1, 3, 2], 
      [0, 1, 2], 
      [0, 2, 3], 
      [0, 3, 1]
    ]
  }
}