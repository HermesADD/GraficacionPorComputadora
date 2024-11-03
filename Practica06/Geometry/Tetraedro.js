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

    this.uv=[
       // Cara 1: 1, 3, 2 (Atras, FrenteDerecho, FrenteIzquierdo)
    0.251, 0.587,  // Vértice Atras
    0.754, 0.587,  // Vértice FrenteDerecho
    0.503, 0.881,  // Vértice FrenteIzquierdo

    // Cara 2: 0, 1, 2 (Arriba, Atras, FrenteIzquierdo)
    0.503, 0.098,  // Vértice Arriba
    0.251, 0.587,  // Vértice Atras
    0.503, 0.881,  // Vértice FrenteIzquierdo

    // Cara 3: 0, 2, 3 (Arriba, FrenteIzquierdo, FrenteDerecho)
    0.503, 0.098,  // Vértice Arriba
    0.503, 0.881,  // Vértice FrenteIzquierdo
    0.754, 0.587,  // Vértice FrenteDerecho

    // Cara 4: 0, 3, 1 (Arriba, FrenteDerecho, Atras)
    0.503, 0.098,  // Vértice Arriba
    0.754, 0.587,  // Vértice FrenteDerecho
    0.251, 0.587 
    ];

    return this.uv;

  }
}