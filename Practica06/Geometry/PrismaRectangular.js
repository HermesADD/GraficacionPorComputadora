class PrismaRectangular extends GenericGeometry{
  /**
   */
  constructor(gl, width=1, height=1, length=1, material = new FlatMaterial(gl), transform=Matrix4.identity()) {
    super(gl,material,transform);

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
      // Cara frontal (antihorario)
      0, 1, 3,
      0, 3, 2,

      // Cara derecha (antihorario)
      0, 2, 6,
      0, 6, 4,

      // Cara trasera (antihorario)
      4, 6, 7,
      4, 7, 5,

      // Cara izquierda (antihorario)
      5, 7, 3,
      5, 3, 1,

      // Cara superior (antihorario)
      0, 4, 5,
      0, 5, 1,

      // Cara inferior (antihorario)
      2, 3, 7,
      2, 7, 6
    ];
  }
  
  getUVCoordinates() {
    let img_w = 512;
    let img_h = 512;

    this.uv = [
      //Derecho
      310/img_w,260/img_h,//Color Azul
      310/img_w,260/img_h,
      310/img_w,260/img_h,
      310/img_w,260/img_h,
      310/img_w,260/img_h,
      310/img_w,260/img_h,

      //Frente
      190/img_w,128/img_h, //Color rojo
      190/img_w,128/img_h,
      190/img_w,128/img_h,
      190/img_w,128/img_h,
      190/img_w,128/img_h,
      190/img_w,128/img_h,

      //Izquierdo
      190/img_w,390/img_h,//Azul claro
      190/img_w,390/img_h,
      190/img_w,390/img_h,
      190/img_w,390/img_h,
      190/img_w,390/img_h,
      190/img_w,390/img_h,

      190/img_w,260/img_h,// Color carne
      190/img_w,260/img_h,
      190/img_w,260/img_h,
      190/img_w,260/img_h,
      190/img_w,260/img_h,
      190/img_w,260/img_h,

      50/img_w,260/img_h,
      50/img_w,260/img_h,
      50/img_w,260/img_h,
      50/img_w,260/img_h,
      50/img_w,260/img_h,
      50/img_w,260/img_h,

      440/img_w,260/img_h,
      440/img_w,260/img_h,
      440/img_w,260/img_h,
      440/img_w,260/img_h,
      440/img_w,260/img_h,
      440/img_w,260/img_h,
    ];
  return this.uv;
  }
  
}
