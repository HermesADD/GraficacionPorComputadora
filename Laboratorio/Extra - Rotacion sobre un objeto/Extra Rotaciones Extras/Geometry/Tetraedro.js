class Tetraedro extends GenericGeometry {

  constructor(gl, width , material = FlatMaterial(gl), transform = identity()) {
    super(gl,material,transform);
    this.initialtranform = transform;
    this.material = material;
    this.w = width;
    this.theta = 0;
    this.init(gl);
  }

  update(elapsed) {
    this.transform = multiply(rotateY(this.theta += elapsed),this.initialtranform);
  
    // se actualiza la matriz de transformación de las geometrías que muestran las normales
    this.flat_faces_geometry.update(this.transform);
    
  }
  
  getVertices() {
    let angle = 2 * Math.PI / 3;
    let x = this.w * 2 * Math.sqrt(2) / 3;
    let y = -this.w / 3;
    let z = 0;
    let x0 = x * Math.cos(angle);
    let z0 = -x * Math.sin(angle);

    return [
      0, this.w, 0,   // Vértice superior
      x0, y, z0,      // Base - primera esquina
      x0, y, -z0,     // Base - segunda esquina
      x, y, z         // Base - tercera esquina
    ];
  }

  getFaces() {
    return [
      1, 3, 2,  // Base
      0, 1, 2,  // Cara que conecta con el vértice superior
      0, 2, 3,  // Otra cara
      0, 3, 1   // La última cara
    ]
  }
}
  
  