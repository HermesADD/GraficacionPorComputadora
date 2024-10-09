class PrismaRectangular {
  /**
   * Prisma Rectangular
   * @param {Number} width el ancho corresponde a la dimensión en el eje X
   * @param {Number} height el alto corresponde a la dimensión en el eje Y
   * @param {Number} length la profundidad corresponde a la dimensión en el eje Z
   */
  constructor(width=1, height=1, length=1, color="#ffffff", transform=identity()) {
    this.w = width;
    this.h = height;
    this.l = length;
    this.color = color;

    this.transform = transform;
    this.vertices = this.getVertices();
    this.faces = this.getFaces();
  }

  getVertices() {
    return [
      { x:  this.w/2, y:  this.h/2, z:  this.l/2 },
      { x:  this.w/2, y: -this.h/2, z:  this.l/2 },
      { x:  this.w/2, y:  this.h/2, z: -this.l/2 },
      { x:  this.w/2, y: -this.h/2, z: -this.l/2 },
      { x: -this.w/2, y:  this.h/2, z:  this.l/2 },
      { x: -this.w/2, y: -this.h/2, z:  this.l/2 },
      { x: -this.w/2, y:  this.h/2, z: -this.l/2 },
      { x: -this.w/2, y: -this.h/2, z: -this.l/2 }
    ];
  }

  getFaces() {
    return [
      [2, 3, 1, 0], 
      [1, 5, 4, 0], 
      [5, 7, 6, 4], 
      [6, 7, 3, 2], 
      [4, 6, 2, 0], 
      [3, 7, 5, 1]
    ]
  }
}