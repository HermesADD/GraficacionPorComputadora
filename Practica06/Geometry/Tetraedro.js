class Tetraedro extends GenericGeometry{
  /**
   * Tetraedro
   * @param {Number} width el tamaño del tetraedro
   */
  constructor(gl, width=1, material = new FlatMaterial(gl), transform=Matrix4.identity()) {
    super(gl,material,transform);

    this.w = width;
    
    this.init(gl);
  }

  getVertices() {
    let angle = 2*Math.PI/3;
    let x = this.w*2*Math.sqrt(2)/3;
    let y = -this.w/3;
    let z = 0;
    let x0 =  x*Math.cos(angle);
    let z0 = -x*Math.sin(angle);

    return [
      0 , this.w, 0, //Arriba
      x0, y     , z0, //Atras
      x0, y     ,-z0, //FrenteIzquierdo
      x , y     , z, //FrenteDerecho
    ];
  }

  getFaces() {
    return [
      1, 3, 2, 
      0, 1, 2, 
      0, 2, 3, 
      0, 3, 1,
    ]
  }

  getUVCoordinates(){

    let img_w = 598;
    let img_h = 512;

    this.uv=[
    160/img_w, 100/img_h,
    160/img_w, 100/img_h,
    160/img_w, 100/img_h,

    300/img_w, 100/img_h,
    300/img_w, 100/img_h,
    300/img_w, 100/img_h,

    450/img_w, 100/img_h,
    450/img_w, 100/img_h,
    450/img_w, 100/img_h,

    300/img_w, 360/img_h,
    300/img_w, 360/img_h,
    300/img_w, 360/img_h,
    ];

    return this.uv;

  }
}