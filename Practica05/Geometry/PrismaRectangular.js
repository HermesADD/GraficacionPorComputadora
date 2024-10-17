class PrismaRectangular extends GenericGeometry{
  /**
   */
  constructor(gl, width=1, height=1, length=1, color="#ffffff", transform=Matrix4.identity()) {
    super(gl,color,transform);

    this.w = width;
    this.h = height;
    this.l = length;

    this.init(gl);
  }

  /**
   * 
   */
  getVertices() {
    return [
       this.w/2,  this.h/2,  this.l/2,
       this.w/2, -this.h/2,  this.l/2,
       this.w/2,  this.h/2, -this.l/2,
       this.w/2, -this.h/2, -this.l/2,
      -this.w/2,  this.h/2,  this.l/2,
      -this.w/2, -this.h/2,  this.l/2,
      -this.w/2,  this.h/2, -this.l/2,
      -this.w/2, -this.h/2, -this.l/2,
    ];
  }

  /**
   * En comparación con los ejemplos anteriores, los cuadriláteros que definen el prisma deben triangularse, es decir, partirse en dos triángulos para poder dibujarlos con WebGL
   */
  getFaces() {
    return [
      2, 3, 1,
      2, 1, 0,

      1, 5, 4,
      1, 4, 0,

      5, 7, 6,
      5, 6, 4,

      6, 7, 3,
      6, 3, 2,

      4, 6, 2,
      4, 2, 0,

      3, 7, 5,
      3, 5, 1,
    ];
  }
}
